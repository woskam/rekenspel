#!/usr/bin/env python3
"""
Haalt de lesinhoud uit de ArtGames-app en schrijft per niveau engels/data/<niveau>.json.

  python3 tools/export_app_content.py /pad/naar/Taalkampioen

Het script compileert tools/export/main.swift samen met Models/ en Data/ van de app en laat
de app zelf de inhoud opbouwen (ContentData.build(), inclusief ContentFixes). Zo is de
website altijd gelijk aan wat kinderen in de app zien. Leenwoorden die de app niet oefent
(zoals "pizza") staan er dus ook hier niet in.
"""
import glob, json, os, re, subprocess, sys, tempfile

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))

def slug(s):
    s = s.lower().replace("&", "en").replace("'", "")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

def export(app):
    exe = os.path.join(tempfile.gettempdir(), "artgames-export-content")
    files = [os.path.join(ROOT, "tools", "export", "main.swift")] + sorted(glob.glob(os.path.join(app, "Models", "*.swift"))) + sorted(glob.glob(os.path.join(app, "Data", "*.swift")))
    subprocess.run(["swiftc", "-O", "-o", exe] + files, check=True)
    return json.loads(subprocess.run([exe], check=True, capture_output=True).stdout)

if __name__ == "__main__":
    app = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~/Taalkampioen")
    chapters = export(app)

    # Woorden die in de app geen eigen emoji hebben (koppeloefeningen in groep 5)
    EIGEN = {"i am fine": "🙂", "what's your name?": "❓", "where are you from?": "🌍", "and you?": "👉",
             "no": "🙅", "of course": "👌", "classmate": "🧑‍🤝‍🧑", "student": "🧑‍🎓", "lunch": "🥪",
             "delicious": "😋", "grandfather": "👴", "bus": "🚌", "internet": "🌐", "to text": "📲",
             "good night": "🌙", "thank you": "🙏"}
    # Woorden zonder emoji krijgen het emoji van hetzelfde woord elders in de app
    emoji = {}
    for c in chapters:
        for l in c["lessons"]:
            for w in l["words"]:
                if w["emoji"]: emoji.setdefault(w["en"].lower(), w["emoji"])
    for c in chapters:
        for l in c["lessons"]:
            for w in l["words"]:
                if not w["emoji"]: w["emoji"] = EIGEN.get(w["en"].lower()) or emoji.get(w["en"].lower(), "💬")

    per = {}
    for c in chapters:
        per.setdefault(c["level"], []).append(c)
    out_dir = os.path.join(ROOT, "engels", "data"); os.makedirs(out_dir, exist_ok=True)
    for level, lst in per.items():
        lst.sort(key=lambda c: (c["seasonal"], c["order"]))
        used = set()
        for c in lst:
            s = slug(c["title"]); n = 2
            while s in used: s = f"{slug(c['title'])}-{n}"; n += 1
            used.add(s); c["slug"] = s
        json.dump({"level": level, "chapters": lst}, open(os.path.join(out_dir, level + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        w = sum(len(l["words"]) for c in lst for l in c["lessons"])
        print(f"{level}: {len(lst)} hoofdstukken, {w} woorden")
