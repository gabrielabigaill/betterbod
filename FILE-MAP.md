# BetterBody — File Map
Every file built so far and exactly where it goes in the Next.js project.

## STEP 1 — Run setup script first
Double-click `setup-nextjs-project.bat` in this folder.
This scaffolds the Next.js project and creates all directories.

## STEP 2 — Copy files into the project

| File in this folder | → Destination in project |
|---|---|
| `package.json` | `/package.json` (overwrite the generated one) |
| `next.config.ts` | `/next.config.ts` |
| `tsconfig.json` | `/tsconfig.json` |
| `tailwind.config.ts` | `/tailwind.config.ts` |
| `.gitignore` | `/.gitignore` |
| `.env.local.example` | `/.env.local.example` (then copy to `.env.local` and fill in keys) |
| `middleware.ts` | `/middleware.ts` |
| `app-layout.tsx` | `/app/layout.tsx` |
| `app-globals.css` | `/app/globals.css` |
| `component-SmoothScrollProvider.tsx` | `/components/providers/SmoothScrollProvider.tsx` |
| `component-CurrencyProvider.tsx` | `/components/providers/CurrencyProvider.tsx` |
| `component-Nav.tsx` | `/components/layout/Nav.tsx` |
| `api-webhook-stripe.ts` | `/app/api/webhooks/stripe/route.ts` |
| `api-checkout.ts` | `/app/api/checkout/route.ts` |
| `api-stride.ts` | `/app/api/stride/route.ts` |

## STEP 3 — Supabase
1. Go to supabase.com → your project → SQL Editor
2. Paste the contents of `supabase-schema.sql`
3. Click Run
4. Make yourself admin: `update profiles set role = 'admin' where email = 'your@email.com';`

## STEP 4 — Environment variables
Fill in `.env.local` with your Supabase + Stripe keys.
Add the same keys to Vercel dashboard under Settings → Environment Variables.

## STEP 5 — Run locally
```
npm run dev
```
Open http://localhost:3000

## STEP 6 — Deploy
```
npx vercel --prod
```

## Still to come (next sessions)
- Homepage React component (`app/page.tsx`)
- Programs, Stride Club, Membership, About pages (React)
- Admin dashboard components
- Auth pages (login, signup, forgot password)
- Account member portal
- Cookie consent banner component
- Footer component
