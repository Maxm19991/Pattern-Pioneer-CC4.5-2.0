# Pattern Pioneer - MVP Website

A Next.js e-commerce platform for selling premium digital patterns.

## ✨ Features (MVP Phase 1)

- ✅ Homepage with hero section and newsletter signup
- ✅ Pattern grid with 113 patterns (converted to WEBP)
- ✅ Pattern detail pages with seamless tiling preview
- ✅ Shopping cart functionality
- ✅ Stripe checkout (test mode)
- ✅ Account area (placeholder)
- ✅ Admin panel (placeholder)
- ✅ Responsive design with pastel color scheme

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Stripe account (for test keys)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:

Copy `.env.local.example` to `.env.local` and add your Stripe test keys:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
```

Get your Stripe test keys from: https://dashboard.stripe.com/test/apikeys

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing Stripe Checkout

Use these test card details:
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## 📁 Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── patterns/             # Pattern listing and detail pages
│   ├── cart/                 # Shopping cart
│   ├── checkout/             # Checkout flow
│   ├── account/              # User account area
│   └── admin/                # Admin panel (placeholder)
├── components/               # React components
├── lib/                      # Utilities and data
│   ├── data/                 # Pattern data (JSON for MVP)
│   ├── db/                   # Database schema
│   ├── store/                # Zustand state management
│   └── types.ts              # TypeScript types
├── public/patterns/          # Pattern images (WEBP)
└── scripts/                  # Utility scripts
```

## 🎨 Patterns

All patterns are stored in `public/patterns/` as WEBP files. The pattern metadata is in `lib/data/patterns.json`.

To add new patterns:
1. Add PNG files to `Patterns 72DPI/` folder
2. Run `npm run convert-patterns` (coming soon)
3. Run `npm run seed-patterns` to regenerate metadata

## 📋 Phase 1 Complete

**What's working:**
- Browse and view 113 patterns
- Add patterns to cart
- Checkout with Stripe (test mode)
- Responsive design
- Email capture forms (UI only)

**Coming in Phase 2:**
- Supabase integration (database + storage)
- NextAuth authentication
- Actual email capture & newsletter
- Download functionality
- Subscription & credits system
- Admin panel (upload, manage)
- Order history & invoices
- Favorites

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Payments:** Stripe
- **Database:** (TBD - Supabase recommended)
- **Auth:** (TBD - NextAuth.js v5)
- **Hosting:** Vercel (recommended for free tier)

## 💰 Cost Optimization

This stack is designed for minimal costs:
- **Vercel:** Free tier (hobby projects)
- **Supabase:** Free tier (500MB DB, 1GB storage)
- **Stripe:** No monthly fees, 2.9% + €0.30 per transaction
- **Total fixed costs:** €0/month

## 🔒 Environment Variables

Required:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key

Optional (for Phase 2):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXTAUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - App URL

## 📝 Next Steps

1. **Get Stripe test keys** and add to `.env.local`
2. **Test the checkout flow** with test card
3. **Set up Supabase** project for database
4. **Add Stripe webhook** for payment confirmation
5. **Implement authentication** with NextAuth
6. **Build download functionality** with Supabase Storage
7. **Write content** for About page and legal pages

## 🐛 Known Issues

- Email forms don't actually send emails yet (Phase 2)
- Downloads page is a placeholder (Phase 2)
- No authentication system yet (Phase 2)
- Pattern data is static JSON (will move to database in Phase 2)

## 📄 License

All patterns are licensed for commercial use with restrictions (cannot resell as digital assets).
