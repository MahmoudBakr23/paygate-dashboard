# Paygate Dashboard

Merchant dashboard for [Paygate](https://github.com/MahmoudBakr23/paygate-api) — a portfolio payment gateway. Provides a landing page and a full post-login dashboard for managing charges, refunds, API keys, and webhook endpoints.

**Live:** https://paygate-dashboard.vercel.app  
**API:** https://paygate-api.fly.dev  
**Docs:** https://paygate-docs.vercel.app

---

## What's included

**Landing page**
- Hero section with MENA payment gateway positioning
- Supported payment methods (Visa, Mastercard, Mada, Apple Pay)
- Feature grid and CTA to register

**Dashboard (authenticated)**
- Overview — volume stats, success rate, volume-by-method bar chart (Recharts)
- Charges — filterable table with status badges
- Refunds — refund list per charge
- API Keys — list active keys, generate new pair (secret shown once with copy button), revoke
- Webhooks — register endpoints with event selector, view existing endpoints
- Settings — account info from `/v1/me`

---

## Stack

| | |
|-|-|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Charts | Recharts |
| Auth | JWT stored in httpOnly cookie via API route handler |
| Deployment | Vercel |

---

## Local Setup

**Requirements:** Node.js 20+

```bash
git clone https://github.com/MahmoudBakr23/paygate-dashboard
cd paygate-dashboard

npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

```bash
npm run dev
```

Open http://localhost:3001 (or whatever port Next.js assigns — the API defaults to port 3000).

For auth to work locally, start `paygate-api` first.

---

## Build

```bash
npm run build
npm run start
```

---

## Deployment (Vercel)

CI deploys automatically on push to `dev` via `.github/workflows/ci.yml`.

Environment variable set in `vercel.json`:

```
NEXT_PUBLIC_API_URL=https://paygate-api.fly.dev
```
