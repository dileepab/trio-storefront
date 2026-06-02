# Trio Storefront — Next.js app

A Next.js 14 (App Router) implementation of the Trio multi-brand storefront. One codebase, three brand skins (Happy Buy, Cleopatra, Modabella) resolved by URL segment.

## Run it

```bash
cd nextjs-app
npm install
npm run dev
# open http://localhost:3000
```

To read live products from GarmentOS/platform instead of the mock catalog:

```bash
PLATFORM_API_BASE_URL=https://app.deez.lk npm run dev
```

For local testing, run the platform app first and use its local URL, for example
`PLATFORM_API_BASE_URL=http://127.0.0.1:3000`.

## Routes

| Path | Page |
|---|---|
| `/` | Trio portal — brand picker |
| `/[brand]` | Brand home (hero, trust strip, featured rail) |
| `/[brand]/shop` | Listing page with filter chips |
| `/[brand]/p/[slug]` | Product detail with size selector & sticky CTA |
| `/[brand]/cart` | Cart with COD / bank-transfer toggle |

`[brand]` ∈ `happybuy`, `cleopatra`, `modabella`.

## Architecture

```
nextjs-app/
├── app/
│   ├── layout.js               # Root layout + global CSS
│   ├── page.js                 # Trio portal
│   ├── globals.css             # Brand tokens (--brand-*, --font-*, --radius)
│   ├── storefront.css          # Layout + per-brand component CSS
│   └── [brand]/
│       ├── layout.js           # data-brand wrapper, Header + Footer + ChatFAB
│       ├── page.js             # Home
│       ├── shop/page.js
│       ├── p/[slug]/page.js
│       └── cart/page.js
├── components/
│   ├── Icon.js                 # Inline Lucide-style strokes
│   ├── Header.js, Footer.js, Hero.js, TrustStrip.js
│   ├── CollectionRail.js, ProductCard.js, PLPFilters.js
│   ├── PDP.js                  # 'use client' for size selector
│   ├── Cart.js                 # 'use client' for qty state
│   └── ChatFAB.js              # 'use client' for open/close
├── lib/
│   ├── brands.js               # BRANDS registry + getBrand()
│   └── products.js             # Mock catalog + HERO + RAIL_TITLES
├── public/logos/               # Brand wordmarks (placeholders)
├── package.json, next.config.js, jsconfig.json
```

## How brand-skinning works

Every component uses CSS custom properties — `--brand-primary`, `--font-display`, `--radius`, etc. — defined in `app/globals.css`. The `[brand]/layout.js` sets `data-brand="happybuy"` (or whichever) on a wrapper, and the entire subtree flips skin.

## Production checklist

Before shipping:

1. **Replace logos** in `public/logos/` — current SVGs are typographic placeholders.
2. **Wire real data** — `lib/products.js` reads `PLATFORM_API_BASE_URL` and falls back to mocks when unavailable.
3. **Cart state** — currently in-component `useState`. Hoist to a context or Zustand/Jotai store and persist to localStorage / server.
4. **Authentication** — add NextAuth or your provider for `/account` and order tracking.
5. **Real product imagery** — replace gradient placeholders in `ProductCard` and `PDP` with `next/image` and CDN URLs.
6. **i18n** — Sinhala-ready copy keys; the brand voice rules are in `lib/brands.js`.
7. **Channel integrations** — wire Messenger / WhatsApp deep links and the AI inbox.

## Brand voice

Inferred from the brief — confirm with brand owners.

| | Happy Buy | Cleopatra | Modabella |
|---|---|---|---|
| Case | Title | Title | lowercase |
| Tone | Direct, value-led | Composed, deferential | Editorial, calm |
| Emoji | OK in marketing | Never | Never |
| Pricing | `LKR 4,990` | `LKR 4,990` | `LKR 4,990` |

## What's not included yet

- Order confirmation / track order pages — reuse `Header` + `Footer` and a generic two-col layout.
- Account & wishlist screens.
- Admin console (separate Next.js app or `/admin/*` route group).
- Real auth, checkout, payment integration.
