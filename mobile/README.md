# Connect store app (Expo / React Native)

The Connect mobile app for store and regional managers, built from the Claude Design handoff in `../project/` (`store_manager_publish.html`, `store_manager_view.html`, `store_manager_view_regional_manager.html`) and the design iterations in `../chats/chat1.md`.

## Run it

```bash
npm install
npx expo start          # then press i / a, or scan the QR code with Expo Go
npx expo start --web    # browser preview
npm test                # unit tests for the product rules
npm run typecheck
```

### Signing in and choosing a role

Authentication is mocked in `src/services/auth.ts`, so any 10-digit number and any two 6-digit codes work. The account decides the role:

| Mobile number | Role |
| --- | --- |
| `9876543210` | Store manager (Tarun Sobhani, single store) |
| `9876500070` | Regional manager (Vikram Rao, 70 locations) |
| anything else | `EXPO_PUBLIC_DEMO_ROLE` (`store` by default, or `regional`) |

Both roles share every screen. `src/config/roles.ts` holds what differs: name and initials, the scaled numbers, the home call to action, the "Across your region" strip and the Leaderboard tab (regional only).

## Structure

```
src/
  app/                 Expo Router routes
    login.tsx, verify.tsx          sign-in and dual OTP
    (app)/welcome.tsx              onboarding welcome
    (app)/(tabs)/                  home, leads, reviews, leaderboard
    (app)/profile.tsx …            profile and its sub-pages, notifications
  components/          design-system primitives (Text, Button, Sheet, chips, tab bar …)
  sheets/              every bottom sheet and dialog, mounted once in (app)/_layout
  theme/               tokens ported from colors_and_type.css and mobile_tokens.css
  config/roles.ts      store vs regional configuration
  data/                sample content from the prototype
  lib/                 pure logic: masking, filters, leaderboard roll-ups
  state/store.ts       app state (session, filters, open sheets, lead edits)
  services/auth.ts     mock OTP auth
```

Every colour, size, radius, shadow and duration comes from `src/theme/tokens.ts`, which mirrors the SI design system's CSS variables by name. Text defaults follow the system's global CSS: Hanken Grotesk, `--si-body` colour, 1.45 leading and tabular numerals.

## Behaviour carried over from the design review

- Missed-call numbers are masked; recovered calls show the full number; lead-form submissions show the customer's name.
- The location sheet starts unchecked. Selecting exactly Karnataka swaps the home card to the amber "Let's get started" state, and the location button becomes a pill with the location count.
- "Recover missed revenue" opens Leads filtered to Missed. Regional managers get "Show me who is losing the most", which opens the Leaderboard.
- Leaderboard percentages are red above 20%. Negative-review share stays within 5–20%.

## Small changes from the prototype

- Lead details edits (name, status, reminder, notes) are saved with "Save & Done" and shown in the list; the prototype discarded them.
- Review filters are a draft until "Apply Filters". Sentiment and rating type now filter too (sentiment is derived from stars: 4–5 positive, 3 neutral, 1–2 negative).
- The login title is "Recover lost revenue" for both roles, because the role is only known after sign-in (the regional prototype still said "Recover every call").
- The backdrop blur behind sheets is omitted.

## Not wired yet

These were visual-only in the prototype and need a backend or product decision: real OTP and lead APIs, the review Reply and "Draft with AI" actions, QR download, image upload (camera or gallery), support ticket submission, create post, invite teammate, the support link, the store switcher in the home header, and the store selector in "Add a lead". The QR code is a placeholder pattern, not a scannable code. The trash icon on unreplied reviews opens the same "Delete this reply?" dialog as the design, but there is no reply to delete there yet.
