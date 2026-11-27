#!/usr/bin/env python3
"""Maakt leerkrachten/index.html: per groep de directe links om met de klas te delen."""
import json, os, html

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
NAMEN = {"groep4": "Groep 4", "groep5": "Groep 5", "groep6": "Groep 6", "groep7": "Groep 7", "groep8": "Groep 8", "brugklas": "Brugklas"}
REKENEN = {  # niveaus uit assets/catalog.js
    "groep4": ["Multiple choice", "Memory", "Speed challenge"],
    "groep5": ["Multiple choice", "Memory", "Speed challenge"],
    "groep6": ["Multiple choice", "Memory", "Speed challenge"],
    "groep7": ["Tafels oefenen (11 t/m 25)", "Multiple choice", "Memory", "Speed challenge"],
    "groep8": ["Tafels oefenen (11 t/m 25)", "Multiple choice", "Memory", "Speed challenge"],
    "brugklas": ["Tafels oefenen (11 t/m 25)", "Multiple choice", "Memory", "Speed challenge"],
}
def e(s): return html.escape(str(s), quote=True)

blokken = []
for lv, naam in NAMEN.items():
    ch = json.load(open(os.path.join(ROOT, "engels", "data", lv + ".json"), encoding="utf-8"))["chapters"]
    themas = "".join(f'<li><a href="/engels/{lv}/{c["slug"]}/">{c["emoji"]} {e(c["title"])}</a>{" <small>(seizoen)</small>" if c.get("seasonal") else ""}</li>' for c in ch)
    blokken.append(f"""<details class="groep"{' open' if lv == 'groep6' else ''}>
  <summary><b>{naam}</b><span>{len(ch)} Engelse thema's · rekenen: {len(REKENEN[lv])} spellen</span></summary>
  <div class="links">
    <p><b>Alles voor {naam.lower()} in één link:</b> <a href="/?niveau={lv}&amp;vak=alle">artgames.nl/?niveau={lv}</a></p>
    <p><b>Engels:</b> <a href="/engels/{lv}/">artgames.nl/engels/{lv}/</a> · <b>Rekenen:</b> <a href="/?niveau={lv}&amp;vak=rekenen">artgames.nl/?niveau={lv}&amp;vak=rekenen</a> ({", ".join(REKENEN[lv])})</p>
    <ul class="themas">{themas}</ul>
  </div>
</details>""")

