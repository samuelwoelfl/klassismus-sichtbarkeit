# Klassismus & Sichtbarkeit

Interaktive Web-App: Bilder im Fokus, ein Regler steuert, welche privilegierten Bildungsorte nach und nach ausblenden.

## Starten

Einfach `index.html` im Browser öffnen — kein Build, kein Server nötig.

```bash
open index.html
```

## Aufbau

| Datei        | Rolle                                      |
|-------------|---------------------------------------------|
| `index.html`| Szenen, SVG-Platzhalter, Slider             |
| `styles.css`| Layout, Slideshow, dunkles UI               |
| `app.js`    | Slider-Logik, Slideshow, Status-Text        |

## Eigene Fotos einbinden

Pro Szene:

1. **Basisbild** — Stadt ohne die „privilegierten“ Gebäude (oder mit allem, je nach Technik).
2. **Ebenen** — jedes Gebäude, das verschwinden soll, als separates PNG mit transparentem Hintergrund.

HTML-Struktur (statt SVG):

```html
<div class="scene">
  <img class="layer-base" src="stadt-basis.jpg" alt="">
  <img class="layer-privilege" data-order="0" data-label="Privatschule" src="privatschule.png" alt="">
  <img class="layer-privilege" data-order="1" data-label="Gymnasium" src="gymnasium.png" alt="">
  <img class="layer-privilege" data-order="2" data-label="Universität" src="uni.png" alt="">
</div>
```

CSS für gestapelte Fotos:

```css
.scene { position: relative; }
.scene img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.layer-privilege { transition: opacity 0.35s ease; }
```

`data-order="0"` blendet zuerst aus (bei Bewegung Richtung „niedrige Klasse“), höhere Zahlen folgen nacheinander.

## Slider

- **Links (0)** — hohe Klasse: alle Ebenen sichtbar  
- **Rechts (100)** — niedrige Klasse: alle `layer-privilege` unsichtbar  

Der Regler gilt für alle Slides gleichzeitig.
