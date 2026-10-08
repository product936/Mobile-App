# SingleInterface Design System

> **Internal UI reference — v1.0**
> The single source of truth for SingleInterface product UI. Reference this before building any new module.

**▶ Browse the portal:** open **[`design-system.html`](design-system.html)** — sidebar IA, live previews, and copy-ready React + HTML snippets for every component.

---

## Guidelines (deep-dive references)

Foundations and components live below and in [`preview/`](preview/). The **how-to-use-them-responsibly** layer lives in [`docs/`](docs/README.md) — read these alongside the tokens:

| Guideline | Covers |
| --- | --- |
| [Accessibility](docs/accessibility.md) | WCAG 2.1 AA, verified contrast pairs, keyboard, screen readers, focus, forms, touch, per-component checklist, testing |
| [Content & UX Writing](docs/content-and-ux-writing.md) | Voice/tone, capitalization, numbers & dates, errors, empty states, terminology word-list, AI copy |
| [AI Interaction Guidelines](docs/ai-interaction-guidelines.md) | AI visual language, the generate→control→feedback lifecycle, trust, human control, privacy |
| [Motion & Interaction](docs/motion-and-interaction.md) | Duration/easing scales, the motion vocabulary, interaction states, reduced-motion |
| [Data Visualization](docs/data-visualization.md) | Chart palette, chart selection, anatomy, accessible charts, KPIs & trend chips |
| [Internationalization](docs/internationalization.md) | Strings & ICU plurals, text expansion, RTL/Arabic mirroring, locale-aware data, fonts/scripts |
| [Inclusive Design](docs/inclusive-design.md) | Disability spectrum, cognitive load, performance-as-access, inclusive content |

---

## Product context

**SingleInterface** is a hyperlocal marketing and AI-powered presence management SaaS for multi-location enterprise brands (think Samsung, telcos, retail chains, banking). It helps marketers and store owners win locally on Google, Bing, Apple Maps, and large directory networks by managing listings, reviews, posts, paid campaigns, leads, and competitor intel from one console — augmented by an "AI Mode" that turns the whole app into a conversational analyst.

The product surfaces a sidebar of **eight AI-suffixed modules** that map to discrete jobs:

| Module | Focus |
| --- | --- |
| Insights AI | Cross-product analytics + KPI dashboards |
| Presence AI | Listings, posts, profile protection, presence score |
| Competitor AI | Brand + local competitors, map-rank tracking |
| Reviews AI | Inbox, deep-dive, sentiment, auto-responder |
| Pages AI | Microsite content optimisation per location |
| Interaction AI | Chats, calls, WhatsApp, messages |
| Audience AI | Leads, segmentation, lookalikes |
| Tasks AI | Next-best-action queue + activity log |

Above that sits a **prompt-first AI Mode** that responds with rich analytical cards (e.g. Customer Feedback, Reputation Score, Search Discoverability), and an **onboarding flow** that ingests a business name and produces a free presence audit in seconds.

---

## Sources used to build this design system

This system was reverse-engineered from the **`Nitin201198/design-system-nn`** GitHub repository (private — Base44 app codebase). The repo contains a Vite + React + Tailwind app with ~365 source files, ~50+ shadcn/ui primitives, and a self-documenting `DesignSystem.jsx` reference page.

- **GitHub repo:** https://github.com/Nitin201198/design-system-nn
- **Key files referenced:**
  - `src/Layout.jsx` — global CSS variables, font stack, dark mode tokens, header chrome
  - `src/pages/DesignSystem.jsx` + `DesignSystemExtra.jsx` — canonical token + component definitions
  - `src/components/ui/*` — shadcn-derived primitives (Button, Badge, Card, Input, etc.)
  - `src/components/global/Sidebar.jsx` — module-level IA + nav patterns
  - `src/pages/Onboarding.jsx` + `src/components/onboarding/*` — landing/signup flow
  - `tailwind.config.js` — semantic CSS variable bridge

> Explore those files in the original repo for richer implementation details — they contain the full prop tables, code blocks, and "do / don't" guidance the team uses internally.

---

## Index

This design system is **bifurcated into Desktop and Mobile**. Brand foundations (colors, type, fonts, logos, iconography) are shared; layout, sizing, components, and chrome diverge.

