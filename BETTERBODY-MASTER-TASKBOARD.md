# BetterBody — Master Build Taskboard
**Project:** BetterBody Fitness Platform + Stride Club  
**Stack:** Next.js 14 · Supabase · Stripe · Vercel  
**Last Updated:** June 2026  
**Status Key:** ✅ Done · 🔄 In Progress · ⬜ Pending · 🔴 Blocked · ⚠️ Needs Review

---

## THE COUNCIL

> Every decision in this build has been reviewed by the following specialists. Their concerns and directives shape the task list below.

---

### 🛡️ ARIA CHEN — Senior Cybersecurity Specialist
*CISSP · OWASP Top 10 · PCI DSS · Zero-Trust Architecture*

**Directives:**
- All auth must use Supabase JWT with short-lived tokens + refresh rotation
- Payment card data must NEVER touch our servers — Stripe handles everything
- All API routes must validate session server-side before returning data
- Row Level Security (RLS) must be enabled on every Supabase table
- Implement CSP headers, HSTS, X-Frame-Options, and XSS protection at Vercel edge
- Rate-limit all public API endpoints (especially auth, payments, step submissions)
- Input sanitization on every form — assume all user input is hostile
- Environment secrets must never be in client-side code
- Regular dependency audits before launch

---

### ⚙️ MARCUS WRIGHT — Senior Software Engineer
*Next.js 14 · React · TypeScript · Supabase · Stripe · REST/GraphQL*

**Directives:**
- Convert static HTML to proper Next.js 14 App Router with TypeScript
- Use Server Components by default; Client Components only where interactivity is required
- Supabase client must be instantiated server-side for sensitive queries
- Stripe webhooks must be verified with the signing secret before processing
- All database mutations go through Supabase server client, not the anon key from browser
- IP-based currency detection via Vercel Edge Middleware (runs before page load, zero latency)
- Animation library: GSAP + ScrollTrigger for scroll animations, Lenis for smooth scroll
- Framer Motion for component-level transitions
- Image optimization through Next.js Image component
- Mobile-first development — every component built for 375px first

---

### 🌐 DOMINIC PIERRE — Senior IT & Networks Officer
*DNS · CDN · SSL/TLS · Uptime Monitoring · Performance*

**Directives:**
- Custom domain to be pointed to Vercel via A/CNAME records — not proxied through Cloudflare initially
- Force HTTPS redirect at Vercel project level — no HTTP access
- Enable Vercel Edge Network caching for static assets (1-year cache headers on fonts, images)
- Set up Vercel Web Analytics + Speed Insights from day one
- UptimeRobot (free tier) on the live URL — alert within 1 minute of downtime
- Supabase database in closest region to primary user base
- Image CDN: use Supabase Storage with CDN enabled for product/program images
- DNS TTL set low (300s) before domain cutover, raise to 3600s after stable

---

### 🎨 SOFIA MELO — Senior UX/UI Designer
*Motion Design · WCAG 2.1 AA · Conversion Optimisation · Mobile UX*

**Directives:**
- All animations must respect `prefers-reduced-motion` — no motion for users who opt out
- Minimum tap target size: 44×44px on mobile
- Color contrast ratio: 4.5:1 minimum for all text (coral on white passes, verify teal combos)
- Page load LCP must be under 2.5s — hero image needs to be WebP, preloaded
- Skeleton loading states on all data-fetched components (leaderboard, orders, etc.)
- Sticky nav must collapse to hamburger below 768px
- Every CTA button needs a clear hover AND focus state (keyboard navigation)
- Currency selector UI: subtle flag + code in nav, dropdown on click

---

### 📦 KEZIA THOMAS — Senior Product Manager
*User Stories · Acceptance Criteria · Launch Readiness · Roadmap*

