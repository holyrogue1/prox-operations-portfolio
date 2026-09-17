/* Decorative photography rotates while the copy remains stationary. */
document.querySelectorAll('[data-hero-gallery]').forEach((hero) => {
  const slides = Array.from(hero.querySelectorAll('.hero-image'));
  const controls = hero.querySelector('.hero-controls');
  const counter = hero.querySelector('.hero-counter');
  const toggle = hero.querySelector('[data-toggle]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const english = document.documentElement.lang === 'en';
  let index = 0;
  let paused = reduced.matches;
  let timer;
  let advancing = false;
  let keyboardFocus = false;
  const failed = new Set();
  controls.hidden = false;
  function label() {
    toggle.textContent = paused ? (english ? 'Play' : '재생') : (english ? 'Pause' : '일시정지');
    toggle.setAttribute('aria-label', paused ? (english ? 'Play background slideshow' : '배경 자동 전환 재생') : (english ? 'Pause background slideshow' : '배경 자동 전환 일시정지'));
  }
  async function show(direction) {
    if (advancing) return;
    advancing = true;
    try {
      for (let attempt = 1; attempt < slides.length; attempt += 1) {
        const next = (index + direction * attempt + slides.length) % slides.length;
        if (failed.has(next)) continue;
        try { await slides[next].decode(); } catch { failed.add(next); continue; }
        slides[index].classList.remove('is-active');
        slides[next].classList.add('is-active');
        index = next;
        counter.textContent = `${index + 1} / ${slides.length}`;
        return;
      }
      paused = true;
      refresh();
    } finally { advancing = false; }
  }
  function refresh() {
    window.clearInterval(timer);
    label();
    if (!paused && !document.hidden && !keyboardFocus) {
      timer = window.setInterval(() => show(1), 5000);
    }
  }
  toggle.addEventListener('click', () => { paused = !paused; keyboardFocus = false; refresh(); });
  hero.querySelector('[data-prev]').addEventListener('click', () => { show(-1); refresh(); });
  hero.querySelector('[data-next]').addEventListener('click', () => { show(1); refresh(); });
  hero.addEventListener('focusin', (event) => { keyboardFocus = event.target.matches(':focus-visible'); refresh(); });
  hero.addEventListener('focusout', () => { keyboardFocus = false; refresh(); });
  document.addEventListener('visibilitychange', refresh);
  reduced.addEventListener('change', () => { paused = reduced.matches; refresh(); });
  refresh();
});

const filters = document.querySelectorAll('[data-report-filter]');
filters.forEach((button) => button.addEventListener('click', () => {
  filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelectorAll('[data-report-category]').forEach((row) => {
    row.hidden = button.dataset.reportFilter !== 'all' && row.dataset.reportCategory !== button.dataset.reportFilter;
  });
  const count = Array.from(document.querySelectorAll('[data-report-category]')).filter((row) => !row.hidden).length;
  document.querySelector('[data-report-count]').textContent = document.documentElement.lang === 'en' ? `${count} documents` : `${count}개 자료`;
}));