```
SingleInterface Design System/
│
├── README.md                ← you are here
├── SKILL.md                 ← entrypoint for Claude / Agent Skills
├── docs/                    ← deep-dive guidelines (accessibility, content, AI, motion, dataviz, i18n, inclusive)
│
├── ── Shared brand foundations ──────────────────────
├── styles.css               ← root entry · @imports colors_and_type.css (link this one file)
├── colors_and_type.css      ← tokens + global typography (both surfaces)
├── fonts/                   ← Hanken Grotesk variable (Roman + Italic)
├── assets/                  ← SI logo wordmark, mark, favicon
│
├── ── Desktop system ────────────────────────────────
├── preview/                 ← 19 desktop spec cards
│   ├── colors-brand.html, colors-neutrals.html, …
│   ├── type-scale.html, radii.html, shadows.html, spacing.html
│   ├── buttons.html, badges.html, kpi-cards.html, …
│   ├── left-navigation.html, header.html  ← app chrome
│   └── tabs.html, alerts.html, form-inputs.html, iconography.html, logo.html
├── ui_kits/singleinterface_app/
│   ├── index.html           ← hi-fi React desktop dashboard prototype
│   ├── Sidebar.jsx, Header.jsx, KpiTile.jsx, AlertBanner.jsx
│   ├── InsightsDashboard.jsx, AIModePanel.jsx, LocationModal.jsx
│   └── styles.css, icons.js
│
├── ── Mobile system ─────────────────────────────────
├── mobile_tokens.css        ← mobile-only overrides (touch targets, safe areas, mobile type scale)
├── preview_mobile/          ← 15 mobile-specific spec cards
│   ├── type-scale-mobile.html, touch-targets.html, spacing-mobile.html
│   ├── tab-bar.html, top-nav-bar.html, bottom-sheet.html, fab.html
│   ├── cards-mobile.html, kpis-mobile.html, list-rows.html
│   └── buttons-mobile.html, inputs-mobile.html, segmented-control.html, alerts-mobile.html, chips-mobile.html
└── ui_kits/singleinterface_mobile/
    ├── index.html           ← hi-fi React iPhone-frame prototype (5 screens, bottom tabs, AI Mode, sheet)
    ├── MobileApp.jsx, MobileComponents.jsx, Screens.jsx
    ├── MobileIcons.js, ios-frame.jsx, design-canvas.jsx
    └── styles.css, README.md
```

### What's shared vs split

| Layer | Desktop | Mobile | Shared? |
| --- | --- | --- | --- |
| Brand palette (deep, accent, semantic) | ✓ | ✓ | **Shared** — `colors_and_type.css` |
| AI gradient | ✓ | ✓ | **Shared** |
| Hanken Grotesk font | ✓ | ✓ | **Shared** — `fonts/` |
| Type scale | 8 steps (32 → 12 px, H1–H6 system) | 10 steps (32 → 11 px, iOS-flavored Large Title → Caption) | **Split** |
| Spacing | 4 px grid, 24 px gutters | 4 px grid, **16 px gutters** + safe-area insets | **Split** |
| Touch / hit targets | `h-10` (40 px) default | **44 / 48 / 56 px** minimums | **Split** |
| Navigation chrome | Fixed top header + collapsible sidebar | **Top nav bar + bottom tab bar** | **Split** |
| Modals | Centered dialog | **Bottom sheet** (rounded top, grabber, blurred backdrop) | **Split** |
| Primary action affordance | Inline buttons in toolbar | **Floating Action Button** (gradient for AI) | **Split** |
| Iconography (Lucide) | ✓ | ✓ | **Shared** library, sometimes different sizes |
| Card shadow (blue-tinted) | ✓ | ✓ (softer) | **Shared philosophy, tuned values** |

---

## Content fundamentals

**Voice.** Product copy speaks **to** the user, not at them. Buttons are imperative verbs ("Add Location", "Connect with Google", "Take walkthrough tour"). Headlines lead with the business outcome ("Find out how your business performs locally"), then a 1-line subtitle explains the mechanism ("Enter your business name to get a free AI-powered presence audit in seconds.").

**Casing.**
- Page titles, card titles, section headers → **Title Case** (CardTitle has `capitalize` baked in).
- Buttons → Title Case for multi-word actions ("Add Location", "Raise a ticket" — note the soft middle-word lowercasing on docs-style links).
- Status badges → Capitalised single word ("Verified", "Pending", "Failed").
- Microcopy under inputs → sentence case.

**Pronouns.** Second person ("your business", "you're losing customers"). First person ("we found 12 competitors") is reserved for onboarding moments where the platform is acting **for** the user.

**Tone in numbers.** Stats lead with the number, then the context. `12,450 / Profile Views / +22% vs last month`. Always tabular-nums; always with a trend chip when historic data exists.

