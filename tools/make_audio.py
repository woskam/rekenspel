#!/usr/bin/env python3
"""
Maakt mp3-bestanden voor alle Engelse woorden en zinnen met Google Cloud Text-to-Speech.

  python3 tools/make_audio.py groep6                 # alle teksten van groep 6
  python3 tools/make_audio.py --proef                # drie proefstemmen naar tools/proef/

De API-sleutel staat in ~/.config/artgames/google-tts-key (of in de omgevingsvariabele
GOOGLE_TTS_KEY) en wordt nooit geprint of in de repo gezet. Bestanden die al bestaan worden
overgeslagen, dus opnieuw draaien kost alleen iets voor nieuwe teksten.

Uitvoer: engels/audio/<hash>.mp3 en engels/audio/index.json (tekst -> bestandsnaam).
"""
import base64, hashlib, json, os, sys, urllib.request, urllib.error, time

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))
STEM = {"languageCode": "en-GB", "name": os.environ.get("ARTGAMES_STEM", "en-GB-Chirp3-HD-Aoede")}
PROEF = ["en-GB-Chirp3-HD-Aoede", "en-GB-Chirp3-HD-Charon", "en-GB-Neural2-C"]

def sleutel():
    k = os.environ.get("GOOGLE_TTS_KEY")
    if not k:
        p = os.path.expanduser("~/.config/artgames/google-tts-key")
        if not os.path.exists(p):
            sys.exit("Geen sleutel gevonden in ~/.config/artgames/google-tts-key")
        k = open(p).read().strip()
    return k

def maak(tekst, stem, key):
    body = json.dumps({"input": {"text": tekst}, "voice": {"languageCode": stem.split("-")[0] + "-" + stem.split("-")[1], "name": stem},
                       "audioConfig": {"audioEncoding": "MP3", "speakingRate": 0.92}}).encode()
    req = urllib.request.Request("https://texttospeech.googleapis.com/v1/text:synthesize", data=body,
                                 headers={"Content-Type": "application/json", "X-Goog-Api-Key": key})
    for poging in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return base64.b64decode(json.load(r)["audioContent"])
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:300]
            if e.code in (429, 500, 503) and poging < 3:
                time.sleep(2 * (poging + 1)); continue
            sys.exit(f"Google gaf fout {e.code}: {msg}")

def teksten(level):
    d = json.load(open(os.path.join(ROOT, "engels", "data", level + ".json"), encoding="utf-8"))
    t = []
    for c in d["chapters"]:
        for l in c["lessons"]:
            t += [w["en"] for w in l["words"]] + l["sentences"]
        if c.get("story"):
            t += [z["en"] for z in c["story"]["sentences"]]
    return list(dict.fromkeys(x.strip() for x in t if x.strip()))

def naam(tekst, stem):
    return hashlib.sha1((stem + "|" + tekst).encode()).hexdigest()[:14] + ".mp3"

if __name__ == "__main__":
    key = sleutel()
    if sys.argv[1:] == ["--proef"]:
        out = os.path.join(ROOT, "tools", "proef"); os.makedirs(out, exist_ok=True)
        zin = "Hello! My name is Sam. I have got a dog and a cat. The elephant is huge!"
        for s in PROEF:
            open(os.path.join(out, s + ".mp3"), "wb").write(maak(zin, s, key))
            print("gemaakt:", s)
        sys.exit()
    level = sys.argv[1]
    audio = os.path.join(ROOT, "engels", "audio"); os.makedirs(audio, exist_ok=True)
    idx_pad = os.path.join(audio, "index.json")
    idx = json.load(open(idx_pad)) if os.path.exists(idx_pad) else {}
    nieuw = tekens = 0
    for t in teksten(level):
        f = naam(t, STEM["name"])
        if not os.path.exists(os.path.join(audio, f)):
            open(os.path.join(audio, f), "wb").write(maak(t, STEM["name"], key))
            nieuw += 1; tekens += len(t)
        idx[t] = f
    json.dump(idx, open(idx_pad, "w"), ensure_ascii=False, indent=0, sort_keys=True)
    print(f"{nieuw} nieuwe bestanden ({tekens} tekens), {len(idx)} teksten in engels/audio/index.json")
