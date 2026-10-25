const root = document.documentElement;
const themeButton = document.querySelector('.theme-button');
const lightShot = document.querySelector('.shot-light');
const fullSize = document.querySelector('.full-size');
const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
const themeColor = document.querySelector('meta[name="theme-color"]');

let preference = root.dataset.theme || 'system';

function renderTheme() {
  const theme = preference === 'system'
    ? (systemTheme.matches ? 'light' : 'dark')
    : preference;
  root.dataset.theme = theme;
  // Only one screenshot is fetched; the picture element picks it by theme.
  lightShot.media = theme === 'light' ? 'all' : 'not all';
  fullSize.href = `assets/loom-ui-${theme}.png`;
  const next = theme === 'dark' ? 'light' : 'dark';
  themeButton.textContent = next === 'light' ? 'Light' : 'Dark';
  themeButton.setAttribute('aria-label', `Switch to the ${next} theme`);
  themeButton.title = `Switch to the ${next} theme`;
  themeColor.content = theme === 'dark' ? '#17171a' : '#ffffff';
}

themeButton.addEventListener('click', () => {
  preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('loom-theme-v2', preference); } catch {}
  renderTheme();
});

systemTheme.addEventListener('change', () => {
  if (preference === 'system') renderTheme();
});

renderTheme();
themeButton.hidden = false;
