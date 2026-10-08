/* @ds-bundle: {"format":4,"namespace":"SingleInterfaceDesignSystem_73ca5d","components":[],"sourceHashes":{"ds-data.js":"3d75e29112f8","ds-mobile-data.js":"f53a026cb2ab","ui_kits/singleinterface_app/icons.js":"31853f46a30e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SingleInterfaceDesignSystem_73ca5d = window.SingleInterfaceDesignSystem_73ca5d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ds-data.js
try { (() => {
/* ============================================================
 * SingleInterface Design System — portal data
 * Drives design-system.html: nav IA, live previews, code snippets.
 * Each entry: { id, group, name, desc, file?, usage?, react?, html?, css? }
 * `file` = a preview/*.html rendered live in an iframe.
 * ============================================================ */
window.DS_META = {
  name: "SingleInterface",
  tagline: "Design System",
  version: "v1.0"
};

/* Group order + labels for the sidebar */
window.DS_GROUPS = [{
  id: "start",
  label: "Get started"
}, {
  id: "Foundations",
  label: "Foundations"
}, {
  id: "Components",
  label: "Components"
}, {
  id: "Guidelines",
  label: "Guidelines"
}];
window.DS_ENTRIES = [/* ───────────────────────── GET STARTED ───────────────────────── */
{
  id: "overview",
  group: "start",
  name: "Overview",
  kind: "overview",
  desc: "The single source of truth for SingleInterface product UI — tokens, components, and the guidelines that govern how to use them."
}, {
  id: "install",
  group: "start",
  name: "Installation",
  kind: "doc",
  desc: "Link the stylesheet, then use the tokens. Brand foundations are shared across desktop and mobile.",
  html: `<!-- 1. Link the root stylesheet (imports tokens + fonts) -->
<link rel="stylesheet" href="styles.css">

<!-- 2. Mobile surfaces add the mobile overrides AFTER it -->
<link rel="stylesheet" href="mobile_tokens.css">

<!-- 3. Use tokens, never raw values -->
<button style="
  background: var(--si-primary-accent);
  color: #fff;
  border-radius: var(--si-radius-md);
  padding: 0 16px; height: 40px; font-weight: 600;
">Add Location</button>`,
  react: `// Tailwind consumers: tokens are bridged as semantic classes.
// Plain React: read CSS variables directly.
export function PrimaryButton({ children, ...props }) {
  return (
    <button
      className="si-btn si-btn--primary"
      style={{
        background: "var(--si-primary-accent)",
        color: "#fff",
        borderRadius: "var(--si-radius-md)",
        height: 40, padding: "0 16px", fontWeight: 600, border: "none",
      }}
      {...props}
    >
      {children}
    </button>
  );
}`
}, /* ───────────────────────── FOUNDATIONS ───────────────────────── */
{
  id: "colors",
  group: "Foundations",
  name: "Color",
  file: "preview/colors-brand.html",
  previewH: 360,
  desc: "A cool, technical palette anchored by deep indigo (#0E0071) and electric blue (#0070FC). Page background is a blue-tinted near-white, never pure white. Semantic colors are the standard four. The AI gradient is reserved for AI surfaces only.",
  more: [{
    name: "Neutrals",
    file: "preview/colors-neutrals.html",
    h: 320
  }, {
    name: "Semantic",
    file: "preview/colors-semantic.html",
    h: 300
  }, {
    name: "AI gradient",
    file: "preview/colors-ai-gradient.html",
    h: 300
  }],
  css: `:root {
  /* Brand */
  --si-primary-deep:   #0E0071;
  --si-primary-accent: #0070FC;
  --si-primary-hover:  #0A0054;

  /* AI gradient — AI surfaces ONLY */
  --si-ai-gradient: linear-gradient(90deg, #0E0071 0%, #0070FC 100%);

  /* Surfaces */
  --si-surface-base:     #F9FAFD;  /* page bg (blue-tinted) */
  --si-surface-elevated: #FFFFFF;  /* cards, sheets */
  --si-border-default:   #E5E7EB;
  --si-border-subtle:    #F3F4F6;

  /* Text */
  --si-text-primary:   #111827;
  --si-text-secondary: #374151;
  --si-text-tertiary:  #6B7280;

  /* Semantic — text/icon · -bg surface · -border */
  --si-success: #16A34A;  --si-success-bg: #F0FDF4;  --si-success-border: #86EFAC;
  --si-warning: #CA8A04;  --si-warning-bg: #FEFCE8;  --si-warning-border: #FDE047;
  --si-error:   #DC2626;  --si-error-bg:   #FEF2F2;  --si-error-border:   #FECACA;
  --si-info:    #1D4ED8;  --si-info-bg:    #EFF6FF;  --si-info-border:    #BFDBFE;

  /* Review stars — always amber */
  --si-star-amber:       #F59E0B;
  --si-star-amber-empty: #E5E7EB;
}`
}, {
  id: "typography",
  group: "Foundations",
  name: "Typography",
  file: "preview/type-scale.html",
  previewH: 420,
  desc: "100% Hanken Grotesk (variable, tabular-nums on by default). No serif, no display face. A fixed scale — never introduce an arbitrary size like 17px.",
  more: [{
    name: "Font stack",
    file: "preview/type-stack.html",
    h: 280
  }],
  css: `:root {
  --si-font-sans: "Hanken Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --si-font-display: 32px;  /* 700 */
  --si-font-h1: 28px;       /* 700 */
  --si-font-h2: 24px;       /* 700 */
  --si-font-h3: 20px;       /* 600 */
  --si-font-h4: 18px;       /* 600 */
  --si-font-h5: 16px;       /* 600 */
  --si-font-body: 15px;     /* 400 */
  --si-font-sm: 14px;       /* 400 */
  --si-font-caption: 12px;  /* 500 */
}
body {
  font-family: var(--si-font-sans);
  font-feature-settings: "tnum" 1;  /* tabular numerics */
  color: var(--si-text-primary);
}`
}, {
  id: "spacing",
  group: "Foundations",
  name: "Spacing & layout",
  file: "preview/spacing.html",
  previewH: 320,
  desc: "4px base unit, multiples only. 24px gutters on desktop, 16px on mobile. Content centered in a max-w 1320px container.",
  css: `/* 4px scale — use multiples only */
--si-space-1: 4px;   --si-space-2: 8px;   --si-space-3: 12px;
--si-space-4: 16px;  --si-space-5: 20px;  --si-space-6: 24px;
--si-space-8: 32px;  --si-space-10: 40px; --si-space-12: 48px;

/* Layout */
--si-gutter-desktop: 24px;
--si-container-max:  1320px;`
}, {
  id: "radius",
  group: "Foundations",
  name: "Radius",
  file: "preview/radii.html",
  previewH: 280,
  desc: "A six-step ladder. Most buttons and inputs use md (8px); standard cards use lg (12px); feature cards and modals use xl (16px); sheets use 2xl (20px); pills and avatars use full.",
  css: `--si-radius-sm:   4px;   /* small chips, tags */
--si-radius-md:   8px;   /* buttons, inputs */
--si-radius-lg:   12px;  /* cards */
--si-radius-xl:   16px;  /* feature cards, modals */
--si-radius-2xl:  20px;  /* bottom sheets */
--si-radius-full: 9999px;/* pills, avatars */`
}, {
  id: "elevation",
  group: "Foundations",
  name: "Elevation",
  file: "preview/shadows.html",
  previewH: 300,
  desc: "A neutral elevation ladder (sm→xl), plus the brand-distinctive --si-shadow-card whose tint leans blue (#0070FC) rather than neutral black. Use --si-shadow-card on standalone cards.",
  css: `/* Neutral ladder */
--si-shadow-sm: 0 1px 2px 0 rgba(0,0,0,.05);
--si-shadow-md: 0 4px 6px -1px rgba(0,0,0,.10), 0 2px 4px -1px rgba(0,0,0,.06);
--si-shadow-lg: 0 10px 15px -3px rgba(0,0,0,.10), 0 4px 6px -2px rgba(0,0,0,.05);
--si-shadow-xl: 0 20px 25px -5px rgba(0,0,0,.10), 0 10px 10px -5px rgba(0,0,0,.04);

/* Brand-distinctive: card shadow leans blue, not neutral */
--si-shadow-card: 0 2px 8px rgba(0,112,252,.08);`
}, {
  id: "iconography",
  group: "Foundations",
  name: "Iconography",
  file: "preview/iconography.html",
  previewH: 320,
  desc: "Lucide (stroke style), flat only — no 3D, skeuomorphic, or glossy icons, no drop shadows. Stars are always amber. Category icons sit in a tinted rounded square.",
  react: `import { Star, MapPin, MessageSquare } from "lucide-react";

// Sizes: body 16 · button/row 18–20 · hero 24
<Star size={18} color="var(--si-star-amber)" fill="var(--si-star-amber)" />

// Category icon in a tinted square
<span className="si-icon-square"
  style={{ width:36, height:36, borderRadius:"var(--si-radius-lg)",
           display:"grid", placeItems:"center",
           background:"#EFF6FF", color:"var(--si-info)" }}>
  <MapPin size={20} />
</span>`,
  html: `<!-- Lucide static SVG (stroke), 2px, currentColor -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="2" stroke-linecap="round"
     stroke-linejoin="round" aria-hidden="true">
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
</svg>`
}, {
  id: "logo",
  group: "Foundations",
  name: "Logo",
  file: "preview/logo.html",
  previewH: 300,
  desc: "The SI mark (gradient dot grid) and wordmark. The mark uses the AI gradient; never recolor or stretch it. Clear space ≥ the height of one dot."
}, {
  id: "breakpoints",
  group: "Foundations",
  name: "Breakpoints & grid",
  file: "preview/breakpoints-grid.html",
  previewH: 360,
  desc: "Five breakpoints and a 12-column, 24px-gutter content grid (max 1320px, centered). Below lg the sidebar collapses to a drawer and multi-column layouts stack. Every screen works down to 320px with no two-axis scroll.",
  css: `/* Breakpoints (min-width) */
--si-bp-sm:  640px;   /* phone landscape */
--si-bp-md:  768px;   /* tablet */
--si-bp-lg:  1024px;  /* laptop — sidebar appears */
--si-bp-xl:  1280px;  /* desktop — full console */
--si-bp-2xl: 1536px;  /* wide */

/* Content grid */
--si-container-max: 1320px;
--si-grid-cols: 12;
--si-gutter-desktop: 24px;`,
  react: `// Tailwind: sm:/md:/lg:/xl:/2xl: map to the tokens above.
// Plain CSS — a responsive 12-col grid that stacks under lg:
.grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(12, 1fr);
  max-width: 1320px;
  margin-inline: auto;
}
.main  { grid-column: span 8; }
.aside { grid-column: span 4; }
@media (max-width: 1024px) {
  .grid { grid-template-columns: 1fr; }
  .main, .aside { grid-column: auto; }
}`
}, /* ───────────────────────── COMPONENTS ───────────────────────── */
{
  id: "buttons",
  group: "Components",
  name: "Buttons",
  file: "preview/buttons.html",
  previewH: 300,
  desc: "One primary action per view. Primary is solid accent; secondary is white + border; ghost is text-only. Destructive uses the error color. Label text is 600 weight for contrast.",
  usage: {
    do: ["Use verb + noun labels (\"Add Location\")", "Exactly one primary per view", "Keep the 600 weight for AA contrast on blue"],
    dont: ["Put the AI gradient on a generic CTA", "Use two filled-blue buttons together", "Write \"OK\" / \"Submit\" / \"Click here\""]
  },
  react: `function Button({ variant = "primary", children, ...props }) {
  const base = {
    height: 40, padding: "0 16px", border: "none", cursor: "pointer",
    borderRadius: "var(--si-radius-md)", fontWeight: 600, fontSize: 14,
    fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 8,
  };
  const variants = {
    primary:   { background: "var(--si-primary-accent)", color: "#fff" },
    secondary: { background: "#fff", color: "var(--si-primary-accent)",
                 border: "1px solid var(--si-border-default)" },
    ghost:     { background: "transparent", color: "var(--si-text-secondary)" },
    danger:    { background: "var(--si-error)", color: "#fff" },
  };
  return <button style={{ ...base, ...variants[variant] }} {...props}>{children}</button>;
}`,
  html: `<button class="si-btn si-btn--primary">Add Location</button>
<button class="si-btn si-btn--secondary">Cancel</button>
<button class="si-btn si-btn--ghost">View archive</button>
<button class="si-btn si-btn--danger">Delete</button>

<style>
.si-btn { height:40px; padding:0 16px; border:none; cursor:pointer;
  border-radius:var(--si-radius-md); font:600 14px var(--si-font-sans);
  display:inline-flex; align-items:center; gap:8px; }
.si-btn--primary   { background:var(--si-primary-accent); color:#fff; }
.si-btn--primary:hover { background:var(--si-primary-hover); }
.si-btn--secondary { background:#fff; color:var(--si-primary-accent);
  border:1px solid var(--si-border-default); }
.si-btn--ghost  { background:transparent; color:var(--si-text-secondary); }
.si-btn--danger { background:var(--si-error); color:#fff; }
</style>`
}, {
  id: "inputs",
  group: "Components",
  name: "Inputs & forms",
  file: "preview/form-inputs.html",
  previewH: 380,
  desc: "Every input has a persistent visible label (never placeholder-only). Accent focus ring, helper text via aria-describedby, error text that says the fix.",
  usage: {
    do: ["Keep labels visible above the field", "Use placeholders for format, not instructions", "Errors state what's wrong AND the fix"],
    dont: ["Use the placeholder as the label", "Validate format on every keystroke", "Show a red border with no message"]
  },
  react: `function Field({ label, hint, error, id, ...props }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 14, fontWeight: 600,
        color: "var(--si-text-primary)" }}>{label}</label>
      <input id={id} aria-invalid={!!error}
        aria-describedby={error ? id + "-err" : id + "-hint"}
        style={{ height: 44, padding: "0 12px", fontSize: 14,
          borderRadius: "var(--si-radius-md)",
          border: "1px solid " + (error ? "var(--si-error)" : "var(--si-border-default)"),
          outline: "none" }} {...props} />
      {error
        ? <p id={id+"-err"} style={{ fontSize: 13, color: "var(--si-error)" }}>{error}</p>
        : hint && <p id={id+"-hint"} style={{ fontSize: 13, color: "var(--si-text-tertiary)" }}>{hint}</p>}
    </div>
  );
}`,
  html: `<div class="si-field">
  <label for="gst">GST number</label>
  <input id="gst" type="text" placeholder="e.g. 22AAAAA0000A1Z5"
         aria-describedby="gst-hint" />
  <p id="gst-hint" class="si-hint">We'll use this to match your Google listing.</p>
</div>

<style>
.si-field { display:grid; gap:6px; }
.si-field label { font:600 14px var(--si-font-sans); color:var(--si-text-primary); }
.si-field input { height:44px; padding:0 12px; font-size:14px;
  border:1px solid var(--si-border-default); border-radius:var(--si-radius-md); outline:none; }
.si-field input:focus { border-color:var(--si-primary-accent);
  box-shadow:0 0 0 3px rgba(0,112,252,.15); }
.si-hint { font-size:13px; color:var(--si-text-tertiary); }
</style>`
}, {
  id: "select",
  group: "Components",
  name: "Select & dropdown",
  file: "preview/select-dropdown.html",
  previewH: 360,
  desc: "A native <select> for simple lists; a custom listbox for searchable / richer options; and a multi-select that summarizes the count and shows removable tags. Triggers are 44px, labeled, with aria-expanded and arrow-key navigation.",
  usage: {
    do: ["Use native <select> for short, simple lists", "Multi-select shows count + removable tags", "Arrow keys navigate; Esc closes; type to jump"],
    dont: ["Build a custom control where native works", "Hide the current selection", "Open on hover"]
  },
  react: `function Select({ label, options, value, onChange, placeholder = 'Select…' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(o => !o)}
        style={{ width: '100%', height: 44, display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 12px', borderRadius: 'var(--si-radius-input,10px)', background: '#fff', cursor: 'pointer',
          border: '1px solid ' + (open ? 'var(--si-primary-accent)' : 'var(--si-border-default)'),
          fontFamily: 'inherit', fontSize: 14 }}>
        <span style={{ flex: 1, textAlign: 'left', color: value ? 'var(--si-text-primary)' : 'var(--si-text-tertiary)' }}>
          {value || placeholder}
        </span>
        <Chevron style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <ul role="listbox" style={{ position: 'absolute', top: 'calc(100% + 6px)', insetInline: 0, zIndex: 20,
          background: '#fff', border: '1px solid var(--si-border-default)', borderRadius: 12,
          boxShadow: 'var(--si-shadow-xl)', padding: 6, listStyle: 'none', margin: 0 }}>
          {options.map(opt => (
            <li key={opt} role="option" aria-selected={opt === value}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{ height: 40, display: 'flex', alignItems: 'center', padding: '0 12px',
                borderRadius: 8, cursor: 'pointer', fontSize: 14,
                background: opt === value ? '#EAF1FE' : 'transparent',
                color: opt === value ? 'var(--si-info)' : 'var(--si-text-secondary)' }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
  html: `<!-- Native select (preferred for short lists) -->
<label class="si-field">
  <span>Date range</span>
  <select class="si-select">
    <option>Today</option><option>This week</option>
    <option selected>This month</option><option>This quarter</option>
  </select>
</label>

<style>
.si-select { width:100%; height:44px; padding:0 12px; font-size:14px; font-family:var(--si-font-sans);
  color:var(--si-text-primary); background:#fff; border:1px solid var(--si-border-default);
  border-radius:var(--si-radius-input,10px); appearance:none; }
.si-select:focus { border-color:var(--si-primary-accent); box-shadow:0 0 0 3px rgba(0,112,252,.15); outline:none; }
</style>`
}, {
  id: "slider",
  group: "Components",
  name: "Slider",
  file: "preview/slider.html",
  previewH: 300,
  desc: "Single-value and dual-thumb range sliders with an accent fill and a value read-out. Each thumb is a focusable role=\"slider\" with aria-valuemin/max/now and arrow-key support; the track click jumps to a value.",
  usage: {
    do: ["role=\"slider\" + aria-valuemin/max/now per thumb", "Arrow keys step; show the current value", "≥44px hit-area on the thumb"],
    dont: ["Use a slider for precise numeric entry (use an input)", "Hide the selected value"]
  },
  react: `function Slider({ min = 0, max = 100, step = 1, value, onChange, label }) {
  const ref = React.useRef(null);
  const pct = ((value - min) / (max - min)) * 100;
  const setFromX = clientX => {
    const r = ref.current.getBoundingClientRect();
    const raw = min + (max - min) * Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    onChange(Math.round(raw / step) * step);
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 14, color: 'var(--si-text-secondary)' }}>{label}</span>
        <strong style={{ color: 'var(--si-primary-accent)', fontVariantNumeric: 'tabular-nums' }}>{value}</strong>
      </div>
      <div ref={ref} onPointerDown={e => setFromX(e.clientX)}
        style={{ position: 'relative', height: 24 }}>
        <div style={{ position: 'absolute', top: '50%', insetInline: 0, height: 6, transform: 'translateY(-50%)',
          background: '#EEF1F6', borderRadius: 999 }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, width: pct + '%', height: 6,
          transform: 'translateY(-50%)', background: 'var(--si-primary-accent)', borderRadius: 999 }} />
        <div role="slider" tabIndex={0} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-label={label}
          onKeyDown={e => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(Math.min(max, value + step));
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(Math.max(min, value - step));
          }}
          style={{ position: 'absolute', top: '50%', left: pct + '%', width: 20, height: 20,
            transform: 'translate(-50%,-50%)', borderRadius: '50%', background: '#fff',
            border: '2px solid var(--si-primary-accent)', boxShadow: '0 1px 4px rgba(0,112,252,.4)', cursor: 'grab' }} />
      </div>
    </div>
  );
}`
}, {
  id: "selection",
  group: "Components",
  name: "Selection controls",
  file: "preview/selection-controls.html",
  previewH: 320,
  desc: "Switch, checkbox, and radio. Use a switch for an immediate on/off setting, a checkbox for multi-select, a radio for one-of-many. Accent on-state plus a shape change — never color alone. Each carries the right role and 2px focus ring.",
  usage: {
    do: ["Switch = instant setting; checkbox = multi; radio = one-of-many", "role=\"switch\"/checkbox/radio + aria-checked", "Label is clickable and ≥ the control's hit-area"],
    dont: ["Use a checkbox where a switch is expected", "Rely on the accent color alone for state", "Omit a group label/legend for radios"]
  },
  react: `function Switch({ checked, onChange, label }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 11, border: 'none', background: 'none', cursor: 'pointer', font: 'inherit' }}>
      <span style={{ width: 42, height: 24, borderRadius: 999, position: 'relative', flex: 'none',
        background: checked ? 'var(--si-primary-accent)' : '#D1D5DB', transition: 'background .2s' }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 20 : 2, width: 20, height: 20, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.25)', transition: 'left .2s' }} />
      </span>
      <span>{label}</span>
    </button>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 11, cursor: 'pointer' }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ width: 20, height: 20, accentColor: 'var(--si-primary-accent)' }} />
      {label}
    </label>
  );
}
// Radios: wrap in <fieldset><legend>…</legend> with name-grouped <input type="radio">.`,
  html: `<label class="si-switch">
  <input type="checkbox" role="switch">
  <span class="si-switch__track"></span>
  Auto-publish AI replies
</label>

<style>
.si-switch { display:inline-flex; align-items:center; gap:11px; cursor:pointer; font-size:14px; }
.si-switch input { position:absolute; opacity:0; }
.si-switch__track { width:42px; height:24px; border-radius:999px; background:#D1D5DB; position:relative; transition:background .2s; }
.si-switch__track::after { content:""; position:absolute; top:2px; left:2px; width:20px; height:20px; border-radius:50%;
  background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.25); transition:left .2s; }
.si-switch input:checked + .si-switch__track { background:var(--si-primary-accent); }
.si-switch input:checked + .si-switch__track::after { left:20px; }
.si-switch input:focus-visible + .si-switch__track { outline:2px solid var(--si-primary-accent); outline-offset:2px; }
</style>`
}, {
  id: "badges",
  group: "Components",
  name: "Tags & badges",
  file: "preview/badges.html",
  previewH: 260,
  desc: "Status badges carry a dot/icon + word + color (never color alone). Use the semantic 50/700 families. Filter chips toggle between solid-accent (active) and white + border (idle).",
  react: `function Badge({ tone = "info", children }) {
  const tones = {
    success: { bg: "var(--si-success-bg)", fg: "var(--si-success)" },
    warning: { bg: "var(--si-warning-bg)", fg: "var(--si-warning)" },
    error:   { bg: "var(--si-error-bg)",   fg: "var(--si-error)" },
    info:    { bg: "var(--si-info-bg)",    fg: "var(--si-info)" },
  }[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: "var(--si-radius-full)",
      fontSize: 12, fontWeight: 600, background: tones.bg, color: tones.fg }}>
      <span style={{ width: 6, height: 6, borderRadius: 9999, background: "currentColor" }} />
      {children}
    </span>
  );
}`,
  html: `<span class="si-badge si-badge--success"><i></i>Verified</span>
<span class="si-badge si-badge--warning"><i></i>Pending</span>
<span class="si-badge si-badge--error"><i></i>Unclaimed</span>

<style>
.si-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px;
  border-radius:var(--si-radius-full); font:600 12px var(--si-font-sans); }
.si-badge i { width:6px; height:6px; border-radius:9999px; background:currentColor; }
.si-badge--success { background:var(--si-success-bg); color:var(--si-success); }
.si-badge--warning { background:var(--si-warning-bg); color:var(--si-warning); }
.si-badge--error   { background:var(--si-error-bg);   color:var(--si-error); }
</style>`
}, {
  id: "cards",
  group: "Components",
  name: "Cards",
  file: "preview/cards.html",
  previewH: 360,
  desc: "The base container for grouped content: 14px radius, white, the blue-tinted card shadow. Variants — basic, stat (with icon + KPI), media (image header), and interactive (hover-lift, focusable). Use one card per logical unit; don't nest cards.",
  usage: {
    do: ["Use --si-shadow-card for the blue-tinted lift", "Interactive cards get hover + focus + a clear affordance", "One card per logical unit"],
    dont: ["Nest cards inside cards", "Put more than one primary action in a card"]
  },
  react: `function Card({ interactive, children, ...props }) {
  return (
    <div tabIndex={interactive ? 0 : undefined} role={interactive ? 'button' : undefined}
      style={{ background: '#fff', border: '1px solid var(--si-border-default)',
        borderRadius: 'var(--si-radius-lg)', boxShadow: 'var(--si-shadow-card)',
        padding: 18, cursor: interactive ? 'pointer' : 'default',
        transition: 'box-shadow .16s, transform .16s, border-color .16s' }}
      onMouseEnter={interactive ? e => { e.currentTarget.style.boxShadow = '0 8px 22px rgba(0,112,252,.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; } : undefined}
      onMouseLeave={interactive ? e => { e.currentTarget.style.boxShadow = 'var(--si-shadow-card)'; e.currentTarget.style.transform = 'none'; } : undefined}
      {...props}>
      {children}
    </div>
  );
}`,
  html: `<article class="si-card">
  <h3>Mall of Emirates</h3>
  <p>Verified listing · last synced 2 hours ago.</p>
</article>

<style>
.si-card { background:#fff; border:1px solid var(--si-border-default);
  border-radius:var(--si-radius-lg); box-shadow:var(--si-shadow-card); padding:18px; }
.si-card h3 { margin:0 0 5px; font-size:16px; font-weight:600; }
.si-card p { margin:0; font-size:13.5px; color:var(--si-text-tertiary); }
.si-card--interactive { cursor:pointer; transition:box-shadow .16s, transform .16s, border-color .16s; }
.si-card--interactive:hover { box-shadow:0 8px 22px rgba(0,112,252,.14); border-color:#C7DBFF; transform:translateY(-2px); }
</style>`
}, {
  id: "accordion",
  group: "Components",
  name: "Accordion",
  file: "preview/accordion.html",
  previewH: 360,
  desc: "Collapsible sections for FAQs, grouped filters, and dense detail. Single-open (one at a time) or multi-open. Each header is a button with aria-expanded; the panel animates via grid-template-rows and the caret rotates.",
  usage: {
    do: ["Header is a <button> with aria-expanded + aria-controls", "Single-open for FAQ; multi-open for filters", "Animate height via grid-template-rows 0fr→1fr"],
    dont: ["Hide critical content behind a collapsed section by default", "Use an accordion where tabs fit better"]
  },
  react: `function Accordion({ items, single = true }) {
  const [open, setOpen] = React.useState(single ? [0] : []);
  const toggle = i => setOpen(prev =>
    single ? (prev.includes(i) ? [] : [i])
           : (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]));
  return items.map((it, i) => {
    const isOpen = open.includes(i);
    return (
      <div key={i} style={{ borderBottom: '1px solid var(--si-border-subtle)' }}>
        <button aria-expanded={isOpen} onClick={() => toggle(i)}
          style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'center', padding: '15px 16px',
            border: 'none', background: 'none', cursor: 'pointer', font: '600 15px inherit', textAlign: 'left' }}>
          <span style={{ flex: 1 }}>{it.q}</span>
          <Chevron style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform .22s' }} />
        </button>
        <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows .26s' }}>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ margin: 0, padding: '0 16px 16px', color: 'var(--si-text-tertiary)' }}>{it.a}</p>
          </div>
        </div>
      </div>
    );
  });
}`,
  html: `<div class="si-acc">
  <div class="si-acc__item is-open">
    <button class="si-acc__trigger" aria-expanded="true">
      <span>What is a Presence Score?</span><svg class="si-acc__caret"><!-- chevron --></svg>
    </button>
    <div class="si-acc__wrap"><div class="si-acc__panel"><p>A 0–100 rollup of listing accuracy, review health, and completeness.</p></div></div>
  </div>
</div>

<style>
.si-acc__wrap { display:grid; grid-template-rows:0fr; transition:grid-template-rows .26s; }
.si-acc__item.is-open .si-acc__wrap { grid-template-rows:1fr; }
.si-acc__panel { overflow:hidden; }
.si-acc__item.is-open .si-acc__caret { transform:rotate(90deg); }
</style>
<script>
document.querySelectorAll('.si-acc__trigger').forEach(t => t.addEventListener('click', () => {
  const item = t.closest('.si-acc__item'), open = item.classList.contains('is-open');
  item.classList.toggle('is-open', !open); t.setAttribute('aria-expanded', String(!open));
}));
</script>`
}, {
  id: "kpi",
  group: "Components",
  name: "KPI cards",
  file: "preview/kpi-cards.html",
  previewH: 300,
  desc: "Big tabular number + label + trend chip. Trend is arrow + sign + percent, green-up / red-down (but semantic-aware). Always pair a number with its comparison context.",
  react: `function KpiTile({ label, value, deltaPct }) {
  const up = deltaPct >= 0;
  return (
    <div style={{ background: "#fff", border: "1px solid var(--si-border-default)",
      borderRadius: "var(--si-radius-lg)", padding: 18, boxShadow: "var(--si-shadow-card)" }}>
      <div style={{ fontSize: 13, color: "var(--si-text-tertiary)" }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, fontVariantNumeric: "tabular-nums",
        margin: "6px 0", color: "var(--si-text-primary)" }}>{value}</div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13,
        fontWeight: 600, color: up ? "var(--si-success)" : "var(--si-error)" }}>
        {up ? "▲" : "▼"} {Math.abs(deltaPct)}% vs last month
      </span>
    </div>
  );
}`,
  html: `<div class="si-kpi">
  <div class="si-kpi__label">Profile Views</div>
  <div class="si-kpi__value">12,450</div>
  <span class="si-kpi__trend si-kpi__trend--up">▲ 22% vs last month</span>
</div>

<style>
.si-kpi { background:#fff; border:1px solid var(--si-border-default);
  border-radius:var(--si-radius-lg); padding:18px; box-shadow:var(--si-shadow-card); }
.si-kpi__label { font-size:13px; color:var(--si-text-tertiary); }
.si-kpi__value { font:700 30px var(--si-font-sans); font-variant-numeric:tabular-nums; margin:6px 0; }
.si-kpi__trend { display:inline-flex; align-items:center; gap:4px; font:600 13px var(--si-font-sans); }
.si-kpi__trend--up   { color:var(--si-success); }
.si-kpi__trend--down { color:var(--si-error); }
</style>`
}, {
  id: "segmented",
  group: "Components",
  name: "Segmented control",
  file: "preview/segmented-control.html",
  previewH: 300,
  desc: "A compact toggle button group for switching a view between ≤4 mutually-exclusive options (Today / Week / Month, Grid / List / Map). A sliding thumb marks the active segment. Use for view state, not page navigation (use Tabs) and not multi-select (use chips).",
  usage: {
    do: ["Use for one-of-N view state (≤4 short options)", "role=\"tablist\"; arrow keys move + select", "Slide the thumb under the active segment"],
    dont: ["Use for page navigation (that's Tabs)", "Exceed ~4 options or use long labels", "Allow multi-select (use chips)"]
  },
  react: `function Segmented({ options, value, onChange, label }) {
  const ref = React.useRef(null);
  const [thumb, setThumb] = React.useState({ left: 0, width: 0 });
  React.useLayoutEffect(() => {
    const el = ref.current?.querySelector('[aria-selected="true"]');
    if (el) setThumb({ left: el.offsetLeft, width: el.offsetWidth });
  }, [value]);
  return (
    <div ref={ref} role="tablist" aria-label={label}
      style={{ position: 'relative', display: 'inline-flex', background: '#EFF1F6',
        borderRadius: 10, padding: 3 }}>
      <span aria-hidden="true" style={{ position: 'absolute', top: 3, bottom: 3,
        left: thumb.left, width: thumb.width, background: '#fff', borderRadius: 8,
        boxShadow: '0 1px 3px rgba(15,23,42,.12)', transition: 'left .22s, width .22s' }} />
      {options.map((opt, i) => {
        const on = opt === value;
        return (
          <button key={opt} role="tab" aria-selected={on} onClick={() => onChange(opt)}
            onKeyDown={e => {
              if (e.key === 'ArrowRight') onChange(options[(i + 1) % options.length]);
              if (e.key === 'ArrowLeft') onChange(options[(i - 1 + options.length) % options.length]);
            }}
            style={{ position: 'relative', zIndex: 1, border: 'none', background: 'none', cursor: 'pointer',
              padding: '8px 18px', borderRadius: 8, fontFamily: 'inherit', fontWeight: 600, fontSize: 14,
              color: on ? 'var(--si-primary-accent)' : 'var(--si-text-tertiary)' }}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}`
}, {
  id: "combobox",
  group: "Components",
  name: "Combobox / autocomplete",
  file: "preview/combobox.html",
  previewH: 380,
  desc: "A text input with a filtered, keyboard-navigable result list — type-ahead for large sets (jump to one of 64 locations) where a plain select would be unwieldy. The matched substring is highlighted; ↑/↓ navigate, Enter selects, Esc closes.",
  usage: {
    do: ["Use for large/searchable sets (not a short fixed list)", "role=\"combobox\" + aria-autocomplete + aria-expanded", "Highlight the match; full keyboard nav; empty-state text"],
    dont: ["Use where a plain <select> suffices", "Filter on the server without a loading state", "Trap focus or swallow Esc"]
  },
  react: `function Combobox({ items, onSelect, placeholder }) {
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const results = items.filter(i => i.label.toLowerCase().includes(q.toLowerCase()));
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);
  const hl = label => {
    const i = label.toLowerCase().indexOf(q.toLowerCase());
    if (!q || i < 0) return label;
    return <>{label.slice(0, i)}<b>{label.slice(i, i + q.length)}</b>{label.slice(i + q.length)}</>;
  };
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input role="combobox" aria-expanded={open} aria-autocomplete="list" autoComplete="off"
        value={q} placeholder={placeholder}
        onFocus={() => setOpen(true)} onChange={e => { setQ(e.target.value); setOpen(true); setActive(-1); }}
        onKeyDown={e => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
          else if (e.key === 'Enter' && active >= 0) { onSelect(results[active]); setQ(results[active].label); setOpen(false); }
          else if (e.key === 'Escape') setOpen(false);
        }}
        style={{ width: '100%', height: 44, padding: '0 12px', fontSize: 15, borderRadius: 10,
          border: '1px solid var(--si-border-default)' }} />
      {open && (
        <ul role="listbox" style={{ position: 'absolute', insetInline: 0, top: 'calc(100% + 6px)', zIndex: 20,
          background: '#fff', border: '1px solid var(--si-border-default)', borderRadius: 12,
          boxShadow: 'var(--si-shadow-xl)', padding: 6, maxHeight: 240, overflow: 'auto', listStyle: 'none', margin: 0 }}>
          {results.length === 0 && <li style={{ padding: 12, color: 'var(--si-text-tertiary)', textAlign: 'center' }}>No matches for "{q}"</li>}
          {results.map((r, i) => (
            <li key={r.label} role="option" aria-selected={i === active}
              onMouseMove={() => setActive(i)} onClick={() => { onSelect(r); setQ(r.label); setOpen(false); }}
              style={{ padding: '9px 11px', borderRadius: 8, cursor: 'pointer', fontSize: 14,
                background: i === active ? '#F3F4F6' : 'transparent' }}>
              {hl(r.label)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`
}, {
  id: "tabs",
  group: "Components",
  name: "Tabs",
  file: "preview/tabs.html",
  previewH: 280,
  desc: "Underline tabs for page-level sections; the tablist is one tab stop with arrow-key nav (APG). Active = accent text + 2px indicator bar, not color alone.",
  react: `function Tabs({ tabs, value, onChange }) {
  return (
    <div role="tablist" style={{ display: "flex", gap: 24,
      borderBottom: "1px solid var(--si-border-default)" }}>
      {tabs.map(t => {
        const active = t === value;
        return (
          <button key={t} role="tab" aria-selected={active}
            onClick={() => onChange(t)}
            style={{ padding: "10px 0", border: "none", background: "none", cursor: "pointer",
              fontSize: 14, fontWeight: active ? 600 : 500, fontFamily: "inherit",
              color: active ? "var(--si-primary-accent)" : "var(--si-text-tertiary)",
              boxShadow: active ? "inset 0 -2px 0 var(--si-primary-accent)" : "none" }}>
            {t}
          </button>
        );
      })}
    </div>
  );
}`,
  html: `<div class="si-tabs" role="tablist">
  <button role="tab" aria-selected="true"  class="si-tab is-active">Overview</button>
  <button role="tab" aria-selected="false" class="si-tab">Reviews</button>
  <button role="tab" aria-selected="false" class="si-tab">Insights</button>
</div>

<style>
.si-tabs { display:flex; gap:24px; border-bottom:1px solid var(--si-border-default); }
.si-tab { padding:10px 0; border:none; background:none; cursor:pointer;
  font:500 14px var(--si-font-sans); color:var(--si-text-tertiary); }
.si-tab.is-active { font-weight:600; color:var(--si-primary-accent);
  box-shadow:inset 0 -2px 0 var(--si-primary-accent); }
</style>`
}, {
  id: "alerts",
  group: "Components",
  name: "Alerts & banners",
  file: "preview/alerts.html",
  previewH: 320,
  desc: "Inline contextual messages using the semantic families. Icon + text + color, with a 4px leading accent border. Info / success / warning / error.",
  react: `function Alert({ tone = "info", title, children }) {
  const c = {
    success: { bg:"var(--si-success-bg)", bd:"var(--si-success)" },
    warning: { bg:"var(--si-warning-bg)", bd:"var(--si-warning)" },
    error:   { bg:"var(--si-error-bg)",   bd:"var(--si-error)" },
    info:    { bg:"var(--si-info-bg)",    bd:"var(--si-info)" },
  }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"}
      style={{ display:"flex", gap:10, padding:"12px 14px", background:c.bg,
        borderRadius:"var(--si-radius-md)", borderLeft:"4px solid " + c.bd, color:c.bd }}>
      <div style={{ color:"var(--si-text-secondary)" }}>
        <strong style={{ color:"var(--si-text-primary)" }}>{title}</strong>
        <div>{children}</div>
      </div>
    </div>
  );
}`,
  html: `<div class="si-alert si-alert--info" role="status">
  <strong>NAP consistency check is running</strong>
  <p>Results will be ready in ~2 minutes.</p>
</div>

<style>
.si-alert { padding:12px 14px; border-radius:var(--si-radius-md); border-left:4px solid; }
.si-alert p { margin:2px 0 0; color:var(--si-text-secondary); font-size:13px; }
.si-alert--info    { background:var(--si-info-bg);    border-color:var(--si-info); }
.si-alert--success { background:var(--si-success-bg); border-color:var(--si-success); }
.si-alert--warning { background:var(--si-warning-bg); border-color:var(--si-warning); }
.si-alert--error   { background:var(--si-error-bg);   border-color:var(--si-error); }
</style>`
}, {
  id: "left-nav",
  group: "Components",
  name: "Left navigation",
  file: "preview/left-navigation.html",
  previewH: 700,
  desc: "The app sidebar — accordion groups (single-open), active states, and a user menu. Group headers are buttons with aria-expanded; sub-items are a list with roving arrow-key focus.",
  usage: {
    do: ["Mark the current leaf with aria-current=\"page\"", "Keep collapsed children out of the tab order", "Single-open accordion to reduce scanning"],
    dont: ["Rely on color alone for the active item", "Nest more than two levels deep"]
  },
  html: `<nav class="si-nav" aria-label="Primary">
  <button class="si-nav__group" aria-expanded="true">
    <svg><!-- icon --></svg>
    <span>Reviews AI</span>
    <svg class="si-nav__caret"><!-- chevron --></svg>
  </button>
  <ul class="si-nav__sub">
    <li><a href="#" aria-current="page">Inbox</a></li>
    <li><a href="#">Deep Dive</a></li>
  </ul>
</nav>

<script>
// single-open accordion
document.querySelectorAll('.si-nav__group').forEach(btn => {
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.si-nav__group')
      .forEach(b => b.setAttribute('aria-expanded', 'false'));
    btn.setAttribute('aria-expanded', String(!open));
  });
});
</script>`,
  react: `function NavGroup({ icon, label, current, children }) {
  const [open, setOpen] = React.useState(current);
  return (
    <div className="si-nav__g">
      <button aria-expanded={open} onClick={() => setOpen(o => !o)}
        className="si-nav__group">
        {icon}<span>{label}</span><Chevron />
      </button>
      {open && <ul className="si-nav__sub">{children}</ul>}
    </div>
  );
}
// <NavItem aria-current="page">Inbox</NavItem>`
}, {
  id: "header",
  group: "Components",
  name: "Top header",
  file: "preview/header.html",
  previewH: 340,
  desc: "The app bar — brand, location switcher, AI Mode toggle, credits, locale, and help. The AI Mode switch is role=\"switch\" with the gradient on its on-state. Dropdowns are labeled menu buttons with aria-expanded.",
  usage: {
    do: ["Use role=\"switch\" + aria-checked for AI Mode", "Give every icon button an aria-label", "Close menus on Esc and outside-click"],
    dont: ["Use the gradient anywhere but the AI Mode on-state", "Show a bare number for credits with no accessible label"]
  },
  html: `<header class="si-header">
  <button class="si-aimode" role="switch" aria-checked="false">
    <span>AI Mode</span><span class="si-switch"></span>
  </button>
</header>

<style>
.si-aimode { display:flex; align-items:center; gap:10px; height:42px; padding:0 14px;
  border:1px solid var(--si-border-default); border-radius:var(--si-radius-md); background:none; }
.si-aimode[aria-checked="true"] { border-color:transparent; background:var(--si-ai-gradient); color:#fff; }
.si-switch { width:40px; height:22px; border-radius:9999px; background:#D1D5DB; position:relative; }
.si-aimode[aria-checked="true"] .si-switch { background:rgba(255,255,255,.45); }
.si-switch::after { content:""; position:absolute; top:2px; left:2px; width:18px; height:18px;
  border-radius:9999px; background:#fff; transition:transform .22s; }
.si-aimode[aria-checked="true"] .si-switch::after { transform:translateX(18px); }
</style>`,
  react: `function AiModeToggle() {
  const [on, setOn] = React.useState(false);
  return (
    <button role="switch" aria-checked={on} onClick={() => setOn(v => !v)}
      className="si-aimode" data-on={on}>
      <span>AI Mode</span><span className="si-switch" />
    </button>
  );
}`
}, {
  id: "progress",
  group: "Components",
  name: "Progress & score",
  file: "preview/progress-score.html",
  previewH: 360,
  desc: "Linear bars, the presence-score ring, and a segmented meter. The ring uses the AI gradient stroke and always carries a text equivalent (\"78 out of 100\"). Bars use semantic colors by health.",
  react: `function ProgressBar({ label, value, tone = "var(--si-primary-accent)" }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
        <span style={{ fontSize:14, color:"var(--si-text-secondary)" }}>{label}</span>
        <span style={{ fontSize:13, fontWeight:600 }}>{value}%</span>
      </div>
      <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}
        style={{ height:8, borderRadius:9999, background:"#EEF1F6", overflow:"hidden" }}>
        <div style={{ width: value + "%", height:"100%", background:tone, borderRadius:9999 }} />
      </div>
    </div>
  );
}`,
  html: `<div class="si-progress">
  <div class="si-progress__top"><span>Listing accuracy</span><b>92%</b></div>
  <div class="si-progress__track" role="progressbar"
       aria-valuenow="92" aria-valuemin="0" aria-valuemax="100">
    <div class="si-progress__fill" style="width:92%; background:var(--si-success)"></div>
  </div>
</div>

<style>
.si-progress__top { display:flex; justify-content:space-between; margin-bottom:7px; font-size:14px; }
.si-progress__track { height:8px; border-radius:9999px; background:#EEF1F6; overflow:hidden; }
.si-progress__fill { height:100%; border-radius:9999px; }
</style>`
}, {
  id: "drawer",
  group: "Components",
  name: "Drawer / slide-over",
  file: "preview/drawer.html",
  previewH: 440,
  desc: "A right-side panel that slides over the page for filters, record detail, and create/edit forms — keeps the user in context, lighter than a full page and roomier than a popover. Scrim dims the page; Esc and scrim-click close; focus is trapped while open.",
  usage: {
    do: ["Use for filters, detail, and create/edit in-context", "Slide from the right with a scrim; Esc + scrim close", "role=\"dialog\" aria-modal; trap + restore focus"],
    dont: ["Use for a quick one-off action (use a popover)", "Stack multiple drawers", "Lose the user's scroll position behind it"]
  },
  react: `function Drawer({ open, onClose, title, children, footer }) {
  React.useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return (
    <>
      <div onClick={onClose} aria-hidden="true"
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.4)', zIndex: 40,
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity .26s' }} />
      <aside role="dialog" aria-modal="true" aria-label={title}
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 340, background: '#fff', zIndex: 41,
          boxShadow: '-8px 0 28px rgba(15,23,42,.14)', display: 'flex', flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .3s cubic-bezier(.32,.72,0,1)' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '1px solid var(--si-border-subtle)' }}>
          <strong style={{ fontSize: 17 }}>{title}</strong>
          <button onClick={onClose} aria-label="Close" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
        </header>
        <div style={{ flex: 1, overflow: 'auto', padding: '18px 20px' }}>{children}</div>
        {footer && <footer style={{ display: 'flex', gap: 10, padding: '14px 20px',
          borderTop: '1px solid var(--si-border-subtle)', background: 'var(--si-surface-base)' }}>{footer}</footer>}
      </aside>
    </>
  );
}`
}, {
  id: "overlays",
  group: "Components",
  name: "Overlays",
  file: "preview/overlays.html",
  previewH: 440,
  desc: "Centered modal dialog, popover menu, and tooltip. Modals are role=\"dialog\" aria-modal, trap focus, close on Esc, and return focus to the trigger. Destructive confirms name the consequence.",
  usage: {
    do: ["Trap focus in the modal; return it on close", "Name the consequence in destructive copy", "Esc closes the topmost overlay"],
    dont: ["Use a modal where a toast would do", "Auto-focus a destructive button"]
  },
  html: `<div class="si-modal-backdrop">
  <div class="si-modal" role="dialog" aria-modal="true" aria-labelledby="m-title">
    <h2 id="m-title">Delete location?</h2>
    <p>This removes <b>Mall of Emirates</b> and all its listing data. This can't be undone.</p>
    <div class="si-modal__foot">
      <button class="si-btn si-btn--secondary">Cancel</button>
      <button class="si-btn si-btn--danger">Delete</button>
    </div>
  </div>
</div>

<style>
.si-modal-backdrop { position:fixed; inset:0; display:grid; place-items:center;
  background:rgba(15,23,42,.45); backdrop-filter:blur(2px); }
.si-modal { width:360px; background:#fff; border-radius:var(--si-radius-xl);
  box-shadow:var(--si-shadow-xl); padding:20px; }
.si-modal__foot { display:flex; justify-content:flex-end; gap:10px; margin-top:16px; }
</style>`,
  react: `function Modal({ title, children, onClose }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onKey = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector("button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="si-modal-backdrop" onClick={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" className="si-modal"
        onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>{children}
      </div>
    </div>
  );
}`
}, {
  id: "avatars",
  group: "Components",
  name: "Avatars",
  file: "preview/avatars.html",
  previewH: 220,
  desc: "Circular, initials or image, five sizes, an optional status dot, and a stacked overflow group. When an avatar is the only identifier, give it the person's name as its accessible label.",
  react: `function Avatar({ name, size = 40, src }) {
  const initials = name.split(" ").map(w => w[0]).slice(0,2).join("");
  return (
    <span aria-label={name} role="img"
      style={{ width:size, height:size, borderRadius:9999, display:"grid",
        placeItems:"center", overflow:"hidden", background:"#D6E4FF",
        color:"var(--si-info)", fontWeight:700, fontSize:size*0.34 }}>
      {src ? <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : initials}
    </span>
  );
}`,
  html: `<span class="si-avatar" role="img" aria-label="Nitin Nanda">NN</span>

<style>
.si-avatar { width:40px; height:40px; border-radius:9999px; display:grid;
  place-items:center; background:#D6E4FF; color:var(--si-info);
  font:700 14px var(--si-font-sans); }
</style>`
}, {
  id: "tables",
  group: "Components",
  name: "Data tables",
  file: "preview/data-tables.html",
  previewH: 380,
  desc: "Sortable header, status badges, row hover, and pagination. Use real <th scope>, sortable headers as buttons with aria-sort, and labeled pagination controls.",
  usage: {
    do: ["Use <th scope=\"col\"> and a <caption>", "Right-align numeric columns; tabular figures", "Sortable headers are buttons with aria-sort"],
    dont: ["Fake a table with divs", "Encode status by row color alone"]
  },
  html: `<table class="si-table">
  <caption class="sr-only">Locations by performance</caption>
  <thead>
    <tr>
      <th scope="col"><button aria-sort="none">Location</button></th>
      <th scope="col">Status</th>
      <th scope="col" class="num">Views</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Mall of Emirates</td>
      <td><span class="si-badge si-badge--success">Verified</span></td>
      <td class="num">42.1K</td>
    </tr>
  </tbody>
</table>

<style>
.si-table { width:100%; border-collapse:collapse; font-size:14px; }
.si-table th { text-align:left; padding:13px 18px; background:var(--si-surface-base);
  font:700 12px var(--si-font-sans); text-transform:uppercase; color:var(--si-text-tertiary); }
.si-table td { padding:14px 18px; border-bottom:1px solid var(--si-border-subtle); }
.si-table tbody tr:hover { background:#F8FAFF; }
.si-table .num { text-align:right; font-variant-numeric:tabular-nums; }
</style>`,
  react: `function DataTable({ columns, rows }) {
  return (
    <table className="si-table">
      <thead><tr>{columns.map(c =>
        <th key={c.key} scope="col" className={c.num ? "num" : ""}>{c.label}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) =>
        <tr key={i}>{columns.map(c =>
          <td key={c.key} className={c.num ? "num" : ""}>{r[c.key]}</td>)}</tr>)}</tbody>
    </table>
  );
}`
}, {
  id: "charts",
  group: "Components",
  name: "Charts",
  file: "preview/charts.html",
  previewH: 320,
  desc: "Bar, line/area, and donut with the brand palette — accent is the focus series, blue-200 is context. Zero-based axes, horizontal-only gridlines. Always pair a role=\"img\" label + a data table.",
  usage: {
    do: ["Start bar/area Y axes at zero", "Accent = focus, blue-200 = context", "Add role=\"img\" + an insight-bearing label and a data table"],
    dont: ["Use 3D, shadows, or pies > 4 slices", "Encode series by color alone"]
  },
  react: `import { BarChart, Bar, XAxis, CartesianGrid, Tooltip } from "recharts";

const SERIES = { focus: "#0070FC", context: "#BFDBFE" };

<figure role="img" aria-label="Profile views by day — peaked Thursday at 8,420.">
  <BarChart width={280} height={150} data={data}>
    <CartesianGrid vertical={false} stroke="#F3F4F6" />
    <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
    <Tooltip />
    <Bar dataKey="views" radius={[4,4,0,0]}
      fill={SERIES.context} /* highlight the focus bar via <Cell> */ />
  </BarChart>
</figure>`
}, {
  id: "inline-scores",
  group: "Components",
  name: "Inline scores",
  file: "preview/inline-scores.html",
  previewH: 300,
  desc: "Amber star ratings, a rating distribution, and score pills. The numeric value carries the meaning and the accessible name — stars are decorative (aria-hidden). Amber is never used as text.",
  react: `function Rating({ value, count }) {
  return (
    <span aria-label={"Rated " + value + " out of 5, " + count + " reviews"}
      style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
      <span aria-hidden="true" style={{ color:"var(--si-star-amber)" }}>
        {"★".repeat(Math.round(value))}{"☆".repeat(5 - Math.round(value))}
      </span>
      <b style={{ fontVariantNumeric:"tabular-nums" }}>{value}</b>
      <span style={{ color:"var(--si-text-tertiary)", fontSize:13 }}>({count})</span>
    </span>
  );
}`,
  html: `<span class="si-rating" aria-label="Rated 4.6 out of 5, 1,284 reviews">
  <span aria-hidden="true" style="color:var(--si-star-amber)">★★★★★</span>
  <b>4.6</b> <span class="muted">(1,284)</span>
</span>`
}, {
  id: "breadcrumbs",
  group: "Components",
  name: "Breadcrumbs",
  file: "preview/breadcrumbs.html",
  previewH: 150,
  desc: "Chevron-separated path with a home icon; the current page is bold and aria-current. Deep paths collapse to an overflow menu. Separators are aria-hidden.",
  html: `<nav class="si-crumbs" aria-label="Breadcrumb">
  <a href="#">Home</a>
  <span aria-hidden="true">›</span>
  <a href="#">Presence AI</a>
  <span aria-hidden="true">›</span>
  <span aria-current="page">Mall of Emirates</span>
</nav>

<style>
.si-crumbs { display:flex; align-items:center; gap:8px; font-size:14px; }
.si-crumbs a { color:var(--si-text-tertiary); text-decoration:none; }
.si-crumbs a:hover { color:var(--si-primary-accent); }
.si-crumbs [aria-current] { color:var(--si-text-primary); font-weight:600; }
</style>`,
  react: `function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="si-crumbs">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {last
              ? <span aria-current="page">{it.label}</span>
              : <a href={it.href}>{it.label}</a>}
            {!last && <span aria-hidden="true">›</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}`
}, {
  id: "stepper",
  group: "Components",
  name: "Stepper / wizard",
  file: "preview/stepper-wizard.html",
  previewH: 230,
  desc: "Done / active / upcoming steps with connectors for multi-step flows like onboarding. The active step is aria-current=\"step\"; completed steps show a check, not just color.",
  react: `function Stepper({ steps, current }) {
  return (
    <ol style={{ display:"flex", listStyle:"none", padding:0, margin:0 }}>
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <li key={s} aria-current={state === "active" ? "step" : undefined}
            style={{ flex:1, textAlign:"center" }}>
            <span className={"si-step__dot is-" + state}>{state === "done" ? "✓" : i + 1}</span>
            <div>{s}</div>
          </li>
        );
      })}
    </ol>
  );
}`
}, {
  id: "timeline",
  group: "Components",
  name: "Timeline & activity",
  file: "preview/timeline-activity.html",
  previewH: 380,
  desc: "A vertical activity feed with a connector rail and per-entry actor, action, and timestamp. Nodes are tinted by event type; relative time with absolute on hover.",
  html: `<ul class="si-feed">
  <li class="si-feed__item">
    <span class="si-feed__node si-feed__node--ok">✓</span>
    <div>
      <p><b>Nitin Nanda</b> verified the <b>Mall of Emirates</b> listing.</p>
      <time datetime="2026-06-18T10:24">Today · 10:24 AM</time>
    </div>
  </li>
</ul>

<style>
.si-feed { list-style:none; padding:0; margin:0; }
.si-feed__item { display:flex; gap:16px; padding-bottom:22px; position:relative; }
.si-feed__node { width:34px; height:34px; border-radius:9999px; display:grid; place-items:center; }
.si-feed__node--ok { background:var(--si-success-bg); color:var(--si-success); }
.si-feed time { font-size:12px; color:var(--si-text-tertiary); }
</style>`
}, {
  id: "toasts",
  group: "Components",
  name: "Notification toasts",
  file: "preview/notification-toasts.html",
  previewH: 320,
  desc: "Success / error / info snackbars (plus an AI-gradient variant) with an optional action and close. role=\"status\" for info/success, role=\"alert\" for errors. Don't auto-dismiss actionable toasts.",
  usage: {
    do: ["role=\"status\" (polite) / role=\"alert\" (assertive)", "Lead with the outcome, past tense", "Keep actionable toasts until dismissed"],
    dont: ["Steal focus to announce a toast", "Stack more than is useful — batch instead"]
  },
  react: `function Toast({ tone = "info", title, action, onClose }) {
  return (
    <div role={tone === "error" ? "alert" : "status"}
      className={"si-toast si-toast--" + tone}>
      <div className="si-toast__body">{title}</div>
      {action && <button className="si-toast__action" onClick={action.onClick}>{action.label}</button>}
      <button aria-label="Dismiss" onClick={onClose}>✕</button>
    </div>
  );
}`,
  html: `<div class="si-toast si-toast--success" role="status">
  <span>628 image requests submitted.</span>
  <button class="si-toast__action">Undo</button>
  <button aria-label="Dismiss">✕</button>
</div>

<style>
.si-toast { display:flex; align-items:center; gap:12px; padding:14px 16px; background:#fff;
  border-radius:var(--si-radius-lg); box-shadow:var(--si-shadow-lg);
  border-left:4px solid var(--si-info); }
.si-toast--success { border-left-color:var(--si-success); }
.si-toast--error   { border-left-color:var(--si-error); }
.si-toast__action  { border:none; background:none; font-weight:600;
  color:var(--si-primary-accent); cursor:pointer; }
</style>`
}, {
  id: "date-picker",
  group: "Components",
  name: "Date & range picker",
  file: "preview/date-picker.html",
  previewH: 420,
  desc: "Preset shortcuts (Today, Last 7/30 days, This month) beside a calendar for a custom range — the core date control for every analytics view. Selecting a range highlights the span; presets and custom stay in sync. Format dates unambiguously (4 Jun 2026).",
  usage: {
    do: ["Offer presets first — most users pick one", "Highlight the full range; show the resolved dates", "Localize format; never ambiguous 03/04"],
    dont: ["Force calendar navigation when a preset fits", "Allow an end before the start"]
  },
  react: `// Wrap a headless calendar (react-day-picker) with our presets + tokens.
import { DayPicker } from 'react-day-picker';

const PRESETS = [
  { label: 'Today', days: 0 }, { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 }, { label: 'This month', month: true },
];

function DateRangePicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 140 }}>
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => onChange(resolvePreset(p))}
            style={{ textAlign: 'left', padding: '9px 12px', borderRadius: 9, border: 'none',
              background: 'none', font: '500 14px inherit', cursor: 'pointer' }}>{p.label}</button>
        ))}
      </div>
      <DayPicker mode="range" selected={value} onSelect={onChange}
        modifiersStyles={{
          range_middle: { background: '#EAF1FE' },
          range_start: { background: 'var(--si-primary-accent)', color: '#fff' },
          range_end: { background: 'var(--si-primary-accent)', color: '#fff' },
        }} />
    </div>
  );
}`
}, {
  id: "file-upload",
  group: "Components",
  name: "File upload",
  file: "preview/file-upload.html",
  previewH: 400,
  desc: "A dropzone (drag-or-browse) plus a file list with per-file progress, success, and remove. Used for logos, store photos, and bulk-location CSVs. Validate type/size, show a clear error per file, and keep the input keyboard-reachable.",
  usage: {
    do: ["Support drag-and-drop AND a keyboard-reachable browse button", "Show per-file progress, success & remove", "State accepted types and size limits up front"],
    dont: ["Hide upload state or fail silently", "Block the UI during upload"]
  },
  react: `function Dropzone({ onFiles, accept = 'image/*,.csv' }) {
  const [over, setOver] = React.useState(false);
  const inputRef = React.useRef(null);
  const handle = files => onFiles([...files]);
  return (
    <div
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files); }}
      onClick={() => inputRef.current.click()}
      role="button" tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inputRef.current.click()}
      style={{ border: '2px dashed ' + (over ? 'var(--si-primary-accent)' : 'var(--si-border-default)'),
        background: over ? '#F4F8FF' : 'transparent', borderRadius: 14, padding: '30px 24px',
        textAlign: 'center', cursor: 'pointer' }}>
      <UploadIcon />
      <div style={{ fontWeight: 600 }}>Drop files here or <b style={{ color: 'var(--si-primary-accent)' }}>browse</b></div>
      <div style={{ fontSize: 13, color: 'var(--si-text-tertiary)' }}>PNG, JPG up to 10 MB · or a location CSV</div>
      <input ref={inputRef} type="file" accept={accept} multiple hidden
        onChange={e => handle(e.target.files)} />
    </div>
  );
}`
}, {
  id: "pagination",
  group: "Components",
  name: "Pagination",
  file: "preview/pagination.html",
  previewH: 300,
  desc: "Numbered pagination with prev/next, truncation (1 … 4 5 6 … 64), and a rows-per-page select for tables; a 'Load more' button for long feeds. Pagination controls are labeled buttons; the current page is aria-current.",
  usage: {
    do: ["Label prev/next and number buttons; mark current with aria-current", "Truncate long ranges with … ", "Use 'Load more' for feeds, numbers for tables"],
    dont: ["Render 64 raw page buttons", "Auto-paginate without a visible control"]
  },
  react: `function Pagination({ page, totalPages, onChange }) {
  const pages = [...new Set([1, 2, totalPages - 1, totalPages, page - 1, page, page + 1])]
    .filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out = []; let prev = 0;
  pages.forEach(p => { if (p - prev > 1) out.push('…'); out.push(p); prev = p; });
  return (
    <nav aria-label="Pagination" style={{ display: 'flex', gap: 6 }}>
      <button aria-label="Previous page" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {out.map((p, i) => p === '…'
        ? <span key={'g'+i} aria-hidden>…</span>
        : <button key={p} aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}>{p}</button>)}
      <button aria-label="Next page" disabled={page === totalPages} onClick={() => onChange(page + 1)}>›</button>
    </nav>
  );
}`
}, {
  id: "skeletons",
  group: "Components",
  name: "Skeleton loaders",
  file: "preview/skeletons.html",
  previewH: 320,
  desc: "Shimmer placeholders that match the final layout for sub-1s loads — they imply the shape of what's coming and feel faster than a spinner. Shimmer turns off under prefers-reduced-motion; announce 'Loading…' politely.",
  usage: {
    do: ["Match the skeleton to the real layout", "Use for loads under ~1s; spinner/label for longer", "Disable shimmer under reduced-motion"],
    dont: ["Show a full-screen spinner where skeletons fit", "Leave skeletons up after data arrives"]
  },
  react: `function Skeleton({ width = '100%', height = 12, radius = 6, circle }) {
  return <span aria-hidden="true" style={{ display: 'block', width,
    height: circle ? width : height, borderRadius: circle ? '50%' : radius,
    background: 'linear-gradient(100deg,#EEF1F6 30%,#F6F8FB 50%,#EEF1F6 70%)',
    backgroundSize: '200% 100%', animation: 'si-shimmer 1.3s ease-in-out infinite' }} />;
}
// Respect reduced motion globally:
// @media (prefers-reduced-motion: reduce){ [style*="si-shimmer"]{ animation:none } }
// @keyframes si-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

function RowSkeleton() {
  return (
    <div role="status" aria-label="Loading" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <Skeleton width={44} circle />
      <div style={{ flex: 1, display: 'grid', gap: 8 }}>
        <Skeleton width="60%" height={13} /><Skeleton width="40%" height={11} />
      </div>
    </div>
  );
}`,
  html: `<div class="si-skel-row" role="status" aria-label="Loading">
  <span class="si-skel" style="width:44px;height:44px;border-radius:50%"></span>
  <span style="flex:1">
    <span class="si-skel" style="display:block;width:60%;height:13px;margin-bottom:8px"></span>
    <span class="si-skel" style="display:block;width:40%;height:11px"></span>
  </span>
</div>

<style>
.si-skel-row { display:flex; gap:14px; align-items:center; }
.si-skel { display:inline-block; border-radius:6px;
  background:linear-gradient(100deg,#EEF1F6 30%,#F6F8FB 50%,#EEF1F6 70%);
  background-size:200% 100%; animation:si-shimmer 1.3s ease-in-out infinite; }
@keyframes si-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
@media (prefers-reduced-motion: reduce){ .si-skel{ animation:none; background:#EEF1F6; } }
</style>`
}, {
  id: "empty",
  group: "Components",
  name: "Empty states",
  file: "preview/empty-states.html",
  previewH: 340,
  desc: "A tinted icon square, a title, a one-line body, and a single clear CTA — centered. Every empty state points to the next action; \"good news\" empties reassure rather than alarm.",
  react: `function EmptyState({ icon, title, body, cta }) {
  return (
    <div style={{ textAlign:"center", padding:"32px 24px",
      border:"1px dashed var(--si-border-default)", borderRadius:"var(--si-radius-lg)" }}>
      <div style={{ width:56, height:56, borderRadius:16, margin:"0 auto 16px",
        display:"grid", placeItems:"center", background:"var(--si-info-bg)",
        color:"var(--si-info)" }}>{icon}</div>
      <h3 style={{ margin:0, fontSize:16 }}>{title}</h3>
      <p style={{ color:"var(--si-text-tertiary)", fontSize:13.5, maxWidth:280, margin:"6px auto 18px" }}>{body}</p>
      {cta}
    </div>
  );
}`,
  html: `<div class="si-empty">
  <div class="si-empty__icon"><!-- icon --></div>
  <h3>No locations yet</h3>
  <p>Add your first business location to start tracking presence and reviews.</p>
  <button class="si-btn si-btn--primary">Add Location</button>
</div>`
}];