**Directives:**
- Minimum Viable Launch: Homepage + Programs + Membership checkout + Stripe working + Auth
- Stride Club is Phase 2 of launch (can go live 2 weeks after main site)
- Admin dashboard is internal — does not block customer-facing launch
- Every feature needs a working empty state (no orders, no steps, no members)
- Soft launch to 50 beta users before public launch — gather feedback
- Payment flows must be tested with Stripe test cards before going live
- All pages need proper `<title>` and `<meta description>` before launch

---

### 🚀 ALEX OSEI — DevOps & Infrastructure Engineer
*CI/CD · GitHub Actions · Environment Management · Monitoring*

**Directives:**
- Three environments: `development` (local), `preview` (Vercel PR deploys), `production`
- GitHub Actions pipeline: lint → type-check → build → deploy on push to `main`
- Separate Supabase projects for dev and production — never share databases
- Vercel environment variables set per environment (dev/preview/prod)
- Error monitoring: Sentry free tier integrated from week one
- Database backups: Supabase Pro includes daily backups — enable before launch
- Never commit secrets — use `.env.local` locally, Vercel dashboard for production

---

### ⚖️ PRIYA NAIR — Legal & Compliance Officer
*GDPR · CCPA · PCI DSS · Cookie Law · Terms & Privacy*

**Directives:**
- Privacy Policy must be live before any data collection begins
- Cookie consent banner required — only set analytics cookies after explicit accept
- Terms & Conditions must cover: subscriptions, cancellation, refund policy, digital goods
- Refund policy: 7-day refund for memberships, no refund on Stride Club workbooks once downloaded
- Age gate: users must confirm 18+ before purchasing (or parent consent flow)
- GDPR right to deletion: users must be able to delete their account + all data
- Stripe handles PCI compliance for card data — document this in privacy policy
- Subscription auto-renewal must be clearly disclosed at checkout

---

### 💳 RYAN FOSTER — Payments & Subscriptions Specialist
*Stripe · Webhooks · Subscription Lifecycle · Chargeback Prevention*

**Directives:**
- Use Stripe Checkout (hosted) for initial launch — faster, PCI compliant out of the box
- Products in Stripe: Monthly Membership ($19.99/mo), Annual Membership ($199/yr), Stride Club ($5/mo)
- Webhook events to handle: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- Failed payment recovery: Stripe Smart Retries enabled, email notification on failure
- Stripe Customer Portal for self-serve subscription management (cancel, upgrade, update card)
- Promo codes via Stripe Coupons — connect to admin coupon UI
- Currency: charge in customer's local currency where supported by Stripe
- Chargeback protection: store `checkout.session.id` and `customer.id` against every order

---
---

## MASTER TASK LIST

> Check off tasks as completed. Format: `- [x]` = done, `- [ ]` = pending.
> Sessions can resume from any unchecked item.

---

## 🗂️ SECTION 0 — PROJECT SETUP

### 0.1 Repository & Environments
- [x] Create static HTML prototype (Phase 1 & 2 complete)
- [x] Next.js 14 `package.json` with all dependencies created
- [x] `next.config.ts` with security headers + image optimization
- [x] `tsconfig.json` configured
- [x] `tailwind.config.ts` with BetterBody design tokens
- [x] `.env.local.example` with all required variable names
- [x] `.gitignore` configured
- [x] `setup-nextjs-project.bat` — one-click project scaffolding
- [ ] Run `setup-nextjs-project.bat` to scaffold on developer machine
- [ ] Push to GitHub repo (`betterbody`)
- [ ] Connect GitHub repo to Vercel
- [ ] Configure three Vercel environments: development, preview, production

### 0.2 Supabase Setup
- [ ] Create Supabase project: `betterbody-prod`
- [ ] Create Supabase project: `betterbody-dev`
- [ ] Copy Supabase URL + anon key into Vercel environment variables
- [ ] Copy Supabase service role key into Vercel (server-side only, never client)
- [ ] Enable Email Auth provider in Supabase dashboard
- [ ] Configure Supabase email templates (confirm email, reset password)

