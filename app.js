(function () {
  const DATA = window.KLASSISMUS_DATA;
  const slider = document.getElementById('class-slider');
  const statusEl = document.getElementById('visibility-status');
  const viewport = document.querySelector('.slides-viewport');
  const captionsEl = document.querySelector('.slide-texts');
  const prevBtn = document.querySelector('.nav-prev');
  const nextBtn = document.querySelector('.nav-next');
  const dotsContainer = document.querySelector('.slide-dots');

  const info = {
    tier: document.getElementById('info-tier'),
    income: document.getElementById('info-income'),
    steps: document.querySelector('.tier-steps'),
    intro: document.getElementById('info-intro'),
    heroNumber: document.getElementById('hero-number'),
    heroLabel: document.getElementById('hero-label'),
    heroNote: document.getElementById('hero-note'),
    dotGrid: document.getElementById('dot-grid'),
    places: document.getElementById('place-list'),
    funnel: document.getElementById('funnel'),
    funnelNote: document.getElementById('funnel-note'),
    facts: document.getElementById('fact-list'),
    sources: document.getElementById('source-list'),
  };

  let slides = [];
  let captions = [];
  let currentSlide = 0;
  let renderedScene = -1;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  // Trichter-Geometrie in viewBox-Einheiten: Beschriftung links, Trichter mittig, Werte rechts
  const FUNNEL = { width: 560, center: 285, maxWidth: 250, rowHeight: 46, gap: 6 };

  const formatNumber = (v) => v.toLocaleString('de-DE');

  function svgEl(tag, attrs, text) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
    if (text != null) node.textContent = text;
    return node;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  /** Regler 0–100 gleichmäßig auf die Herkunftsstufen verteilt */
  function getTier(value) {
    return Math.min(DATA.tiers.length - 1, Math.floor(value / (100 / DATA.tiers.length)));
  }

  /* ── Szenen aufbauen ── */

  function buildScene(scene) {
    const wrap = el('div', 'scene');
    wrap.setAttribute('role', 'img');
    wrap.setAttribute('aria-label', `${scene.title}: ${scene.institutions.map((i) => i.name).join(', ')}`);

    if (scene.base) {
      const base = el('img', 'layer-base');
      base.src = scene.base;
      base.alt = '';
      wrap.appendChild(base);
      scene.institutions.forEach((inst) => {
        if (!inst.img) return;
        const layer = el('img', 'layer-privilege');
        layer.src = inst.img;
        layer.alt = inst.name;
        layer.dataset.order = inst.order ?? 0;
        layer.dataset.label = inst.name;
        wrap.appendChild(layer);
      });
      return wrap;
    }

    // Platzhalter, bis das Foto da ist: jede Einrichtung als Kachel
    wrap.classList.add('scene-placeholder');
    const grid = el('div', 'placeholder-grid');
    scene.institutions.forEach((inst) => {
      const tile = el('div', 'placeholder-tile');
      tile.appendChild(el('span', 'placeholder-kind', inst.kind));
      tile.appendChild(el('strong', null, inst.name));
      tile.appendChild(el('span', 'placeholder-address', inst.address));
      if (inst.order != null) {
        tile.classList.add('layer-privilege');
        tile.dataset.order = inst.order;
        tile.dataset.label = inst.name;
      }
      grid.appendChild(tile);
    });
    wrap.appendChild(grid);
    wrap.appendChild(el('p', 'placeholder-note', 'Foto folgt'));
    return wrap;
  }

  function buildSlides() {
    const grain = viewport.querySelector('.grain');
    DATA.scenes.forEach((scene, i) => {
      const fig = el('figure', 'slide');
      fig.dataset.slide = i;
      fig.appendChild(buildScene(scene));
      viewport.insertBefore(fig, grain);

      const cap = el('figcaption', 'slide-caption');
      cap.dataset.slide = i;
      cap.appendChild(el('span', 'slide-tag', `Szene ${String(i + 1).padStart(2, '0')}`));
      cap.appendChild(el('strong', null, scene.title));
      cap.appendChild(el('span', 'slide-hint', scene.place));
      captionsEl.appendChild(cap);
    });
    slides = Array.from(viewport.querySelectorAll('.slide'));
    captions = Array.from(captionsEl.querySelectorAll('.slide-caption'));
  }

  /* ── Ebenen ein-/ausblenden ── */

  /** @param {number} value 0 = niedrige Klasse, 100 = hohe Klasse */
  function getLayerOpacity(layerOrder, totalLayers, value) {
    const t = (100 - value) / 100;
    const segmentSize = 1 / totalLayers;
    const start = layerOrder * segmentSize;
    const end = (layerOrder + 1) * segmentSize;

    if (t <= start) return 1;
    if (t >= end) return 0;
    return 1 - (t - start) / segmentSize;
  }

  /** Anzahl unterschiedlicher `order`-Stufen einer Szene — Bild und Info nutzen dieselbe Zählung. */
  function getLayerCount(scene) {
    return new Set(scene.institutions.filter((i) => i.order != null).map((i) => i.order)).size;
  }

  function updatePrivilegeLayers(slideEl, total, sliderValue) {
    slideEl.querySelectorAll('.layer-privilege').forEach((layer) => {
      const order = parseInt(layer.dataset.order, 10) || 0;
      const opacity = getLayerOpacity(order, total, sliderValue);
      layer.style.opacity = String(opacity);
      layer.classList.toggle('is-fading', opacity > 0 && opacity < 1);
    });
  }

  /* ── Informationsebene ── */

  function sourceIndex(key) {
    return Object.keys(DATA.sources).indexOf(key) + 1;
  }

  function sourceRef(key) {
    const a = el('a', 'source-ref', `[${sourceIndex(key)}]`);
    a.href = `#source-${key}`;
    return a;
  }

  function buildStaticInfo() {
    DATA.tiers.forEach((tier, i) => {
      const btn = el('button', 'tier-step');
      btn.type = 'button';
      btn.appendChild(el('span', 'tier-step-edu', tier.short));
      btn.appendChild(el('span', 'tier-step-income', tier.income));
      btn.setAttribute('aria-label', `${tier.label}, ${tier.income}`);
      btn.addEventListener('click', () => {
        // Mitte des Stufenbereichs, Ränder auf 0/100 damit die Extreme erreichbar sind
        const step = 100 / DATA.tiers.length;
        const value = i === 0 ? 0 : i === DATA.tiers.length - 1 ? 100 : Math.round(step * i + step / 2);
        slider.value = String(value);
        applySlider(value);
      });
      info.steps.appendChild(btn);
    });

    for (let i = 0; i < 100; i++) info.dotGrid.appendChild(el('span'));

    buildFunnel();

    Object.entries(DATA.sources).forEach(([key, src]) => {
      const li = el('li');
      li.id = `source-${key}`;
      li.appendChild(document.createTextNode(`${src.text} `));
      const a = el('a', null, 'Link');
      a.href = src.url;
      a.target = '_blank';
      a.rel = 'noopener';
      li.appendChild(a);
      info.sources.appendChild(li);
    });
  }

  /** Trichter als gestapelte Trapeze: Oberkante = Wert der Stufe, Unterkante = Wert der nächsten Stufe */
  function buildFunnel() {
    const { width, center, maxWidth, rowHeight, gap } = FUNNEL;
    const stages = DATA.funnel.stages;
    const height = stages.length * (rowHeight + gap) - gap;
    const halfWidth = (v) => Math.max((v / 100) * maxWidth, 3) / 2;
    info.funnel.setAttribute('viewBox', `0 0 ${width} ${height}`);

    DATA.funnel.groups.forEach((group, g) => {
      const shape = svgEl('g', { class: 'funnel-shape', 'data-group': g });
      shape.appendChild(svgEl('title', {}, group));
      stages.forEach((stage, i) => {
        const next = stages[i + 1] ? stages[i + 1].values[g] : stage.values[g];
        const y0 = i * (rowHeight + gap);
        const y1 = y0 + rowHeight;
        const top = halfWidth(stage.values[g]);
        const bottom = halfWidth(next);
        shape.appendChild(svgEl('polygon', {
          points: `${center - top},${y0} ${center + top},${y0} ${center + bottom},${y1} ${center - bottom},${y1}`,
        }));
      });
      info.funnel.appendChild(shape);
    });

    stages.forEach((stage, i) => {
      const y = i * (rowHeight + gap) + rowHeight / 2;
      info.funnel.appendChild(svgEl('text', { class: 'funnel-label', x: 0, y }, stage.label));
      const values = svgEl('text', { class: 'funnel-values', x: width, y, 'text-anchor': 'end' });
      values.appendChild(svgEl('tspan', { class: 'funnel-value-active' }));
      values.appendChild(svgEl('tspan', { class: 'funnel-value-other' }));
      info.funnel.appendChild(values);
    });
  }

  function updateFunnel(group) {
    const other = 1 - group;
    const shapeFor = (g) => info.funnel.querySelector(`.funnel-shape[data-group="${g}"]`);
    shapeFor(group).classList.add('is-active');
    shapeFor(other).classList.remove('is-active');
    // Aktiver Trichter gefüllt, der andere als Kontur darüber
    shapeFor(group).after(shapeFor(other));
    info.funnel.dataset.active = group;

    info.funnel.querySelectorAll('.funnel-values').forEach((text, i) => {
      const values = DATA.funnel.stages[i].values;
      text.querySelector('.funnel-value-active').textContent = values[group];
      text.querySelector('.funnel-value-other').textContent = ` / ${values[other]}`;
    });
    info.funnel.setAttribute(
      'aria-label',
      `Bildungstrichter, ${DATA.funnel.groups[group]}: ` +
        DATA.funnel.stages.map((s) => `${s.label} ${s.values[group]}`).join(', ')
    );
    info.funnelNote.replaceChildren(
      document.createTextNode(
        `Gefüllt: ${DATA.funnel.groups[group]}. Kontur: ${DATA.funnel.groups[other]}. Einkommen ist hier nicht erfasst. `
      ),
      ...DATA.funnel.sources.map(sourceRef)
    );
  }

  /**
   * Ein Text je Stufe, alle übereinander in derselben Grid-Zelle; nur der aktive ist sichtbar.
   * So hat das Element immer die Höhe des längsten Textes und das Layout springt beim Verschieben nicht.
   */
  function fillTierVariants(container, textForTier, source) {
    container.classList.add('tier-variants');
    container.replaceChildren(
      ...DATA.tiers.map((_, tier) => {
        const variant = el('span', 'tier-variant', `${textForTier(tier)} `);
        variant.appendChild(sourceRef(source));
        return variant;
      })
    );
  }

  function showTierVariant(container, tier) {
    container.querySelectorAll('.tier-variant').forEach((variant, i) => {
      variant.classList.toggle('is-active', i === tier);
    });
  }

  function renderHeroNotes(hero) {
    const topTier = DATA.tiers.length - 1;
    fillTierVariants(
      info.heroNote,
      (tier) => {
        const comparison = tier === topTier ? '' : `Zum Vergleich in der obersten Stufe: ${formatNumber(hero.values[topTier])}.`;
        return [comparison, groupNote(hero, tier)].filter(Boolean).join(' ');
      },
      hero.source
    );
  }

  function renderSceneInfo(scene) {
    info.intro.textContent = scene.intro;
    renderHeroNotes(DATA.metrics[scene.hero]);

    info.places.replaceChildren();
    scene.institutions.forEach((inst) => {
      const li = el('li', 'place');
      if (inst.order != null) li.classList.add('is-privileged');

      const head = el('div', 'place-head');
      head.appendChild(el('strong', 'place-kind', inst.kind));
      head.appendChild(el('span', 'place-name', inst.name));
      head.appendChild(el('span', 'place-address', inst.address));
      li.appendChild(head);

      const metric = inst.metric && DATA.metrics[inst.metric];
      if (metric) {
        const row = el('div', 'place-metric');
        const bar = el('div', 'metric-bar');
        bar.appendChild(el('span', 'metric-fill'));
        const top = el('span', 'metric-top');
        top.style.left = `${metric.values[DATA.tiers.length - 1]}%`;
        top.title = `Oberste Stufe: ${formatNumber(metric.values[DATA.tiers.length - 1])} %`;
        bar.appendChild(top);
        row.appendChild(bar);
        row.appendChild(el('span', 'metric-value'));
        li.appendChild(row);
        const caption = el('p', 'metric-caption');
        fillTierVariants(
          caption,
          (tier) => `${metric.label}.${metric.groups ? ` (${metric.groups[tier]})` : ''}`,
          metric.source
        );
        li.appendChild(caption);
      } else {
        li.appendChild(el('p', 'metric-caption', 'Bleibt sichtbar — für alle erreichbar.'));
      }
      li.dataset.metric = inst.metric || '';
      info.places.appendChild(li);
    });

    info.facts.replaceChildren();
    scene.facts.forEach((fact) => {
      const li = el('li', 'fact');
      li.appendChild(el('span', 'fact-value', fact.value));
      const p = el('p', 'fact-text', `${fact.text} `);
      p.appendChild(sourceRef(fact.source));
      li.appendChild(p);
      info.facts.appendChild(li);
    });
  }

  function groupNote(metric, tier) {
    return metric.groups ? `Wert für: ${metric.groups[tier]}.` : '';
  }

  function updateInfo(value) {
    const scene = DATA.scenes[currentSlide];
    const tier = getTier(value);
    const topTier = DATA.tiers.length - 1;

    if (renderedScene !== currentSlide) {
      renderSceneInfo(scene);
      renderedScene = currentSlide;
    }

    info.tier.textContent = DATA.tiers[tier].label;
    info.income.textContent = DATA.tiers[tier].income;
    info.steps.querySelectorAll('button').forEach((btn, i) => {
      btn.classList.toggle('is-active', i === tier);
      btn.setAttribute('aria-pressed', i === tier ? 'true' : 'false');
    });

    const hero = DATA.metrics[scene.hero];
    const count = Math.round(hero.values[tier]);
    info.heroNumber.textContent = formatNumber(hero.values[tier]);
    info.heroLabel.textContent = hero.label;
    info.dotGrid.querySelectorAll('span').forEach((dot, i) => {
      dot.classList.toggle('is-on', i < count);
      dot.classList.toggle('is-top', i >= count && i < Math.round(hero.values[topTier]));
    });
    showTierVariant(info.heroNote, tier);

    const total = getLayerCount(scene);
    info.places.querySelectorAll('.place').forEach((li, i) => {
      const inst = scene.institutions[i];
      if (inst.order != null) {
        li.classList.toggle('is-hidden', getLayerOpacity(inst.order, total, value) < 0.05);
      }
      const metric = DATA.metrics[li.dataset.metric];
      if (!metric) return;
      const v = metric.values[tier];
      li.querySelector('.metric-fill').style.width = `${v}%`;
      li.querySelector('.metric-value').textContent = `${formatNumber(v)} %`;
      showTierVariant(li.querySelector('.metric-caption'), tier);
    });

    updateFunnel(DATA.tiers[tier].funnel);
  }

  /* ── Steuerung ── */

  function applySlider(value) {
    DATA.scenes.forEach((scene, i) => updatePrivilegeLayers(slides[i], getLayerCount(scene), value));
    const tier = DATA.tiers[getTier(value)];
    statusEl.textContent = `${tier.label} · ${tier.income} netto`;
    slider.setAttribute('aria-valuenow', String(value));
    updateInfo(value);
  }

  function goToSlide(index) {
    currentSlide = ((index % slides.length) + slides.length) % slides.length;

    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentSlide));
    captions.forEach((caption, i) => caption.classList.toggle('is-active', i === currentSlide));

    dotsContainer.querySelectorAll('button').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentSlide);
      dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
    });

    applySlider(Number(slider.value));
  }

  function initDots() {
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Szene ${i + 1}: ${DATA.scenes[i].title}`);
      btn.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(btn);
    });
  }

  slider.addEventListener('input', () => applySlider(Number(slider.value)));

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  document.addEventListener('keydown', (e) => {
    if (e.target === slider) return;
    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
  });

  buildSlides();
  buildStaticInfo();
  initDots();
  goToSlide(0);
})();
