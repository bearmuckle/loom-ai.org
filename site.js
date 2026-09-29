const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
const lightShot = document.querySelector('.light-shot');
const screenshotLink = document.querySelector('.screenshot-link');
const imageDialog = document.querySelector('.image-dialog');
const dialogShot = document.querySelector('.dialog-shot');
let preferredTheme = root.dataset.theme || 'system';

function renderTheme() {
  const theme = preferredTheme === 'system'
    ? (systemTheme.matches ? 'light' : 'dark')
    : preferredTheme;
  root.dataset.theme = theme;
  // The source and fallback follow the same theme before and after interaction.
  lightShot.media = theme === 'light' ? 'all' : 'not all';
  const screenshot = `assets/loom-native-ui-${theme}.png`;
  screenshotLink.href = screenshot;
  document.querySelector('.preview-hint').href = screenshot;
  dialogShot.src = screenshot;
  const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;
  themeToggle.setAttribute('aria-label', label);
  themeToggle.title = label;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#1e1e2e' : '#eff1f5';
}

themeToggle.addEventListener('click', () => {
  preferredTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('loom-theme-v2', preferredTheme); } catch {}
  renderTheme();
});
systemTheme.addEventListener('change', () => {
  if (preferredTheme === 'system') renderTheme();
});
renderTheme();
themeToggle.hidden = false;

screenshotLink.addEventListener('click', (event) => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  if (typeof imageDialog.showModal !== 'function') return;
  event.preventDefault();
  imageDialog.showModal();
});
imageDialog.addEventListener('click', (event) => {
  if (event.target !== imageDialog) return;
  const bounds = imageDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) imageDialog.close();
});
imageDialog.addEventListener('close', () => screenshotLink.focus({ preventScroll: true }));
