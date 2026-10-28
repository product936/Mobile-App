# Connect store app (Expo / React Native)

The Connect mobile app for store and regional managers, built from the Claude Design handoff in `../project/` (`store_manager_publish.html`, `store_manager_view.html`, `store_manager_view_regional_manager.html`) and the design iterations in `../chats/chat1.md`.

## Run it

```bash
npm install
npx expo start          # then press i / a, or scan the QR code with Expo Go
npx expo start --web    # browser preview
npm test                # unit tests for the product rules
npm run typecheck
npm run preview:web     # builds the clickable web preview into dist/preview
```

### Clickable web preview

`npm run preview:web` exports the web build and writes `dist/preview/connect-preview.html` plus `connect-app.js`, with the fonts and logos embedded. Publish both files together as a private claude.ai artifact; the app always shows inside an iPhone 15 Pro Max mockup at true proportions, scaled evenly and centred to fit the window or panel. Republishing the same page keeps the same link.

### Signing in and choosing a role

Authentication is mocked in `src/services/auth.ts`, so any 10-digit number and any two 6-digit codes work. The account decides the role:

| Mobile number | Role |
| --- | --- |
| `9876543210` | Store manager (Tarun Sobhani, single store) |
| `9876500070` | Regional manager (Vikram Rao, 70 locations) |
| `9999999999` | Store manager without access to Reviews (Home has no "Needs you now"; the Reviews tab shows a lock and a Request access screen) |
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

- Sending a review request ends on a "Review request sent" confirmation, followed by an optional "Quick feedback?" rating (five faces plus an optional comment). The same feedback dialog follows a lead status change saved in Lead details.
- Lead details shows a coloured status pill next to the title, a status dropdown, Remind me tomorrow, notes (edit, and delete with confirmation; each edit is kept as a version in the data) and Customer history as an accordion. Request review and Call back sit in a sticky bar at the bottom of the sheet.
- On Reviews, "Draft with AI" opens an inline reply box on the card and fills it with an AI draft that matches the review's sentiment. The draft is fully editable (the label changes to "AI draft · edited by you" once changed), "Regenerate" gives a different wording, and nothing is posted until "Post reply". "Reply" opens the same box empty, with "Draft with AI" one tap away. Posted replies show "Reply posted" and can be edited later with the pencil ("Update reply") or deleted.
- Review access is a per-account permission (`access.reviews`, read with `useCanUse('reviews')`), separate from the role. Without it, Home leaves out "Needs you now", and the Reviews tab stays in the bar with a small lock instead of its count. Opening it shows a minimal, centred zero state (lock icon, "You don't have access to Reviews", one explainer line and a Request access button), which shows "Access requested" once sent, including on later visits. `requestAccess` in `src/services/access.ts` is a mock.
- Customer history in Lead details is an accordion: closed, it's a tinted card with a history icon, the title, an interaction count and a preview of the latest interaction (for example "Latest: Called back by AI bot · 6:23 PM"); tap to open the lead's journey, newest first, with each step's time on the right. Each time the customer gets in touch the journey runs again: the contact (missed call, enquiry form or walk-in), the AI bot's call back with the product it qualified the purchase intent for, then the store manager's call backs. Until the store manager logs a call after the latest contact, the top step is "Call back by Rahul Sharma" with "Add call note". The store manager is named in each step (`STORE.manager` in `src/config/roles.ts`), and every step shows its time. The AI bot's latest call shows a quiet, non-interactive "Getting the call recording" state (ready within 5 minutes); earlier AI calls have a playable recording. A store manager call ("Called back by Rahul Sharma") opens its note with "View note", and a known outcome (from sample data or, later, the backend) shows as a coloured chip by its title.
- "Call back" dials the customer (on a device) and opens "What happened on the call?", as do "Add call note" and "View note" in Customer history. It asks only for call notes (required, up to 500 characters) and saves them against the store manager's call in Customer history straight away. A new call sets the status to "Called by store manager" unless the lead is already converted. In the web preview there is no dialer, so the modal opens straight away. The AI bot's call and qualified product are sample data until the bot is connected. Priya Menon's lead comes with a sample journey: missed call, AI bot call back and a store manager call that converted, then a repeat missed call at 6:20 PM that starts the journey again.

- Missed-call numbers are masked; recovered calls show the full number; lead-form submissions show the customer's name.
- The location sheet starts unchecked. Selecting exactly Karnataka swaps the home card to the amber "Let's get started" state, and the location button becomes a pill with the location count.
- "Recover missed revenue" opens Leads filtered to Missed. Regional managers get "Show me who is losing the most", which opens the Leaderboard.
- Leaderboard percentages are red above 20%. Negative-review share stays within 5–20%.

## Small changes from the prototype

- Lead details edits (name, status, reminder) save as they change (status and reminder straight away, the name when editing ends or the sheet closes) and show in the list; there is no Save & Done button; the prototype discarded them. Notes save on their own with "Save note", as in the design, and keep their version history per lead for the session.
- Review filters are a draft until "Apply Filters". Sentiment and rating type now filter too (sentiment is derived from stars: 4–5 positive, 3 neutral, 1–2 negative).
- The login title is "Recover lost revenue" for both roles, because the role is only known after sign-in (the regional prototype still said "Recover every call").
- The backdrop blur behind sheets is omitted.

## Not wired yet

These were visual-only in the prototype and need a backend or product decision: real OTP and lead APIs, sending review requests and storing feedback (both mocked in `src/services/feedback.ts`), the AI model and Google reply API behind review replies (mocked in `src/services/reviews.ts`, with sample drafts in `src/lib/reviews.ts`), QR download, image upload (camera or gallery), support ticket submission, create post, invite teammate, the support link, the store switcher in the home header, and the store selector in "Add a lead". The call recording in customer history plays a simulated 32-second clip, every lead shows the same sample notes until real lead data is connected, and the AI bot's call in customer history is sample data until the bot is connected. Call notes are kept for the session only. The QR code is a placeholder pattern, not a scannable code. The trash icon on unreplied reviews opens the same "Delete this reply?" dialog as the design, but there is no reply to delete there yet.
