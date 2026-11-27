#!/usr/bin/env python3
"""
Haalt de lesinhoud uit de ArtGames-app (Swift) en schrijft die als JSON
naar engels/data/<niveau>.json, voor de Engelse oefenpagina's op artgames.nl.

Gebruik:
  python3 tools/export_app_content.py /pad/naar/Taalkampioen/Data/Groep6Data.swift groep6

Werkt voor bestanden waarin elk hoofdstuk bestaat uit LessonBuilder.vocabLesson(...)
blokken en een LessonBuilder.simpleStory(...), zoals Groep6Data.swift.
"""
import json, re, sys, os

STR = r'"((?:[^"\\]|\\.)*)"'

def unq(s):
    return bytes(s, "utf-8").decode("unicode_escape").encode("latin-1").decode("utf-8") if "\\" in s else s

def parse(src):
    chapters = []
    # Splits op hoofdstukken: elk hoofdstuk eindigt met chapters.append(Chapter(...))
    parts = re.split(r'chapters\.append\(Chapter\(', src)
    for i in range(1, len(parts)):
        body = parts[i - 1][parts[i - 1].rfind("do {"):] if "do {" in parts[i - 1] else parts[i - 1]
        head = parts[i]
        m = re.search(r'order:\s*(\d+),\s*level:\s*\.(\w+),\s*title:\s*' + STR + r',\s*description:\s*' + STR + r',\s*emoji:\s*' + STR, head)
        if not m:
            continue
        order, level, title, desc, emoji = m.groups()
        lessons = []
        for lm in re.finditer(r'vocabLesson\((.*?)dialogue:', body, re.S):
            block = lm.group(1)
            t = re.search(r'title:\s*' + STR + r',\s*subtitle:\s*' + STR + r',\s*emoji:\s*' + STR, block)
            words = [{"en": unq(a), "nl": unq(b), "emoji": c} for a, b, c in re.findall(r'\(\s*' + STR + r',\s*' + STR + r',\s*' + STR + r'\s*\)', block.split("sentences:")[0])]
            sents = re.findall(STR, re.search(r'sentences:\s*\[(.*?)\]', block, re.S).group(1)) if "sentences:" in block else []
            lessons.append({"title": unq(t.group(1)), "subtitle": unq(t.group(2)), "emoji": t.group(3), "words": words, "sentences": [unq(s) for s in sents]})
        story = None
        sm = re.search(r'simpleStory\(title:\s*' + STR + r',\s*emoji:\s*' + STR + r',\s*sentences:\s*\[(.*?)\]\)\s*\n', body, re.S)
        if sm:
            lines = re.findall(r'\(emoji:\s*' + STR + r',\s*en:\s*' + STR + r',\s*nl:\s*' + STR, sm.group(3))
            story = {"title": unq(sm.group(1)), "emoji": sm.group(2), "sentences": [{"emoji": e, "en": unq(a), "nl": unq(b)} for e, a, b in lines]}
        chapters.append({"order": int(order), "level": level, "title": unq(title), "description": unq(desc), "emoji": emoji, "lessons": lessons, "story": story})
    return chapters

def slug(s):
    s = s.lower().replace("&", "en").replace("'", "")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

if __name__ == "__main__":
    swift, level = sys.argv[1], sys.argv[2]
    chapters = [c for c in parse(open(swift, encoding="utf-8").read()) if c["level"] == level]
    for c in chapters:
        c["slug"] = slug(c["title"])
    out = os.path.join(os.path.dirname(__file__), "..", "engels", "data", level + ".json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump({"level": level, "chapters": chapters}, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    words = sum(len(l["words"]) for c in chapters for l in c["lessons"])
    print(f"{len(chapters)} hoofdstukken, {sum(len(c['lessons']) for c in chapters)} lessen, {words} woorden -> {os.path.normpath(out)}")