/* ============================================================
 * GUIDELINES — rendered as in-portal content pages.
 * Each: { id, name, desc, doc (full .md), html (portal content) }
 * Content is contextual to SingleInterface tokens & components.
 * ============================================================ */
window.DS_GUIDES = [/* ─────────────── ACCESSIBILITY ─────────────── */
{
  id: "accessibility",
  name: "Accessibility",
  desc: "WCAG 2.1 AA is the floor. Every token, component, and pattern is built so a screen can be operated by keyboard, read by a screen reader, and understood at 200% zoom.",
  doc: "docs/accessibility.md",
  html: `
<h2>Target: WCAG 2.1 AA</h2>
<p>SingleInterface is an enterprise tool used all day on shared workstations and busy retail floors. Accessibility is also a procurement requirement (buyers ask for a VPAT/ACR), so treat every guideline here as shippable scope. The principle: <strong>color + icon + text</strong> for every state — never color alone.</p>

<h3>Contrast — verified token pairs</h3>
<p>Use these pairs; don't improvise. Body text needs <strong>4.5:1</strong>, large text & UI boundaries <strong>3:1</strong>, focus rings <strong>3:1</strong>.</p>
<table>
<thead><tr><th>Foreground</th><th>On</th><th>Ratio</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td><code>--si-text-primary</code> #111827</td><td><code>--si-surface-base</code></td><td>16.1:1</td><td class="ok">AAA</td></tr>
<tr><td><code>--si-text-tertiary</code> #6B7280</td><td>#FFFFFF</td><td>4.95:1</td><td class="ok">AA body</td></tr>
<tr><td><code>--si-primary-accent</code> #0070FC</td><td>#FFFFFF</td><td>4.0:1</td><td class="warn">AA large/UI only</td></tr>
<tr><td>White</td><td><code>--si-primary-accent</code> button</td><td>4.0:1</td><td class="ok">OK at 600 weight</td></tr>
<tr><td><code>--si-star-amber</code> #F59E0B</td><td>#FFFFFF</td><td>1.9:1</td><td class="bad">decorative only</td></tr>
</tbody></table>
<div class="callout callout--warn"><strong>The amber-star trap.</strong> #F59E0B fails as text or as a lone meaningful icon. A star is allowed only when the numeric rating beside it (in <code>--si-text-primary</code>) carries the meaning.</div>
<div class="callout callout--warn"><strong>The accent-blue caveat.</strong> #0070FC is ~4:1 on white — fine for large text, UI borders, and 600-weight button labels, but borderline for 14px body links. In running prose use <code>--si-primary-deep</code> (12.6:1) or add an underline.</div>

<h3>Keyboard</h3>
<p>Everything operable by mouse is operable by keyboard, in logical (DOM) order, with no traps.</p>
<ul>
<li><strong>Tab / Shift+Tab</strong> move between controls; <strong>Enter/Space</strong> activate; <strong>Esc</strong> closes the topmost overlay and returns focus to its trigger.</li>
<li><strong>Arrow keys</strong> move <em>within</em> composite widgets — tabs, the left-nav accordion, menus (location/locale/user), the segmented control, and data-grid cells.</li>
<li>Tabs are one tab stop (APG); collapsed accordion children leave the tab order; modals & sheets trap focus and restore it on close.</li>
</ul>

<h3>Focus visibility</h3>
<p>Every focusable element shows a <code>:focus-visible</code> ring — 2px <code>--si-primary-accent</code>, 2px offset, ≥3:1. On the AI gradient and dark surfaces the ring switches to <strong>white</strong>. Never <code>outline:none</code> without a replacement. Provide a "Skip to main content" link as the first focusable element.</p>

<h3>Screen readers & semantics</h3>
<ul>
<li>Semantic HTML before ARIA: <code>&lt;button&gt;</code>, <code>&lt;a href&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;table&gt;</code>, headings.</li>
<li>Accessible name on every control — icon-only buttons (burger, help, FAB, close, row "⋯") need <code>aria-label</code>.</li>
<li>State is programmatic: <code>aria-expanded</code> (accordion/menus), <code>aria-selected</code> (tabs), <code>aria-checked</code> (the AI Mode switch), <code>aria-current="page"</code> (active nav / breadcrumb).</li>
<li>Live regions: toasts use <code>role="status"</code> (polite) or <code>role="alert"</code> (errors); async/AI results announce politely — never token-by-token.</li>
</ul>

<h3>Forms & touch</h3>
<ul>
<li>Persistent visible <code>&lt;label&gt;</code> (never placeholder-as-label); helper/error via <code>aria-describedby</code>; <code>aria-invalid</code> on error.</li>
<li>Errors say what's wrong <em>and</em> the fix — "Enter a valid GST number (15 characters)", never "Invalid".</li>
<li>Hit areas ≥ <strong>44×44px</strong>; gesture actions (swipe a review row, dismiss a sheet) always have a button alternative; activate on <code>pointerup</code>.</li>
</ul>

<h3>Per-component checklist</h3>
<table>
<thead><tr><th>Component</th><th>Must-haves</th></tr></thead>
<tbody>
<tr><td>Left navigation</td><td><code>nav[aria-label]</code>, group <code>aria-expanded</code>, <code>aria-current="page"</code>, roving arrows</td></tr>
<tr><td>Top header</td><td>AI Mode = <code>role="switch"</code>+<code>aria-checked</code>; labeled icon buttons & menu triggers</td></tr>
<tr><td>Charts</td><td><code>role="img"</code> + insight-bearing label + a data table; never color-only series</td></tr>
<tr><td>Inline scores</td><td>numeric rating is the accessible name; stars <code>aria-hidden</code></td></tr>
<tr><td>Modal / sheet</td><td><code>role="dialog"</code>+<code>aria-modal</code>, focus trap, Esc, return focus</td></tr>
</tbody></table>
`
}, /* ─────────────── CONTENT & UX WRITING ─────────────── */
{
  id: "content-writing",
  name: "Content & UX Writing",
  desc: "Words are UI. The product should sound like one calm, competent person — an expert colleague who respects the user's time.",
  doc: "docs/content-and-ux-writing.md",
  html: `
<h2>Voice: calm, confident, useful</h2>
<p>We're an enterprise tool that manages a brand's entire local presence; we earn trust by being precise, never loud. Voice is constant; tone flexes with the moment.</p>
<div class="do-dont">
  <div class="dd dd--do"><h4>We are</h4><ul><li>Clear — plain words, the point first</li><li>Confident — we make recommendations</li><li>Useful — every string helps the user act</li><li>Honest — we say what happened, including bad news</li></ul></div>
  <div class="dd dd--dont"><h4>We're not</h4><ul><li>Clever, jargon-y, padded</li><li>Hedging, vague, apologetic</li><li>Decorative or filler</li><li>Euphemistic or blame-shifting</li></ul></div>
</div>
<div class="callout">One exclamation mark, max — only for genuine wins ("Great, we found your business!"). Everywhere else, a period.</div>

<h3>Capitalization</h3>
<table>
<thead><tr><th>Element</th><th>Style</th><th>Example</th></tr></thead>
<tbody>
<tr><td>Page / card / button titles</td><td>Title Case</td><td>"Listing Management", "Add Location"</td></tr>
<tr><td>Status badges</td><td>Capitalized word</td><td>"Verified", "Pending"</td></tr>
<tr><td>Helper / error / tooltip</td><td>Sentence case</td><td>"We'll use this to match your listing."</td></tr>
</tbody></table>
<p>Module names are proper nouns — <strong>Insights AI</strong>, <strong>Presence AI</strong>, <strong>AI Mode</strong> — always exactly so.</p>

<h3>Buttons & errors</h3>
<ul>
<li><strong>Verb + noun</strong>, Title Case, ≤3 words: "Add Location", "Send Reply", "Request Credits". One primary per view.</li>
<li>Destructive buttons name the action ("Delete Location"), never "Yes" or "OK".</li>
<li>Errors are the most important strings: state the problem and the fix, at the field, blaming the form not the user — "That email's already registered."</li>
</ul>

<h3>Numbers & data</h3>
<ul>
<li>Numerals always for data; tabular figures (the type system has <code>tnum</code> on).</li>
<li>Localize grouping — India uses <code>4,70,280</code>; abbreviate in tight tiles (<code>42.1K</code>) with the full value in tooltips.</li>
<li>Trend = sign + value + context: "+22% vs last month". Never an ambiguous date (<code>03/04</code>) — write "4 Mar 2026".</li>
</ul>

<h3>Terminology — say this, not that</h3>
<table>
<thead><tr><th>Use</th><th>Avoid</th></tr></thead>
<tbody>
<tr><td>Listing</td><td>citation, NAP record</td></tr>
<tr><td>Location / store</td><td>outlet, branch</td></tr>
<tr><td>Presence Score</td><td>health score, SI score</td></tr>
<tr><td>AI Mode</td><td>copilot, bot, assistant</td></tr>
<tr><td>Sign in / Sign out</td><td>log in / log out</td></tr>
</tbody></table>
<div class="callout">A concept has <strong>one</strong> name across the whole product. If it's a "location" in the table, it's not an "outlet" in the modal.</div>

<h3>Inclusive & global</h3>
<p>Write plain, translatable English — short sentences, no idioms, no slang in errors. People-first and bias-free (no gendered defaults, no "sanity check" → say "quick check"). Never concatenate sentence fragments; use full templated strings so translators can reorder. See <em>Internationalization</em>.</p>
`
}, /* ─────────────── AI INTERACTION ─────────────── */
{
  id: "ai-interaction",
  name: "AI Interaction",
  desc: "Every module carries an AI suffix and AI Mode turns the console into a conversational analyst. That power earns trust only if the AI is transparent, controllable, and honest about its limits.",
  doc: "docs/ai-interaction-guidelines.md",
  html: `
<h2>The promise</h2>
<p>AI does the heavy lifting; the user stays in control and always knows what's happening, where it came from, and how to undo it.</p>
<ul>
<li><strong>Augment, don't replace.</strong> AI surfaces insight and drafts work — the user decides and acts.</li>
<li><strong>Human in the loop.</strong> Anything consequential (sending a reply, publishing, spending credits, editing a live listing) needs explicit confirmation.</li>
<li><strong>Transparent & honest.</strong> Always show content is AI-generated, the data used, and how fresh it is.</li>
</ul>

<h3>When to use AI</h3>
<div class="do-dont">
  <div class="dd dd--do"><h4>Good fit</h4><ul><li>Summarizing 1,200 reviews into themes</li><li>Drafting a reply in the brand tone</li><li>Spotting anomalies ("views dropped 18%")</li><li>Natural-language Q&A over the user's data</li></ul></div>
  <div class="dd dd--dont"><h4>Keep deterministic</h4><ul><li>The Presence Score (rules, not vibes)</li><li>Sending that reply (human approves)</li><li>Billing math & credit balances</li><li>Permissions / who-can-do-what</li></ul></div>
</div>
<div class="callout">Rule of thumb: AI for <strong>judgment, language, and synthesis</strong>; deterministic code for <strong>facts, money, and permissions</strong>. Never let the model invent a number the system already knows.</div>

<h3>The AI visual language</h3>
<p>AI surfaces are visibly different so users always know when they're talking to the model.</p>
<ul>
<li>The <strong>AI gradient</strong> <code>linear-gradient(90deg,#0E0071,#0070FC)</code> marks — and only marks — AI surfaces: AI Mode header, the AI FAB/sparkle, AI reply cards, the center tab, the "AI" badge. <strong>Never on a generic CTA.</strong></li>
<li>The <strong>sparkle</strong> (four-point star) is the universal "AI" affordance.</li>
<li>Any model-produced content wears an <strong>AI badge</strong> so it's never mistaken for human or system-of-record data.</li>
<li>Text/icons/focus rings go white on the gradient; add a <code>forced-colors</code> border for high-contrast mode.</li>
</ul>

<h3>The lifecycle</h3>
<table>
<thead><tr><th>Moment</th><th>Do</th></tr></thead>
<tbody>
<tr><td>Invite</td><td>Show what AI can do here + 3–4 example prompts; let the user scope locations/dates.</td></tr>
<tr><td>Generate</td><td>Acknowledge in &lt;100ms; stream output; show a cancellable, reduced-motion-safe thinking state.</td></tr>
<tr><td>Output</td><td>Badge it AI; show sources & freshness ("Based on 1,284 reviews, up to today 10:00 AM"); lead with the answer; link to verify.</td></tr>
<tr><td>Control</td><td>Edit / Regenerate / Refine / Apply-Send / Undo always one click away. The consequential verb is a deliberate click.</td></tr>
<tr><td>Feedback</td><td>Lightweight 👍/👎 + reason and a Report path, always present.</td></tr>
</tbody></table>

<h3>Trust & control</h3>
<ul>
<li>Express uncertainty honestly — "looks positive", "likely", a low-confidence note when data is thin. Don't fabricate metrics the system can compute.</li>
<li>Confirm before consequence; preview before apply; bulk actions get extra friction ("Apply AI replies to 38 reviews?").</li>
<li>AI can only do what the user is allowed to — it never escalates permission, and shows credit cost before a paid action.</li>
<li>The assistant is a capable tool, not a persona with feelings or a name. Minimal "I"; prefer "Here's what we found".</li>
</ul>
`
}, /* ─────────────── MOTION & INTERACTION ─────────────── */
{
  id: "motion",
  name: "Motion & Interaction",
  desc: "Motion is functional, fast, and quiet. It explains change — where something came from, where it went, what's loading — then gets out of the way. When in doubt, less.",
  doc: "docs/motion-and-interaction.md",
  html: `
<h2>Principles</h2>
<p>This is a tool people use for hours; motion that's showy the first time is exhausting the thousandth. Purposeful, fast (120–320ms), natural easing, consistent, and respectful of <code>prefers-reduced-motion</code>.</p>

<h3>Duration & easing</h3>
<table>
<thead><tr><th>Token</th><th>Value</th><th>Use</th></tr></thead>
<tbody>
<tr><td><code>--m-dur-fast</code></td><td>160ms</td><td>taps, toggles, chip/segment switches, hover</td></tr>
<tr><td><code>--m-dur-base</code></td><td>240ms</td><td>dropdowns, accordions, tab/panel changes, toasts</td></tr>
<tr><td><code>--m-dur-slow</code></td><td>320ms</td><td>bottom sheets, modals, larger surfaces</td></tr>
<tr><td><code>--m-ease-out</code></td><td>cubic-bezier(.25,.46,.45,.94)</td><td>entrances — decelerate into place</td></tr>
<tr><td><code>--m-ease-sheet</code></td><td>cubic-bezier(.32,.72,0,1)</td><td>bottom-sheet settle</td></tr>
</tbody></table>
<p>Entrances decelerate (ease-out), exits accelerate (ease-in). Never linear for spatial motion. Small/near elements move faster than large/far ones.</p>

<h3>The motion vocabulary</h3>
<table>
<thead><tr><th>Pattern</th><th>Spec</th></tr></thead>
<tbody>
<tr><td>Fade + rise (dropdowns, menus, tooltips)</td><td>opacity 0→1 + translateY 6px→0, base, ease-out</td></tr>
<tr><td>Accordion expand (left nav)</td><td>animate <code>grid-template-rows 0fr→1fr</code>, caret rotates 90°</td></tr>
<tr><td>Sheet up</td><td>translateY 100%→0 + backdrop fade, slow, ease-sheet</td></tr>
<tr><td>Press feedback</td><td>scale to ~0.98; AI surfaces scale to 1.02 on idle hover</td></tr>
<tr><td>Skeleton shimmer</td><td>~1.2s sweep; <strong>off</strong> under reduced-motion</td></tr>
</tbody></table>

<h3>Interaction states</h3>
<p>Every interactive element defines all of these — visibly distinct, never color-only:</p>
<ul>
<li><strong>Hover</strong> — bg tint or lift (primary buttons go <code>#0070FC</code> → <code>--si-primary-deep</code>, lift 2px).</li>
<li><strong>Focus-visible</strong> — 2px accent ring, 2px offset; white on dark/gradient.</li>
<li><strong>Active</strong> — scale 0.98 / darker bg, immediate.</li>
<li><strong>Selected</strong> — weight change + indicator bar/check plus color; <code>aria-current</code>/<code>aria-selected</code>.</li>
<li><strong>Loading / Disabled / Error</strong> — spinner or skeleton; reduced opacity; error color + icon + message (never a red border alone).</li>
</ul>

<h3>Loading & reduced motion</h3>
<ul>
<li>Under 1s → skeletons matching the final layout (feel faster than spinners). 1–10s → labeled progress with a cancel. AI → stream progressively.</li>
<li>Under <code>prefers-reduced-motion: reduce</code>: replace slide/scale with opacity-only or instant; stop shimmer, count-ups, and sheet springs; keep focus rings and a simple spinner. Content must never depend on motion.</li>
</ul>
`
}, /* ─────────────── DATA VISUALIZATION ─────────────── */
{
  id: "dataviz",
  name: "Data Visualization",
  desc: "Presence scores, view trends, rank tracking, sentiment. Charts must be accurate, instantly readable, accessible, and on-brand. A pretty but misleading chart is a bug.",
  doc: "docs/data-visualization.md",
  html: `
<h2>Principles</h2>
<p>Clarity over decoration (no 3D, shadows, or chart-junk). Honest encoding — bar/area Y-axes start at <strong>zero</strong>, scales stay consistent across compared charts. Accessible by construction. On-brand: the primary series is <code>--si-primary-accent</code>.</p>

<h3>Chart color</h3>
<p>The "one series pops" pattern is the house style: context bars/lines in <code>#BFDBFE</code> (blue-200), the focus series in <code>#0070FC</code>. Semantic mapping is fixed — green good, red bad, amber caution — but up isn't always good (rising negative reviews is red).</p>
<table>
<thead><tr><th>Order</th><th>Color</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>#0070FC</code></td><td>focus / "this period"</td></tr>
<tr><td>2</td><td><code>#0E0071</code></td><td>comparison / "last period"</td></tr>
<tr><td>3</td><td><code>#BFDBFE</code></td><td>context / de-emphasized</td></tr>
<tr><td>4–6</td><td><code>#16A34A</code> / <code>#CA8A04</code> / <code>#DC2626</code></td><td>positive / neutral / negative</td></tr>
</tbody></table>
<div class="callout callout--warn">≤6 categories with distinct colors. Never encode by hue alone — add labels, patterns, or a data table. The amber star color is for ratings, not chart series (poor contrast).</div>

<h2>Chart catalogue</h2>
<p>Every chart type in the system, grouped by the question it answers. Each shows the on-brand treatment and the SingleInterface use case it's built for. Pick the simplest chart that answers the question — and always pair it with a data table for accessibility.</p>

<h3>1 · Trends over time</h3>
<div class="chart-gallery">

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Line chart">
    <line x1="16" y1="96" x2="232" y2="96" stroke="#E5E7EB"/><line x1="16" y1="64" x2="232" y2="64" stroke="#F3F4F6"/><line x1="16" y1="32" x2="232" y2="32" stroke="#F3F4F6"/>
    <polyline points="16,82 56,60 96,68 136,40 176,50 216,22" fill="none" stroke="#0070FC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="216" cy="22" r="4" fill="#0070FC" stroke="#fff" stroke-width="2"/>
  </svg></div><h4>Line</h4><p><b>One metric over time.</b> Profile views or search rank across 30 days.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Area chart">
    <defs><linearGradient id="ar1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0070FC" stop-opacity=".18"/><stop offset="1" stop-color="#0070FC" stop-opacity="0"/></linearGradient></defs>
    <line x1="16" y1="96" x2="232" y2="96" stroke="#E5E7EB"/><line x1="16" y1="64" x2="232" y2="64" stroke="#F3F4F6"/><line x1="16" y1="32" x2="232" y2="32" stroke="#F3F4F6"/>
    <polygon points="16,78 56,58 96,66 136,42 176,52 216,28 216,96 16,96" fill="url(#ar1)"/>
    <polyline points="16,78 56,58 96,66 136,42 176,52 216,28" fill="none" stroke="#0070FC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg></div><h4>Area</h4><p><b>One metric, volume emphasis.</b> Cumulative impressions where the magnitude matters.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Multi-line chart">
    <line x1="16" y1="96" x2="232" y2="96" stroke="#E5E7EB"/><line x1="16" y1="64" x2="232" y2="64" stroke="#F3F4F6"/><line x1="16" y1="32" x2="232" y2="32" stroke="#F3F4F6"/>
    <polyline points="16,84 56,64 96,70 136,44 176,52 216,26" fill="none" stroke="#0070FC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="16,90 56,82 96,84 136,72 176,78 216,66" fill="none" stroke="#0E0071" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>
  </svg></div><h4>Multi-line</h4><p><b>Compare 2–3 series over time.</b> This period (solid) vs last period (dashed).</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Stacked area chart">
    <defs><linearGradient id="sa1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0070FC" stop-opacity=".22"/><stop offset="1" stop-color="#0070FC" stop-opacity=".05"/></linearGradient></defs>
    <line x1="16" y1="96" x2="232" y2="96" stroke="#E5E7EB"/>
    <polygon points="16,70 80,58 144,62 216,44 216,96 16,96" fill="#BFDBFE"/>
    <polygon points="16,54 80,40 144,46 216,26 216,44 144,62 80,58 16,70" fill="url(#sa1)"/>
    <polyline points="16,54 80,40 144,46 216,26" fill="none" stroke="#0070FC" stroke-width="2"/>
  </svg></div><h4>Stacked area</h4><p><b>Part-to-whole over time.</b> Sentiment volume (pos/neu/neg) month over month.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Step line chart">
    <line x1="16" y1="96" x2="232" y2="96" stroke="#E5E7EB"/><line x1="16" y1="56" x2="232" y2="56" stroke="#F3F4F6"/>
    <polyline points="16,80 60,80 60,60 110,60 110,68 160,68 160,40 216,40" fill="none" stroke="#0070FC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg></div><h4>Step line</h4><p><b>Values that hold then jump.</b> Map-rank position, which changes in discrete steps.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Sparkline in a KPI tile">
    <text x="16" y="34" font-family="Hanken Grotesk,sans-serif" font-size="13" fill="#6B7280">Profile views</text>
    <text x="16" y="64" font-family="Hanken Grotesk,sans-serif" font-size="26" font-weight="700" fill="#111827">12,450</text>
    <text x="16" y="84" font-family="Hanken Grotesk,sans-serif" font-size="12" font-weight="600" fill="#16A34A">&#9650; 22%</text>
    <polyline points="150,70 168,58 186,64 204,44 222,30" fill="none" stroke="#0070FC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg></div><h4>Sparkline</h4><p><b>Trend shape inside a KPI.</b> A tiny axis-less line beside the headline number.</p></div>

</div>

<h3>2 · Comparison &amp; ranking</h3>
<div class="chart-gallery">

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Vertical bar chart with one highlighted bar">
    <line x1="16" y1="96" x2="232" y2="96" stroke="#E5E7EB"/><line x1="16" y1="64" x2="232" y2="64" stroke="#F3F4F6"/><line x1="16" y1="32" x2="232" y2="32" stroke="#F3F4F6"/>
    <rect x="26" y="58" width="22" height="38" rx="3" fill="#BFDBFE"/><rect x="58" y="46" width="22" height="50" rx="3" fill="#BFDBFE"/><rect x="90" y="66" width="22" height="30" rx="3" fill="#BFDBFE"/><rect x="122" y="30" width="22" height="66" rx="3" fill="#0070FC"/><rect x="154" y="52" width="22" height="44" rx="3" fill="#BFDBFE"/><rect x="186" y="40" width="22" height="56" rx="3" fill="#BFDBFE"/>
  </svg></div><h4>Vertical bar</h4><p><b>Compare across categories.</b> Views by weekday — the peak day pops in accent.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Grouped bar chart">
    <line x1="16" y1="96" x2="232" y2="96" stroke="#E5E7EB"/><line x1="16" y1="56" x2="232" y2="56" stroke="#F3F4F6"/>
    <rect x="30" y="50" width="18" height="46" rx="3" fill="#0070FC"/><rect x="50" y="64" width="18" height="32" rx="3" fill="#BFDBFE"/>
    <rect x="98" y="38" width="18" height="58" rx="3" fill="#0070FC"/><rect x="118" y="56" width="18" height="40" rx="3" fill="#BFDBFE"/>
    <rect x="166" y="58" width="18" height="38" rx="3" fill="#0070FC"/><rect x="186" y="70" width="18" height="26" rx="3" fill="#BFDBFE"/>
  </svg></div><h4>Grouped bar</h4><p><b>Two measures per category.</b> This vs last period for each location.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Horizontal bar ranking chart">
    <rect x="70" y="14" width="150" height="13" rx="3" fill="#0070FC"/><rect x="70" y="36" width="120" height="13" rx="3" fill="#BFDBFE"/><rect x="70" y="58" width="96" height="13" rx="3" fill="#BFDBFE"/><rect x="70" y="80" width="64" height="13" rx="3" fill="#BFDBFE"/>
    <text x="64" y="24" text-anchor="end" font-family="Hanken Grotesk,sans-serif" font-size="9" fill="#6B7280">Emirates</text>
    <text x="64" y="46" text-anchor="end" font-family="Hanken Grotesk,sans-serif" font-size="9" fill="#9CA3AF">Yas Mall</text>
    <text x="64" y="68" text-anchor="end" font-family="Hanken Grotesk,sans-serif" font-size="9" fill="#9CA3AF">Marina</text>
    <text x="64" y="90" text-anchor="end" font-family="Hanken Grotesk,sans-serif" font-size="9" fill="#9CA3AF">Sharjah</text>
  </svg></div><h4>Horizontal bar</h4><p><b>Rank many items with long labels.</b> Top locations by reviews or views.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Bullet chart with target marker">
    <text x="16" y="30" font-family="Hanken Grotesk,sans-serif" font-size="10" fill="#6B7280">Listing accuracy</text>
    <rect x="16" y="40" width="208" height="14" rx="7" fill="#EEF1F6"/>
    <rect x="16" y="40" width="172" height="14" rx="7" fill="#0070FC"/>
    <line x1="196" y1="34" x2="196" y2="60" stroke="#0E0071" stroke-width="3"/>
    <text x="16" y="78" font-family="Hanken Grotesk,sans-serif" font-size="10" fill="#111827">82%</text>
    <text x="224" y="78" text-anchor="end" font-family="Hanken Grotesk,sans-serif" font-size="10" fill="#6B7280">target 90%</text>
  </svg></div><h4>Bullet</h4><p><b>Value against a target.</b> A KPI vs its goal — the tick marks the target.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Diverging bar chart">
    <line x1="120" y1="12" x2="120" y2="100" stroke="#E5E7EB"/>
    <rect x="120" y="18" width="74" height="12" rx="3" fill="#16A34A"/>
    <rect x="120" y="36" width="50" height="12" rx="3" fill="#16A34A"/>
    <rect x="92" y="54" width="28" height="12" rx="3" fill="#DC2626"/>
    <rect x="64" y="72" width="56" height="12" rx="3" fill="#DC2626"/>
  </svg></div><h4>Diverging bar</h4><p><b>Positive vs negative around a center.</b> Net sentiment or rank gains/losses by store.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Lollipop chart">
    <line x1="16" y1="96" x2="232" y2="96" stroke="#E5E7EB"/>
    <line x1="40" y1="96" x2="40" y2="64" stroke="#BFDBFE" stroke-width="2"/><circle cx="40" cy="64" r="5" fill="#BFDBFE"/>
    <line x1="90" y1="96" x2="90" y2="40" stroke="#0070FC" stroke-width="2"/><circle cx="90" cy="40" r="5" fill="#0070FC"/>
    <line x1="150" y1="96" x2="150" y2="56" stroke="#BFDBFE" stroke-width="2"/><circle cx="150" cy="56" r="5" fill="#BFDBFE"/>
    <line x1="206" y1="96" x2="206" y2="72" stroke="#BFDBFE" stroke-width="2"/><circle cx="206" cy="72" r="5" fill="#BFDBFE"/>
  </svg></div><h4>Lollipop</h4><p><b>Bar ranking, less ink.</b> Cleaner than bars when comparing many sparse categories.</p></div>

</div>

<h3>3 · Part-to-whole</h3>
<div class="chart-gallery">

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Donut chart of review sentiment">
    <g transform="translate(60,60)">
      <circle r="34" fill="none" stroke="#EEF1F6" stroke-width="12"/>
      <circle r="34" fill="none" stroke="#16A34A" stroke-width="12" stroke-dasharray="137 214" transform="rotate(-90)"/>
      <circle r="34" fill="none" stroke="#CA8A04" stroke-width="12" stroke-dasharray="47 214" stroke-dashoffset="-137" transform="rotate(-90)"/>
      <circle r="34" fill="none" stroke="#DC2626" stroke-width="12" stroke-dasharray="30 214" stroke-dashoffset="-184" transform="rotate(-90)"/>
      <text y="2" text-anchor="middle" font-family="Hanken Grotesk,sans-serif" font-size="15" font-weight="700" fill="#111827">64%</text>
      <text y="15" text-anchor="middle" font-family="Hanken Grotesk,sans-serif" font-size="7" fill="#6B7280">positive</text>
    </g>
    <g font-family="Hanken Grotesk,sans-serif" font-size="10" fill="#374151">
      <rect x="120" y="40" width="9" height="9" rx="2" fill="#16A34A"/><text x="134" y="48">Positive</text>
      <rect x="120" y="56" width="9" height="9" rx="2" fill="#CA8A04"/><text x="134" y="64">Neutral</text>
      <rect x="120" y="72" width="9" height="9" rx="2" fill="#DC2626"/><text x="134" y="80">Negative</text>
    </g>
  </svg></div><h4>Donut</h4><p><b>Part-to-whole, ≤4 slices.</b> Review sentiment split. The center holds the headline.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="100 percent stacked bar">
    <text x="16" y="34" font-family="Hanken Grotesk,sans-serif" font-size="10" fill="#6B7280">Sentiment</text>
    <rect x="16" y="44" width="138" height="18" fill="#16A34A"/>
    <rect x="156" y="44" width="44" height="18" fill="#CA8A04"/>
    <rect x="202" y="44" width="22" height="18" fill="#DC2626"/>
    <rect x="16" y="44" width="208" height="18" fill="none" stroke="#fff" stroke-width="0"/>
  </svg></div><h4>100% stacked bar</h4><p><b>Composition as percentages.</b> One full-width bar split into shares.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Stacked bar chart">
    <line x1="16" y1="96" x2="232" y2="96" stroke="#E5E7EB"/>
    <g><rect x="38" y="60" width="26" height="36" fill="#0070FC"/><rect x="38" y="44" width="26" height="16" fill="#BFDBFE"/></g>
    <g><rect x="100" y="52" width="26" height="44" fill="#0070FC"/><rect x="100" y="32" width="26" height="20" fill="#BFDBFE"/></g>
    <g><rect x="162" y="66" width="26" height="30" fill="#0070FC"/><rect x="162" y="50" width="26" height="16" fill="#BFDBFE"/></g>
  </svg></div><h4>Stacked bar</h4><p><b>Sub-totals within a total.</b> Calls vs chats per location, stacked.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Waffle chart">
    <g font-family="Hanken Grotesk,sans-serif">
      <rect x="20" y="20" width="14" height="14" rx="2" fill="#0070FC"/><rect x="38" y="20" width="14" height="14" rx="2" fill="#0070FC"/><rect x="56" y="20" width="14" height="14" rx="2" fill="#0070FC"/><rect x="74" y="20" width="14" height="14" rx="2" fill="#0070FC"/><rect x="92" y="20" width="14" height="14" rx="2" fill="#0070FC"/><rect x="110" y="20" width="14" height="14" rx="2" fill="#0070FC"/><rect x="128" y="20" width="14" height="14" rx="2" fill="#E5E7EB"/>
      <rect x="20" y="38" width="14" height="14" rx="2" fill="#0070FC"/><rect x="38" y="38" width="14" height="14" rx="2" fill="#0070FC"/><rect x="56" y="38" width="14" height="14" rx="2" fill="#0070FC"/><rect x="74" y="38" width="14" height="14" rx="2" fill="#0070FC"/><rect x="92" y="38" width="14" height="14" rx="2" fill="#0070FC"/><rect x="110" y="38" width="14" height="14" rx="2" fill="#E5E7EB"/><rect x="128" y="38" width="14" height="14" rx="2" fill="#E5E7EB"/>
      <rect x="20" y="56" width="14" height="14" rx="2" fill="#0070FC"/><rect x="38" y="56" width="14" height="14" rx="2" fill="#E5E7EB"/><rect x="56" y="56" width="14" height="14" rx="2" fill="#E5E7EB"/><rect x="74" y="56" width="14" height="14" rx="2" fill="#E5E7EB"/><rect x="92" y="56" width="14" height="14" rx="2" fill="#E5E7EB"/><rect x="110" y="56" width="14" height="14" rx="2" fill="#E5E7EB"/><rect x="128" y="56" width="14" height="14" rx="2" fill="#E5E7EB"/>
      <text x="156" y="46" font-size="20" font-weight="700" fill="#111827">64%</text>
    </g>
  </svg></div><h4>Waffle</h4><p><b>A friendlier percentage.</b> Verified vs unverified listings as a 100-square grid.</p></div>

</div>

<h3>4 · Single value &amp; progress</h3>
<div class="chart-gallery">

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Radial progress ring, Presence Score 78">
    <defs><linearGradient id="ring1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0E0071"/><stop offset="1" stop-color="#0070FC"/></linearGradient></defs>
    <g transform="translate(120,62)">
      <circle r="40" fill="none" stroke="#EEF1F6" stroke-width="11"/>
      <circle r="40" fill="none" stroke="url(#ring1)" stroke-width="11" stroke-linecap="round" stroke-dasharray="196 251" transform="rotate(-90)"/>
      <text y="2" text-anchor="middle" font-family="Hanken Grotesk,sans-serif" font-size="26" font-weight="700" fill="#111827">78</text>
      <text y="18" text-anchor="middle" font-family="Hanken Grotesk,sans-serif" font-size="9" fill="#6B7280">of 100</text>
    </g>
  </svg></div><h4>Progress ring</h4><p><b>Single score toward a goal.</b> The Presence Score — gradient stroke, text equivalent always shown.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Half gauge">
    <g transform="translate(120,82)">
      <path d="M -70 0 A 70 70 0 0 1 70 0" fill="none" stroke="#EEF1F6" stroke-width="12" stroke-linecap="round"/>
      <path d="M -70 0 A 70 70 0 0 1 44 -54" fill="none" stroke="#16A34A" stroke-width="12" stroke-linecap="round"/>
      <text y="-12" text-anchor="middle" font-family="Hanken Grotesk,sans-serif" font-size="22" font-weight="700" fill="#111827">4.6</text>
      <text y="4" text-anchor="middle" font-family="Hanken Grotesk,sans-serif" font-size="9" fill="#6B7280">avg rating</text>
    </g>
  </svg></div><h4>Gauge</h4><p><b>Value on a bounded range.</b> Average rating or health on a good/bad arc.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Linear progress bars">
    <g font-family="Hanken Grotesk,sans-serif" font-size="9" fill="#6B7280">
      <text x="16" y="26">Listing accuracy</text><rect x="16" y="30" width="208" height="8" rx="4" fill="#EEF1F6"/><rect x="16" y="30" width="191" height="8" rx="4" fill="#16A34A"/>
      <text x="16" y="58">Response rate</text><rect x="16" y="62" width="208" height="8" rx="4" fill="#EEF1F6"/><rect x="16" y="62" width="141" height="8" rx="4" fill="#0070FC"/>
      <text x="16" y="90">Completeness</text><rect x="16" y="94" width="208" height="8" rx="4" fill="#EEF1F6"/><rect x="16" y="94" width="94" height="8" rx="4" fill="#CA8A04"/>
    </g>
  </svg></div><h4>Linear progress</h4><p><b>Several completions at a glance.</b> Sub-scores feeding the Presence Score, colored by health.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="KPI with delta and mini bars">
    <text x="16" y="32" font-family="Hanken Grotesk,sans-serif" font-size="11" fill="#6B7280">New reviews</text>
    <text x="16" y="62" font-family="Hanken Grotesk,sans-serif" font-size="28" font-weight="700" fill="#111827">348</text>
    <rect x="16" y="74" width="58" height="18" rx="9" fill="#F0FDF4"/>
    <text x="45" y="87" text-anchor="middle" font-family="Hanken Grotesk,sans-serif" font-size="11" font-weight="600" fill="#16A34A">&#9650; 12%</text>
    <g fill="#BFDBFE"><rect x="150" y="62" width="9" height="30" rx="2"/><rect x="164" y="52" width="9" height="40" rx="2"/><rect x="178" y="44" width="9" height="48" rx="2"/><rect x="192" y="36" width="9" height="56" rx="2"/><rect x="206" y="28" width="9" height="64" rx="2" fill="#0070FC"/></g>
  </svg></div><h4>KPI + delta</h4><p><b>Headline number with context.</b> Big tabular value, a trend chip, and a mini bar history.</p></div>

</div>

<h3>5 · Distribution &amp; relationship</h3>
<div class="chart-gallery">

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Histogram">
    <line x1="16" y1="96" x2="232" y2="96" stroke="#E5E7EB"/>
    <g fill="#0070FC"><rect x="24" y="78" width="24" height="18"/><rect x="50" y="64" width="24" height="32"/><rect x="76" y="40" width="24" height="56"/><rect x="102" y="30" width="24" height="66"/><rect x="128" y="50" width="24" height="46"/><rect x="154" y="68" width="24" height="28"/><rect x="180" y="82" width="24" height="14"/></g>
  </svg></div><h4>Histogram</h4><p><b>Shape of a distribution.</b> How review ratings or response times spread (bars touch — it's continuous).</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Scatter plot">
    <line x1="22" y1="96" x2="232" y2="96" stroke="#E5E7EB"/><line x1="22" y1="12" x2="22" y2="96" stroke="#E5E7EB"/>
    <g fill="#0070FC" opacity="0.85"><circle cx="48" cy="78" r="4"/><circle cx="70" cy="64" r="4"/><circle cx="96" cy="70" r="4"/><circle cx="120" cy="52" r="4"/><circle cx="138" cy="58" r="4"/><circle cx="162" cy="40" r="4"/><circle cx="186" cy="46" r="4"/><circle cx="206" cy="30" r="4"/></g>
  </svg></div><h4>Scatter</h4><p><b>Relationship between two metrics.</b> Reviews vs rating per location — spot outliers.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Bubble chart">
    <line x1="22" y1="96" x2="232" y2="96" stroke="#E5E7EB"/><line x1="22" y1="12" x2="22" y2="96" stroke="#E5E7EB"/>
    <g fill="#0070FC" opacity="0.7"><circle cx="60" cy="72" r="6"/><circle cx="104" cy="56" r="12"/><circle cx="150" cy="64" r="8"/><circle cx="190" cy="40" r="16"/></g>
  </svg></div><h4>Bubble</h4><p><b>Three dimensions at once.</b> Add a size axis — e.g. views (x), rating (y), revenue (size).</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Heatmap of activity by day and hour">
    <g>
      <rect x="40" y="20" width="22" height="16" rx="2" fill="#DBEAFE"/><rect x="64" y="20" width="22" height="16" rx="2" fill="#93C5FD"/><rect x="88" y="20" width="22" height="16" rx="2" fill="#0070FC"/><rect x="112" y="20" width="22" height="16" rx="2" fill="#60A5FA"/><rect x="136" y="20" width="22" height="16" rx="2" fill="#DBEAFE"/><rect x="160" y="20" width="22" height="16" rx="2" fill="#BFDBFE"/><rect x="184" y="20" width="22" height="16" rx="2" fill="#93C5FD"/>
      <rect x="40" y="40" width="22" height="16" rx="2" fill="#93C5FD"/><rect x="64" y="40" width="22" height="16" rx="2" fill="#0070FC"/><rect x="88" y="40" width="22" height="16" rx="2" fill="#0E0071"/><rect x="112" y="40" width="22" height="16" rx="2" fill="#0070FC"/><rect x="136" y="40" width="22" height="16" rx="2" fill="#60A5FA"/><rect x="160" y="40" width="22" height="16" rx="2" fill="#DBEAFE"/><rect x="184" y="40" width="22" height="16" rx="2" fill="#BFDBFE"/>
      <rect x="40" y="60" width="22" height="16" rx="2" fill="#DBEAFE"/><rect x="64" y="60" width="22" height="16" rx="2" fill="#BFDBFE"/><rect x="88" y="60" width="22" height="16" rx="2" fill="#60A5FA"/><rect x="112" y="60" width="22" height="16" rx="2" fill="#93C5FD"/><rect x="136" y="60" width="22" height="16" rx="2" fill="#DBEAFE"/><rect x="160" y="60" width="22" height="16" rx="2" fill="#EFF6FF"/><rect x="184" y="60" width="22" height="16" rx="2" fill="#DBEAFE"/>
    </g>
  </svg></div><h4>Heatmap</h4><p><b>Density across two categories.</b> Calls or visits by day-of-week × hour to find peak windows.</p></div>

</div>

<h3>6 · Specialized (hyperlocal)</h3>
<div class="chart-gallery">

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Funnel chart of the lead journey">
    <polygon points="20,18 220,18 196,38 44,38" fill="#0E0071"/>
    <polygon points="48,42 192,42 172,62 68,62" fill="#0070FC"/>
    <polygon points="72,66 168,66 150,86 90,86" fill="#60A5FA"/>
    <polygon points="94,90 146,90 132,106 108,106" fill="#BFDBFE"/>
  </svg></div><h4>Funnel</h4><p><b>Stage-by-stage drop-off.</b> Impressions → clicks → calls → store visits.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Combo bar and line chart">
    <line x1="16" y1="96" x2="232" y2="96" stroke="#E5E7EB"/><line x1="16" y1="56" x2="232" y2="56" stroke="#F3F4F6"/>
    <g fill="#BFDBFE"><rect x="30" y="62" width="20" height="34" rx="3"/><rect x="70" y="52" width="20" height="44" rx="3"/><rect x="110" y="66" width="20" height="30" rx="3"/><rect x="150" y="46" width="20" height="50" rx="3"/><rect x="190" y="58" width="20" height="38" rx="3"/></g>
    <polyline points="40,70 80,58 120,62 160,40 200,34" fill="none" stroke="#0070FC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg></div><h4>Combo (bar + line)</h4><p><b>Volume and a rate together.</b> Review count (bars) with average rating (line).</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Local pack rank grid">
    <g font-family="Hanken Grotesk,sans-serif" font-size="11" font-weight="700" text-anchor="middle">
      <rect x="78" y="14" width="26" height="26" rx="5" fill="#16A34A"/><text x="91" y="31" fill="#fff">1</text>
      <rect x="108" y="14" width="26" height="26" rx="5" fill="#EEF1F6"/><text x="121" y="31" fill="#9CA3AF">2</text>
      <rect x="138" y="14" width="26" height="26" rx="5" fill="#EEF1F6"/><text x="151" y="31" fill="#9CA3AF">3</text>
      <rect x="78" y="44" width="26" height="26" rx="5" fill="#EEF1F6"/><text x="91" y="61" fill="#9CA3AF">4</text>
      <rect x="108" y="44" width="26" height="26" rx="5" fill="#0070FC"/><text x="121" y="61" fill="#fff">5</text>
      <rect x="138" y="44" width="26" height="26" rx="5" fill="#EEF1F6"/><text x="151" y="61" fill="#9CA3AF">6</text>
      <rect x="78" y="74" width="26" height="26" rx="5" fill="#EEF1F6"/><text x="91" y="91" fill="#9CA3AF">7</text>
      <rect x="108" y="74" width="26" height="26" rx="5" fill="#EEF1F6"/><text x="121" y="91" fill="#9CA3AF">8</text>
      <rect x="138" y="74" width="26" height="26" rx="5" fill="#EEF1F6"/><text x="151" y="91" fill="#9CA3AF">9</text>
    </g>
  </svg></div><h4>Rank grid</h4><p><b>Position in the local pack.</b> Your spot in the Google 3-pack / map grid by keyword.</p></div>

  <div class="chart-card"><div class="frame"><svg viewBox="0 0 240 120" role="img" aria-label="Rating distribution bars">
    <g font-family="Hanken Grotesk,sans-serif" font-size="9" fill="#6B7280">
      <text x="16" y="24">5&#9733;</text><rect x="34" y="17" width="190" height="8" rx="4" fill="#EEF1F6"/><rect x="34" y="17" width="150" height="8" rx="4" fill="#F59E0B"/>
      <text x="16" y="42">4&#9733;</text><rect x="34" y="35" width="190" height="8" rx="4" fill="#EEF1F6"/><rect x="34" y="35" width="70" height="8" rx="4" fill="#F59E0B"/>
      <text x="16" y="60">3&#9733;</text><rect x="34" y="53" width="190" height="8" rx="4" fill="#EEF1F6"/><rect x="34" y="53" width="34" height="8" rx="4" fill="#F59E0B"/>
      <text x="16" y="78">2&#9733;</text><rect x="34" y="71" width="190" height="8" rx="4" fill="#EEF1F6"/><rect x="34" y="71" width="16" height="8" rx="4" fill="#F59E0B"/>
      <text x="16" y="96">1&#9733;</text><rect x="34" y="89" width="190" height="8" rx="4" fill="#EEF1F6"/><rect x="34" y="89" width="9" height="8" rx="4" fill="#F59E0B"/>
    </g>
  </svg></div><h4>Rating distribution</h4><p><b>Star breakdown.</b> The 5★→1★ spread — amber is allowed here because the row label carries the meaning.</p></div>

</div>

<h3>Anatomy</h3>
<ul>
<li>Horizontal-only gridlines (<code>#F3F4F6</code>); a slightly stronger zero baseline (<code>#E5E7EB</code>). No vertical or minor gridlines, no plot box.</li>
<li>Ticks in <code>#9CA3AF</code>, tabular, abbreviated (<code>42.1K</code>); full value in the tooltip.</li>
<li>Bars: 3–4px top radius, ~40% gap. Lines: 2.5px accent, round joins, optional area gradient 18%→0%, end-point dot. Donuts: ~6px ring, white separators, headline in the hole.</li>
<li>Legends only when &gt;1 series; small square swatch + label; never the sole channel.</li>
</ul>

<h3>When NOT to use a chart</h3>
<div class="do-dont">
  <div class="dd dd--do"><h4>Reach for</h4><ul><li>A single big number when there's one value</li><li>A table when exact figures matter</li><li>A sparkline when only the shape matters</li><li>A bar over a pie for &gt;4 categories</li></ul></div>
  <div class="dd dd--dont"><h4>Avoid</h4><ul><li>Pies / donuts with &gt;4 slices</li><li>Dual Y-axes (usually misleading)</li><li>3D, shadows, or decorative gradients</li><li>Radar charts for &gt;4 axes</li><li>Truncated (non-zero) bar axes</li></ul></div>
</div>

<h3>Accessible charts (required)</h3>
<ul>
<li><code>role="img"</code> + a label stating the <em>insight</em> — "Line chart: search rank improved from 8.2 to 4.1 over 30 days", not just the type.</li>
<li><strong>Always pair a data table</strong> (visible or toggle-revealed) — the single most important chart-a11y move.</li>
<li>Tooltip carries exact values + comparison; reachable on focus, dismiss on Esc. Series meet 3:1 contrast and never rely on hue alone.</li>
<li>Don't animate chart entrances under reduced-motion; if you do, keep it ≤600ms, once, and never required to read the data.</li>
</ul>

<h3>KPIs &amp; trend chips</h3>
<p>Big tabular number + label + time context. Trend chip = arrow + sign + percent, green-up / red-down but semantic-aware (rising negative reviews is red). A number with no "vs what" is hard to judge — always show comparison context where history exists.</p>
`
}, /* ─────────────── INTERNATIONALIZATION ─────────────── */
{
  id: "i18n",
  name: "Internationalization",
  desc: "SingleInterface ships in English, Arabic (RTL), Hindi, Vietnamese and more. Build for translation and mirroring from day one — retrofitting RTL into a finished screen is brutal.",
  doc: "docs/internationalization.md",
  html: `
<h2>Principles</h2>
<p>Externalize every string. Design for expansion (translations run 30–40% longer). Mirror for RTL. Localize data, not just words. Write source copy that survives translation.</p>

<h3>Strings</h3>
<ul>
<li><strong>Keys, not concatenation</strong> — word order differs by language. Use templated placeholders: <code>"You have {count} new reviews"</code>, never <code>"You have " + count + " reviews"</code>.</li>
<li><strong>ICU plurals</strong> (Arabic has 6 forms): <code>{count, plural, one {# review} other {# reviews}}</code>.</li>
<li>Don't translate brand/proper nouns (SingleInterface, Google, module names). Give translators context comments and character limits.</li>
</ul>

<h3>Layout for variable text</h3>
<ul>
<li>Never fix the width/height of text containers — use <code>min-*</code> and allow wrapping. Buttons, tabs, chips, and nav items expand with their label.</li>
<li>Test at <strong>+40%</strong> (or pseudo-localize) before real translations exist; ellipsize with a tooltip only when truncation is unavoidable.</li>
</ul>

<h3>RTL — Arabic, Hebrew, Urdu</h3>
<p>RTL is real and tested. Set <code>dir="rtl"</code> and use <strong>CSS logical properties</strong> (<code>margin-inline-start</code>, <code>inset-inline-start</code>, <code>text-align:start</code>) so layout flips automatically.</p>
<div class="do-dont">
  <div class="dd dd--do"><h4>Mirror</h4><ul><li>Page flow; sidebar moves to the right</li><li>Text alignment, lists, tables, forms</li><li>Directional icons — back/forward chevrons, breadcrumb separators, send</li><li>Steppers, sliders, timelines (right→left)</li></ul></div>
  <div class="dd dd--dont"><h4>Do NOT mirror</h4><ul><li>Logos & brand marks (the SI mark)</li><li>Media / photos</li><li>Numbers, clocks, chart numeric axes</li><li>Phone numbers, code, URLs, email</li></ul></div>
</div>
<p>Use <code>dir="auto"</code> on user-generated content (reviews) so each renders in its own script direction, and handle bidi runs (an English brand name inside Arabic UI).</p>

<h3>Localize the data</h3>
<table>
<thead><tr><th>Data</th><th>How</th></tr></thead>
<tbody>
<tr><td>Numbers</td><td>Indian <code>4,70,280</code> vs Western <code>470,280</code> — <code>Intl.NumberFormat</code></td></tr>
<tr><td>Currency</td><td>symbol, code, placement, decimals per locale (₹ · AED · $)</td></tr>
<tr><td>Dates</td><td><code>Intl.DateTimeFormat</code> — never ambiguous <code>03/04</code></td></tr>
<tr><td>Calendars</td><td>respect first-day-of-week & Fri–Sat weekends</td></tr>
</tbody></table>

<h3>Fonts & scripts</h3>
<p>Hanken Grotesk covers Latin; define per-script fallbacks for Arabic, Devanagari, Vietnamese diacritics, and CJK so missing glyphs don't tofu. Increase line-height for Arabic/Devanagari; never embed text in images. Missing translations fall back to English, never a raw key.</p>
`
}, /* ─────────────── INCLUSIVE DESIGN ─────────────── */
{
  id: "inclusive",
  name: "Inclusive Design",
  desc: "Build so the widest range of people can use the product well — across ability, language, device, network, and expertise. Accessibility is the measurable floor; this is the broader mindset. Solve for one, extend to many.",
  doc: "docs/inclusive-design.md",
  html: `
<h2>Principles</h2>
<ul>
<li><strong>Recognize exclusion.</strong> Every decision includes or excludes someone — ask "who does this leave out?"</li>
<li><strong>Solve for one, extend to many.</strong> Designing for a screen-reader or one-handed user helps everyone (keyboard power-users, people on a train).</li>
<li><strong>Design for the spectrum.</strong> Disability is often situational and temporary, not just permanent.</li>
</ul>

<h3>The disability spectrum</h3>
<p>The same accommodation serves all three columns — which is why inclusive design pays for itself.</p>
<table>
<thead><tr><th>Ability</th><th>Permanent</th><th>Temporary</th><th>Situational</th></tr></thead>
<tbody>
<tr><td>Vision</td><td>low vision</td><td>eye dilation</td><td>bright sun on a store floor</td></tr>
<tr><td>Motor</td><td>tremor</td><td>broken arm</td><td>one hand on the till</td></tr>
<tr><td>Hearing</td><td>deaf</td><td>ear infection</td><td>loud retail floor</td></tr>
<tr><td>Cognitive</td><td>dyslexia, ADHD</td><td>migraine</td><td>stress, second language</td></tr>
</tbody></table>

<h3>Cognitive clarity</h3>
<p>Enterprise users are busy, multitasking, sometimes new. Reduce load:</p>
<ul>
<li>Plain language, the point first; define jargon inline.</li>
<li>Consistency — the same component behaves identically everywhere, so users learn once.</li>
<li>Chunk & structure with headings and progressive disclosure (accordions, "show more").</li>
<li>Forgiving by design — confirm/undo for destructive actions, autosave drafts (a half-written review reply survives a timeout).</li>
<li>One primary action per screen; recognition over recall.</li>
</ul>

<h3>Don't assume the user</h3>
<table>
<thead><tr><th>Avoid assuming</th><th>Inclusive stance</th></tr></thead>
<tbody>
<tr><td>Reads English fluently</td><td>translatable copy, localization, RTL</td></tr>
<tr><td>Fast device / network</td><td>works on mid-range Android & slow 3G; skeletons; degrade gracefully</td></tr>
<tr><td>Mouse on a big screen</td><td>full keyboard, touch, 44px targets, 320px reflow</td></tr>
<tr><td>Is an expert</td><td>first-run guidance, empty-state direction, sensible defaults</td></tr>
<tr><td>"Standard" name/gender</td><td>flexible fields, no gendered defaults, locale-aware shapes</td></tr>
</tbody></table>

<h3>Performance is access</h3>
<p>A heavy app excludes people on cheaper devices and slower networks — a large share of our APAC/India/MEA users. Fast first render, progressive loading, graceful offline (cached data labeled stale, queued actions), and no requirement for the latest hardware. Accessibility is part of "done", tested with a real range of people — not a separate "accessibility mode".</p>
`
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ds-data.js", error: String((e && e.message) || e) }); }

// ds-mobile-data.js
try { (() => {
/* ============================================================
 * SingleInterface Design System — MOBILE portal data
 * Drives the Mobile platform in design-system.html.
 * Code output is React Native (Expo-compatible).
 * Foundations are SHARED with web (same brand tokens); the
 * mobile layer re-scales type/spacing and adds native patterns.
 * ============================================================ */
window.DS_MOBILE_META = {
  name: "SingleInterface",
  tagline: "Mobile Design System",
  version: "v1.0"
};
window.DS_MOBILE_GROUPS = [{
  id: "start",
  label: "Get started"
}, {
  id: "Foundations",
  label: "Foundations"
}, {
  id: "Components",
  label: "Components"
}, {
  id: "Guidelines",
  label: "Guidelines"
}];

/* Shared tokens module referenced by every RN snippet below. */
const RN_TOKENS = `// theme/tokens.ts — the single source for the React Native app.
// Mirrors colors_and_type.css + mobile_tokens.css so web & mobile stay in sync.
export const color = {
  primaryDeep: '#0E0071', primaryAccent: '#0070FC', primaryHover: '#0A0054',
  surfaceBase: '#F9FAFD', surfaceElevated: '#FFFFFF',
  borderDefault: '#E5E7EB', borderSubtle: '#F3F4F6',
  textPrimary: '#111827', textSecondary: '#374151', textTertiary: '#6B7280',
  success: '#16A34A', successBg: '#F0FDF4',
  warning: '#CA8A04', warningBg: '#FEFCE8',
  error:   '#DC2626', errorBg:   '#FEF2F2',
  info:    '#1D4ED8', infoBg:    '#EFF6FF',
  starAmber: '#F59E0B',
};
export const aiGradient = ['#0E0071', '#0070FC']; // expo-linear-gradient

export const type = {                 // iOS-flavored scale
  largeTitle: 32, title1: 28, title2: 22, title3: 18,
  headline: 16, body: 15, callout: 14, subhead: 13, footnote: 12, caption: 11,
};
export const font = { regular: 'HankenGrotesk-Regular', medium: 'HankenGrotesk-Medium',
  semibold: 'HankenGrotesk-SemiBold', bold: 'HankenGrotesk-Bold' };

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24 }; // 4px grid
export const gutter = 16;             // page padding (web uses 24)
export const radius = { input: 10, card: 14, sheet: 20, full: 9999 };
export const touch = { min: 44, comfy: 48, large: 56 }; // hit-area minimums

export const shadowCard = {           // blue-tinted elevation (brand signature)
  shadowColor: '#0070FC', shadowOpacity: 0.10, shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 }, elevation: 2,
};`;
window.DS_MOBILE_ENTRIES = [/* ───────── GET STARTED ───────── */
{
  id: "m-overview",
  group: "start",
  name: "Overview",
  kind: "overview",
  desc: "The mobile face of SingleInterface — the on-the-go companion to the web console. Same brand DNA (deep indigo, electric blue, Hanken Grotesk, blue-tinted elevation), re-expressed with native patterns: a bottom tab bar, bottom sheets, a thumb-reachable FAB, and 44pt touch targets. Code output is React Native."
}, {
  id: "m-install",
  group: "start",
  name: "Installation",
  kind: "doc",
  desc: "Drop in the shared tokens module and the Hanken Grotesk font, then build with React Native primitives. Every snippet in this section imports from theme/tokens.ts.",
  react: RN_TOKENS
}, /* ───────── FOUNDATIONS ───────── */
{
  id: "m-color",
  group: "Foundations",
  name: "Color",
  file: "preview/colors-brand.html",
  previewH: 360,
  desc: "Color is 100% shared with web — same brand, surface, semantic, and AI-gradient values, so a screen reads as the same product across platforms. On mobile the page background is the blue-tinted --si-surface-base, cards are pure white, and the AI gradient (expo-linear-gradient) is reserved for AI surfaces, the center tab, and the AI FAB.",
  react: `import { color, aiGradient } from '../theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';

// Brand surface
<View style={{ flex: 1, backgroundColor: color.surfaceBase }} />

// AI surface — gradient ONLY here, never on a generic button
<LinearGradient colors={aiGradient} start={{x:0,y:0}} end={{x:1,y:0}}
  style={{ borderRadius: 14, padding: 16 }}>
  <Text style={{ color: '#fff' }}>Ask AI</Text>
</LinearGradient>`
}, {
  id: "m-typography",
  group: "Foundations",
  name: "Typography",
  file: "preview_mobile/type-scale-mobile.html",
  previewH: 460,
  desc: "Hanken Grotesk, re-scaled for a 390px viewport: a 10-step iOS-flavored ramp from Large Title (32) down to Caption (11, tab labels only). Tabular numerics stay on. Body never below 12pt. Support Dynamic Type by scaling from these base sizes.",
  react: `import { StyleSheet, Text } from 'react-native';
import { type, font, color } from '../theme/tokens';

export const text = StyleSheet.create({
  largeTitle: { fontFamily: font.bold, fontSize: type.largeTitle, letterSpacing: -0.5, color: color.textPrimary },
  title1:     { fontFamily: font.bold, fontSize: type.title1, color: color.textPrimary },
  title3:     { fontFamily: font.semibold, fontSize: type.title3, color: color.textPrimary },
  headline:   { fontFamily: font.semibold, fontSize: type.headline, color: color.textPrimary },
  body:       { fontFamily: font.regular, fontSize: type.body, lineHeight: 22, color: color.textSecondary },
  caption:    { fontFamily: font.medium, fontSize: type.caption, color: color.textTertiary },
  tabular:    { fontVariant: ['tabular-nums'] },
});

// <Text style={text.title1}>Reviews</Text>
// <Text style={[text.headline, text.tabular]}>4,70,280</Text>`
}, {
  id: "m-spacing",
  group: "Foundations",
  name: "Spacing & layout",
  file: "preview_mobile/spacing-mobile.html",
  previewH: 340,
  desc: "4px base grid, denser than web: 16px page gutters (web uses 24), 12px default gap between cards, 24px between sections. Always pad for the device safe areas (notch, home indicator) — never let content sit under the status bar or tab bar.",
  react: `import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { gutter, space } from '../theme/tokens';

function Screen({ children }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingHorizontal: gutter,
      paddingTop: insets.top, paddingBottom: insets.bottom + space[3] }}>
      {children}
    </View>
  );
}`
}, {
  id: "m-touch",
  group: "Foundations",
  name: "Touch targets",
  file: "preview_mobile/touch-targets.html",
  previewH: 320,
  desc: "Three tiers: 44pt minimum hit-area on every interactive element (Apple HIG / Material), 48pt for primary CTAs and key rows, 56pt for the FAB and tab bar. Pad the tap target — don't enlarge the glyph. Keep ≥8pt between adjacent targets.",
  react: `import { Pressable } from 'react-native';
import { touch } from '../theme/tokens';

// A 20px icon with a full 44pt hit-area (pad, don't grow the glyph)
<Pressable hitSlop={12}
  style={{ minWidth: touch.min, minHeight: touch.min,
           alignItems: 'center', justifyContent: 'center' }}>
  <Icon name="bell" size={20} />
</Pressable>`
}, {
  id: "m-radius",
  group: "Foundations",
  name: "Radius & elevation",
  file: "preview_mobile/cards-mobile.html",
  previewH: 300,
  desc: "Slightly rounder than web: inputs 10, cards 14, bottom-sheet top corners 20, pills/avatars full. Elevation is the brand-distinctive blue-tinted shadow (--m-shadow-card) — softer and more directional than web. On Android, pair shadowColor with elevation.",
  react: `import { radius, shadowCard, color } from '../theme/tokens';

export const card = {
  backgroundColor: color.surfaceElevated,
  borderRadius: radius.card,   // 14
  padding: 16,
  ...shadowCard,               // blue-tinted, iOS + Android
};
// Bottom sheet: borderTopLeftRadius / borderTopRightRadius = radius.sheet (20)`
}, {
  id: "m-icons",
  group: "Foundations",
  name: "Iconography",
  file: "preview/iconography.html",
  previewH: 320,
  desc: "Lucide (via lucide-react-native), flat stroke, shared with web. Mobile default sizes: body 16, row/button 18–20, tab bar 24. Stars are always amber and decorative (the numeric rating carries meaning). No emoji in product UI except locale flags.",
  react: `import { Star, MapPin, Bell } from 'lucide-react-native';
import { color } from '../theme/tokens';

<Star size={18} color={color.starAmber} fill={color.starAmber} />
<Bell size={24} color={color.textTertiary} />   {/* tab bar */}`
}, /* ───────── COMPONENTS ───────── */
{
  id: "m-buttons",
  group: "Components",
  name: "Buttons",
  file: "preview_mobile/buttons-mobile.html",
  previewH: 340,
  desc: "Full-width 48–52pt primary CTA pinned near the thumb; inline 36pt secondary actions. Primary is solid accent; secondary is white + border; the AI action uses the gradient. Press feedback scales to ~0.98. One primary action per screen.",
  usage: {
    do: ["Full-width primary near the bottom (thumb zone)", "≥48pt height; scale to 0.98 on press", "Gradient only for the AI action"],
    dont: ["Tiny inline buttons as the main CTA", "Two solid-accent buttons competing", "Gradient on a generic button"]
  },
  react: `import { Pressable, Text, StyleSheet } from 'react-native';
import { color, radius, font, touch } from '../theme/tokens';

export function Button({ label, variant = 'primary', onPress }) {
  return (
    <Pressable onPress={onPress}
      style={({ pressed }) => [
        s.base, s[variant],
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
      ]}>
      <Text style={[s.label, variant === 'secondary' && { color: color.primaryAccent }]}>
        {label}
      </Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  base: { height: touch.comfy, borderRadius: radius.input, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  primary: { backgroundColor: color.primaryAccent },
  secondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: color.borderDefault },
  label: { fontFamily: font.semibold, fontSize: 16, color: '#fff' },
});`
}, {
  id: "m-inputs",
  group: "Components",
  name: "Inputs",
  file: "preview_mobile/inputs-mobile.html",
  previewH: 380,
  desc: "44pt height (meets touch-min), 10px radius, persistent label above the field, accent focus ring. Use the right keyboardType and returnKeyType; show errors inline with the fix. Never rely on a placeholder as the label.",
  react: `import { View, Text, TextInput, StyleSheet } from 'react-native';
import { color, radius, font, touch } from '../theme/tokens';

export function Field({ label, hint, error, ...props }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholderTextColor={color.textTertiary}
        style={[s.input, focused && s.focused, !!error && s.invalid]}
        accessibilityLabel={label} {...props} />
      {error
        ? <Text style={[s.hint, { color: color.error }]}>{error}</Text>
        : !!hint && <Text style={s.hint}>{hint}</Text>}
    </View>
  );
}
const s = StyleSheet.create({
  label: { fontFamily: font.semibold, fontSize: 14, color: color.textPrimary },
  input: { height: touch.min, borderRadius: radius.input, borderWidth: 1,
    borderColor: color.borderDefault, paddingHorizontal: 12, fontSize: 15, color: color.textPrimary },
  focused: { borderColor: color.primaryAccent },
  invalid: { borderColor: color.error },
  hint: { fontSize: 13, color: color.textTertiary },
});`
}, {
  id: "m-search",
  group: "Components",
  name: "Search field",
  file: "preview_mobile/search-field.html",
  previewH: 360,
  desc: "A 44pt pill search with a leading icon, a clear (✕) button when filled, and a Cancel affordance on focus. Shows recents and live suggestions (matched substring bolded) in a card below.",
  react: `import { View, TextInput, Pressable, Text } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { color, radius, font } from '../theme/tokens';

export function SearchField({ value, onChange, onCancel }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, height: 44,
        paddingHorizontal: 14, backgroundColor: '#fff', borderRadius: radius.full,
        borderWidth: 1, borderColor: focused ? color.primaryAccent : color.borderDefault }}>
        <Search size={18} color={color.textTertiary} />
        <TextInput value={value} onChangeText={onChange} placeholder="Search locations, reviews…"
          placeholderTextColor={color.textTertiary} returnKeyType="search"
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, fontSize: 15, fontFamily: font.regular, color: color.textPrimary }} />
        {!!value && (
          <Pressable onPress={() => onChange('')} hitSlop={8}
            accessibilityLabel="Clear search"
            style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: color.borderSubtle,
              alignItems: 'center', justifyContent: 'center' }}>
            <X size={13} color={color.textTertiary} />
          </Pressable>
        )}
      </View>
      {focused && (
        <Pressable onPress={onCancel} hitSlop={8}>
          <Text style={{ color: color.primaryAccent, fontFamily: font.semibold, fontSize: 15 }}>Cancel</Text>
        </Pressable>
      )}
    </View>
  );
}`
}, {
  id: "m-chips",
  group: "Components",
  name: "Chips",
  file: "preview_mobile/chips-mobile.html",
  previewH: 280,
  desc: "32pt pill filter chips in a horizontal scroll row. Active = solid accent + white; idle = white + border. Chips are toggles, not buttons — keep a ≥44pt hit-area even though the visible pill is 32.",
  react: `import { Pressable, Text } from 'react-native';
import { color, radius, font } from '../theme/tokens';

export function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={8}
      style={{ height: 32, paddingHorizontal: 14, borderRadius: radius.full,
        alignItems: 'center', justifyContent: 'center', borderWidth: 1,
        backgroundColor: active ? color.primaryAccent : '#fff',
        borderColor: active ? color.primaryAccent : color.borderDefault }}>
      <Text style={{ fontFamily: font.medium, fontSize: 13,
        color: active ? '#fff' : color.textSecondary }}>{label}</Text>
    </Pressable>
  );
}`
}, {
  id: "m-segmented",
  group: "Components",
  name: "Segmented control",
  file: "preview_mobile/segmented-control.html",
  previewH: 260,
  desc: "An iOS-style segmented control for ≤3 short, mutually-exclusive options (Today / Week / Month). A pill thumb slides under the active segment. Use for view switching, not navigation.",
  react: `import { View, Pressable, Text } from 'react-native';
import { color, radius, font } from '../theme/tokens';

export function Segmented({ options, value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: color.borderSubtle,
      borderRadius: radius.input, padding: 3 }}>
      {options.map(opt => {
        const active = opt === value;
        return (
          <Pressable key={opt} onPress={() => onChange(opt)}
            accessibilityRole="tab" accessibilityState={{ selected: active }}
            style={{ flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radius.input - 3,
              backgroundColor: active ? '#fff' : 'transparent' }}>
            <Text style={{ fontFamily: active ? font.semibold : font.medium, fontSize: 14,
              color: active ? color.primaryAccent : color.textTertiary }}>{opt}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}`
}, {
  id: "m-date-picker",
  group: "Components",
  name: "Date & range picker",
  file: "preview_mobile/date-picker-mobile.html",
  previewH: 440,
  desc: "Opens in a bottom sheet: a horizontal row of preset chips above a full-width calendar for a custom range, with an Apply CTA showing the resolved dates. The core date control for every mobile analytics view.",
  usage: {
    do: ["Open in a bottom sheet; presets as a scroll chip row", "Full-width calendar; 44pt day targets", "Apply button shows the resolved range"],
    dont: ["Cram a calendar into a tiny popover", "Require typing a date"]
  },
  react: `import DateTimePicker from '@react-native-community/datetimepicker'; // native single-date
// For a range, render presets + a calendar grid inside a bottom sheet:
import { View, Pressable, Text, FlatList } from 'react-native';
import { color, radius, font } from '../theme/tokens';

const PRESETS = ['Today', '7 days', '30 days', 'This month', 'Custom'];

function PresetChips({ value, onChange }) {
  return (
    <FlatList horizontal showsHorizontalScrollIndicator={false} data={PRESETS}
      keyExtractor={p => p} contentContainerStyle={{ gap: 8 }}
      renderItem={({ item }) => {
        const active = item === value;
        return (
          <Pressable onPress={() => onChange(item)}
            style={{ height: 34, paddingHorizontal: 14, borderRadius: radius.full,
              alignItems: 'center', justifyContent: 'center', borderWidth: 1,
              backgroundColor: active ? color.primaryAccent : '#fff',
              borderColor: active ? color.primaryAccent : color.borderDefault }}>
            <Text style={{ fontFamily: font.semibold, fontSize: 13,
              color: active ? '#fff' : color.textSecondary }}>{item}</Text>
          </Pressable>
        );
      }} />
  );
}`
}, {
  id: "m-subtabs",
  group: "Components",
  name: "Sub-tabs",
  file: "preview_mobile/sub-tabs.html",
  previewH: 280,
  desc: "Underline tabs for switching sections within a screen (e.g. Reviews → Inbox / Deep Dive). Active = accent label + 2px indicator. For top-level navigation use the bottom tab bar instead."
}, {
  id: "m-cards",
  group: "Components",
  name: "Cards",
  file: "preview_mobile/cards-mobile.html",
  previewH: 300,
  desc: "14px radius, white, the blue-tinted card shadow. The base container for grouped content. Tappable cards get press feedback (scale 0.98) and a clear affordance.",
  react: `import { View } from 'react-native';
import { card } from '../theme/styles'; // from the Radius & elevation snippet

<View style={card}>
  {/* title, body, meta */}
</View>`
}, {
  id: "m-kpi",
  group: "Components",
  name: "KPI tiles",
  file: "preview_mobile/kpis-mobile.html",
  previewH: 300,
  desc: "Big tabular number + label + trend chip (green-up / red-down, percent only, with a small arrow). Lay out 2-up on phones. Always pair the number with comparison context.",
  react: `import { View, Text } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { color, font, card } from '../theme/tokens';

export function KpiTile({ label, value, deltaPct }) {
  const up = deltaPct >= 0;
  return (
    <View style={[card, { flex: 1 }]}>
      <Text style={{ fontSize: 13, color: color.textTertiary }}>{label}</Text>
      <Text style={{ fontFamily: font.bold, fontSize: 28, marginVertical: 4,
        fontVariant: ['tabular-nums'], color: color.textPrimary }}>{value}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <TrendingUp size={14} color={up ? color.success : color.error} />
        <Text style={{ fontFamily: font.semibold, fontSize: 13,
          color: up ? color.success : color.error }}>{Math.abs(deltaPct)}%</Text>
      </View>
    </View>
  );
}`
}, {
  id: "m-charts",
  group: "Components",
  name: "Charts",
  file: "preview_mobile/charts-mobile.html",
  previewH: 420,
  desc: "Bar, line/area, and donut sized for a phone card — same brand palette and rules as web (accent = focus series, blue-200 = context, zero-based axes). Use react-native-svg or victory-native. Keep them glanceable: few ticks, abbreviated values, tap a bar/point for the exact figure.",
  usage: {
    do: ["Accent = focus series, blue-200 = context", "Few ticks; abbreviate (42.1K); tap for exact value", "Pair an accessibilityLabel summarising the trend"],
    dont: ["Cram a dense web chart onto a phone", "Use color as the only encoding", "Animate entrance under reduce-motion"]
  },
  react: `import { View, Text } from 'react-native';
import Svg, { Rect, Polyline, Polygon, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { color, font, card } from '../theme/tokens';

export function ViewsBarChart({ data }) {            // data: number[] (7 days)
  const max = Math.max(...data), peak = data.indexOf(max);
  return (
    <View style={card} accessibilityRole="image"
      accessibilityLabel={\`Profile views, last 7 days, peak \${max}\`}>
      <Text style={{ fontFamily: font.semibold, fontSize: 13, color: color.textTertiary }}>Profile views</Text>
      <Svg width="100%" height={120} viewBox="0 0 300 120" style={{ marginTop: 10 }}>
        {data.map((v, i) => {
          const h = (v / max) * 92, x = 22 + i * 40;
          return <Rect key={i} x={x} y={104 - h} width={26} height={h} rx={5}
            fill={i === peak ? color.primaryAccent : '#BFDBFE'} />;
        })}
      </Svg>
    </View>
  );
}

// Donut (sentiment) — stroke-dasharray segments, white separators, center label.
export function SentimentDonut({ pos, neu, neg }) {
  const seg = (val, offset, c) => (
    <Circle cx="21" cy="21" r="15.9" fill="none" stroke={c} strokeWidth="6"
      strokeDasharray={\`\${val} \${100 - val}\`} strokeDashoffset={offset} />
  );
  return (
    <Svg width={88} height={88} viewBox="0 0 42 42">
      <Circle cx="21" cy="21" r="15.9" fill="none" stroke="#EEF1F6" strokeWidth="6" />
      {seg(pos, 25, color.success)}
      {seg(neu, -(pos - 25), color.warning)}
      {seg(neg, -(pos + neu - 25), color.error)}
    </Svg>
  );
}`
}, {
  id: "m-progress",
  group: "Components",
  name: "Progress & score",
  file: "preview_mobile/progress-score-mobile.html",
  previewH: 420,
  desc: "The presence-score ring (AI-gradient stroke, always with a text equivalent \"78 / 100\"), linear health bars by metric, and a segmented verification meter. The score ring is the hero of the mobile Home screen.",
  usage: {
    do: ["Ring carries a text value (\"78 / 100\") + a trend", "Bars use semantic colors by health", "role=progressbar with aria-valuenow equivalents"],
    dont: ["Show a ring with no numeric label", "Use green/red as the only signal"]
  },
  react: `import { View, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { color, font, card } from '../theme/tokens';

export function ScoreRing({ score = 78 }) {
  const r = 48, c = 2 * Math.PI * r, off = c * (1 - score / 100);
  return (
    <View style={card} accessibilityRole="progressbar"
      accessibilityValue={{ now: score, min: 0, max: 100 }}
      accessibilityLabel={\`Presence score \${score} out of 100\`}>
      <Svg width={116} height={116} viewBox="0 0 116 116">
        <Defs>
          <LinearGradient id="g" x1="0" y1="0" x2="116" y2="116">
            <Stop offset="0" stopColor={color.primaryDeep} />
            <Stop offset="1" stopColor={color.primaryAccent} />
          </LinearGradient>
        </Defs>
        <Circle cx="58" cy="58" r={r} fill="none" stroke="#EEF1F6" strokeWidth={12} />
        <Circle cx="58" cy="58" r={r} fill="none" stroke="url(#g)" strokeWidth={12} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 58 58)" />
      </Svg>
      <Text style={{ position: 'absolute', alignSelf: 'center', top: 44,
        fontFamily: font.bold, fontSize: 30 }}>{score}</Text>
    </View>
  );
}

export function HealthBar({ label, pct, tint }) {
  return (
    <View style={{ marginBottom: 15 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 }}>
        <Text style={{ fontSize: 14, color: color.textSecondary }}>{label}</Text>
        <Text style={{ fontSize: 13, fontFamily: font.semibold, fontVariant: ['tabular-nums'] }}>{pct}%</Text>
      </View>
      <View style={{ height: 8, borderRadius: 999, backgroundColor: '#EEF1F6' }}>
        <View style={{ height: 8, borderRadius: 999, width: \`\${pct}%\`, backgroundColor: tint }} />
      </View>
    </View>
  );
}`
}, {
  id: "m-inline-scores",
  group: "Components",
  name: "Inline scores",
  file: "preview_mobile/inline-scores-mobile.html",
  previewH: 420,
  desc: "Amber star ratings, a rating distribution, and score pills — the building blocks of the mobile Reviews screen. The numeric value carries the meaning and the accessible name; stars are decorative (accessibilityElementsHidden).",
  usage: {
    do: ["Numeric value is the accessible name (\"4.6 of 5\")", "Stars amber + decorative; pills use semantic bg", "Distribution bars use amber fill"],
    dont: ["Use a lone amber star with no number", "Use amber as text color"]
  },
  react: `import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { color, font } from '../theme/tokens';

export function StarRating({ value, count }) {
  return (
    <View accessibilityLabel={\`Rated \${value} out of 5, \${count} reviews\`}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
        <Text style={{ fontFamily: font.bold, fontSize: 46, fontVariant: ['tabular-nums'] }}>{value}</Text>
        <View style={{ flexDirection: 'row', gap: 2 }} accessibilityElementsHidden>
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={18} color={color.starAmber}
              fill={i <= Math.round(value) ? color.starAmber : 'transparent'} />
          ))}
        </View>
      </View>
      <Text style={{ fontSize: 13, color: color.textTertiary, marginTop: 3 }}>{count} reviews</Text>
    </View>
  );
}

export function DistRow({ stars, value, total }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 9 }}>
      <Text style={{ width: 30, fontSize: 13, color: color.textSecondary }}>{stars}★</Text>
      <View style={{ flex: 1, height: 8, borderRadius: 999, backgroundColor: '#EEF1F6' }}>
        <View style={{ height: 8, borderRadius: 999, width: \`\${(value/total)*100}%\`, backgroundColor: color.starAmber }} />
      </View>
      <Text style={{ width: 34, textAlign: 'right', fontSize: 12, color: color.textTertiary,
        fontVariant: ['tabular-nums'] }}>{value}</Text>
    </View>
  );
}`
}, {
  id: "m-list-rows",
  group: "Components",
  name: "List rows",
  file: "preview_mobile/list-rows.html",
  previewH: 360,
  desc: "Grouped list — a single 14px-radius card with internal hairline dividers (the iOS Settings pattern). Each row ≥44pt: leading icon/avatar, primary + optional secondary text, trailing value / chevron. Chevron only if the row drills in.",
  react: `import { Pressable, View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { color, font, touch } from '../theme/tokens';

export function Row({ title, subtitle, value, onPress, last }) {
  return (
    <Pressable onPress={onPress}
      style={({ pressed }) => [{ minHeight: touch.min, flexDirection: 'row',
        alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: last ? 0 : 1, borderBottomColor: color.borderSubtle,
        backgroundColor: pressed ? color.borderSubtle : '#fff' }]}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: font.semibold, fontSize: 16, color: color.textPrimary }}>{title}</Text>
        {!!subtitle && <Text style={{ fontSize: 13, color: color.textTertiary }}>{subtitle}</Text>}
      </View>
      {!!value && <Text style={{ fontSize: 15, color: color.textTertiary, marginRight: 6 }}>{value}</Text>}
      {!!onPress && <ChevronRight size={18} color={color.textTertiary} />}
    </Pressable>
  );
}`
}, {
  id: "m-settings-rows",
  group: "Components",
  name: "Settings rows",
  file: "preview_mobile/settings-rows.html",
  previewH: 360,
  desc: "List rows specialized for settings: trailing toggle (Switch), value + chevron, or a destructive action in the error color. Group related rows under a section label."
}, {
  id: "m-selection",
  group: "Components",
  name: "Selection controls",
  file: "preview_mobile/selection-controls.html",
  previewH: 340,
  desc: "Switch (settings toggles), checkbox (multi-select filters), and radio (single choice) — all with ≥44pt row hit-areas and the accent on-state. Use a switch for an immediate on/off setting, a checkbox for multi-select, a radio for one-of-many.",
  usage: {
    do: ["Switch = immediate setting; checkbox = multi; radio = one-of-many", "Whole row is the 44pt tap target", "Accent on-state + a shape change, not color alone"],
    dont: ["Use a checkbox where a switch is expected (settings)", "Tiny 24pt-only tap targets"]
  },
  react: `import { Pressable, View, Text, Switch } from 'react-native';
import { Check } from 'lucide-react-native';
import { color, font, touch } from '../theme/tokens';

// Switch (settings row) — use the native Switch tinted to brand
export function SettingSwitch({ label, value, onValueChange }) {
  return (
    <View style={{ minHeight: 52, flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, gap: 14 }}>
      <Text style={{ flex: 1, fontFamily: font.medium, fontSize: 16, color: color.textPrimary }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange}
        trackColor={{ true: color.primaryAccent, false: '#D1D5DB' }} thumbColor="#fff" />
    </View>
  );
}

// Checkbox row (multi-select)
export function CheckRow({ label, checked, onToggle }) {
  return (
    <Pressable onPress={onToggle} accessibilityRole="checkbox" accessibilityState={{ checked }}
      style={{ minHeight: touch.comfy, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16 }}>
      <View style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: checked ? color.primaryAccent : 'transparent',
        borderColor: checked ? color.primaryAccent : '#C7CDD6' }}>
        {checked && <Check size={15} color="#fff" strokeWidth={3} />}
      </View>
      <Text style={{ fontFamily: font.medium, fontSize: 15, color: color.textPrimary }}>{label}</Text>
    </Pressable>
  );
}`
}, {
  id: "m-slider",
  group: "Components",
  name: "Slider",
  file: "preview_mobile/slider-mobile.html",
  previewH: 300,
  desc: "Single-value and range sliders with a large 28pt thumb (easy to drag) and a live value read-out. Use @react-native-community/slider for the single case; a gesture-handler pan for range. Snap to sensible steps.",
  react: `import Slider from '@react-native-community/slider';  // npm i @react-native-community/slider
import { View, Text } from 'react-native';
import { color, font } from '../theme/tokens';

export function RatingSlider({ value, onChange }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontFamily: font.semibold, fontSize: 16 }}>Minimum rating</Text>
        <Text style={{ fontFamily: font.bold, fontSize: 16, color: color.primaryAccent }}>{value.toFixed(1)}★</Text>
      </View>
      <Slider minimumValue={1} maximumValue={5} step={0.5} value={value} onValueChange={onChange}
        minimumTrackTintColor={color.primaryAccent}
        maximumTrackTintColor="#EEF1F6" thumbTintColor={color.primaryAccent} />
    </View>
  );
}`
}, {
  id: "m-top-nav",
  group: "Components",
  name: "Top nav bar",
  file: "preview_mobile/top-nav-bar.html",
  previewH: 300,
  desc: "44pt nav bar for child screens — glass (white ~80% + blur), sticky, single hairline. Layout: back · centered title · single action. Respect the top safe-area inset above it.",
  react: `import { View, Text, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, font } from '../theme/tokens';

export function NavBar({ title, onBack, action }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: 'rgba(255,255,255,0.9)',
      borderBottomWidth: 1, borderBottomColor: color.borderSubtle }}>
      <View style={{ height: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
        <Pressable onPress={onBack} hitSlop={12} style={{ width: 44, height: 44, justifyContent: 'center' }}>
          <ChevronLeft size={26} color={color.primaryAccent} />
        </Pressable>
        <Text style={{ flex: 1, textAlign: 'center', fontFamily: font.semibold, fontSize: 17 }}>{title}</Text>
        <View style={{ width: 44, alignItems: 'flex-end' }}>{action}</View>
      </View>
    </View>
  );
}`
}, {
  id: "m-sticky-header",
  group: "Components",
  name: "Large title header",
  file: "preview_mobile/sticky-header.html",
  previewH: 360,
  desc: "Tab-root header: a 28/700 large title + optional subtitle that collapses into a standard 44pt nav bar as the user scrolls. Implement with Animated scroll interpolation."
}, {
  id: "m-tabbar",
  group: "Components",
  name: "Bottom tab bar",
  file: "preview_mobile/tab-bar.html",
  previewH: 330,
  desc: "The primary navigation — 5 slots, 56pt, 24px Lucide icons with 11px caption labels. Active = accent; idle = tertiary. The center slot is the AI gradient (AI Mode). Sits above the home-indicator safe area.",
  usage: {
    do: ["Exactly 5 slots; labels in 11px caption", "Center slot = AI gradient for AI Mode", "Add the bottom safe-area inset below 56pt"],
    dont: ["More than 5 tabs (use More)", "Icons without labels", "Gradient on a non-AI tab"]
  },
  react: `import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, BarChart2, Star, MoreHorizontal } from 'lucide-react-native';
import { color, aiGradient, font } from '../theme/tokens';

const Tab = createBottomTabNavigator();

export function Tabs() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: color.primaryAccent,
      tabBarInactiveTintColor: color.textTertiary,
      tabBarLabelStyle: { fontFamily: font.medium, fontSize: 11 },
      tabBarStyle: { height: 56 },
    }}>
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarIcon: ({ color: c }) => <Home size={24} color={c} /> }} />
      <Tab.Screen name="Insights" component={InsightsScreen}
        options={{ tabBarIcon: ({ color: c }) => <BarChart2 size={24} color={c} /> }} />
      <Tab.Screen name="AI" component={AiModeScreen}
        options={{ tabBarIcon: () => (
          <LinearGradient colors={aiGradient} style={{ width: 44, height: 44, borderRadius: 22,
            alignItems: 'center', justifyContent: 'center' }}>
            <Sparkle size={22} color="#fff" />
          </LinearGradient>) }} />
      <Tab.Screen name="Reviews" component={ReviewsScreen}
        options={{ tabBarIcon: ({ color: c }) => <Star size={24} color={c} /> }} />
      <Tab.Screen name="More" component={MoreScreen}
        options={{ tabBarIcon: ({ color: c }) => <MoreHorizontal size={24} color={c} /> }} />
    </Tab.Navigator>
  );
}`
}, {
  id: "m-fab",
  group: "Components",
  name: "Floating action button",
  file: "preview_mobile/fab.html",
  previewH: 320,
  desc: "56pt circular FAB floating above content, clearing the tab bar + home indicator. AI gradient + sparkle when invoking AI; solid accent for a primary 'Add'. Strong blue lift shadow.",
  react: `import { Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkle } from 'lucide-react-native';
import { aiGradient } from '../theme/tokens';

export function AiFab({ onPress }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Ask AI"
      style={{ position: 'absolute', right: 16, bottom: 90,
        shadowColor: '#0070FC', shadowOpacity: 0.35, shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 }, elevation: 8 }}>
      <LinearGradient colors={aiGradient} start={{x:0,y:0}} end={{x:1,y:1}}
        style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}>
        <Sparkle size={26} color="#fff" />
      </LinearGradient>
    </Pressable>
  );
}`
}, {
  id: "m-quick-actions",
  group: "Components",
  name: "Quick actions",
  file: "preview_mobile/quick-actions.html",
  previewH: 300,
  desc: "A grid of icon-in-tinted-square + label tiles on Home for the top tasks (Add Location, Reply, Post, Audit). Each tile is a ≥44pt target."
}, {
  id: "m-file-upload",
  group: "Components",
  name: "Attach & upload",
  file: "preview_mobile/file-upload-mobile.html",
  previewH: 440,
  desc: "An add tile that opens a source action sheet — Take photo / Photo library / Files (CSV) — then shows each upload with a thumbnail and progress. Request camera/library permission in context and degrade gracefully if denied.",
  usage: {
    do: ["Offer Camera / Library / Files via an action sheet", "Show a thumbnail + per-file progress", "Ask permission in context, handle denial"],
    dont: ["Upload silently with no progress", "Assume permission is granted"]
  },
  react: `import * as ImagePicker from 'expo-image-picker';   // npm i expo-image-picker
import * as DocumentPicker from 'expo-document-picker';

async function pickFromLibrary() {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return showPermissionSheet();
  const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsMultipleSelection: true });
  if (!res.canceled) upload(res.assets);
}
async function takePhoto() {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) return showPermissionSheet();
  const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
  if (!res.canceled) upload(res.assets);
}
async function pickCsv() {
  const res = await DocumentPicker.getDocumentAsync({ type: 'text/csv' });
  if (res.type === 'success') upload([res]);
}
// Present these three via the Action sheet component.`
}, {
  id: "m-bottom-sheet",
  group: "Components",
  name: "Bottom sheet",
  file: "preview_mobile/bottom-sheet.html",
  previewH: 420,
  desc: "The mobile replacement for the centered modal. 20px top corners, a 36×5 grabber, blurred backdrop, slides up on the iOS sheet curve, swipe-to-dismiss. Use for forms, detail, and AI Mode.",
  usage: {
    do: ["Use a sheet instead of a centered modal", "Show a grabber; support swipe-to-dismiss", "Trap focus; return it on close"],
    dont: ["Center a dialog for routine tasks", "Block the whole screen when a sheet fits"]
  },
  react: `import BottomSheet from '@gorhom/bottom-sheet';   // npm i @gorhom/bottom-sheet
import { color, radius } from '../theme/tokens';

export function Sheet({ children }) {
  const ref = React.useRef(null);
  return (
    <BottomSheet ref={ref} snapPoints={['45%', '85%']}
      handleIndicatorStyle={{ backgroundColor: color.borderDefault, width: 36 }}
      backgroundStyle={{ borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet }}>
      {children}
    </BottomSheet>
  );
}`
}, {
  id: "m-action-sheet",
  group: "Components",
  name: "Action sheet",
  file: "preview_mobile/action-sheet.html",
  previewH: 360,
  desc: "A bottom-anchored list of choices for a single decision; destructive action in the error color, a separated Cancel. Use the native ActionSheetIOS on iOS where possible."
}, {
  id: "m-alert-dialog",
  group: "Components",
  name: "Alert dialog",
  file: "preview_mobile/alert-dialog.html",
  previewH: 340,
  desc: "A centered confirmation dialog — reserved for true confirmations (delete, discard). Title that names the consequence, body, and ≤2 actions with the safe action on the right.",
  react: `import { Alert } from 'react-native';

Alert.alert(
  'Delete location?',
  'This removes Mall of Emirates and all its listing data. This can\\'t be undone.',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: deleteLocation },
  ],
);`
}, {
  id: "m-snackbar",
  group: "Components",
  name: "Snackbar / toast",
  file: "preview_mobile/snackbar.html",
  previewH: 320,
  desc: "A bottom transient message above the tab bar with an optional single action and auto-dismiss. role=status for info/success, assertive for errors. Don't auto-dismiss actionable toasts.",
  react: `import { View, Text, Pressable, Animated } from 'react-native';
import { color, radius, font } from '../theme/tokens';

export function Snackbar({ message, action, onAction }) {
  return (
    <View accessibilityLiveRegion="polite"
      style={{ position: 'absolute', left: 16, right: 16, bottom: 76,
        flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
        backgroundColor: color.textPrimary, borderRadius: radius.card }}>
      <Text style={{ flex: 1, color: '#fff', fontFamily: font.medium, fontSize: 14 }}>{message}</Text>
      {!!action && (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={{ color: '#7FB4FF', fontFamily: font.semibold, fontSize: 14 }}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}`
}, {
  id: "m-badges",
  group: "Components",
  name: "Notification badges",
  file: "preview_mobile/notification-badges.html",
  previewH: 280,
  desc: "Count pills on tab icons and rows. Cap at 99+. Use the error color for unread/alert counts; keep ≥16pt diameter so they're legible."
}, {
  id: "m-swipe",
  group: "Components",
  name: "Swipe actions",
  file: "preview_mobile/swipe-actions.html",
  previewH: 320,
  desc: "Reveal actions on a left/right row swipe (archive, reply, delete) — destructive in the error color. Always provide a non-swipe alternative (tap into the row → action) for accessibility.",
  react: `import { Swipeable } from 'react-native-gesture-handler';
import { View, Text, Pressable } from 'react-native';
import { color } from '../theme/tokens';

function RightActions({ onDelete }) {
  return (
    <Pressable onPress={onDelete}
      style={{ backgroundColor: color.error, justifyContent: 'center', paddingHorizontal: 24 }}>
      <Text style={{ color: '#fff', fontWeight: '600' }}>Delete</Text>
    </Pressable>
  );
}
// <Swipeable renderRightActions={() => <RightActions onDelete={...} />}>{row}</Swipeable>`
}, {
  id: "m-pull-refresh",
  group: "Components",
  name: "Pull to refresh",
  file: "preview_mobile/pull-to-refresh.html",
  previewH: 320,
  desc: "Branded spinner at the top of scroll views. Use RefreshControl tinted to the accent. Pair with optimistic UI and a 'last updated' timestamp.",
  react: `import { ScrollView, RefreshControl } from 'react-native';
import { color } from '../theme/tokens';

<ScrollView refreshControl={
  <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
    tintColor={color.primaryAccent} colors={[color.primaryAccent]} />
}>
  {content}
</ScrollView>`
}, {
  id: "m-carousel",
  group: "Components",
  name: "Carousel",
  file: "preview_mobile/carousel.html",
  previewH: 320,
  desc: "Horizontal snap list with a peek of the next card. Use a paged FlatList; show dots only for ≤5 items. Never auto-advance faster than the user can read."
}, {
  id: "m-accordion",
  group: "Components",
  name: "Collapsible sections",
  file: "preview_mobile/accordion-mobile.html",
  previewH: 400,
  desc: "Accordion rows inside a grouped card — for location detail, grouped settings, and FAQ. Each header is a ≥54pt row with an optional trailing meta value; the caret rotates and the panel animates open. Single- or multi-open.",
  usage: {
    do: ["Header row ≥44pt with aria-expanded", "Optional trailing meta (★ 4.6, Open now)", "Animate height; rotate the caret"],
    dont: ["Hide the primary content collapsed by default", "Use where a drill-in screen is clearer"]
  },
  react: `import { Pressable, View, Text, LayoutAnimation } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { color, font } from '../theme/tokens';

function Section({ title, meta, children }) {
  const [open, setOpen] = React.useState(false);
  const toggle = () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setOpen(o => !o); };
  return (
    <View>
      <Pressable onPress={toggle} accessibilityRole="button" accessibilityState={{ expanded: open }}
        style={{ minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16 }}>
        <Text style={{ flex: 1, fontFamily: font.semibold, fontSize: 16, color: color.textPrimary }}>{title}</Text>
        {!!meta && <Text style={{ fontSize: 13, color: color.textTertiary }}>{meta}</Text>}
        <ChevronDown size={20} color={open ? color.primaryAccent : color.textTertiary}
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }} />
      </Pressable>
      {open && <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>{children}</View>}
    </View>
  );
}`
}, {
  id: "m-load-more",
  group: "Components",
  name: "Load more & infinite scroll",
  file: "preview_mobile/load-more.html",
  previewH: 420,
  desc: "Two pagination patterns for mobile feeds: an explicit 'Load more' button with a count, and auto-loading with a footer spinner on scroll (FlatList onEndReached). Prefer load-more when users need a stopping point; infinite for browsing.",
  usage: {
    do: ["Show a count ('25 of 1,284')", "Footer spinner respects reduced-motion", "Use onEndReached with a threshold for infinite"],
    dont: ["Infinite-scroll a list users need to finish", "Trigger loads on every pixel — throttle"]
  },
  react: `import { FlatList, ActivityIndicator, Pressable, Text } from 'react-native';
import { color, font } from '../theme/tokens';

function ReviewFeed({ data, loadMore, loading, hasMore }) {
  return (
    <FlatList
      data={data}
      keyExtractor={r => r.id}
      renderItem={({ item }) => <ReviewRow review={item} />}
      onEndReached={hasMore ? loadMore : null}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        loading ? <ActivityIndicator color={color.primaryAccent} style={{ padding: 16 }} />
        : hasMore ? (
          <Pressable onPress={loadMore} style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: color.primaryAccent, fontFamily: font.semibold, fontSize: 15 }}>Load 25 more</Text>
          </Pressable>
        ) : null
      }
    />
  );
}`
}, {
  id: "m-avatars",
  group: "Components",
  name: "Avatars",
  file: "preview_mobile/avatars.html",
  previewH: 240,
  desc: "Circular, initials or image, with an optional status dot and stacked overflow group. When the avatar is the only identifier, set accessibilityLabel to the person's name."
}, {
  id: "m-stepper",
  group: "Components",
  name: "Stepper",
  file: "preview_mobile/stepper.html",
  previewH: 280,
  desc: "A −/value/+ numeric stepper with ≥44pt tap targets on each control, and a wizard stepper for multi-step flows (onboarding). Done / active / upcoming states, never color-only."
}, {
  id: "m-skeletons",
  group: "Components",
  name: "Skeletons",
  file: "preview_mobile/skeletons.html",
  previewH: 320,
  desc: "Shimmer placeholders matching the final layout for sub-1s loads. Turn shimmer off under reduce-motion (static blocks). Announce 'Loading…' politely."
}, {
  id: "m-empty",
  group: "Components",
  name: "Empty state",
  file: "preview_mobile/empty-state.html",
  previewH: 340,
  desc: "Centered tinted icon square + title + one-line body + a single CTA. Every empty state points to the next action; 'good news' empties reassure rather than alarm."
}];

/* ───────── MOBILE GUIDELINES ───────── */
window.DS_MOBILE_GUIDES = [{
  id: "m-platform",
  name: "Platform conventions",
  desc: "We ship one brand on two platforms. Honor each OS where users have muscle memory — but keep SingleInterface's color, type, and AI language identical across iOS, Android, and web.",
  html: `
<h2>One brand, native on each platform</h2>
<p>SingleInterface follows <strong>Material 3</strong> on Android and the <strong>iOS Human Interface Guidelines</strong> on iOS for <em>behavior and chrome</em> — back gestures, sheet physics, ripple vs highlight, system fonts for OS surfaces — while keeping our <strong>brand layer identical everywhere</strong>: the indigo→blue palette, Hanken Grotesk, blue-tinted elevation, the amber star, and the AI gradient. A store manager moving between the web console and the app should feel one product.</p>

<h3>Follow the platform for…</h3>
<div class="do-dont">
  <div class="dd dd--do"><h4>Match the OS</h4><ul><li>Navigation: bottom tabs + stack; iOS edge-swipe back, Android system back</li><li>Sheets &amp; pickers: native bottom-sheet physics; iOS/Android date pickers</li><li>Press feedback: Android ripple, iOS highlight/scale</li><li>Haptics, share sheets, permission prompts</li><li>Safe areas, status bar, home indicator</li></ul></div>
  <div class="dd dd--dont"><h4>Keep ours (consistent)</h4><ul><li>Color tokens &amp; semantic mapping</li><li>Hanken Grotesk for in-app content</li><li>The AI gradient + sparkle language</li><li>Blue-tinted card elevation</li><li>Iconography (Lucide), amber stars</li></ul></div>
</div>

<h3>Material 3 ↔ our system</h3>
<table>
<thead><tr><th>Material 3</th><th>SingleInterface mobile</th></tr></thead>
<tbody>
<tr><td>Primary / color roles</td><td><code>color.primaryAccent</code> #0070FC as the M3 "primary"; our semantic four map to M3 error/tertiary roles</td></tr>
<tr><td>Elevation tonal overlays</td><td>replaced by our blue-tinted <code>shadowCard</code></td></tr>
<tr><td>FAB</td><td>our AI gradient FAB (sparkle) / solid-accent Add</td></tr>
<tr><td>Navigation bar</td><td>our 5-slot bottom tab bar, center = AI</td></tr>
<tr><td>State layers (hover/press/focus)</td><td>ripple on Android; 0.98 scale + tint on iOS</td></tr>
</tbody></table>

<h3>iOS HIG ↔ our system</h3>
<ul>
<li><strong>Large titles</strong> that collapse on scroll → our Large Title header.</li>
<li><strong>Bottom sheets</strong> with grabber + the iOS sheet curve → our Bottom sheet.</li>
<li><strong>Segmented controls</strong> for ≤3 options → our Segmented control.</li>
<li>SF Symbols are an OS affordance only — in-app icons stay <strong>Lucide</strong> for cross-platform parity.</li>
</ul>
<div class="callout">When the platform convention and our brand conflict on a <em>visual</em>, brand wins (it's the same product). When they conflict on a <em>behavior</em> users expect from the OS, the platform wins (don't fight muscle memory).</div>
`
}, {
  id: "m-accessibility",
  name: "Accessibility",
  desc: "WCAG 2.1 AA on mobile, plus the native a11y stacks: VoiceOver (iOS) and TalkBack (Android), Dynamic Type, and generous touch targets.",
  html: `
<h2>Mobile accessibility</h2>
<p>Same floor as web (WCAG 2.1 AA, color + icon + text, 4.5:1 contrast) expressed through React Native's a11y props and the native screen readers.</p>

<h3>Touch &amp; pointers</h3>
<ul>
<li><strong>44pt minimum</strong> hit-area on every control (48 for primary, 56 for FAB/tab bar). Use <code>hitSlop</code> to grow the target without enlarging the glyph; keep ≥8pt between targets.</li>
<li>Every gesture (swipe-to-action, swipe-to-dismiss, pinch) has a visible single-tap alternative.</li>
<li>Activate on release, so users can slide off to cancel.</li>
</ul>

<h3>Screen readers</h3>
<ul>
<li>Set <code>accessibilityLabel</code> on every icon-only control (FAB → "Ask AI", nav back, bell). Set <code>accessibilityRole</code> (button, tab, switch, header, image).</li>
<li>State via <code>accessibilityState</code> — <code>{ selected }</code> for tabs/segments, <code>{ checked }</code> for the AI Mode switch, <code>{ disabled }</code>, <code>{ expanded }</code>.</li>
<li>Announce async/AI results with <code>AccessibilityInfo.announceForAccessibility()</code> or <code>accessibilityLiveRegion="polite"</code> (Android) — the completed answer, not every streamed token.</li>
<li>Group a row's parts with <code>accessible={true}</code> so it reads as one item; order follows visual order.</li>
<li>Manage focus on screen change with <code>AccessibilityInfo.setAccessibilityFocus()</code>.</li>
</ul>

<h3>Type &amp; motion</h3>
<ul>
<li>Support <strong>Dynamic Type</strong>: scale from the base sizes with <code>PixelRatio.getFontScale()</code> / <code>allowFontScaling</code>; layouts use min-heights and wrap, never fixed text boxes.</li>
<li>Respect <strong>Reduce Motion</strong> (<code>AccessibilityInfo.isReduceMotionEnabled()</code>): drop sheet springs, shimmer, and count-ups; keep opacity/instant.</li>
<li>Star ratings: the numeric value is the accessible name ("Rated 4.6 of 5, 1,284 reviews"); stars are <code>accessibilityElementsHidden</code>.</li>
</ul>
<div class="callout">Test with VoiceOver (iOS) and TalkBack (Android) on a real device, at the largest Dynamic Type setting, with Reduce Motion on — part of "done", not a final gate.</div>
`
}, {
  id: "m-navigation",
  name: "Navigation",
  desc: "Bottom tabs for top-level destinations, stacks for drill-down, sheets for focused tasks. Predictable back behavior on both platforms.",
  html: `
<h2>Navigation model</h2>
<ul>
<li><strong>Bottom tab bar</strong> (5 slots) for the top-level destinations — Home, Insights, AI, Reviews, More. Center is AI Mode (gradient). This replaces the web sidebar.</li>
<li><strong>Stack navigation</strong> for drill-down (location → reviews → a single review). A 44pt top nav bar with back · title · one action.</li>
<li><strong>Bottom sheets</strong> for focused tasks and detail without leaving context (reply composer, filters, AI Mode).</li>
<li><strong>Modals/dialogs</strong> only for true confirmations.</li>
</ul>

<h3>Back behavior</h3>
<ul>
<li>iOS: edge-swipe-back is enabled on stacks; the nav-bar back button mirrors it.</li>
<li>Android: the hardware/gesture <strong>Back</strong> always works and never traps the user; Back from a tab root exits or returns to Home, not a dead end.</li>
<li>Sheets dismiss on swipe-down, backdrop tap, and Android Back.</li>
</ul>

<h3>Hierarchy &amp; the 'More' tab</h3>
<p>The eight AI modules don't fit five tabs — the four primary live in the bar; the rest (Presence, Competitor, Pages, Interaction, Audience, Tasks, settings) live under <strong>More</strong>, mirroring the web sidebar groups so the mental model is consistent.</p>
<div class="callout">Deep links and notifications route straight to the relevant stack screen, restoring the tab + back stack so the user can navigate up naturally.</div>
`
}, {
  id: "m-motion",
  name: "Motion & gestures",
  desc: "Native, fast, quiet motion. The same duration/easing philosophy as web, expressed with the iOS sheet curve, ripples, and haptics.",
  html: `
<h2>Motion on mobile</h2>
<p>Same tokens as web — fast (160–320ms), ease-out entrances, ease-in exits — plus native physics.</p>
<table>
<thead><tr><th>Pattern</th><th>Spec</th></tr></thead>
<tbody>
<tr><td>Screen push (stack)</td><td>platform default — iOS slide-from-right, Android shared-axis</td></tr>
<tr><td>Bottom sheet</td><td>slide up on <code>--m-ease-sheet</code> (cubic-bezier(.32,.72,0,1)); follows the finger; swipe-to-dismiss</td></tr>
<tr><td>Press</td><td>Android ripple; iOS scale to 0.98 + tint</td></tr>
<tr><td>Tab switch</td><td>cross-fade content; no slide</td></tr>
<tr><td>Skeleton shimmer</td><td>~1.2s; off under Reduce Motion</td></tr>
</tbody></table>

<h3>Gestures &amp; haptics</h3>
<ul>
<li>Standard gestures only: swipe-back, swipe row actions, swipe-down to dismiss a sheet, pull-to-refresh. Each has a button alternative.</li>
<li>Use <strong>haptics</strong> sparingly and meaningfully (<code>expo-haptics</code>): light impact on toggle/selection, success/warning/error notification haptics on the matching outcome. Never decorative.</li>
<li>Respect Reduce Motion: replace large transitions with fades; keep functional feedback.</li>
</ul>
`
}, {
  id: "m-content",
  name: "Content & UX writing",
  desc: "Same calm, confident voice as web — tightened for small screens and thumbs. Front-load the point; cut every spare word.",
  html: `
<h2>Writing for mobile</h2>
<p>The voice and rules are shared with the web <em>Content &amp; UX Writing</em> guide — this is what changes on a phone.</p>
<ul>
<li><strong>Shorter everything.</strong> Tab labels ≤1 word (11px caption); nav titles ≤2–3; buttons verb+noun ≤3. Front-load the meaningful word — labels truncate.</li>
<li><strong>One idea per screen.</strong> Progressive disclosure over dense screens; push detail into sheets.</li>
<li><strong>Thumb-first CTAs.</strong> The primary action is full-width near the bottom; its label says exactly what happens ("Send Reply").</li>
<li><strong>Errors inline and brief</strong> — what's wrong + the fix, at the field. Stressful moments get the plainest language.</li>
<li><strong>Numbers</strong> stay tabular and localized; abbreviate in tiles (<code>42.1K</code>), full value on tap.</li>
<li><strong>Notifications</strong> (push): subject + what changed, ≤1 line; deep-link to the exact screen. Never spam — batch.</li>
</ul>
<div class="callout">Same canonical terms as web (Listing, Location, Presence Score, AI Mode, Reply, Verified/Pending/Unclaimed) — consistency across platforms is the point.</div>
`
}, {
  id: "m-ai",
  name: "AI Interaction",
  desc: "AI Mode as a thumb-reachable, conversational layer — the gradient FAB and a bottom sheet — with the same trust, control, and transparency rules as web.",
  html: `
<h2>AI on mobile</h2>
<p>All of the web <em>AI Interaction</em> principles apply (augment don't replace, human-in-the-loop, transparency, honest limits). Mobile changes the <em>surface</em>, not the rules.</p>
<ul>
<li><strong>Entry points:</strong> the center <strong>AI tab</strong> and a gradient <strong>sparkle FAB</strong>; inline "Draft reply / Summarize / Explain" actions where the work is.</li>
<li><strong>AI Mode opens as a bottom sheet</strong> — prompt field above the keyboard, suggested prompts as chips, streaming response in scrollable cards.</li>
<li><strong>Streaming:</strong> show a thinking indicator (Reduce-Motion-safe); announce the completed answer politely to the screen reader, not token-by-token.</li>
<li><strong>Always show source &amp; freshness</strong> ("Based on 1,284 reviews, up to today 10:00 AM") and the AI badge on generated content.</li>
<li><strong>Control within reach:</strong> Edit / Regenerate / Apply-Send are full-width, thumb-zone buttons. Consequential actions (send a public reply, spend credits) need an explicit confirm — never auto-send.</li>
<li><strong>Voice input</strong> is an optional accelerator for the prompt, never the only way in.</li>
</ul>
<div class="callout">The gradient + sparkle mark AI surfaces on mobile exactly as on web — never on a generic button or tab.</div>
`
}, {
  id: "m-inclusive",
  name: "Inclusive design",
  desc: "Build for one-handed use, small and old devices, bright sun, flaky networks, and second-language users — the real conditions of a retail floor.",
  html: `
<h2>Inclusive mobile</h2>
<p>Extends the web <em>Inclusive Design</em> mindset to the realities of phones in the field.</p>
<ul>
<li><strong>One-handed reach:</strong> primary actions and navigation sit in the bottom thumb zone; avoid critical taps at the very top of tall screens.</li>
<li><strong>Device &amp; network range:</strong> works on mid-range Android and small/older screens; fast first render, skeletons, optimistic UI, and graceful offline (cached data labeled stale, queued actions). Don't assume a flagship or fast 5G.</li>
<li><strong>Environment:</strong> high contrast survives bright sun on a store floor; targets are forgiving for tremor, gloves, or a phone held while busy.</li>
<li><strong>Cognitive load:</strong> one task per screen, consistent patterns, forgiving (autosave a half-written reply, confirm/undo destructive actions, never time out without warning).</li>
<li><strong>Global:</strong> translatable, RTL-ready (Arabic), locale-aware numbers/dates; layouts flex for +40% text and Dynamic Type.</li>
<li><strong>Don't assume:</strong> fluent English, perfect vision/color perception, two free hands, or full attention.</li>
</ul>
`
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ds-mobile-data.js", error: String((e && e.message) || e) }); }

// ui_kits/singleinterface_app/icons.js
try { (() => {
// icons.js — Lucide icon path strings as raw SVG markup.
// Use with: dangerouslySetInnerHTML={{ __html: `<svg ...>${SI_ICONS.foo}</svg>` }}
// In production, prefer `lucide-react` imports directly.

window.SI_ICONS = {
  // wrapped in a 24x24 viewBox <svg>
  lightbulb: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.71 2.74 1.5 3.5C8.26 12.26 8.73 13.02 8.91 14"/></svg>`,
  radar: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76a6 6 0 1 0 .79 7.77"/><path d="M12 12h.01"/><circle cx="12" cy="12" r="2"/></svg>`,
  scan: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m16 16-1.9-1.9"/></svg>`,
  star: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  file: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  users: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  dashboard: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>`,
  activity: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  list: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
  newspaper: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>`,
  target: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  map: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  // dashboard KPIs
  shieldKpi: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`,
  trending: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  xcircle: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  message: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.7 5.7 1.9-5.7 1.9L12 18.2l-1.9-5.7-5.7-1.9 5.7-1.9z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
  alertTri: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  arrowR: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  send: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  close: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  download: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  zap: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/singleinterface_app/icons.js", error: String((e && e.message) || e) }); }

})();