**Vibe.** Calm-but-confident enterprise. No exclamation marks except in success toasts ("Great! Found your business."). No emoji in production UI — emoji only appear in the **language switcher** (`🇬🇧 / 🇮🇳 / 🇻🇳`) and in occasional flag chips. Iconography (Lucide) carries all other "decorative" meaning.

**Specific copy patterns observed in the codebase:**
- `"Coverage is computed per publisher as listed placements."` — explanatory helper.
- `"Trusted by 10,000+ businesses worldwide · No credit card required"` — trust line under hero CTA, middle-dot separator.
- `"NAP consistency check is running. Results will be ready in ~2 minutes."` — info banner.
- `"628 image deletion requests were successfully submitted to Google."` — success banner.
- `"Out of Credits! Click to request more credits"` — danger tooltip.
- `"Use only Design System components, tokens, and patterns. No new colors, sizes, or custom styles."` — the **prompt rule** the team uses with AI-assisted module builds.

---

## Visual foundations

### Color vibe
A **cool, technical-but-friendly** palette anchored by a single deep indigo (`#0E0071`) and an electric mid-blue (`#0070FC`). Page background is a **near-white blue tint** (`#F9FAFD`), not pure white — every surface sits one step above it. Semantic colors are the standard four (green/amber/red/blue) at Tailwind's `50`/`200`/`700` shades. No warm hues, no pastels, no purple except the **AI gradient**.

### The AI gradient
`bg-gradient-to-r from-[#0E0071] to-[#0070FC]` — used **exclusively** for AI-mode UI, AI action buttons, the onboarding SI logo mark, and the "AI Feature" badge. Never on a generic CTA.

### Type
**Hanken Grotesk** (bundled locally in `fonts/` — variable font, full 100–900 axis, Roman + Italic), loaded once globally with `tnum` feature-settings ON so all numerics are tabular by default. Falls back through `-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`. There's no serif and no display font — the system is 100% Hanken across hero, body, mono (Hanken doesn't have a mono — code uses `font-mono`, which is the Tailwind stack).

Scale is fixed at 9 steps (Display / H1–H6 / Body / Caption). Never introduce arbitrary sizes — `text-[17px]` is explicitly called out as a violation.

### Spacing
**4px base unit**, multiples only (`p-1 → 4px`, `p-2 → 8px`, `p-6 → 24px`, `p-12 → 48px`). Cards lay out on 24px gutters at desktop, 12px on mobile. Page content is centred in a `max-w-[1320px]` container with horizontal padding `px-3 sm:px-6 lg:px-8`.

### Backgrounds
- **No imagery in product chrome.** Marketing/onboarding surfaces use a very subtle radial-dot overlay on the AI gradient at 10% opacity (see `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)` at 18×18px tile).
- **Page bg:** flat `#F9FAFD` blue tint.
- **Card bg:** flat `#FFFFFF`.
- **Section accent bg:** `bg-blue-50` / `bg-amber-50` etc — the `50` step of each Tailwind family for context tinting.
- No textures, no grain, no full-bleed photographs.

### Animation
- **Easing:** custom cubic-bezier `[0.4, 0, 0.2, 1]` for onboarding step transitions; default Tailwind `transition-all duration-200` for everything else.
- **Hover micro-motion:** buttons lift `-translate-y-0.5` + shadow grow. AI button scales `1.02`. List items hover with bg tint, not shadow.
- **Press:** translate back to `0`, AI button scales `0.98`.
- **Entrance:** subtle `fade-in + translate-y-2` (200ms) on dropdowns and accordion content. Framer Motion is used in onboarding (`opacity 0→1, y 30→0, 500ms`).
- **No bounces, no parallax, no scroll-triggered reveals** in product UI.

### Borders, shadows, radii
- **Default border:** `1px solid #E5E7EB` (gray-200).
- **Subtle divider:** `1px solid #F3F4F6` (gray-100).
- **Card shadow (custom):** `box-shadow: 0 2px 8px rgba(0, 112, 252, 0.08)` — a **blue-tinted** elevation. This is a brand-distinctive detail; every shadow leans toward `#0070FC` rather than neutral black.
- **Shadow ladder:** `shadow-sm` (default), `shadow-md` (hover/dropdown), `shadow-lg` (modal), `shadow-xl` (primary CTA, popover).
- **Radius ladder:** `sm: 4px`, `md: 8px` (most buttons & inputs), `lg: 12px` (standard cards), `xl: 16px` (feature cards/modals), `full` (avatars, pill chips, filter chips).

