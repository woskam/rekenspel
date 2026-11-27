/*
 * ArtGames: overzicht van alle vakken, niveaus en spellen.
 * De homepage bouwt de keuzes en kaarten uit dit bestand.
 *
 * Nieuw vak?    Voeg een regel toe aan VAKKEN.
 * Nieuw spel?   Voeg een object toe aan SPELLEN met het vak, de niveaus en de link.
 */
window.ARTGAMES = {
  NIVEAUS: [
    { id: "groep3", naam: "Groep 3" },
    { id: "groep4", naam: "Groep 4" },
    { id: "groep5", naam: "Groep 5" },
    { id: "groep6", naam: "Groep 6" },
    { id: "groep7", naam: "Groep 7" },
    { id: "groep8", naam: "Groep 8" },
    { id: "brugklas", naam: "Brugklas" }
  ],

  // status: "open" of "binnenkort"
  VAKKEN: [
    { id: "rekenen",    naam: "Rekenen",    emoji: "🔢", kleur: "#fff1df", status: "open" },
    { id: "engels",     naam: "Engels",     emoji: "🇬🇧", kleur: "#e5f0ff", status: "open" },
    { id: "nederlands", naam: "Nederlands", emoji: "📖", kleur: "#fff4cc", status: "binnenkort" },
    { id: "frans",      naam: "Frans",      emoji: "🇫🇷", kleur: "#ffe8e8", status: "binnenkort" }
  ],

  // type: "spel", "les" of "app"
  SPELLEN: [
    { vak: "engels", type: "app", niveaus: ["groep4", "groep5", "groep6", "groep7", "groep8", "brugklas"],
      emoji: "📱", titel: "ArtGames-app", tekst: "Luisteren, nazeggen en lezen in korte lessen op je eigen niveau. Gratis voor iPhone en iPad.",
      href: "app/", label: "Bekijk de app" },

    { vak: "engels", type: "les", niveaus: ["brugklas"],
      emoji: "🎧", titel: "Les 1: Introductie", tekst: "Podcast, woordenlijst, flashcards, multiple choice en memory.",
      href: "engels/brugklas/les1/index.html", label: "Start" },
    { vak: "engels", type: "les", niveaus: ["brugklas"],
      emoji: "⚽", titel: "Les 2: Hobbies", tekst: "Podcast over hobby's en vrije tijd.",
      href: "engels/brugklas/les2/index.html", label: "Start" },

    { vak: "rekenen", type: "spel", niveaus: ["groep7", "groep8", "brugklas"],
      emoji: "✏️", titel: "Tafels oefenen", tekst: "Grote tafels van 11 tot 25 met uitleg over slimme rekenstrategieën.",
      href: "rekenspel/spel-tafels.html", label: "Speel" },
    { vak: "rekenen", type: "spel", niveaus: ["groep4", "groep5", "groep6", "groep7", "groep8", "brugklas"],
      emoji: "🎯", titel: "Multiple choice", tekst: "Kies een tafel van 1 tot 20 en kies het juiste antwoord uit vier mogelijkheden.",
      href: "rekenspel/spel-multiple-choice.html", label: "Speel" },
    { vak: "rekenen", type: "spel", niveaus: ["groep4", "groep5", "groep6", "groep7", "groep8", "brugklas"],
      emoji: "🧠", titel: "Memory", tekst: "Kies een tafel van 1 tot 20 en zoek bij elke som het juiste antwoord.",
      href: "rekenspel/spel-memory.html", label: "Speel" },
    { vak: "rekenen", type: "spel", niveaus: ["groep4", "groep5", "groep6", "groep7", "groep8", "brugklas"],
      emoji: "⚡", titel: "Speed challenge", tekst: "Kies een tafel van 1 tot 20: zoveel mogelijk goed in 60 seconden.",
      href: "rekenspel/spel-speed.html", label: "Speel" }
  ]
};
