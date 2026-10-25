# KHOJ · खोज

An educational women's health symptom tracking and care navigation prototype. **Not a diagnostic tool.** The current app is a local demo with fictional sample data and educational safety rules.

🌐 Live Demo: https://khoj-xi.vercel.app/

## Run locally

1. Install Node.js 20+ and dependencies with `npm install`.
2. Start with `npm run dev`.
3. Run `npm test` for the unit tests; `npm run build` creates the production bundle.

## Architecture

The UI is React/TypeScript with React Router, TanStack Query, i18next, Recharts and jsPDF. `src/lib/api.ts` is the local API boundary. The current app uses localStorage only; the Supabase schema and edge-function files are scaffolding and are not connected to the UI. No API secrets belong in browser code.

## Data, consent and privacy

The current app stores account records, the active session, profile and consent choices, check-ins, cycles, follow-ups, Passport drafts, diary entries, diary lock hashes (if set), and safety state in this device’s `localStorage`. Records are namespaced by account. The fictional Priya demo uses the separate `guest-demo` namespace; demo records cannot be loaded into a registered account. Browser storage is accessible to someone with access to this device.

Health records, diary entries, and passwords are not sent to a server, backend, or AI service by the current app. The interface does request Google Fonts, which exposes ordinary connection metadata to Google, not health records. PDF creation and JSON export happen in the browser; a file is created only when you choose to download it. Export includes only the current account’s locally stored app data. “Delete everything” clears that account’s app data; “Delete my account and data” also removes its local account record.

The consent controls are limited in this prototype. “Save my check-ins on this device” currently controls Cycle-page edits only; check-ins and other settings are still written locally when this choice is off. “Use AI to explain patterns” is stored as a preference, but no AI is connected. The Passport sharing preference does not transmit anything; Passport content remains local, and the PDF requires an explicit download.

Authentication is demo-only. Account records and salted password hashes live in localStorage, where a device user can modify or remove them. Passwords are not stored as plain text, but this is **not production security** and must not be used as real authentication.

## Safety and limitations

`src/safety.ts` contains **demo rules, not clinically reviewed**, version `demo-0.1`. Pattern matching and safety results are educational examples, not clinical assessment. The current app has no AI connection; any AI explanation added later may explain a pattern but must not change safety urgency. This prototype is not medical advice or a diagnosis. Helpline values are 112 and Tele-MANAS 14416; verify them before release. Providers are fictional sample listings; independently verify care information.

## Validation plan

Planned before real-world use, not completed: clinician review of safety and pattern rules; usability testing with representative users; and a WCAG accessibility audit. These are future validation steps, not claims that the app has passed those reviews.