### Hover & press states
- **Buttons (primary):** bg shifts `#0070FC → #0E0071`, shadow grows, lifts 2px.
- **Buttons (outline):** subtle `bg-gray-50` tint, no color change.
- **Cards (clickable):** `hover:shadow-md` transition; sometimes `hover:border-blue-300 hover:bg-blue-50` for selectable items.
- **Filter chips:** active → solid `#0070FC` bg + white text; idle → white bg, gray-200 border, blue-300 border on hover.
- **Nav items:** active → `bg-blue-50 text-blue-600 font-medium`; hover → `bg-gray-100 text-blue-600`.

### Transparency & blur
- **Modal backdrop:** `bg-black/50 backdrop-blur-sm` (sidebar mobile overlay too).
- **Sticky overlays:** plain white, no blur.
- Translucency is otherwise avoided.

### Layout rules
- **Fixed top header:** 64px desktop, 56px mobile, white bg, single bottom-border.
- **Fixed sidebar:** 240–280px expanded, 72px collapsed, white bg, single right-border, persists collapse state in `localStorage('sidebarCollapsed')`.
- **Content gutter:** `max-w-[1320px]` centered, breathing room consistent.
- **Mobile breakpoints (reference):** sm 480 / md 768 / lg 1024 / xl 1280 / 2xl 1440. Below md, sidebar becomes an overlay drawer triggered by a hamburger.
- **RTL support is real** — Arabic users (detected via email domain heuristic) flip the entire `dir` attribute and mirror sidebar to the right.

### Numbers & data
- **All numeric values use `tabular-nums`** to keep KPI columns aligned.
- **Trend chips** sit beneath KPI numbers: green up / red down, percent only, small Lucide arrow.
- **Charts** are Recharts with the brand `#0070FC` as the primary series, no gridlines on minor axes, gray `#9CA3AF` tick labels.

---

## Iconography

- **Library: Lucide React (`lucide-react` v0.475+).** Used throughout — sidebar items, KPI tiles, buttons, alert banners, dropdowns. Stroke style. 16/18/20/24 px sizes (`w-3 / w-4 / w-4.5 / w-5 / w-6` etc.).
- **Flat icons only.** Never use 3D, skeumorphic, or photographic icon styles. No drop-shadows, embossing, beveled or glossy treatments on icons. The brand vocabulary is exclusively flat line/fill iconography (Lucide stroke icons + occasional filled glyphs).
- **Star icon = always amber.** Wherever a star represents a review or rating — whether as a Lucide icon, a `★` glyph in copy, a filter chip, or a row meta — use `var(--si-star-amber)` (`#F59E0B`). Empty/unrated states use `var(--si-star-amber-empty)` (`#E5E7EB`). Amber is used regardless of surface tone (light cards, dark gradient, etc.).
- **No custom SVG icons** in the codebase apart from a 4-color **Google `G`** glyph (for the "Connect with Google" button) and the **SI mark** itself.
- **Icon sizing convention:** body text icons `w-3 h-3`, button/input icons `w-4 h-4`, alert/tile icons `w-5 h-5`, hero `w-6 h-6`.
- **Icon containers:** when an icon represents a category or status, it sits inside a colored **rounded-xl square** — `w-8 h-8 bg-blue-100 rounded-lg` / `w-9 h-9 bg-blue-50 rounded-xl` — with the icon centered and tinted to the container's family (e.g. `bg-green-100` + `text-green-600`).
- **No emoji in product UI** beyond country flags in the language menu.
- **No icon font** — Lucide is imported per-component as named exports.
- **CDN fallback:** in HTML mocks where Lucide-React isn't loaded, use https://unpkg.com/lucide@latest icons or Lucide's static SVG CDN.

The wordmark + mark live in `assets/`:
- `assets/logo-si-wordmark.svg` — full lockup, dark.
- `assets/logo-si-mark.svg` — gradient SI square (the onboarding header treatment).
- `assets/logo-si-favicon.svg` — small mark, monochrome.

> A high-res PNG of the production wordmark lives in the source codebase at the URL referenced in `src/components/global/Sidebar.jsx`. The SVGs in this design system are vector recreations matching the documented gradient + typography.

---

## Caveats & substitutions

- **Logo wordmark** is a vector recreation of what's used in the live product (per the Supabase image URL referenced in the source). If you have the production SVG, replace `assets/logo-si-wordmark.svg`.
- **Fonts:** Hanken Grotesk variable fonts (`HankenGrotesk-VariableFont_wght.ttf` + Italic) live in `fonts/` and are wired in via `@font-face` in `colors_and_type.css`. No external CDN required.
- **Icons:** UI kit and previews link `lucide` from CDN rather than bundling the `lucide-react` package.
