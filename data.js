/*
 * Inhalte & Zahlen für Szenen und Informationsebene.
 *
 * Reglerposition → 6 Herkunftsstufen aus Bildung + Haushaltseinkommen der Eltern.
 * Die Stufen folgen der Diagonale des ifo-Chancenmonitors (Gymnasialbesuch nach
 * Abitur der Eltern × Haushaltsnettoeinkommen, Mikrozensus 2022). So gibt es für
 * jede Stufe eine echte, gemessene Kombination.
 *
 * Kennzahlen haben genau einen Wert je Stufe. `groups` nennt pro Stufe die Gruppe,
 * aus der der Wert in der Quelle stammt — die UI zeigt sie offen an. Nur der
 * Gymnasialbesuch ist nach Bildung UND Einkommen erhoben, alle anderen Werte nur
 * nach Bildung der Eltern.
 */
const NIEDRIG_MITTEL_HOCH = [
  'niedrige Elternbildung',
  'mittlere Elternbildung',
  'mittlere Elternbildung',
  'mittlere Elternbildung',
  'hohe Elternbildung',
  'hohe Elternbildung',
];

window.KLASSISMUS_DATA = {
  /* `funnel`: welche Gruppe des Bildungstrichters zur Stufe gehört (0 = Nicht-Akademiker, 1 = Akademiker) */
  tiers: [
    { label: 'Eltern ohne Berufsabschluss', short: 'ohne Abschluss', income: 'unter 2.750 €', funnel: 0 },
    { label: 'Eltern mit Berufsausbildung', short: 'Ausbildung', income: '2.750–4.000 €', funnel: 0 },
    { label: 'Eltern mit Berufsausbildung', short: 'Ausbildung', income: '4.000–6.000 €', funnel: 0 },
    { label: 'Ein Elternteil mit Abitur', short: 'Abitur', income: '4.000–6.000 €', funnel: 0 },
    { label: 'Eltern mit Hochschulabschluss', short: 'Studium', income: '4.000–6.000 €', funnel: 1 },
    { label: 'Eltern mit Hochschulabschluss', short: 'Studium', income: 'über 6.000 €', funnel: 1 },
  ],

  /*
   * Datenbasiertes Ausblenden: Die Kennzahl einer Einrichtung (`metric`) wird zwischen den
   * Stufenmitten stufenlos interpoliert. Ab `full` % ist das Gebäude voll sichtbar, darunter
   * verblasst es gleichmäßig und ist bei `gone` % ganz weg. Die Grenzen sind eine
   * gestalterische Setzung: Geht nur noch etwa jedes fünfte Kind diesen Weg, ist er im Bild weg.
   */
  fade: {
    gone: 20,
    full: 60,
    // `fades: 'zugespitzt'`: bewusst plakativ nach Reglerposition (weg bei 4, voll ab 20) —
    // die Informationsebene weist darauf hin, dass die Daten das nicht so zeigen.
    zugespitzt: [4, 20],
  },

  metrics: {
    gymnasium: {
      label: 'besuchen ein Gymnasium',
      values: [16.9, 23.8, 31.4, 55.7, 70.4, 79.2],
      groups: [
        'kein Elternteil mit Abitur, unter 2.750 €',
        'kein Elternteil mit Abitur, 2.750–4.000 €',
        'kein Elternteil mit Abitur, 4.000–6.000 €',
        'ein Elternteil mit Abitur, 4.000–6.000 €',
        'beide Eltern mit Abitur, 4.000–6.000 €',
        'beide Eltern mit Abitur, über 6.000 €',
      ],
      source: 'chancenmonitor2026',
    },
    studium: {
      label: 'beginnen ein Studium',
      values: [12, 24, 24, 48, 79, 79],
      groups: [
        'Eltern ohne Berufsabschluss, Einkommen nicht erfasst',
        'Eltern mit Berufsabschluss, Einkommen nicht erfasst',
        'Eltern mit Berufsabschluss, Einkommen nicht erfasst',
        'Eltern mit Abitur, Einkommen nicht erfasst',
        'Akademikerfamilie, Einkommen nicht erfasst',
        'Akademikerfamilie, Einkommen nicht erfasst',
      ],
      source: 'dzhw2018',
    },
    realschule: {
      label: 'besuchen eine Realschule',
      values: [33, 35, 35, 35, 18, 18],
      groups: NIEDRIG_MITTEL_HOCH,
      source: 'destatis2016',
    },
    mittelschule: {
      label: 'besuchen eine Haupt-/Mittelschule',
      values: [22, 7, 7, 7, 3, 3],
      groups: NIEDRIG_MITTEL_HOCH,
      source: 'destatis2016',
    },
    promotion: {
      label: 'schließen eine Promotion ab',
      values: [2, 2, 2, 2, 6, 6],
      groups: [
        'Nicht-Akademikerfamilie',
        'Nicht-Akademikerfamilie',
        'Nicht-Akademikerfamilie',
        'Nicht-Akademikerfamilie',
        'Akademikerfamilie',
        'Akademikerfamilie',
      ],
      source: 'stifterverband2021',
    },
  },

  /* Bildungstrichter: nur zwei Gruppen verfügbar (siehe `tiers[].funnel`). */
  funnel: {
    groups: ['Nicht-Akademikerfamilie', 'Akademikerfamilie'],
    stages: [
      { label: 'Grundschule', values: [100, 100] },
      { label: 'Oberstufe', values: [46, 83] },
      { label: 'Studium', values: [27, 79] },
      { label: 'Promotion', values: [2, 6] },
    ],
    sources: ['dzhw2018', 'stifterverband2021'],
  },

  sources: {
    chancenmonitor2026: {
      text: 'Wößmann et al. (2026): Der Chancenmonitor von ifo und „Ein Herz für Kinder“. ifo Schnelldienst digital 5/2026, Tab. A2 (Mikrozensus 2022; Kinder 10–18 Jahre, ohne Migrationshintergrund, gemeinsam erziehende Eltern).',
      url: 'https://www.ifo.de/DocDL/sd-digital-2026-05-woessmann-etal-chancenmonitor.pdf',
    },
    dzhw2018: {
      text: 'Kracke, Middendorff, Buck (2018): Beteiligung an Hochschulbildung. Chancen(un)gleichheit in Deutschland. DZHW Brief 3|2018 (Daten 2016).',
      url: 'https://www.dzhw.eu/services/meldungen/detail?pm_id=1523',
    },
    destatis2016: {
      text: 'Statistisches Bundesamt (2016): Bildung der Eltern beeinflusst die Schulwahl für Kinder. Pressemitteilung Nr. 312, Mikrozensus 2015 (Kinder unter 15 Jahren).',
      url: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2016/09/PD16_312_122.html',
    },
    stifterverband2021: {
      text: 'Stifterverband (2021): Vom Arbeiterkind zum Doktor. Hochschul-Bildungs-Report, Diskussionspapier 2 (korrigierte Fassung).',
      url: 'https://www.stifterverband.org/medien/vom_arbeiterkind_zum_doktor',
    },
    bpb2019: {
      text: 'bpb, Zahlen und Fakten: Schüler nach Schulabschluss der Eltern (Mikrozensus 2019).',
      url: 'https://www.bpb.de/kurz-knapp/zahlen-und-fakten/soziale-situation-in-deutschland/183038/schueler-nach-schulabschluss-der-eltern/',
    },
    sozialerhebung2021: {
      text: 'Kroher et al. (2023): Die Studierendenbefragung in Deutschland. 22. Sozialerhebung (Sommersemester 2021).',
      url: 'https://www.dzhw.eu/pdf/ab_20/Soz22_Hauptbericht.pdf',
    },
    kmk2022: {
      text: 'KMK (2024): Sonderpädagogische Förderung in Schulen 2013–2022. Statistische Veröffentlichungen, Dok. Nr. 240.',
      url: 'https://www.kmk.org/fileadmin/Dateien/pdf/Statistik/Dokumentationen/Dok_240_SoPae_2022.pdf',
    },
  },

  /*
   * Szenen = Fotostandorte.
   * - `base`: Foto ohne die freigestellten Gebäude (optional; ohne Foto wird ein Platzhalter gezeigt)
   * - `institutions[].fades`: true = blendet je nach Kennzahl (`metric`) aus, siehe `fade`;
   *   'zugespitzt' = blendet ganz links plakativ aus, auch wenn die Daten das nicht decken.
   *   Ohne `fades` bleibt die Einrichtung immer sichtbar.
   * - `institutions[].img`: freigestelltes PNG dieser Einrichtung (optional, gleiche Größe wie `base`)
   * - `institutions[].label`: [x, y] in Prozent des Fotos, Spitze des Labels zeigt dorthin (optional)
   * - `institutions[].metric`: Schlüssel aus `metrics` (optional)
   * - `hero`: Kennzahl für die 100-Punkte-Grafik
   */
  scenes: [
    {
      title: 'Kriemhildenstraße',
      place: 'Augsburg · Stadtjägerviertel',
      intro: 'Ein Gymnasium mitten im Wohnviertel, für alle sichtbar. Ob es für ein Kind nach der vierten Klasse auch erreichbar ist, entscheidet sich vor allem am Elternhaus.',
      base: 'img/1_bg.jpg',
      hero: 'gymnasium',
      institutions: [
        { name: 'St.-Georg-Mittelschule', address: 'Auf dem Kreuz 25', kind: 'Mittelschule', metric: 'mittelschule' },
        { name: 'Agnes-Bernauer-Realschule', address: 'Auf dem Kreuz 36', kind: 'Realschule', metric: 'realschule', fades: 'zugespitzt' },
        { name: 'Jakob-Fugger-Gymnasium', address: 'Kriemhildenstraße 5', kind: 'Gymnasium', metric: 'gymnasium', fades: true, img: 'img/gymnasium_1.png', label: [42.7, 35] },
        { name: 'Welserschule', address: 'Jesuitengasse 14', kind: 'Kaufm. Berufsschule' },
      ],
      facts: [
        { value: '46 : 83', text: 'Von je 100 Kindern erreichen 46 aus Nicht-Akademiker- und 83 aus Akademikerfamilien die gymnasiale Oberstufe.', source: 'dzhw2018' },
        { value: '40 % : 63 %', text: 'Kinder gut verdienender Eltern ohne Abitur (über 6.000 €) gehen seltener aufs Gymnasium als Kinder von Eltern mit zwei Abiturzeugnissen und weniger als 2.750 €. Bildung wiegt schwerer als Geld.', source: 'chancenmonitor2026' },
      ],
    },
    {
      title: 'Tannenstraße',
      place: 'Fürth · Innenstadt',
      intro: 'Mittelschule, Realschule und Gymnasium stehen hier Wand an Wand. Nach der vierten Klasse werden die Kinder auf drei Gebäude verteilt — und in welches sie gehen, folgt deutlich dem Elternhaus.',
      base: 'img/4_bg.jpg',
      hero: 'gymnasium',
      institutions: [
        { name: 'Otto-Seeling-Mittelschule', address: 'Otto-Seeling-Promenade 31', kind: 'Mittelschule', metric: 'mittelschule', img: 'img/4_Mittelschule.png', label: [45.5, 17] },
        { name: 'Leopold-Ullstein-Realschule', address: 'Sigmund-Nathan-Straße 1', kind: 'Realschule', metric: 'realschule', fades: 'zugespitzt', img: 'img/4_realschule.png', label: [33, 48] },
        { name: 'Helene-Lange-Gymnasium', address: 'Tannenstraße 20', kind: 'Gymnasium', metric: 'gymnasium', fades: true, img: 'img/4_Gymnasium.png', label: [55, 33] },
      ],
      facts: [
        { value: '5,9 %', text: 'der Eltern von Gymnasiast*innen haben höchstens einen Hauptschulabschluss. An Hauptschulen sind es 41,7 %.', source: 'bpb2019' },
        { value: '16,9 % → 40 %', text: 'Ohne Abitur in der Familie hängt es besonders am Geld: Mit steigendem Einkommen wächst die Gymnasialquote auf mehr als das Doppelte.', source: 'chancenmonitor2026' },
        { value: '67,1 %', text: 'der Eltern von Gymnasiast*innen haben selbst (Fach-)Abitur — deutlich mehr als im Schnitt aller Schularten.', source: 'bpb2019' },
      ],
    },
    {
      title: 'Oettingenstraße',
      place: 'München · Lehel · am Englischen Garten',
      intro: 'Die Helen-Keller-Realschule und das Institut für Informatik der LMU liegen Wand an Wand am Englischen Garten. Wer auf dem Schulhof steht, sieht die Uni — ob der Weg dorthin führt, hängt stark vom Elternhaus ab.',
      base: 'img/2_bg.jpg',
      hero: 'studium',
      institutions: [
        { name: 'Helen-Keller-Realschule', address: 'Oettingenstraße 78', kind: 'Realschule', metric: 'realschule', fades: 'zugespitzt', img: 'img/2_helen-keller-realschule.png', label: [62.6, 45] },
        { name: 'Institut für Informatik der LMU', address: 'Oettingenstraße 67', kind: 'Universität', metric: 'studium', fades: true, img: 'img/2_lmu-informatik.png', label: [33.5, 30] },
      ],
      facts: [
        { value: '79 : 27', text: 'Von je 100 Kindern beginnen 79 aus Akademiker- und 27 aus Nicht-Akademikerfamilien ein Studium.', source: 'dzhw2018' },
        { value: '22 % : 9 %', text: 'der Studienanfänger*innen aus Nicht-Akademiker- bzw. Akademikerfamilien kommen ohne gymnasiales Abitur an die Hochschule — etwa über Realschule, Ausbildung und Berufsoberschule.', source: 'stifterverband2021' },
        { value: '56 %', text: 'aller Studierenden haben mindestens ein Elternteil mit Hochschulabschluss.', source: 'sozialerhebung2021' },
      ],
    },
    {
      title: 'Campus Deutz',
      place: 'Köln · Deutz · Betzdorfer Straße',
      intro: 'Das Hans-Böckler-Berufskolleg und der Campus Deutz der TH Köln liegen nur einen Parkplatz auseinander. Am Berufskolleg lässt sich die Fachhochschulreife erwerben — wie viele danach über den Platz ins Studium gehen, hängt stark vom Elternhaus ab.',
      base: 'img/3_bg.jpg',
      hero: 'studium',
      institutions: [
        { name: 'Hans-Böckler-Berufskolleg', address: 'Köln-Deutz', kind: 'Berufskolleg', img: 'img/3_berufskolleg.png', label: [56, 52] },
        { name: 'TH Köln, Campus Deutz', address: 'Betzdorfer Straße 2', kind: 'Hochschule', metric: 'studium', fades: true, img: 'img/3_th-koeln.png', label: [24, 42] },
      ],
      facts: [
        { value: '22 % : 9 %', text: 'der Studienanfänger*innen aus Nicht-Akademiker- bzw. Akademikerfamilien kommen ohne gymnasiales Abitur an die Hochschule — etwa über Ausbildung, Berufskolleg oder Berufsoberschule.', source: 'stifterverband2021' },
        { value: '79 : 27', text: 'Von je 100 Kindern beginnen 79 aus Akademiker- und 27 aus Nicht-Akademikerfamilien ein Studium.', source: 'dzhw2018' },
        { value: '56 %', text: 'aller Studierenden haben mindestens ein Elternteil mit Hochschulabschluss.', source: 'sozialerhebung2021' },
      ],
    },
  ],
};
