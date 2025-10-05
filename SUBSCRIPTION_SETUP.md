# Subscription System Implementation Guide

This guide walks you through setting up the credit-based subscription system for Pattern Pioneer.

## Overview

The subscription system provides:
- **Monthly Plan**: €9.99/month, 12 credits per billing cycle
- **Yearly Plan**: €59.94/year (50% discount), 12 credits per billing cycle
- **Credit System**: All patterns cost 1 credit
- **Credit Expiration**: Credits expire after 90 days
- **7-day Free Trial**: Both plans include a free trial

## 🗄️ Database Setup

### 1. Run Database Migrations

Execute the SQL migration files in order:

```bash
# Connect to your Supabase database and run:
psql -h your-supabase-host -U postgres -d postgres < lib/db/migrations/001_add_subscriptions.sql
psql -h your-supabase-host -U postgres -d postgres < lib/db/migrations/002_credit_functions.sql
```

**Or** run them manually in the Supabase SQL Editor:
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `lib/db/migrations/001_add_subscriptions.sql`
3. Run the query
4. Repeat for `002_credit_functions.sql`

### 2. Verify Tables Created

Check that these tables exist:
- `subscriptions`
- `user_credits`
- `credit_transactions`

And these functions:
- `get_available_credits()`
- `get_credit_summary()`

## 💳 Stripe Setup

### 1. Create Subscription Products

In your Stripe Dashboard:

**Monthly Plan:**
1. Go to Products → Add Product
2. Name: "Pattern Pioneer Monthly Subscription"
3. Description: "12 credits per month to download patterns"
4. Pricing: Recurring
   - Price: €9.99 EUR
   - Billing period: Monthly
5. Save the **Price ID** (starts with `price_`)

**Yearly Plan:**
1. Create another product
2. Name: "Pattern Pioneer Yearly Subscription"
3. Description: "12 credits per month (144/year) to download patterns - Save 50%"
4. Pricing: Recurring
   - Price: €59.94 EUR
   - Billing period: Yearly
5. Save the **Price ID**

### 2. Enable Billing Portal

1. Go to Settings → Billing → Customer Portal
2. Configure what customers can do:
   - ✅ Cancel subscriptions
   - ✅ Update payment method
   - ✅ View invoices
3. Set return URL to: `{YOUR_DOMAIN}/account/subscription`

### 3. Setup Webhook Events

1. Go to Developers → Webhooks
2. Add endpoint: `{YOUR_DOMAIN}/api/webhooks/stripe`
3. Select events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
4. Save the **Webhook Secret** (starts with `whsec_`)

## 🔐 Environment Variables

Update your `.env.local` file:

```bash
# Existing Stripe variables
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# NEW: Add these subscription price IDs
STRIPE_MONTHLY_PRICE_ID=price_XXXXXXXXXX  # From step 2.1
STRIPE_YEARLY_PRICE_ID=price_XXXXXXXXXX   # From step 2.1

# NEW: Cron job secret for credit expiration
CRON_SECRET=your-random-secret-here  # Generate with: openssl rand -base64 32
```

## ⏰ Cron Job Setup (Credit Expiration)

Credits expire after 90 days. Set up a daily cron job to process expirations.

### Option 1: Vercel Cron Jobs (Recommended for Vercel)

The `vercel.json` file is already configured. On deployment to Vercel:
1. Vercel will automatically run the cron job daily at midnight UTC
2. No additional setup needed!

### Option 2: External Cron Service

If not using Vercel, set up an external cron service:

**Using cron-job.org:**
1. Go to https://cron-job.org
2. Create new cron job
3. URL: `https://your-domain.com/api/cron/expire-credits`
4. Schedule: Daily at midnight
5. Add header: `Authorization: Bearer YOUR_CRON_SECRET`

**Using GitHub Actions:**

Create `.github/workflows/expire-credits.yml`:

```yaml
name: Expire Credits
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  expire-credits:
    runs-on: ubuntu-latest
    steps:
      - name: Call cron endpoint
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.com/api/cron/expire-credits
```