### 0.3 Stripe Setup
- [ ] Create Stripe account (or use existing)
- [ ] Create products in Stripe dashboard:
  - [ ] Monthly Membership — $19.99/month recurring
  - [ ] Annual Membership — $199/year recurring
  - [ ] Stride Club — $5/month recurring
- [ ] Copy Stripe publishable key + secret key into Vercel env vars
- [ ] Create Stripe webhook endpoint pointing to `/api/webhooks/stripe`
- [ ] Copy webhook signing secret into Vercel env vars
- [ ] Enable Stripe Customer Portal in Stripe dashboard
- [ ] Test all products with Stripe test mode cards

---

## 🗄️ SECTION 1 — DATABASE SCHEMA (Supabase)

### 1.1 Core Tables
- [x] Create `profiles` table (extends Supabase auth.users)
  - `id` (uuid, FK to auth.users)
  - `full_name` (text)
  - `email` (text)
  - `avatar_url` (text)
  - `currency` (text, default 'USD')
  - `country_code` (text)
  - `created_at` (timestamptz)
- [ ] Create `subscriptions` table
  - `id` (uuid)
  - `user_id` (uuid, FK profiles)
  - `stripe_customer_id` (text)
  - `stripe_subscription_id` (text)
  - `plan_type` (enum: monthly, annual, stride_club)
  - `status` (enum: active, cancelled, past_due, trialing)
  - `current_period_end` (timestamptz)
  - `created_at` (timestamptz)
- [ ] Create `orders` table
  - `id` (uuid)
  - `user_id` (uuid, FK profiles)
  - `stripe_session_id` (text)
  - `amount_total` (integer, cents)
  - `currency` (text)
  - `status` (enum: pending, complete, refunded)
  - `items` (jsonb)
  - `created_at` (timestamptz)

### 1.2 Content Tables
- [ ] Create `programs` table
  - `id` (uuid)
  - `name` (text)
  - `slug` (text, unique)
  - `short_description` (text)
  - `full_description` (text)
  - `cover_image_url` (text)
  - `duration_weeks` (integer)
  - `days_per_week` (integer)
  - `difficulty` (enum: beginner, intermediate, advanced)
  - `location` (enum: gym, home, travel, any)
  - `is_active` (boolean)
  - `is_featured` (boolean)
  - `sort_order` (integer)
  - `created_at` (timestamptz)
- [ ] Create `challenges` table (same structure as programs + `start_date`, `end_date`)
- [ ] Create `products` table (physical/digital merchandise)
  - `id`, `name`, `slug`, `description`, `price_usd`, `type` (physical/digital), `image_url`, `is_active`, `stripe_price_id`
- [ ] Create `bundles` table + `bundle_items` join table
- [ ] Create `nutrition_recipes` table
  - `id`, `title`, `slug`, `description`, `image_url`, `category`, `calories`, `prep_time_mins`, `ingredients` (jsonb), `steps` (jsonb), `is_active`

### 1.3 Stride Club Tables
- [ ] Create `stride_sessions` table
  - `id` (uuid)
  - `user_id` (uuid, FK profiles)
  - `steps` (integer)
  - `duration_seconds` (integer)
  - `started_at` (timestamptz)
  - `ended_at` (timestamptz)
  - `week_number` (integer)
  - `year` (integer)
- [ ] Create `stride_leaderboard` view (weekly aggregation of stride_sessions)
- [ ] Create `stride_workbooks` table
  - `id`, `title`, `month`, `year`, `file_url`, `is_active`
- [ ] Create `stride_workbook_access` table (tracks which users downloaded which workbook)

### 1.4 Admin & Marketing Tables
- [ ] Create `coupons` table
  - `id`, `code` (unique), `type` (percent/fixed), `value`, `usage_count`, `max_uses`, `expires_at`, `is_active`, `stripe_coupon_id`
- [ ] Create `reviews` table
  - `id`, `user_id`, `product_type` (program/product/bundle), `product_id`, `rating` (1-5), `body`, `is_approved`, `created_at`
