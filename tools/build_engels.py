#!/usr/bin/env python3
"""
Maakt de Engelse oefenpagina's van artgames.nl uit engels/data/<niveau>.json.

  python3 tools/build_engels.py groep6

Schrijft engels/<niveau>/index.html (overzicht) en engels/<niveau>/<thema>/index.html.
Draai eerst tools/export_app_content.py om de JSON uit de app bij te werken.
"""
import json, os, sys, html

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
NAMEN = {"groep3": "Groep 3", "groep4": "Groep 4", "groep5": "Groep 5", "groep6": "Groep 6", "groep7": "Groep 7", "groep8": "Groep 8", "brugklas": "Brugklas"}
APP = "https://apps.apple.com/app/artgames-engels-oefenen/id6836407113"
V = "2"

def e(s): return html.escape(str(s), quote=True)

def kop(titel, beschrijving, canonical):
    return f"""<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{e(titel)}</title>
<meta name="description" content="{e(beschrijving)}">
<link rel="canonical" href="https://artgames.nl{canonical}">
<meta name="apple-itunes-app" content="app-id=6836407113">
<link rel="icon" href="/app/img/icon.png">
<link rel="stylesheet" href="/assets/site.css?v={V}">
<link rel="stylesheet" href="/assets/oefen.css?v={V}">
</head>
<body>
"""

NAV = """<div class="top">
  <nav class="nav on-brand"><div class="wrap">
    <a class="logo" href="/"><img src="/app/img/icon.png" alt="">ArtGames</a>
    <div class="nav-links"><a class="pill" href="/app/">📱 De app</a></div>
  </div></nav>
"""

FOOT = """<footer class="site"><div class="wrap">
  <span>© 2026 Wychert Oskam · ArtGames</span>
  <span><a href="/">Alle spellen</a> · <a href="/app/">ArtGames-app</a> · <a href="/app/privacy.html#website">Privacy</a></span>
</div></footer>
"""

APPTIP = f"""<div class="app-tip">
  <div><b>Oefen dit ook hardop in de app</b><p>In de ArtGames-app zeg je de woorden na en komen lastige woorden vanzelf terug.</p></div>
  <a class="store" href="{APP}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.32.8-.69 0-1.74-.78-2.86-.76-1.47.02-2.83.86-3.59 2.17-1.53 2.66-.39 6.6 1.1 8.75.73 1.05 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.46-.03-.01-2.3-.88-2.31-3.51zM14.2 6.13c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.3-.56.64-1.05 1.67-.92 2.66.97.08 1.96-.49 2.56-1.2z"/></svg><span><small>Download in de</small>App Store</span></a>
</div>
"""

def thema_pagina(level, c, vorige, volgende):
    naam = NAMEN[level]
    woorden = [w for l in c["lessons"] for w in l["words"]]
    voorbeeld = ", ".join(w["en"] for w in woorden[:4])
    titel = f"Engels {naam.lower()}: {c['title']} · woordjes en spelletjes | ArtGames"
    beschr = f"Oefen Engelse woordjes over {c['title'].lower()} voor {naam.lower()}: {voorbeeld} en meer. Gratis flashcards, memory en een quiz met uitspraak."
    url = f"/engels/{level}/{c['slug']}/"
    gid = f"engels-{level.replace('groep', 'g')}-{c['slug']}"
    data = {"id": gid, "titel": f"Engels {naam}: {c['title']}", "lessons": c["lessons"]}

    blokken = []
    for n, l in enumerate(c["lessons"], 1):
        items = "".join(
            f'<li><span class="emoji" aria-hidden="true">{w["emoji"]}</span><div><b lang="en">{e(w["en"])}</b><span class="nl">{e(w["nl"])}</span></div>'
            f'<button class="spk" type="button" data-spreek="{e(w["en"])}" aria-label="Luister: {e(w["en"])}">🔊</button></li>' for w in l["words"])
        zinnen = "".join(f'<p class="zinnetje"><button class="spk" type="button" data-spreek="{e(s)}" aria-label="Luister naar de zin">🔊</button><span lang="en">{e(s)}</span></p>' for s in l["sentences"])
        blokken.append(f'<div class="les-blok"><h3>{l["emoji"]} Les {n}: {e(l["title"])}<small>{e(l["subtitle"])}</small></h3><ul class="woorden">{items}</ul>{zinnen}</div>')

    verhaal = ""
    if c.get("story"):
        s = c["story"]
        zinnen = "".join(
            f'<div class="zin"><span class="emoji" aria-hidden="true">{z["emoji"]}</span><div><div class="en" lang="en">{e(z["en"])}</div><div class="nl">{e(z["nl"])}</div><button class="toon" type="button">Toon vertaling</button></div>'
            f'<button class="spk" type="button" data-spreek="{e(z["en"])}" aria-label="Luister naar de zin">🔊</button></div>' for z in s["sentences"])
        verhaal = f'<div class="verhaal"><h3>{s["emoji"]} {e(s["title"])}</h3>{zinnen}</div>'

    navlinks = '<div class="nav-thema">' + (f'<a href="../{vorige["slug"]}/">← {vorige["emoji"]} {e(vorige["title"])}</a>' if vorige else "<span></span>") + \
        (f'<a href="../{volgende["slug"]}/">{volgende["emoji"]} {e(volgende["title"])} →</a>' if volgende else "") + "</div>"

    return kop(titel, beschr, url) + NAV + f"""  <header class="wrap kop">
    <div class="crumbs"><a href="/">ArtGames</a> › <a href="/?niveau={level}&amp;vak=engels">Engels</a> › <a href="../">{naam}</a></div>
    <span class="groot-emoji" aria-hidden="true">{c['emoji']}</span>
    <h1>{e(c['title'])}</h1>
    <p class="lead">{e(c['description'])}.</p>
    <ul class="feiten"><li>{naam}</li><li>{len(woorden)} woorden</li><li>3 lessen</li>{'<li>Verhaaltje</li>' if verhaal else ''}</ul>
  </header>
</div>

<main class="wrap">
  <div class="oefen" id="oefenen">
    <div class="tabbar" role="tablist" aria-label="Kies een oefening">
      <button type="button" role="tab" data-tab="woorden">📚 Woorden</button>
      <button type="button" role="tab" data-tab="flashcards" data-deel="Flashcards">🎴 Flashcards</button>
      <button type="button" role="tab" data-tab="memory" data-deel="Memory">🧠 Memory</button>
      <button type="button" role="tab" data-tab="quiz" data-deel="Quiz">🎯 Quiz</button>
      {'<button type="button" role="tab" data-tab="verhaal">📖 Verhaal</button>' if verhaal else ''}
    </div>
    <section class="paneel" id="p-woorden" role="tabpanel" style="padding:0">{''.join(blokken)}</section>
    <section class="paneel" id="p-flashcards" role="tabpanel" hidden style="padding:0"><div id="fc"></div></section>
    <section class="paneel" id="p-memory" role="tabpanel" hidden style="padding:0"><div id="mem" data-les="0"></div></section>
    <section class="paneel" id="p-quiz" role="tabpanel" hidden style="padding:0"><div id="quiz"></div></section>
    {f'<section class="paneel" id="p-verhaal" role="tabpanel" hidden style="padding:0">{verhaal}</section>' if verhaal else ''}
  </div>
  {APPTIP}
  {navlinks}
</main>
{FOOT}
<script id="les-data" type="application/json">{json.dumps(data, ensure_ascii=False).replace("</", "<\\/")}</script>
<script src="/assets/progress.js?v=1"></script>
<script src="/assets/oefen.js?v={V}"></script>
</body>
</html>
"""