pagina = f"""<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ArtGames voor leerkrachten · gratis oefenen in de klas</title>
<meta name="description" content="Gratis oefenspellen voor Engels en rekenen, van groep 4 tot de brugklas. Zonder accounts, cookies of tracking. Per groep en thema een directe link voor Klasbord, Teams of het digibord.">
<link rel="canonical" href="https://artgames.nl/leerkrachten/">
<link rel="icon" href="/app/img/icon.png">
<link rel="stylesheet" href="/assets/site.css?v=1">
<style>
.kop {{ position: relative; z-index: 1; padding: 18px 20px 96px; }}
.punten {{ position: relative; z-index: 2; margin-top: -70px; display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px; }}
.punt {{ background: var(--card); border: 1px solid var(--line); border-radius: 20px; padding: 18px 20px; box-shadow: var(--shadow); }}
.punt b {{ display: block; font-size: 1.05rem; margin-bottom: 4px; }}
.punt span {{ color: var(--muted); font-size: .95rem; }}
.punt .em {{ font-size: 1.6rem; display: block; margin-bottom: 6px; }}
.groep {{ background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 16px 20px; }}
.groep + .groep {{ margin-top: 10px; }}
.groep summary {{ cursor: pointer; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; font-size: 1.1rem; }}
.groep summary span {{ color: var(--muted); font-size: .92rem; }}
.links p {{ margin: 12px 0 0; }}
.themas {{ columns: 3 220px; margin: 14px 0 4px; padding-left: 1.1em; }}
.themas li {{ margin-bottom: 4px; }}
.themas small {{ color: var(--muted); }}
.tips {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; }}
.tip {{ background: var(--soft); border-radius: 18px; padding: 18px 20px; }}
.tip h3 {{ margin: 0 0 6px; }}
.tip p {{ margin: 0; color: var(--muted); }}
code {{ background: var(--soft); padding: 2px 6px; border-radius: 6px; font-size: .9em; }}
</style>
</head>
<body>
<div class="top">
  <nav class="nav on-brand"><div class="wrap">
    <a class="logo" href="/"><img src="/app/img/icon.png" alt="">ArtGames</a>
    <div class="nav-links"><a class="pill" href="/app/">📱 De app</a></div>
  </div></nav>
  <header class="wrap kop">
    <div class="crumbs"><a href="/">ArtGames</a></div>
    <h1>Voor leerkrachten</h1>
    <p class="lead">Gratis oefenen met Engels en rekenen, van groep 4 tot de brugklas. Deel een link en je leerlingen kunnen direct beginnen.</p>
  </header>
</div>

<main class="wrap">
  <div class="punten">
    <div class="punt"><span class="em">🔒</span><b>Geen accounts of tracking</b><span>Leerlingen hoeven niet in te loggen. Er worden geen cookies gebruikt en geen gegevens verzameld.</span></div>
    <div class="punt"><span class="em">💻</span><b>Werkt op elk apparaat</b><span>Chromebook, laptop, tablet of digibord: alles draait in de browser. Er is niets te installeren.</span></div>
    <div class="punt"><span class="em">🔗</span><b>Direct naar het juiste niveau</b><span>Elke groep en elk thema heeft een eigen link voor Klasbord, Teams of Google Classroom.</span></div>
    <div class="punt"><span class="em">💸</span><b>Gratis</b><span>Geen advertenties, geen abonnement en geen aankopen.</span></div>
  </div>

  <section>
    <h2>Links per groep</h2>
    <p class="intro">Klik een groep open voor de directe links. Elk Engels thema heeft een woordenlijst met uitspraak, flashcards, memory, een quiz en een kort verhaaltje.</p>
    {''.join(blokken)}
  </section>

  <section style="padding-top:0">
    <h2>Tips voor in de klas</h2>
    <div class="tips">
      <div class="tip"><h3>🎯 Klassikaal op het digibord</h3><p>Open de quiz van een thema en laat de klas om de beurt antwoorden. Bij elk antwoord hoort iedereen de uitspraak.</p></div>
      <div class="tip"><h3>🎴 Woordjes leren</h3><p>Zet de themalink in je weekplanning. Leerlingen oefenen met flashcards en sluiten af met de quiz.</p></div>
      <div class="tip"><h3>⭐ Voortgang op het eigen apparaat</h3><p>Op een vaste Chromebook onthoudt de site welke spellen en tafels een leerling al gedaan heeft. Met "Neem je voortgang mee" op de homepage gaat de voortgang via een link naar een ander apparaat.</p></div>
      <div class="tip"><h3>📱 Thuis verder met de app</h3><p>Met de gratis ArtGames-app voor iPhone en iPad oefenen leerlingen thuis ook het hardop uitspreken. Woorden die nog lastig zijn komen vanzelf terug.</p></div>
    </div>
  </section>

  <section style="padding-top:0">
    <h2>Privacy</h2>
    <p class="intro">ArtGames verzamelt geen persoonsgegevens. Voortgang en een eventuele voornaam blijven in de browser van de leerling en worden nooit naar ons gestuurd. Lees het <a href="/app/privacy.html#website">privacybeleid</a>. Vragen of ideeën voor nieuwe lessen? Mail <a href="mailto:wychert@gmail.com">wychert@gmail.com</a>.</p>
  </section>
</main>

<footer class="site"><div class="wrap">
  <span>© 2026 Wychert Oskam · ArtGames</span>
  <span><a href="/">Alle spellen</a> · <a href="/app/">ArtGames-app</a> · <a href="/app/privacy.html#website">Privacy</a></span>
</div></footer>
</body>
</html>
"""
os.makedirs(os.path.join(ROOT, "leerkrachten"), exist_ok=True)
open(os.path.join(ROOT, "leerkrachten", "index.html"), "w", encoding="utf-8").write(pagina)
print("leerkrachten/index.html gemaakt")