- [ ] Create `subscribers` table (email list, pre-auth)
  - `id`, `email`, `source` (homepage/stride_club/etc), `subscribed_at`
- [ ] Create `email_templates` table
  - `id`, `name`, `subject`, `html_body`, `type` (transactional/marketing), `updated_at`

### 1.5 Row Level Security (RLS)
- [ ] Enable RLS on ALL tables
- [ ] `profiles`: users can read/update only their own row; service role can read all
- [ ] `subscriptions`: users read only their own; service role full access
- [ ] `orders`: users read only their own; service role full access
- [ ] `stride_sessions`: users CRUD only their own; leaderboard view is public read
- [ ] `programs`, `challenges`, `recipes`: public read if `is_active = true`
- [ ] `products`, `bundles`: public read if `is_active = true`
- [ ] `coupons`: service role only
- [ ] `reviews`: approved reviews are public read; users can insert their own
- [ ] `subscribers`: insert only via service role (no public read)
- [ ] Write RLS policy tests in Supabase dashboard

---

## ⚙️ SECTION 2 — NEXT.JS APP STRUCTURE

### 2.1 Project Architecture
- [x] Set up `app/layout.tsx` (App Router root layout)
- [x] Create `Nav` component with currency selector + mobile hamburger
- [x] Create `SmoothScrollProvider` (Lenis + GSAP + custom cursor)
- [x] Create `CurrencyProvider` with `useCurrency()` hook
- [x] `app/globals.css` with all animation + utility classes
- [x] Configure `middleware.ts` for currency detection + auth protection on `/account`, `/admin`
- [ ] `utils/supabase/client.ts` (browser client) — copy once project scaffolded
- [ ] `utils/supabase/server.ts` (server component client)
- [ ] Footer component

### 2.2 Pages to Build (App Router)
- [ ] `/` — Homepage (convert from HTML)
- [ ] `/programs` — Programs listing page
- [ ] `/programs/[slug]` — Individual program detail page
- [ ] `/challenges` — Challenges listing
- [ ] `/challenges/[slug]` — Challenge detail
- [ ] `/nutrition` — Nutrition/recipes page
- [ ] `/nutrition/[slug]` — Individual recipe page
- [ ] `/stride-club` — Stride Club marketing + tracker page
- [ ] `/membership` — Pricing + checkout page
- [ ] `/about` — About Judith page
- [ ] `/shop` — Merchandise listing
- [ ] `/shop/[slug]` — Product detail
- [ ] `/account` — Member dashboard (protected)
- [ ] `/account/programs` — My programs (protected)
- [ ] `/account/nutrition` — My nutrition (protected)
- [ ] `/account/stride-club` — My Stride Club + tracker (protected)
- [ ] `/account/billing` — Subscription management (protected)
- [ ] `/account/settings` — Profile settings (protected)
- [ ] `/auth/login` — Login page
- [ ] `/auth/signup` — Signup page
- [ ] `/auth/forgot-password` — Password reset
- [ ] `/auth/callback` — Supabase OAuth callback handler
- [ ] `/admin` — Admin dashboard (protected, admin role only)
- [ ] `/admin/orders` — Orders management
- [ ] `/admin/products` — Products management
- [ ] `/admin/programs` — Programs management
- [ ] `/admin/users` — Users management
- [ ] `/admin/stride-club` — Stride Club management
- [ ] `/admin/coupons` — Coupons management
- [ ] `/admin/reviews` — Reviews moderation
- [ ] `/admin/subscribers` — Email subscribers list
- [ ] `/admin/email-templates` — Email template editor
- [ ] `/admin/settings` — Site settings (hero text, announcement bar, exchange rate)
- [ ] `/legal/privacy-policy` — Privacy Policy
- [ ] `/legal/terms` — Terms & Conditions
- [ ] `/legal/refunds` — Refund Policy
- [ ] `/legal/cookies` — Cookie Policy

