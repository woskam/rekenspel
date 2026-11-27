/*
 * ArtGames: voortgang onthouden, alleen in deze browser (localStorage).
 * Er gaat niets naar een server. Wist iemand de browsergegevens, dan is de voortgang weg.
 *
 * Gebruik op een spelpagina:
 *   AG.spel({ id: "rekenen-memory", titel: "Memory", vak: "rekenen" });
 *   AG.naAfloop("endGame", () => ({ deel: "Tafel " + selectedTable, tekst: "In 9 beurten" }));
 *   AG.markeer(".table-btn", btn => "Tafel " + btn.textContent.trim());
 */
(function () {
  var KEY = "artgames.v1";
  var mem = null; // valt terug op geheugen als opslag niet mag (privévenster)

  function leeg() { return { actief: "gast", spelers: { gast: { naam: "", spellen: {}, laatst: null, dagen: [] } } }; }
  function laad() {
    if (mem) return mem;
    try { var d = JSON.parse(localStorage.getItem(KEY)); if (d && d.spelers) return d; } catch (e) {}
    return leeg();
  }
  function bewaar(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); mem = null; } catch (e) { mem = d; } }
  function vandaag() { var t = new Date(); return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(); }
  function speler(d) { d = d || laad(); return d.spelers[d.actief] || d.spelers[Object.keys(d.spelers)[0]]; }

  var huidig = null;

  var AG = {
    /* Spelers */
    spelers: function () { var d = laad(); return Object.keys(d.spelers).map(function (id) { return { id: id, naam: d.spelers[id].naam, actief: id === d.actief }; }); },
    speler: function () { return speler(); },
    kies: function (id) { var d = laad(); if (d.spelers[id]) { d.actief = id; bewaar(d); } },
    nieuw: function (naam) {
      naam = String(naam || "").trim().slice(0, 20); if (!naam) return;
      var d = laad(), gast = d.spelers.gast;
      // De eerste naam neemt de voortgang van "gast" over
      if (gast && !gast.naam && Object.keys(d.spelers).length === 1) { gast.naam = naam; d.actief = "gast"; }
      else { var id = "s" + Date.now().toString(36); d.spelers[id] = { naam: naam, spellen: {}, laatst: null, dagen: [] }; d.actief = id; }
      bewaar(d);
    },
    wisAlles: function () { try { localStorage.removeItem(KEY); } catch (e) {} mem = null; },

    /* Spelpagina */
    spel: function (info) {
      huidig = info;
      var d = laad(), s = speler(d);
      var sp = s.spellen[info.id] || (s.spellen[info.id] = { keer: 0, delen: {} });
      sp.titel = info.titel; sp.vak = info.vak;
      s.laatst = { id: info.id, titel: info.titel, vak: info.vak, href: location.pathname + location.search, tijd: Date.now() };
      if (s.dagen.indexOf(vandaag()) < 0) { s.dagen.push(vandaag()); s.dagen = s.dagen.slice(-60); }
      bewaar(d);
    },
    // r = { deel: "Tafel 7", procent: 90, tekst: "9 van de 10 goed" }  (procent mag ontbreken)
    resultaat: function (r) {
      if (!huidig) return;
      var d = laad(), s = speler(d), sp = s.spellen[huidig.id] || (s.spellen[huidig.id] = { keer: 0, delen: {} });
      sp.keer++; sp.laatsteTekst = (r.deel ? r.deel + ": " : "") + (r.tekst || "");
      var k = r.deel || "*", oud = sp.delen[k] || {};
      sp.delen[k] = { klaar: true, procent: Math.max(oud.procent || 0, r.procent || 0), keer: (oud.keer || 0) + 1 };
      bewaar(d);
      AG.markeerOpnieuw && AG.markeerOpnieuw();
    },
    naAfloop: function (fnNaam, maakResultaat) {
      var orig = window[fnNaam]; if (typeof orig !== "function") return;
      window[fnNaam] = function () { var uit = orig.apply(this, arguments); try { var r = maakResultaat(); if (r) AG.resultaat(r); } catch (e) {} return uit; };
    },
    info: function (id) { var s = speler(); return s.spellen[id] || null; },
    deel: function (id, deel) { var sp = AG.info(id); return sp && sp.delen[deel] || null; },

    /* Sterretjes op keuzeknoppen (bijvoorbeeld tafels) */
    markeer: function (selector, deelVan) {
      function doe() {
        if (!huidig) return;
        document.querySelectorAll(selector).forEach(function (el) {
          var x = AG.deel(huidig.id, deelVan(el)); var oud = el.querySelector(".ag-mark"); if (oud) oud.remove();
          if (!x) return;
          var m = document.createElement("span"); m.className = "ag-mark";
          m.textContent = x.procent >= 80 ? " ⭐" : " ✓"; m.title = x.procent ? "Beste: " + x.procent + "%" : "Gedaan";
          el.appendChild(m);
        });
      }
      AG.markeerOpnieuw = doe; doe();
    },
    reeks: function () {
      var dagen = speler().dagen.slice().sort(), n = 0, t = new Date();
      for (var i = 0; i < 60; i++) {
        var k = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
        if (dagen.indexOf(k) >= 0) n++; else if (i > 0) break;
        t.setDate(t.getDate() - 1);
      }
      return n;
    }
  };
  window.AG = AG;
})();
