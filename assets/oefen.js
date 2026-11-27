/*
 * ArtGames: oefeningen op een Engelse themapagina (woordenlijst, flashcards, memory, quiz, verhaal).
 * De inhoud staat in <script id="les-data" type="application/json"> op de pagina zelf.
 */
(function () {
  var D = JSON.parse(document.getElementById("les-data").textContent);
  var ALLE = [].concat.apply([], D.lessons.map(function (l) { return l.words; }));

  /* ── Uitspraak: bij voorkeur een Engelse stem die op het apparaat zelf draait ── */
  var stem = null;
  function kiesStem() {
    if (!("speechSynthesis" in window)) return;
    var v = speechSynthesis.getVoices().filter(function (x) { return /^en(-|_)/i.test(x.lang); });
    stem = v.filter(function (x) { return x.localService && /GB/i.test(x.lang); })[0] || v.filter(function (x) { return x.localService; })[0] || null;
  }
  if ("speechSynthesis" in window) { kiesStem(); speechSynthesis.onvoiceschanged = kiesStem; }
  function spreek(tekst, langzaam) {
    if (!("speechSynthesis" in window) || !stem) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(tekst); u.voice = stem; u.lang = stem.lang; u.rate = langzaam ? 0.6 : 0.9;
    speechSynthesis.speak(u);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-spreek]"); if (!b) return;
    e.preventDefault(); e.stopPropagation(); spreek(b.getAttribute("data-spreek"), b.hasAttribute("data-langzaam"));
  });
  window.setTimeout(function () { if (!stem) document.documentElement.classList.add("geen-stem"); }, 1500);

  function schud(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function $(id) { return document.getElementById(id); }
  function luidspreker(tekst) { return '<button class="spk" type="button" data-spreek="' + esc(tekst) + '" aria-label="Luister: ' + esc(tekst) + '">🔊</button>'; }
  function klaar(box, titel, regel, procent, opnieuw) {
    var sterren = procent >= 90 ? "⭐⭐⭐" : procent >= 70 ? "⭐⭐" : procent >= 40 ? "⭐" : "💪";
    box.innerHTML = '<div class="klaar"><div class="sterren">' + sterren + "</div><h3>" + esc(titel) + "</h3><p>" + esc(regel) + '</p><button class="btn" type="button">Nog een keer</button> <a class="btn licht" href="#oefenen">Kies iets anders</a></div>';
    box.querySelector("button").addEventListener("click", opnieuw);
  }
  function bewaar(deel, procent, tekst) { if (window.AG) AG.resultaat({ deel: deel, procent: procent, tekst: tekst }); toonSterren(); }

  /* ── Tabs ── */
  var tabs = document.querySelectorAll("[data-tab]");
  function open(naam) {
    tabs.forEach(function (t) { t.setAttribute("aria-selected", String(t.getAttribute("data-tab") === naam)); });
    document.querySelectorAll(".paneel").forEach(function (p) { p.hidden = p.id !== "p-" + naam; });
    if (STARTERS[naam]) STARTERS[naam]();
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { open(t.getAttribute("data-tab")); }); });
  function toonSterren() {
    tabs.forEach(function (t) {
      var naam = t.getAttribute("data-deel"); if (!naam || !window.AG) return;
      var x = AG.deel(D.id, naam), m = t.querySelector(".ag-mark");
      if (m) m.remove();
      if (x) { var s = document.createElement("span"); s.className = "ag-mark"; s.textContent = x.procent >= 80 ? " ⭐" : " ✓"; t.appendChild(s); }
    });
  }

  /* ── Flashcards ── */
  function flashcards() {
    var box = $("fc"), kaarten = schud(ALLE), i = 0, goed = 0, om = false;
    function toon() {
      if (i >= kaarten.length) {
        var p = Math.round(goed / kaarten.length * 100);
        bewaar("Flashcards", p, goed + " van de " + kaarten.length + " gekend");
        return klaar(box, "Alle kaarten gedaan!", "Je kende er " + goed + " van de " + kaarten.length + ".", p, flashcards);
      }
      var w = kaarten[i]; om = false;
      box.innerHTML = '<p class="teller">Kaart ' + (i + 1) + " van " + kaarten.length + '</p>' +
        '<button class="fc-kaart" type="button" aria-live="polite"><span class="emoji">' + w.emoji + '</span><span class="woord">' + esc(w.nl) + '</span><span class="hint">Tik om het Engelse woord te zien</span></button>' +
        '<div class="fc-knoppen" hidden><button class="btn rood" type="button" data-fc="0">Nog oefenen</button><button class="btn groen" type="button" data-fc="1">Ik wist het!</button></div>';
      var k = box.querySelector(".fc-kaart");
      k.addEventListener("click", function () {
        if (om) { spreek(w.en); return; }
        om = true; k.classList.add("om");
        k.innerHTML = '<span class="emoji">' + w.emoji + '</span><span class="woord">' + esc(w.en) + '</span><span class="hint">' + esc(w.nl) + " · tik om nog eens te luisteren</span>";
        spreek(w.en); box.querySelector(".fc-knoppen").hidden = false;
      });
      box.querySelectorAll("[data-fc]").forEach(function (b) { b.addEventListener("click", function () { if (b.getAttribute("data-fc") === "1") goed++; else kaarten.push(w); i++; if (kaarten.length > ALLE.length * 2) kaarten.length = ALLE.length * 2; toon(); }); });
    }
    toon();
  }

  /* ── Memory ── */
  function memory() {
    var box = $("mem"), les = Number(box.getAttribute("data-les") || 0);
    var woorden = D.lessons[les].words.slice(0, 6);
    var kaarten = schud([].concat(
      woorden.map(function (w, n) { return { paar: n, html: '<span class="emoji">' + w.emoji + "</span>" + esc(w.en), en: w.en }; }),
      woorden.map(function (w, n) { return { paar: n, html: esc(w.nl) }; })));
    var open1 = null, bezig = false, paren = 0, beurten = 0;
    var keuze = '<div class="les-keuze">' + D.lessons.map(function (l, n) { return '<button type="button" class="choice" aria-pressed="' + (n === les) + '" data-les="' + n + '">' + l.emoji + " " + esc(l.title) + "</button>"; }).join("") + "</div>";
    box.innerHTML = keuze + '<p class="teller" id="mem-stand">Paren: 0 van ' + woorden.length + " · beurten: 0</p>" + '<div class="mem-grid">' + kaarten.map(function (k, n) { return '<button type="button" class="mem-kaart" data-n="' + n + '" aria-label="Kaart ' + (n + 1) + '"><span class="voor">?</span><span class="achter">' + k.html + "</span></button>"; }).join("") + "</div>";
    box.querySelectorAll("[data-les]").forEach(function (b) { b.addEventListener("click", function () { box.setAttribute("data-les", b.getAttribute("data-les")); memory(); }); });
    box.querySelectorAll(".mem-kaart").forEach(function (el) {
      el.addEventListener("click", function () {
        var k = kaarten[Number(el.getAttribute("data-n"))];
        if (bezig || el.classList.contains("om") || el.classList.contains("gevonden")) return;
        el.classList.add("om"); if (k.en) spreek(k.en);
        if (!open1) { open1 = { el: el, k: k }; return; }
        beurten++;
        var a = open1; open1 = null;
        if (a.k.paar === k.paar) {
          a.el.classList.add("gevonden"); el.classList.add("gevonden"); paren++;
          if (paren === woorden.length) {
            var p = Math.min(100, Math.round(woorden.length / beurten * 100));
            setTimeout(function () { bewaar("Memory", p, "klaar in " + beurten + " beurten"); klaar(box, "Alle paren gevonden!", "Je deed het in " + beurten + " beurten.", p, memory); }, 600);
          }
        } else {
          bezig = true; setTimeout(function () { a.el.classList.remove("om"); el.classList.remove("om"); bezig = false; }, 1000);
        }
        $("mem-stand").textContent = "Paren: " + paren + " van " + woorden.length + " · beurten: " + beurten;
      });
    });
  }

  /* ── Quiz ── */
  function quiz() {
    var box = $("quiz"), vragen = schud(ALLE).slice(0, 10), i = 0, goed = 0;
    function toon() {
      if (i >= vragen.length) {
        var p = goed * 10;
        bewaar("Quiz", p, goed + " van de 10 goed");
        return klaar(box, goed >= 8 ? "Super gedaan!" : "Quiz klaar!", goed + " van de 10 goed.", p, quiz);
      }
      var w = vragen[i], luister = stem && i % 2 === 1;
      var opties = schud([w].concat(schud(ALLE.filter(function (x) { return x.en !== w.en; })).slice(0, 3)));
      box.innerHTML = '<p class="teller">Vraag ' + (i + 1) + " van 10 · " + goed + " goed</p>" +
        (luister
          ? '<div class="vraag"><button class="spk groot" type="button" data-spreek="' + esc(w.en) + '">🔊</button><p>Luister. Wat betekent dit woord?</p></div>' +
            '<div class="opties">' + opties.map(function (o) { return '<button type="button" class="optie" data-en="' + esc(o.en) + '">' + o.emoji + " " + esc(o.nl) + "</button>"; }).join("") + "</div>"
          : '<div class="vraag"><span class="emoji groot">' + w.emoji + '</span><p>Wat is <b>' + esc(w.nl) + "</b> in het Engels?</p></div>" +
            '<div class="opties">' + opties.map(function (o) { return '<button type="button" class="optie" data-en="' + esc(o.en) + '">' + esc(o.en) + "</button>"; }).join("") + "</div>") +
        '<p class="uitleg" id="uitleg" aria-live="polite"></p>';
      if (luister) setTimeout(function () { spreek(w.en); }, 250);
      box.querySelectorAll(".optie").forEach(function (b) {
        b.addEventListener("click", function () {
          if (box.querySelector(".optie.goed, .optie.fout")) return;
          var ok = b.getAttribute("data-en") === w.en;
          if (ok) goed++;
          box.querySelectorAll(".optie").forEach(function (x) { if (x.getAttribute("data-en") === w.en) x.classList.add("goed"); });
          if (!ok) b.classList.add("fout");
          $("uitleg").innerHTML = (ok ? "Goed zo! " : "Bijna. ") + "<b>" + esc(w.en) + "</b> = " + esc(w.nl) + " " + luidspreker(w.en);
          spreek(w.en);
          setTimeout(function () { i++; toon(); }, ok ? 1200 : 2200);
        });
      });
    }
    toon();
  }

  var STARTERS = { flashcards: flashcards, memory: memory, quiz: quiz };

  /* ── Verhaal: vertaling tonen ── */
  document.querySelectorAll(".zin").forEach(function (z) {
    var b = z.querySelector(".toon"); if (!b) return;
    b.addEventListener("click", function () { z.classList.toggle("vertaald"); b.textContent = z.classList.contains("vertaald") ? "Verberg vertaling" : "Toon vertaling"; });
  });

  if (window.AG) AG.spel({ id: D.id, titel: D.titel, vak: "engels" });
  toonSterren();
  var start = (location.hash || "").replace("#", "");
  open(STARTERS[start] || start === "verhaal" || start === "woorden" ? start : "woorden");
})();