### 2.3 API Routes
- [x] `POST /api/webhooks/stripe` — Full webhook handler (checkout, subscription lifecycle, payment failure)
- [x] `POST /api/checkout` — Create Stripe checkout session with rate limiting
- [x] `POST /api/stride` (start + stop) — Step tracking with anti-cheat validation
- [x] `GET  /api/stride` — Weekly leaderboard fetch
- [ ] `GET  /api/currency` — Return rates from Supabase settings table
- [ ] `POST /api/subscribe` — Add email to subscribers list
- [ ] `POST /api/admin/send-email` — Send marketing email (admin only)
- [ ] `GET  /api/admin/stats` — Dashboard stats (admin only)

---

## 🎨 SECTION 3 — MOTION & ANIMATIONS (DONPROD-INSPIRED)

### 3.1 Dependencies
- [x] `lenis` — in package.json
- [x] `gsap` + `@gsap/react` — in package.json
- [x] `framer-motion` — in package.json
- [x] `SmoothScrollProvider.tsx` — Lenis + ScrollTrigger + custom cursor built

### 3.2 Global Animations
- [ ] **Smooth scroll** — Lenis wraps the entire app, buttery 60fps scroll
- [ ] **Page transitions** — fade + slight upward slide between route changes (Framer Motion)
- [ ] **Loading screen** — BetterBody logo animates in on first load (0.8s, then fades out)
- [ ] **Custom cursor** — subtle circle cursor that scales on hover over links/buttons (desktop only)
- [ ] **Scroll progress bar** — thin coral line at top of page showing scroll depth

### 3.3 Homepage Animations
- [ ] **Hero text reveal** — headline words stagger in with upward slide (GSAP SplitText or CSS)
- [ ] **Hero image parallax** — right-side image scrolls at 0.7x speed on scroll
- [ ] **Stats counter** — numbers count up when stats bar enters viewport
- [ ] **Scroll-triggered section reveals** — each section fades + slides up as it enters viewport (ScrollTrigger)
- [ ] **Program card hover** — subtle 3D tilt effect on hover (perspective transform)
- [ ] **Magnetic buttons** — primary CTAs subtly attract cursor within 60px radius
- [ ] **Feature icon micro-animations** — icons rotate/bounce when their section enters view

### 3.4 Programs Page Animations
- [ ] **Filter transition** — cards that don't match filter shrink + fade out; matching ones expand in
- [ ] **Card stagger** — program cards animate in with 80ms stagger on page load
- [ ] **Image zoom on hover** — already in CSS, confirm smooth 60fps

### 3.5 Stride Club Animations
- [ ] **Step counter tick** — each step increment has a micro bounce on the number
- [ ] **Leaderboard bar fill** — bars animate width on page load (left to right, staggered)
- [ ] **Leaderboard live pulse** — gold #1 row has a subtle pulsing glow border
- [ ] **Progress bar fill** — smooth CSS transition as steps increase toward goal

### 3.6 Membership Page Animations
- [ ] **Pricing cards stagger in** on scroll
- [ ] **Featured card** has a slow shimmer animation on its border
- [ ] **FAQ accordion** — smooth height transition (not display:none toggle)

### 3.7 Accessibility
- [ ] Wrap all GSAP/Lenis animations with `prefers-reduced-motion` media query check
- [ ] If user has reduced motion: disable parallax, Lenis, and complex entrance animations; keep simple fades only

---

## 🌍 SECTION 4 — IP-BASED CURRENCY DETECTION

### 4.1 Edge Middleware
- [x] `middleware.ts` created — reads `x-vercel-ip-country` Vercel header
- [x] Maps country code → currency code + symbol
- [x] Sets `bb_currency`, `bb_currency_sym`, `bb_country` cookies on response
- [ ] Currency map to cover at minimum:
  - `JM` → JMD (Jamaican Dollar) — primary market
  - `AU` → AUD (Australian Dollar)
  - `GB` → GBP (British Pound)
  - `US` → USD (US Dollar) — default
  - `CA` → CAD (Canadian Dollar)
  - `EU` countries → EUR (Euro)
  - `TT`, `BB`, `GY`, `LC`, etc. → TTD/USD (Caribbean — use USD)

