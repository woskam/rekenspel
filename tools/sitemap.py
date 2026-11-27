#!/usr/bin/env python3
"""Schrijft sitemap.xml en robots.txt voor artgames.nl op basis van alle index.html-pagina's."""
import os, datetime
ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
SKIP = {"tools", ".git", "assets", "css", "data"}
urls = []
for d, dirs, files in os.walk(ROOT):
    dirs[:] = sorted(x for x in dirs if x not in SKIP and not x.startswith("."))
    rel = os.path.relpath(d, ROOT).replace(os.sep, "/")
    for f in sorted(files):
        if not f.endswith(".html") or f.startswith("_"): continue
        path = ("/" if rel == "." else "/" + rel + "/") + ("" if f == "index.html" else f)
        urls.append(path)
today = datetime.date.today().isoformat()
with open(os.path.join(ROOT, "sitemap.xml"), "w") as out:
    out.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for u in urls: out.write(f"  <url><loc>https://artgames.nl{u}</loc><lastmod>{today}</lastmod></url>\n")
    out.write("</urlset>\n")
with open(os.path.join(ROOT, "robots.txt"), "w") as out:
    out.write("User-agent: *\nAllow: /\nSitemap: https://artgames.nl/sitemap.xml\n")
print(len(urls), "pagina's in sitemap.xml")
