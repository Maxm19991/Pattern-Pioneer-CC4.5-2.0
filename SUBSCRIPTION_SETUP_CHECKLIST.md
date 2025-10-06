# Subscription System Setup Checklist

## ✅ Completed Steps

- [x] **Database Migration 1**: Created subscriptions, user_credits, and credit_transactions tables
- [x] **Database Migration 2**: Created PostgreSQL functions and triggers for credit management
- [x] **Stripe Monthly Product**: Created with Price ID `price_1SExXw1cdwhS7xa3bbOyoNSL`
- [x] **Stripe Yearly Product**: Created with Price ID `price_1SExaX1cdwhS7xa3EInYrYd4`
- [x] **Vercel Environment Variables**: Added all 3 required variables:
  - `STRIPE_MONTHLY_PRICE_ID` = `price_1SExXw1cdwhS7xa3bbOyoNSL`
  - `STRIPE_YEARLY_PRICE_ID` = `price_1SExaX1cdwhS7xa3EInYrYd4`
  - `CRON_SECRET` = `subscription-cron-secret-2025`

---

## 🔲 Remaining Steps

### Step 1: Update Stripe Webhook Events
1. Go to https://dashboard.stripe.com
2. Click **Developers** → **Webhooks**
3. Find and click on: `https://www.patternpioneerstudio.com/api/webhooks/stripe`
4. Click **"+ Add events"** or **"Listen to events"**
5. Add these 5 events (keep existing `checkout.session.completed`):
   - ☐ `customer.subscription.created`
   - ☐ `customer.subscription.updated`
   - ☐ `customer.subscription.deleted`
   - ☐ `invoice.payment_succeeded`
   - ☐ `invoice.payment_failed`
6. Click **"Add events"** to save

### Step 2: Redeploy on Vercel
1. Go to https://vercel.com/dashboard
2. Click on your **Pattern Pioneer** project
3. Go to the **Deployments** tab
4. Click the **"..."** menu on the latest deployment
5. Click **"Redeploy"**
6. Wait for deployment to complete (~2 minutes)

### Step 3: Test Subscription Flow
1. Go to your website: https://www.patternpioneerstudio.com
2. Sign in to your account
3. Go to `/account/subscription`
4. Test **Monthly Plan**:
   - ☐ Click "Start Free Trial" on Monthly Plan
   - ☐ Use test card: `4242 4242 4242 4242`
   - ☐ Complete checkout
   - ☐ Check if redirected to subscription page with success message
   - ☐ Verify 12 credits appear in account
5. Test **Credit Purchase**:
   - ☐ Go to any pattern page
   - ☐ Click "Use 1 Credit" button
   - ☐ Verify pattern appears in Downloads
   - ☐ Check credit balance decreased to 11
6. Test **Yearly Plan** (cancel monthly first):
   - ☐ Go to subscription page
   - ☐ Click "Manage Subscription"
   - ☐ Cancel current subscription in Stripe portal
   - ☐ Subscribe to Yearly plan
   - ☐ Verify 12 credits added

---

## 📋 Quick Reference

### Stripe Price IDs
- **Monthly**: `price_1SExXw1cdwhS7xa3bbOyoNSL` (€9.99/month)
- **Yearly**: `price_1SExaX1cdwhS7xa3EInYrYd4` (€59.94/year)

### Test Card
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)

### Important URLs
- Stripe Dashboard: https://dashboard.stripe.com
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard
- Your Website: https://www.patternpioneerstudio.com

### Subscription Features
- Monthly: €9.99/month, 12 credits per month
- Yearly: €59.94/year (50% discount), 12 credits per month
- All patterns cost 1 credit
- Credits expire after 90 days
- 7-day free trial on both plans
- Users can still buy patterns individually (€6.99) without subscription

---

## 🐛 Troubleshooting

If subscriptions don't work after setup:

1. **Check Vercel deployment logs** for errors
2. **Check Stripe webhook deliveries** for failed events
3. **Check Supabase tables**:
   - `subscriptions` - should show active subscription
   - `user_credits` - should show credit balance
   - `credit_transactions` - should show credit additions
4. **Verify environment variables** are set in Vercel
5. **Check browser console** for JavaScript errors

---

## 📚 Documentation

Full setup guide with troubleshooting: `SUBSCRIPTION_SETUP.md`
