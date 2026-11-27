// Exporteert de lesinhoud van de ArtGames-app naar JSON voor artgames.nl.
// Wordt gecompileerd samen met Models/ en Data/ van de app; zie tools/export_app_content.sh.
import Foundation

struct WebWord: Codable { let en: String; let nl: String; let emoji: String }
struct WebLesson: Codable { let title: String; let subtitle: String; let emoji: String; let words: [WebWord]; let sentences: [String] }
struct WebLine: Codable { let emoji: String; let en: String; let nl: String }
struct WebStory: Codable { let title: String; let emoji: String; let sentences: [WebLine] }
struct WebChapter: Codable { let order: Int; let level: String; let title: String; let description: String; let emoji: String; let seasonal: Bool; let lessons: [WebLesson]; let story: WebStory }

func isSentence(_ s: String) -> Bool {
    let t = s.trimmingCharacters(in: .whitespaces)
    return t.hasSuffix(".") || t.hasSuffix("?") || t.hasSuffix("!") || t.split(separator: " ").count > 4
}

var out: [WebChapter] = []
for c in ContentData.build() {
    let lessons: [WebLesson] = c.lessons.map { l in
        var seen = Set<String>(), words: [WebWord] = [], sentences: [String] = []
        func addSentence(_ x: String) {
            let t = x.trimmingCharacters(in: .whitespaces)
            if !t.isEmpty && !t.contains("____") && !sentences.contains(t) { sentences.append(t) }
        }
        for e in l.exercises {
            if e.type == .wordOrder { addSentence(e.correctSentence); continue }
            if e.type == .dictation { addSentence(e.target); continue }
            for p in e.pairs where !seen.contains(p.english.lowercased()) {
                seen.insert(p.english.lowercased()); words.append(WebWord(en: p.english, nl: p.dutch, emoji: ""))
            }
            let t = e.target.trimmingCharacters(in: .whitespaces)
            guard !t.isEmpty, !e.translation.isEmpty, ![.cloze, .grammar, .dialogue].contains(e.type) else { continue }
            if t.contains(", ") { continue }                       // opsommingen zoals "book, pencil, bag"
            if isSentence(t) { addSentence(t); continue }
            if let i = words.firstIndex(where: { $0.en.lowercased() == t.lowercased() }) {
                if words[i].emoji.isEmpty { words[i] = WebWord(en: words[i].en, nl: words[i].nl, emoji: e.emoji) }
            } else {
                seen.insert(t.lowercased()); words.append(WebWord(en: t, nl: e.translation, emoji: e.emoji))
            }
        }
        return WebLesson(title: l.title, subtitle: l.subtitle, emoji: l.emoji, words: words, sentences: sentences)
    }
    let story = WebStory(title: c.story.title, emoji: c.story.emoji, sentences: c.story.sentences.map { WebLine(emoji: $0.emoji, en: $0.english, nl: $0.dutch) })
    out.append(WebChapter(order: c.order, level: c.level.rawValue, title: c.title, description: c.description, emoji: c.emoji, seasonal: c.seasonalWindow != nil, lessons: lessons, story: story))
}
let enc = JSONEncoder(); enc.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
FileHandle.standardOutput.write(try! enc.encode(out))
