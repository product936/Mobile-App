/**
 * Builds a single self-contained HTML page of the app for the clickable web
 * preview (published as a claude.ai artifact).
 *
 * Usage: npm run preview:web   →   dist/preview/connect-preview.html + connect-app.js
 *
 * The artifact viewer loads only its own published files and data: URIs, so
 * this takes the `expo export --platform web` output, embeds the five Hanken
 * Grotesk weights the app uses and the two logos into the JS bundle, and writes
 * a small page that loads it. Publish both files together. On larger screens the
 * app shows inside an iPhone 15 Pro Max mockup at true proportions (scaled
 * evenly to fit the window); on phones it fills the screen.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const webDir = join(root, 'dist', 'web');
const outDir = join(root, 'dist', 'preview');
const outFile = join(outDir, 'connect-preview.html');
const outJs = join(outDir, 'connect-app.js');

if (!existsSync(webDir)) {
  console.error('Missing dist/web. Run `npx expo export --platform web --output-dir dist/web` first.');
  process.exit(1);
}

const jsDir = join(webDir, '_expo', 'static', 'js', 'web');
const entry = readdirSync(jsDir).find((f) => f.startsWith('entry-') && f.endsWith('.js'));
let js = readFileSync(join(jsDir, entry), 'utf8');

// Embed only the assets the app uses; unused font weights stay unreferenced.
const used = [
  /\/assets\/node_modules\/@expo-google-fonts\/hanken-grotesk\/(400Regular|500Medium|600SemiBold|700Bold|800ExtraBold)\/[^"]+\.ttf/g,
  /\/assets\/assets\/images\/[^"]+\.(?:png|jpe?g)/g,
];
const mime = { ttf: 'font/ttf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
let embedded = 0;
for (const pattern of used) {
  for (const assetPath of new Set(js.match(pattern) ?? [])) {
    const ext = assetPath.split('.').pop();
    const data = readFileSync(join(webDir, assetPath)).toString('base64');
    js = js.split(`"${assetPath}"`).join(`"data:${mime[ext]};base64,${data}"`);
    embedded += 1;
  }
}

// The app's router reads the page path; start it at the app root whatever
// URL the preview is served from. This runs before the app, after the browser
// has already resolved this script's own (relative) address.
js = `try { if (location.pathname !== '/') history.replaceState(null, '', '/'); } catch (e) {}\n${js}`;

const statusIcons = `<svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="4.5" width="3" height="7.5" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden="true"><path d="M8.5 2.4c2.3 0 4.4.9 6 2.4l1.3-1.4A11 11 0 0 0 8.5.4 11 11 0 0 0 1.2 3.4L2.5 4.8a8.6 8.6 0 0 1 6-2.4Z"/><path d="M8.5 6.1c1.3 0 2.5.5 3.4 1.4l1.3-1.4A7 7 0 0 0 8.5 4a7 7 0 0 0-4.7 2.1l1.3 1.4a4.8 4.8 0 0 1 3.4-1.4Z"/><circle cx="8.5" cy="10" r="1.8"/></svg><svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden="true"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor"/><rect x="24" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.4"/></svg>`;

// iPhone 15 Pro Max, in points: 430 x 932 screen, 55pt display corners,
// 59pt top inset (status bar + Dynamic Island), 34pt bottom inset (home indicator).
const device = { w: 430, h: 932, radius: 55, insetTop: 59, insetBottom: 34, frame: 18 };

const html = `<title>Connect Store App</title>
<style>
  /* An iPhone 15 Pro Max at true proportions, scaled evenly to fit, on a quiet backdrop. Phones get the plain app. */
  :root {
    --backdrop: #E7EBF3;
    --backdrop-glow: #F5F7FB;
    --bezel: #0B0B0E;
    --titanium: #8C8882;
    --titanium-edge: #5F5C58;
    --island: #000000;
    --app-surface: #F9FAFD;
    --status-ink: #111827;
    --device-shadow: 0 50px 100px -30px rgba(14, 0, 113, 0.42), 0 14px 32px rgba(15, 23, 42, 0.22);
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { --backdrop: #0F121A; --backdrop-glow: #1A1F2B; --device-shadow: 0 50px 100px -30px rgba(0, 0, 0, 0.8); color-scheme: dark; }
  }
  :root[data-theme="dark"] { --backdrop: #0F121A; --backdrop-glow: #1A1F2B; --device-shadow: 0 50px 100px -30px rgba(0, 0, 0, 0.8); color-scheme: dark; }
  html { height: 100%; background: radial-gradient(1200px 800px at 50% 0%, var(--backdrop-glow), var(--backdrop) 60%); background-color: var(--backdrop); }
  body {
    height: 100%;
    margin: 0;
    overflow: hidden;
    background: var(--app-surface);
    color-scheme: light;
    /* Makes the app's full-screen sheets and dialogs fill the device screen, not the browser window. */
    transform: translateZ(0);
  }
  #root { display: flex; height: 100%; flex: 1; }
  .device-chrome { display: none; }

  html.framed { overflow: hidden; display: grid; place-items: center; }
  html.framed body {
    flex: none;
    width: ${device.w}px;
    height: ${device.h}px;
    border-radius: ${device.radius}px;
    transform: scale(var(--device-scale, 1));
    transform-origin: center center;
    box-shadow:
      0 0 0 ${device.frame - 4}px var(--bezel),
      0 0 0 ${device.frame - 1}px var(--titanium),
      0 0 0 ${device.frame}px var(--titanium-edge),
      var(--device-shadow);
  }
  html.framed .device-chrome { display: flex; position: fixed; z-index: 2147483647; pointer-events: none; }
  /* Status bar: time and icons sit in the two "ears" either side of the Dynamic Island. */
  .status-bar {
    top: 0; left: 0; right: 0; height: ${device.insetTop}px;
    align-items: center; justify-content: space-between;
    padding: 0 0 6px; box-sizing: border-box;
    color: var(--status-ink);
    font: 600 17px/1 -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
  }
  .status-bar .ear { width: 152px; display: flex; justify-content: center; align-items: center; gap: 6px; }
  .island { top: 11px; left: 50%; transform: translateX(-50%); width: 126px; height: 37px; border-radius: 9999px; background: var(--island); }
  .home-indicator { bottom: 8px; left: 50%; transform: translateX(-50%); width: 140px; height: 5px; border-radius: 9999px; background: var(--status-ink); opacity: 0.9; }
</style>
<script>
  // Large screens show the device; phones show the app full screen.
  (function () {
    if (window.innerWidth < 600) return;
    var root = document.documentElement;
    root.classList.add('framed');
    // The app reads these as the device's safe-area insets.
    window.__CONNECT_PREVIEW_INSETS__ = { top: ${device.insetTop}, bottom: ${device.insetBottom}, left: 0, right: 0 };
    function fit() {
      var outerW = ${device.w} + 2 * ${device.frame}, outerH = ${device.h} + 2 * ${device.frame};
      var s = Math.min(1, (window.innerWidth - 48) / outerW, (window.innerHeight - 48) / outerH);
      root.style.setProperty('--device-scale', String(Math.max(0.4, s)));
    }
    fit();
    window.addEventListener('resize', fit);
  })();
</script>
<div class="device-chrome status-bar" aria-hidden="true"><span class="ear">9:41</span><span class="ear">${statusIcons}</span></div>
<div class="device-chrome island" aria-hidden="true"></div>
<div class="device-chrome home-indicator" aria-hidden="true"></div>
<div id="root"></div>
<script src="connect-app.js"></script>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, html);
writeFileSync(outJs, js);
console.log(`Wrote ${outFile} and connect-app.js (${(js.length / 1024 / 1024).toFixed(2)} MB, ${embedded} assets embedded)`);