def overzicht(level, chapters):
    naam = NAMEN[level]
    n_woorden = sum(len(l["words"]) for c in chapters for l in c["lessons"])
    kaarten = "".join(
        f'<a class="card thema" href="{c["slug"]}/" data-id="engels-{level.replace("groep", "g")}-{c["slug"]}"><span class="icon">{c["emoji"]}</span><h3>{e(c["title"])}</h3>'
        f'<p>{e(c["description"])}.</p><span class="woordjes">{", ".join(e(w["en"]) for w in c["lessons"][0]["words"][:3])} …</span>'
        f'<span class="meta"><span class="tag">{sum(len(l["words"]) for l in c["lessons"])} woorden</span><span class="go">Oefen →</span></span></a>' for c in chapters)
    return kop(f"Engels {naam.lower()}: woordjes oefenen per thema | ArtGames",
               f"Gratis Engelse woordjes oefenen voor {naam.lower()}: {len(chapters)} thema's met flashcards, memory, een quiz en uitspraak.",
               f"/engels/{level}/") + NAV + f"""  <header class="wrap kop">
    <div class="crumbs"><a href="/">ArtGames</a> › <a href="/?niveau={level}&amp;vak=engels">Engels</a></div>
    <h1>Engels {naam.lower()}</h1>
    <p class="lead">Kies een thema en oefen de woorden met flashcards, memory en een quiz. Tik op 🔊 om te horen hoe je het uitspreekt.</p>
    <ul class="feiten"><li>{len(chapters)} thema's</li><li>{n_woorden} woorden</li><li>Gratis</li></ul>
  </header>
</div>
<main class="wrap">
  <div class="thema-grid">{kaarten}</div>
  {APPTIP}
</main>
{FOOT}
<script src="/assets/progress.js?v=1"></script>
<script>
document.querySelectorAll(".thema").forEach(function (a) {{
  var x = window.AG && AG.info(a.getAttribute("data-id")); if (!x) return;
  var s = document.createElement("span"); s.className = "done"; s.textContent = "✓ geoefend";
  s.style.cssText = "position:absolute;top:16px;right:16px;background:#e6f6ec;color:#23824a;font-weight:800;font-size:.8rem;border-radius:999px;padding:3px 10px";
  a.appendChild(s);
}});
</script>
</body>
</html>
"""

if __name__ == "__main__":
    level = sys.argv[1]
    d = json.load(open(os.path.join(ROOT, "engels", "data", level + ".json"), encoding="utf-8"))
    ch = d["chapters"]
    base = os.path.join(ROOT, "engels", level)
    os.makedirs(base, exist_ok=True)
    open(os.path.join(base, "index.html"), "w", encoding="utf-8").write(overzicht(level, ch))
    for i, c in enumerate(ch):
        p = os.path.join(base, c["slug"]); os.makedirs(p, exist_ok=True)
        open(os.path.join(p, "index.html"), "w", encoding="utf-8").write(thema_pagina(level, c, ch[i - 1] if i > 0 else None, ch[i + 1] if i + 1 < len(ch) else None))
    print(f"{len(ch)} themapagina's + overzicht -> engels/{level}/")
