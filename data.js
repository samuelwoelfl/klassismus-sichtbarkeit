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
   * Szenen = Fotostandorte in Augsburg.
   * - `base`: Foto ohne die privilegierten Orte (optional; ohne Foto wird ein Platzhalter gezeigt)
   * - `institutions[].order`: gesetzt = verschwindet beim Verschieben nach links (0 zuerst).
   *   Ohne `order` bleibt die Einrichtung immer sichtbar.
   * - `institutions[].img`: freigestelltes PNG dieser Einrichtung (optional)
   * - `institutions[].metric`: Schlüssel aus `metrics` (optional)
   * - `hero`: Kennzahl für die 100-Punkte-Grafik
   */
  scenes: [
    {
      title: 'Auf dem Kreuz',
      place: 'Innenstadt Nord · Domviertel',
      intro: 'Mittelschule, Realschule, Berufsschule und Gymnasium liegen hier kaum 300 Meter auseinander. Räumlich Nachbarn — und doch führen sie in sehr unterschiedliche Leben.',
      base: 'img/1_bg.jpg',
      hero: 'gymnasium',
      institutions: [
        { name: 'St.-Georg-Mittelschule', address: 'Auf dem Kreuz 25', kind: 'Mittelschule', metric: 'mittelschule' },
        { name: 'Welserschule', address: 'Jesuitengasse 14', kind: 'Kaufm. Berufsschule' },
        { name: 'Agnes-Bernauer-Realschule', address: 'Auf dem Kreuz 36', kind: 'Realschule', metric: 'realschule' },
        { name: 'Maria-Ward-Gymnasium', address: 'Frauentorstraße 26', kind: 'Gymnasium', metric: 'gymnasium', order: 0, img: 'img/gymnasium_1.png' },
      ],
      facts: [
        { value: '5,9 %', text: 'der Eltern von Gymnasiast*innen haben höchstens einen Hauptschulabschluss. An Hauptschulen sind es 41,7 %.', source: 'bpb2019' },
        { value: '46 : 83', text: 'Von je 100 Kindern erreichen 46 aus Nicht-Akademiker- und 83 aus Akademikerfamilien die gymnasiale Oberstufe.', source: 'dzhw2018' },
        { value: '40 % : 63 %', text: 'Kinder gut verdienender Eltern ohne Abitur (über 6.000 €) gehen seltener aufs Gymnasium als Kinder von Eltern mit zwei Abiturzeugnissen und weniger als 2.750 €. Bildung wiegt schwerer als Geld.', source: 'chancenmonitor2026' },
      ],
    },
    {
      title: 'Ulrichsviertel',
      place: 'Maximilianstraße Süd · Predigerberg',
      intro: 'Förderzentrum, Berufsschulen für soziale Berufe, Realschule und Gymnasium teilen sich wenige Straßenzüge. Wer wo landet, entscheidet sich oft schon mit zehn Jahren.',
      hero: 'gymnasium',
      institutions: [
        { name: 'Ulrichschule', address: 'Maximilianstraße 52', kind: 'Förderzentrum' },
        { name: 'Berufsschulzentrum für soziale Berufe', address: 'Predigerberg 1', kind: 'Berufsschule' },
        { name: 'Fachakademie für Hauswirtschaft', address: 'Maximilianstraße 79', kind: 'Fachakademie' },
        { name: 'Mädchenrealschule St. Ursula', address: 'Bei Sankt Ursula 2', kind: 'Realschule', metric: 'realschule' },
        { name: 'Holbein-Gymnasium', address: 'Hallstraße 10', kind: 'Gymnasium', metric: 'gymnasium', order: 0 },
      ],
      facts: [
        { value: '73,1 %', text: 'der Jugendlichen, die 2022 eine Förderschule verließen, gingen ohne Hauptschulabschluss.', source: 'kmk2022' },
        { value: '16,9 % → 40 %', text: 'Ohne Abitur in der Familie hängt es besonders am Geld: Mit steigendem Einkommen wächst die Gymnasialquote auf mehr als das Doppelte.', source: 'chancenmonitor2026' },
        { value: '67,1 %', text: 'der Eltern von Gymnasiast*innen haben selbst (Fach-)Abitur — deutlich mehr als im Schnitt aller Schularten.', source: 'bpb2019' },
      ],
    },
    {
      title: 'Grottenau',
      place: 'Königsplatz · Innenstadt',
      intro: 'Zwischen Grottenau und Schaezlerstraße: eine Berufsfachschule für Altenpflege, ein Gymnasium und das Leopold-Mozart-Zentrum der Universität, an dem Musik studiert wird.',
      hero: 'studium',
      institutions: [
        { name: 'St.-Anna-Grundschule', address: 'Schaezlerstraße 26', kind: 'Grundschule' },
        { name: 'Heimerer Schule', address: 'Ludwigstraße 19', kind: 'Berufsfachschule Altenpflege' },
        { name: 'Maria-Theresia-Gymnasium', address: 'Gutenbergstraße 1', kind: 'Gymnasium', metric: 'gymnasium', order: 1 },
        { name: 'Leopold-Mozart-Zentrum', address: 'Grottenau 1', kind: 'Universität', metric: 'studium', order: 0 },
      ],
      facts: [
        { value: '22 % : 9 %', text: 'der Studienanfänger*innen aus Nicht-Akademiker- bzw. Akademikerfamilien kommen ohne gymnasiales Abitur an die Hochschule — etwa über Ausbildung und Berufsoberschule.', source: 'stifterverband2021' },
        { value: '56 %', text: 'aller Studierenden haben mindestens ein Elternteil mit Hochschulabschluss.', source: 'sozialerhebung2021' },
      ],
    },
    {
      title: 'Campus Süd',
      place: 'Universitätsviertel · Alter Postweg',
      intro: 'Am Rand des Uni-Campus liegen das Berufsbildungswerk, eine Berufsschule und die Technikerschule. Derselbe Stadtteil, völlig unterschiedliche Aussichten auf Einkommen und Status.',
      hero: 'studium',
      institutions: [
        { name: 'Berufsbildungswerk Augsburg', address: 'Hugo-Eckener-Straße 25', kind: 'Berufliche Reha' },
        { name: 'Berufsschule St. Elisabeth', address: 'Fritz-Wendel-Straße 4', kind: 'Berufsschule' },
        { name: 'Technikerschule Augsburg', address: 'Alter Postweg 101', kind: 'Fachschule' },
        { name: 'Universität Augsburg', address: 'Universitätsstraße 2', kind: 'Universität', metric: 'studium', order: 0 },
      ],
      facts: [
        { value: '56 %', text: 'der Studierenden haben mindestens ein Elternteil mit Hochschulabschluss.', source: 'sozialerhebung2021' },
        { value: '13 %', text: 'der Studierenden erhielten 2021 BAföG.', source: 'sozialerhebung2021' },
        { value: '2 : 6', text: 'Von 100 Kindern promovieren 2 aus Nicht-Akademiker- und 6 aus Akademikerfamilien.', source: 'stifterverband2021' },
      ],
    },
    {
      title: 'Klinikum',
      place: 'Universitätsklinikum · Kriegshaber',
      intro: 'Am Uniklinikum lernen Pflegekräfte und studieren Ärzt*innen auf demselben Gelände. Beide arbeiten später am selben Bett — mit sehr unterschiedlichen Zugangswegen.',
      hero: 'studium',
      institutions: [
        { name: 'Akademie für Gesundheitsberufe', address: 'Stenglinstraße', kind: 'Berufsfachschulen Pflege' },
        { name: 'Medizincampus', address: 'Delbrückstraße', kind: 'Medizinstudium', metric: 'studium', order: 0 },
      ],
      facts: [
        { value: '76 % : 82 %', text: 'Einmal eingeschrieben, schließen Nicht-Akademiker- und Akademikerkinder den Bachelor fast gleich oft ab. Die Auslese passiert vorher.', source: 'stifterverband2021' },
        { value: '79 : 27', text: 'Von je 100 Kindern beginnen 79 aus Akademiker- und 27 aus Nicht-Akademikerfamilien ein Studium.', source: 'dzhw2018' },
      ],
    },
  ],
};
