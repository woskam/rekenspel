/*
 * ArtGames: overzicht van alle vakken, niveaus en spellen.
 * De homepage bouwt de keuzes en kaarten uit dit bestand.
 *
 * Nieuw vak?    Voeg een regel toe aan VAKKEN.
 * Nieuw spel?   Voeg een object toe aan SPELLEN met het vak, de niveaus en de link.
 *               Het id is hetzelfde als in AG.spel({ id }) op de spelpagina, zodat de
 *               homepage kan laten zien wat al gespeeld is.
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

    { vak: "engels", type: "les", niveaus: ["groep4"],
      emoji: "👋", titel: "Engels groep 4", tekst: "10 thema's met 170 woorden, zoals hallo & gedag, mijn familie, ik, jij, hij, zij. Flashcards, memory, quiz en verhaaltjes.",
      id: "engels-g4", href: "engels/groep4/", label: "Oefen" },
    { vak: "engels", type: "les", niveaus: ["groep5"],
      emoji: "👋", titel: "Engels groep 5", tekst: "12 thema's met 216 woorden, zoals hallo! begroetingen & jezelf, familie & vrienden, dieren & eten. Flashcards, memory, quiz en verhaaltjes.",
      id: "engels-g5", href: "engels/groep5/", label: "Oefen" },
    { vak: "engels", type: "les", niveaus: ["groep6"],
      emoji: "👨‍👩‍👧", titel: "Engels groep 6", tekst: "15 thema's met 255 woorden, zoals ik en mijn familie, kleuren en getallen, dieren. Flashcards, memory, quiz en verhaaltjes.",
      id: "engels-g6", href: "engels/groep6/", label: "Oefen" },
    { vak: "engels", type: "les", niveaus: ["groep7"],
      emoji: "⚽", titel: "Engels groep 7", tekst: "12 thema's met 196 woorden, zoals hobby's en sport, huis, kamer & de klok, weer, seizoenen & winkelen. Flashcards, memory, quiz en verhaaltjes.",
      id: "engels-g7", href: "engels/groep7/", label: "Oefen" },
    { vak: "engels", type: "les", niveaus: ["groep8"],
      emoji: "📱", titel: "Engels groep 8", tekst: "15 thema's met 242 woorden, zoals vriendschap & social media, eten & recepten, reizen & vakantie. Flashcards, memory, quiz en verhaaltjes.",
      id: "engels-g8", href: "engels/groep8/", label: "Oefen" },
    { vak: "engels", type: "les", niveaus: ["brugklas"],
      emoji: "🏫", titel: "Engels brugklas", tekst: "15 thema's met 251 woorden, zoals nieuwe school & rooster, vrije tijd & media, eten & gezondheid. Flashcards, memory, quiz en verhaaltjes.",
      id: "engels-brugklas", href: "engels/brugklas/", label: "Oefen" },

    { vak: "engels", type: "les", niveaus: ["brugklas"],
      emoji: "🎧", titel: "Brugklas les 1: Introductie (podcast)", tekst: "Podcast, woordenlijst, flashcards, multiple choice en memory.",
      id: "engels-bk-les1", href: "engels/brugklas/les1/index.html", label: "Start" },
    { vak: "engels", type: "les", niveaus: ["brugklas"],
      emoji: "⚽", titel: "Brugklas les 2: Hobbies (podcast)", tekst: "Podcast over hobby's en vrije tijd.",
      id: "engels-bk-les2", href: "engels/brugklas/les2/index.html", label: "Start" },

    { vak: "rekenen", type: "spel", niveaus: ["groep7", "groep8", "brugklas"],
      emoji: "✏️", titel: "Tafels oefenen", tekst: "Grote tafels van 11 tot 25 met uitleg over slimme rekenstrategieën.",
      id: "rekenen-tafels", href: "rekenspel/spel-tafels.html", label: "Speel" },
    { vak: "rekenen", type: "spel", niveaus: ["groep4", "groep5", "groep6", "groep7", "groep8", "brugklas"],
      emoji: "🎯", titel: "Multiple choice", tekst: "Kies een tafel van 1 tot 20 en kies het juiste antwoord uit vier mogelijkheden.",
      id: "rekenen-mc", href: "rekenspel/spel-multiple-choice.html", label: "Speel" },
    { vak: "rekenen", type: "spel", niveaus: ["groep4", "groep5", "groep6", "groep7", "groep8", "brugklas"],
      emoji: "🧠", titel: "Memory", tekst: "Kies een tafel van 1 tot 20 en zoek bij elke som het juiste antwoord.",
      id: "rekenen-memory", href: "rekenspel/spel-memory.html", label: "Speel" },
    { vak: "rekenen", type: "spel", niveaus: ["groep4", "groep5", "groep6", "groep7", "groep8", "brugklas"],
      emoji: "⚡", titel: "Speed challenge", tekst: "Kies een tafel van 1 tot 20: zoveel mogelijk goed in 60 seconden.",
      id: "rekenen-speed", href: "rekenspel/spel-speed.html", label: "Speel" }
  ]
};