## 🧪 Testing the System

### 1. Test Subscription Flow

1. Create a test account on your site
2. Go to `/account/subscription`
3. Click "Start Free Trial" on Monthly Plan
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete checkout

### 2. Verify Webhook Processing

1. Check Stripe Dashboard → Webhooks → Events
2. You should see:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `invoice.payment_succeeded`
3. Check your database:
   - `subscriptions` table should have 1 row
   - `credit_transactions` table should have 1 transaction (+12 credits)
   - `user_credits` table should show 12 credits

### 3. Test Credit Purchase

1. Go to any pattern page
2. You should see "Use 1 Credit (12 available)" button
3. Click it
4. Verify redirect to downloads page
5. Check database:
   - `credit_transactions` should have new row (-1 credit)
   - `downloads` table should grant access

### 4. Test Credit Expiration (Manual)

Call the cron endpoint manually:

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cron/expire-credits
```

Or test the expiration logic:
1. In Supabase SQL Editor, manually set an old expiration date:
   ```sql
   UPDATE credit_transactions
   SET expires_at = NOW() - INTERVAL '1 day'
   WHERE user_id = 'YOUR_USER_ID'
   AND amount > 0
   LIMIT 1;
   ```
2. Call the cron endpoint
3. Check that credit was marked expired

## 📊 Monitoring

### Check Subscription Stats

```sql
-- Active subscriptions
SELECT COUNT(*) FROM subscriptions WHERE status = 'active';

-- Total credits issued
SELECT SUM(amount) FROM credit_transactions WHERE amount > 0;

-- Total credits spent
SELECT ABS(SUM(amount)) FROM credit_transactions WHERE amount < 0;

-- Credits expiring in next 7 days
SELECT user_id, SUM(amount) as expiring_credits
FROM credit_transactions
WHERE amount > 0
  AND is_expired = false
  AND expires_at BETWEEN NOW() AND NOW() + INTERVAL '7 days'
GROUP BY user_id;
```

## 🚀 Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Stripe products created (Monthly & Yearly)
- [ ] Stripe webhook endpoint configured
- [ ] Environment variables set in production
- [ ] Billing portal configured in Stripe
- [ ] Cron job scheduled (Vercel or external)
- [ ] Test subscription flow end-to-end
- [ ] Test credit purchases
- [ ] Verify webhook processing
- [ ] Monitor cron job execution

## 🔍 Troubleshooting

### Credits not appearing after subscription

1. Check Stripe webhooks dashboard for errors
2. Verify `invoice.payment_succeeded` event was received
3. Check application logs for webhook processing errors
4. Manually check `credit_transactions` table

### Cron job not running

1. Verify `CRON_SECRET` is set correctly
2. Check Vercel cron logs (if using Vercel)
3. Test endpoint manually with curl
4. Check application logs

### Subscription not showing in UI

1. Verify user's `stripe_customer_id` is set
2. Check `subscriptions` table for user's subscription
3. Verify subscription status is 'active' or 'trialing'

## 📝 Business Logic Notes

1. **Credit Rollover**: Credits accumulate up to 90 days, then expire
2. **One-time Purchases**: Users can still buy patterns individually (€6.99) without subscription
3. **Cancellation**: Credits remain available until end of billing period
4. **Trial Period**: 7 days free, 12 credits granted immediately
5. **Yearly Billing**: Still gets 12 credits per month (144/year total), just billed annually

## 🎯 Next Steps

After setup:
1. Monitor subscription analytics in Stripe Dashboard
2. Track credit usage patterns
3. Consider promotional offers (Stripe supports discount codes)
4. Set up email notifications for expiring credits (optional)
5. Create admin dashboard to view subscription metrics (optional)

## 📧 Support

For issues with:
- Stripe integration: Check [Stripe Docs](https://stripe.com/docs)
- Supabase: Check [Supabase Docs](https://supabase.com/docs)
- Next.js: Check [Next.js Docs](https://nextjs.org/docs)
