# Web App Documentation

Frontend for Subscription Cancellation Guarantee.

This app is designed for demo clarity: judges should understand the value quickly, navigate easily, and validate business impact in minutes.

## What This Frontend Delivers

- Fast, readable landing narrative
- Demo login with low friction
- Dashboard with spend + risk summary
- Subscription detail with cancellation action flow
- Renewal calendar with risk color coding

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand for session state

## Screens in This App

- /                     -> landing and value narrative
- /auth                 -> demo authentication
- /dashboard            -> portfolio summary and subscription overview
- /subscriptions/[id]   -> subscription-level operations and history
- /renewals             -> upcoming renewal timeline

## 5-Minute Frontend Setup

Fastest from repository root:

```bash
npm run setup
npm run dev
```

If you only want the web app process:

From repository root:

```bash
npm --prefix apps/web install
npm --prefix apps/web run dev
```

Open: http://localhost:3000

Default API target is http://localhost:4000.

If needed, override using NEXT_PUBLIC_API_BASE_URL.

Example:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 npm --prefix apps/web run dev
```

## Frontend Validation

```bash
npm --prefix apps/web run lint
npm --prefix apps/web run build
```

Both commands should pass before demo day.

## Design and UX Notes

- Visual language: glass surfaces + gradient atmosphere + clean hierarchy
- Typography: display + body contrast for storytelling and scannability
- Motion: small staggered reveal for section rhythm
- Responsiveness: mobile, tablet, and desktop layouts are supported

## Session and API Integration

- Session token is stored in client state using Zustand persistence
- Auth token is sent as Bearer token for protected endpoints
- API envelope pattern is handled through typed client helpers

## Main Frontend Folders

```text
apps/web
├── app/         # route pages and global styles
├── components/  # reusable UI blocks
├── lib/         # api client, types, formatting, session store
└── public/      # static assets
```

## Fast Judge Demo Path

1. Open /auth.
2. Login with demo email and PIN.
3. Inspect dashboard metrics.
4. Open any subscription detail.
5. Trigger cancellation actions.
6. Open /renewals for upcoming exposure.

This is the fastest path to validate product value and UX quality.
