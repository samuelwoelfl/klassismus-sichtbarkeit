(function () {
  const slider = document.getElementById('class-slider');
  const statusEl = document.getElementById('visibility-status');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const captions = Array.from(document.querySelectorAll('.slide-caption'));
  const prevBtn = document.querySelector('.nav-prev');
  const nextBtn = document.querySelector('.nav-next');
  const dotsContainer = document.querySelector('.slide-dots');

  let currentSlide = 0;

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

  function updatePrivilegeLayers(slideEl, sliderValue) {
    const layers = slideEl.querySelectorAll('.layer-privilege');
    const total = layers.length;
    const hidden = [];

    layers.forEach((layer) => {
      const order = parseInt(layer.dataset.order, 10) || 0;
      const opacity = getLayerOpacity(order, total, sliderValue);
      layer.style.opacity = String(opacity);
      layer.classList.toggle('is-fading', opacity > 0 && opacity < 1);

      if (opacity < 0.05) {
        const label = layer.dataset.label;
        if (label) hidden.push(label);
      }
    });

    return hidden;
  }

  function buildStatusText(sliderValue, hiddenLabels) {
    if (sliderValue >= 100) {
      return 'Alle Bildungsorte sind sichtbar.';
    }
    if (sliderValue === 0) {
      return 'Nur noch das bleibt, was ohne Klassenprivileg zugänglich ist.';
    }
    if (hiddenLabels.length === 0) {
      return 'Einige Orte beginnen zu verschwinden …';
    }
    const list = hiddenLabels.join(', ');
    return `Nicht mehr sichtbar: ${list}`;
  }

  function getHiddenLabels(slideEl) {
    const hidden = [];
    slideEl.querySelectorAll('.layer-privilege').forEach((layer) => {
      const opacity = parseFloat(layer.style.opacity);
      if (opacity < 0.05 && layer.dataset.label) {
        hidden.push(layer.dataset.label);
      }
    });
    return hidden;
  }

  function applySliderToAllSlides(value) {
    slides.forEach((slide) => updatePrivilegeLayers(slide, value));

    const activeSlide = slides[currentSlide];
    const hidden = activeSlide ? getHiddenLabels(activeSlide) : [];

    statusEl.textContent = buildStatusText(value, hidden);
    slider.setAttribute('aria-valuenow', String(value));
  }

  function goToSlide(index) {
    currentSlide = ((index % slides.length) + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === currentSlide);
    });

    captions.forEach((caption, i) => {
      caption.classList.toggle('is-active', i === currentSlide);
    });

    dotsContainer.querySelectorAll('button').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentSlide);
      dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
    });

    applySliderToAllSlides(Number(slider.value));
  }

  function initDots() {
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Szene ${i + 1}`);
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      if (i === 0) btn.classList.add('is-active');
      btn.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(btn);
    });
  }

  slider.addEventListener('input', () => {
    applySliderToAllSlides(Number(slider.value));
  });

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
  });

  initDots();
  applySliderToAllSlides(Number(slider.value));
})();
