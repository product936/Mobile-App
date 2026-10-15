# Changelog

Every change to the Connect store app, newest first. Each entry links to its pull request, which has the details, screenshots and test notes.

Clickable preview (always the latest version): https://claude.ai/artifact/MyroQ1CaiYuvHWBVuDxRbS

## Unreleased

- **Customer journey and call notes** ([#9](https://github.com/product936/Mobile-App/pull/9)): Customer history in Lead details now shows the lead's journey, newest first: call backs by the store manager (with the call outcome next to the title), the call back by the AI bot with its qualified purchase intent, then the missed call. "Call back" and "Add call note" open "What happened on the call?" with the call outcome and free-text notes; once a call has a note it opens with "View note". The AI bot's call has no note action. The lead status dropdown gains "Called by AI bot" and "Called by store manager", and logging a call sets the status to "Called by store manager" (Expired for a wrong number). Call notes now live with their call in Customer history instead of the Notes section.
- **Call back outcome** ([#8](https://github.com/product936/Mobile-App/pull/8)): tapping "Call back" in Lead details now opens "How did the call go?", asking for the call status (Connected, No answer, Busy, Asked to call later or Wrong number) and optional call notes. Saving adds the call to the lead's notes, shows a "Call logged" confirmation, and moves the lead's status where the outcome makes it clear (for example, Connected sets it to Contacted).
- **Quick feedback cleanup** ([#7](https://github.com/product936/Mobile-App/pull/7)): removed the "Skip" button next to Send feedback ("Skip for now" remains) and the repeated "How was that?" heading. The preview now re-measures the window when its frame changes size, so the phone no longer renders tiny if the page loads before the viewer has sized it.

## 2026-10-15

- **Review request success and quick feedback** ([#6](https://github.com/product936/Mobile-App/pull/6)): sending a review request on WhatsApp or SMS now ends on a "Review request sent" confirmation. Closing it opens an optional "Quick feedback?" dialog (five faces, from very hard to very easy, plus an optional comment of up to 500 characters). The same dialog appears after a lead's status is changed and saved in Lead details.
- **Clickable web preview** ([#5](https://github.com/product936/Mobile-App/pull/5)): `npm run preview:web` builds the app as a private claude.ai page shown inside an iPhone 15 Pro Max mockup at true proportions at every window size (scaled evenly and centred, including phones and the claude.ai side panel), with the device's safe-area insets. Sheets now size to the space they actually have, and the rating slider stays accurate when the view is scaled.

## 2026-10-14

- **Lead details update from Claude Design** ([#4](https://github.com/product936/Mobile-App/pull/4)): status pill next to the title, status dropdown, versioned notes with edit, delete and version history, and a customer history timeline with a playable call recording.

## 2026-10-08

- **First version of the app** ([#1](https://github.com/product936/Mobile-App/pull/1)): Expo / React Native app built from the Claude Design handoff, covering sign-in with dual OTP, Home, Leads, Reviews, Leaderboard (regional managers), Profile and its sub-pages, and Notifications, for both store and regional managers.
