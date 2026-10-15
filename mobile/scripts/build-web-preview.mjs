/**
 * Builds a single self-contained HTML page of the app for the clickable web
 * preview (published as a claude.ai artifact).
 *
 * Usage: npm run preview:web   →   dist/preview/connect-preview.html + connect-app.js
 *
 * The artifact viewer loads only its own published files and data: URIs, so
 * this takes the `expo export --platform web` output, embeds the five Hanken
 * Grotesk weights the app uses and the two logos into the JS bundle, and writes
 * a small page that loads it. Publish both files together. On wide screens the
 * app sits in a phone-width column; on phones it fills the screen.
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

const html = `<title>Connect Store App</title>
<style>
  /* Phone-width app column centered on a quiet backdrop; full screen on phones. */
  :root {
    --backdrop: #E7EBF3;
    --frame-edge: #D5DBE7;
    --app-surface: #F9FAFD;
    --frame-shadow: 0 24px 60px -20px rgba(14, 0, 113, 0.28);
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { --backdrop: #11141C; --frame-edge: #262C3A; --frame-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.6); color-scheme: dark; }
  }
  :root[data-theme="dark"] { --backdrop: #11141C; --frame-edge: #262C3A; --frame-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.6); color-scheme: dark; }
  html { height: 100%; background: var(--backdrop); }
  body {
    height: 100%;
    max-width: 430px;
    margin: 0 auto;
    overflow: hidden;
    background: var(--app-surface);
    color-scheme: light;
    /* Makes the app's full-screen sheets and dialogs fill this column, not the browser window. */
    transform: translateZ(0);
  }
  @media (min-width: 480px) {
    body { border-left: 1px solid var(--frame-edge); border-right: 1px solid var(--frame-edge); box-shadow: var(--frame-shadow); }
  }
  #root { display: flex; height: 100%; flex: 1; }
</style>
<div id="root"></div>
<script src="connect-app.js"></script>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, html);
writeFileSync(outJs, js);
console.log(`Wrote ${outFile} and connect-app.js (${(js.length / 1024 / 1024).toFixed(2)} MB, ${embedded} assets embedded)`);