### 4.2 Exchange Rate Management
- [ ] Store base exchange rates in Supabase `settings` table (admin can update)
- [ ] Admin Settings page has "Exchange Rate" inputs per currency
- [ ] Create `/api/currency` route that returns current rates from Supabase
- [ ] Optional: cron job to auto-update rates from a free FX API (exchangerate.host)

### 4.3 Frontend Currency Display
- [ ] Create `useCurrency()` hook — reads cookie, returns `{ code, symbol, rate, format(usdAmount) }`
- [ ] All price displays use `useCurrency().format(price)` — never hardcoded "$"
- [ ] Currency selector in nav (flag + code) — lets user override auto-detected currency
- [ ] Persist manual override in `localStorage` (takes priority over cookie)
- [ ] Checkout always charges in USD via Stripe (display local currency as "approximately X")

---

## 🔐 SECTION 5 — AUTHENTICATION & SECURITY

### 5.1 Auth Flows
- [ ] Email + password signup with email confirmation
- [ ] Email + password login
- [ ] Google OAuth (optional, nice to have)
- [ ] Password reset via email
- [ ] Auth state persisted via Supabase session + `middleware.ts` refresh
- [ ] On signup: auto-create row in `profiles` table via Supabase trigger
- [ ] On subscription complete (Stripe webhook): update `subscriptions` table

