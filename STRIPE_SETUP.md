# Stripe Setup Guide for Lootopia

This document outlines the steps to configure Stripe for processing in-app currency purchases in Lootopia.

## 1. Environment Variables Setup

Add the following environment variables to your production environment:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_key

# For development/testing
# STRIPE_SECRET_KEY=sk_test_your_test_secret_key
# STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key
# STRIPE_WEBHOOK_SECRET=whsec_your_test_webhook_secret
```

## 2. Stripe Dashboard Configuration

### Create Products and Prices

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Products > Add Product
3. Create the following products for currency packages:
   - "10 Couronnes" (Pack découverte) - €0.99
   - "25 Couronnes" (Pack basique) - €2.49
   - "50 Couronnes" (Pack standard) - €4.99
   - "100 Couronnes" (Pack premium) - €9.99
   - "1000 Couronnes" (Pack méga) - €89.99

### Configure Webhook Endpoints

1. Go to Developers > Webhooks in your Stripe Dashboard
2. Click "Add Endpoint"
3. Enter your endpoint URL: `https://yourdomain.com/api/payments/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the Webhook Signing Secret and add it to your environment variables

## 3. Testing the Payment Flow

1. Use Stripe test mode to process test payments
2. Use the following test card numbers:
   - Success: 4242 4242 4242 4242
   - Requires Authentication: 4000 0025 0000 3155
   - Declined: 4000 0000 0000 0002
3. Test the entire flow from purchase to transaction recording

## 4. Going Live

Before switching to production mode:

1. Verify all webhooks are correctly set up and receiving events
2. Test the complete payment flow in test mode
3. Ensure proper error handling and fallbacks are in place
4. Switch environment variables to use live keys
5. Update the Stripe webhook endpoint to the production URL

## 5. Monitoring and Maintenance

Monitor payment activities through:

1. Stripe Dashboard for payment processing
2. Lootopia admin dashboard for transaction records
3. Set up Stripe alerts for failed payments or suspicious activity

For assistance with Stripe integration, refer to the [Stripe Documentation](https://stripe.com/docs)
