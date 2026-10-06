# Klassismus & Sichtbarkeit

Interaktive Web-App: Bilder im Fokus, ein Regler steuert, welche privilegierten Bildungsorte nach und nach ausblenden.

## Starten

Einfach `index.html` im Browser öffnen — kein Build, kein Server nötig.

```bash
open index.html
```

## Aufbau

| Datei        | Rolle                                                        |
|-------------|---------------------------------------------------------------|
| `index.html`| Grundgerüst: Slideshow, Regler, Informationsebene            |
| `data.js`   | Szenen (Orte, Einrichtungen, Fotos), Kennzahlen, Quellen      |
| `styles.css`| Layout, Slideshow, Informationsebene, dunkles UI              |
| `app.js`    | Baut Szenen aus `data.js`, Slider-Logik, Informationsebene    |

## Eigene Fotos einbinden

Pro Szene in `data.js`:

1. **`base`** — Foto ohne die „privilegierten“ Gebäude.
2. **`institutions[].img`** — jedes Gebäude, das verschwinden soll, als PNG mit transparentem Hintergrund.
3. **`institutions[].fades: true`** — das Gebäude blendet datenbasiert aus (siehe unten). Ohne `fades` bleibt die Einrichtung immer sichtbar.
   `fades: 'zugespitzt'` blendet ganz links plakativ aus, unabhängig von den Daten (z. B. Realschulen); die Informationsebene weist darauf hin.
4. **`institutions[].label`** — `[x, y]` in Prozent des Fotos: Position des Gebäude-Labels.

Solange eine Szene kein `base`-Foto hat, zeigt sie Platzhalter-Kacheln mit den Einrichtungen.

## Slider

- **Links (0)** — niedrige Klasse
- **Rechts (100)** — hohe Klasse

Wann ein Gebäude verschwindet, bestimmen die Daten: Die Kennzahl der Einrichtung (z. B. Gymnasialbesuch) wird zwischen den Stufen stufenlos interpoliert. Über `fade.full` (60 %) ist das Gebäude voll sichtbar, darunter verblasst es und bei `fade.gone` (20 %) ist es weg. Uni und Gymnasium verschwinden also nicht schlagartig, sondern in dem Tempo, in dem die Chancen sinken.

Der Regler gilt für alle Szenen gleichzeitig und steuert auch die Informationsebene. Die Position wird in sechs Herkunftsstufen aus Bildung und Haushaltseinkommen der Eltern übersetzt. Die Stufen folgen der Diagonale des ifo-Chancenmonitors (Gymnasialbesuch nach Abitur der Eltern × Einkommen, Mikrozensus 2022), damit jede Stufe einer echten, gemessenen Kombination entspricht.

## Informationsebene

Unter dem Bild: Herkunftsstufe, „Von 100 Kindern …“-Grafik, Kennzahlen je Einrichtung im Bild, Bildungstrichter (SVG-Trichterdiagramm) und ortsbezogene Hintergrundfakten. Alle Zahlen stehen mit Quelle in `data.js`. Nur der Gymnasialbesuch ist nach Bildung und Einkommen erhoben; wo eine Quelle andere oder weniger Gruppen unterscheidet, zeigt die Seite an, aus welcher Gruppe der Wert stammt.

## Lokal mit Server

```bash
python3 -m http.server 8123
```