### 5.2 Security Headers (Vercel `headers()` in `next.config.ts`)
- [ ] `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- [ ] `Content-Security-Policy` — allow Supabase, Stripe, Google Fonts, Vercel Analytics

### 5.3 Rate Limiting
- [ ] Rate limit `/api/checkout/create-session` — max 10 per IP per minute
- [ ] Rate limit `/api/auth/*` — max 5 attempts per IP per 15 minutes
- [ ] Rate limit `/api/stride/stop` — max 1 per user per 10 seconds (anti-cheat)
- [ ] Use Vercel KV or Upstash Redis for rate limit counters

### 5.4 Anti-Cheat (Stride Club)
- [ ] Maximum steps per session capped at 50,000 (server-side validation)
- [ ] Minimum session duration: 60 seconds before steps count
- [ ] Flag sessions where steps-per-second > 5 (physically impossible walking pace)
- [ ] Flagged sessions held for manual admin review before leaderboard inclusion

---

## 📧 SECTION 6 — EMAIL SYSTEM

### 6.1 Transactional Emails (Resend or SendGrid)
- [ ] Set up Resend account + verify sending domain
- [ ] Create email templates for:
  - [ ] Welcome email (on signup)
  - [ ] Email confirmation (Supabase default — customise template)
  - [ ] Purchase confirmation (on `checkout.session.completed`)
  - [ ] Subscription renewal reminder (3 days before renewal)
  - [ ] Payment failed notification
  - [ ] Subscription cancelled confirmation
  - [ ] Password reset (Supabase default — customise template)
  - [ ] Stride Club workbook delivery (monthly)

### 6.2 Marketing Emails
- [ ] Admin can compose + send to all subscribers from admin dashboard
- [ ] Unsubscribe link in every marketing email (legal requirement)
- [ ] Track open/click rates via Resend analytics

---

## 🖥️ SECTION 7 — ADMIN DASHBOARD

### 7.1 Dashboard Overview
- [ ] Total revenue (this month vs last month)
- [ ] Total active subscriptions breakdown (monthly/annual/stride)
- [ ] Total users count
- [ ] New signups this week
- [ ] Orders awaiting fulfillment
- [ ] Top 5 programs by member engagement
- [ ] Recent orders table

### 7.2 Orders Management
- [ ] List all orders (filterable by status, date, amount)
- [ ] Order detail view (customer info, items, Stripe session link)
- [ ] Mark physical orders as shipped + enter tracking number
- [ ] Trigger manual refund (via Stripe API)

### 7.3 Products & Programs
- [ ] CRUD for products (name, description, price, image, type, active toggle)
- [ ] CRUD for programs (all fields including week/day structure)
- [ ] CRUD for challenges
- [ ] CRUD for bundles (select products/programs to bundle + set price)
- [ ] Image upload to Supabase Storage

### 7.4 Users
- [ ] List all users with subscription status
- [ ] User detail: orders, active subscription, Stride Club stats
- [ ] Manually grant/revoke access
- [ ] Delete user (GDPR compliance — purges all data)

### 7.5 Stride Club Admin
- [ ] View weekly leaderboard with flagged session warnings
- [ ] Approve/reject flagged sessions
- [ ] Upload monthly workbook PDF
- [ ] View all members + their step totals
- [ ] Manual leaderboard reset

### 7.6 Coupons
- [ ] Create coupon (code, % or fixed discount, usage limit, expiry, Stripe coupon sync)
- [ ] Toggle active/inactive
- [ ] View usage count per coupon

### 7.7 Settings Page
- [ ] Hero headline + caption + CTA text
- [ ] Announcement bar text + toggle show/hide
- [ ] Sale banner enable/disable + discount % + countdown end date
- [ ] Exchange rates per currency (JMD, AUD, GBP, EUR, CAD)
- [ ] Judith bio text
- [ ] Social links (Instagram, TikTok, YouTube)
- [ ] Support email address

---

## ⚖️ SECTION 8 — LEGAL PAGES

- [ ] Write Privacy Policy (covers: data collected, Stripe payment data, Supabase storage, email marketing, cookies, GDPR rights)
- [ ] Write Terms & Conditions (subscriptions, auto-renewal disclosure, digital goods policy, user conduct)
- [ ] Write Refund Policy (7-day refund on memberships, workbook policy)
- [ ] Write Cookie Policy
- [ ] Build Cookie Consent Banner component:
  - [ ] Shows on first visit
  - [ ] "Accept All" / "Necessary Only" options
  - [ ] Stores preference in localStorage
  - [ ] Only loads Google Analytics + Vercel Analytics after accept
- [ ] Add links to all legal pages in site footer

---

## 📱 SECTION 9 — SEO & PERFORMANCE

### 9.1 SEO
- [ ] Generate `metadata` for every page (title, description, og:image)
- [ ] Create `sitemap.xml` (Next.js auto-generation)
- [ ] Create `robots.txt`
- [ ] Add JSON-LD structured data on program pages (Course schema)
- [ ] Add JSON-LD on homepage (Organization schema)
- [ ] Add JSON-LD on product pages (Product schema)
- [ ] Verify site in Google Search Console after launch

### 9.2 Performance
- [ ] Convert all hero images to WebP
- [ ] Add `priority` prop to above-the-fold images (LCP optimisation)
- [ ] Lazy-load all below-fold images
- [ ] Implement skeleton loading states on dynamic content
- [ ] Run Lighthouse audit — target 90+ on all scores
- [ ] Enable Vercel Speed Insights

---

## 🧪 SECTION 10 — TESTING & QA

### 10.1 Payment Testing
- [ ] Test Monthly Membership checkout with Stripe test card `4242 4242 4242 4242`
- [ ] Test failed payment with card `4000 0000 0000 0002`
- [ ] Test subscription cancellation via Stripe Customer Portal
- [ ] Test annual membership checkout
- [ ] Test Stride Club subscription
- [ ] Test coupon code application at checkout
- [ ] Verify webhook fires and updates Supabase `subscriptions` table

### 10.2 Auth Testing
- [ ] Signup with valid email
- [ ] Confirm email flow
- [ ] Login / logout
- [ ] Password reset flow
- [ ] Protected route blocks unauthenticated user
- [ ] Admin route blocks non-admin user

### 10.3 Stride Club Testing
- [ ] Start + stop walk session — steps saved to DB
- [ ] Anti-cheat: attempt session under 60 seconds — should not count
- [ ] Anti-cheat: submit 60,000 steps — should be capped/flagged
- [ ] Leaderboard updates after session ends
- [ ] Weekly leaderboard resets on Monday

### 10.4 Currency Testing
- [ ] Test from JM IP → JMD displayed
- [ ] Test from AU IP → AUD displayed
- [ ] Test from GB IP → GBP displayed
- [ ] Manual currency override persists on refresh
- [ ] Checkout always charges in USD regardless of display currency

### 10.5 Cross-Browser & Mobile
- [ ] Chrome (desktop + mobile)
- [ ] Safari (desktop + iOS)
- [ ] Firefox
- [ ] Edge
- [ ] 375px mobile width (iPhone SE)
- [ ] 390px (iPhone 14)
- [ ] 768px (iPad)
- [ ] 1440px (desktop)

---

## 🚀 SECTION 11 — LAUNCH SEQUENCE

### 11.1 Pre-Launch (1 week before)
- [ ] Stripe switch from TEST mode to LIVE mode
- [ ] Add real Stripe live keys to Vercel production environment
- [ ] Point custom domain to Vercel (update DNS A/CNAME records)
- [ ] Verify HTTPS is working on custom domain
- [ ] Seed Supabase production DB with initial programs, challenges, recipes
- [ ] Upload program cover images to Supabase Storage
- [ ] Run final Lighthouse audit on production URL
- [ ] Set up UptimeRobot monitoring on production URL
- [ ] Set up Sentry error monitoring
- [ ] Enable Supabase daily backups (requires Pro plan)

### 11.2 Soft Launch (beta — 50 users)
- [ ] Invite beta users via direct email with early access link
- [ ] Monitor Vercel logs + Sentry for errors in real-time
- [ ] Collect feedback via simple form (Tally.so or Typeform)
- [ ] Fix any critical bugs before public launch
- [ ] Verify at least 3 real payments processed successfully

### 11.3 Public Launch
- [ ] Remove beta/coming-soon gate
- [ ] Announce on Instagram + TikTok
- [ ] Send launch email to subscriber list
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor daily active users + conversion rate for first 7 days
- [ ] Have Stripe payout schedule confirmed

---

## 📊 SECTION 12 — POST-LAUNCH ROADMAP

*These are confirmed future features — not blocking launch.*

- [ ] **Mobile app** (React Native, reuses Supabase backend)
- [ ] **Live coaching sessions** (Zoom/StreamYard integration)
- [ ] **Nutrition meal planner** (generate weekly plan from recipe library)
- [ ] **Apple Health / Google Fit integration** for automatic step sync
- [ ] **Affiliate / referral program** (Stripe affiliate or custom)
- [ ] **Group challenges** (friends can create private leaderboards)
- [ ] **Push notifications** (step reminders, leaderboard updates)
- [ ] **Podcast / YouTube content hub** embedded on site

---

## 📋 COUNCIL SIGN-OFF CHECKLIST
*Before launch, each council member signs off on their domain.*

| Specialist | Domain | Signed Off |
|---|---|---|
| Aria Chen | Security audit complete, headers verified, no exposed secrets | ⬜ |
| Marcus Wright | All TypeScript errors resolved, no console errors in prod | ⬜ |
| Dominic Pierre | Domain live on HTTPS, CDN caching confirmed, uptime monitor active | ⬜ |
| Sofia Melo | Lighthouse 90+ all scores, mobile UX reviewed, a11y checked | ⬜ |
| Kezia Thomas | All MVP pages functional, empty states handled, beta feedback positive | ⬜ |
| Alex Osei | CI/CD pipeline passing, Sentry active, prod DB backed up | ⬜ |
| Priya Nair | Privacy Policy live, cookie banner working, T&Cs published | ⬜ |
| Ryan Foster | Live Stripe keys active, webhooks verified, 3 real payments confirmed | ⬜ |

---

*This document is the single source of truth for the BetterBody build. Update it at the start of every session.*
