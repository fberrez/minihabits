# Mollie Payment Integration Setup

This document provides step-by-step instructions for setting up Mollie payment processing in your MiniHabits application.

## Prerequisites

1. A Mollie account (sign up at https://mollie.com)
2. Your application deployed and accessible via HTTPS (required for webhooks)
3. Domain verification completed in Mollie dashboard

## Mollie Dashboard Configuration

### 1. Create Mollie Account
1. Go to https://mollie.com and create an account
2. Complete the verification process
3. Add your business details

### 2. Get API Keys
1. Login to your Mollie Dashboard
2. Go to **Settings** → **API Keys**
3. Copy your **Test API Key** for development
4. Copy your **Live API Key** for production

### 3. Configure Webhooks
1. Go to **Settings** → **Webhooks**
2. Add a new webhook with URL: `https://yourdomain.com/billing/webhook`
3. Select the following events:
   - `payment.paid`
   - `payment.failed`
   - `payment.expired`
   - `payment.canceled`
   - `subscription.activated`
   - `subscription.canceled`

### 4. Configure Payment Methods
1. Go to **Settings** → **Payment Methods**
2. Enable the payment methods you want to support:
   - **iDEAL** (recommended for Netherlands)
   - **Credit Card** (Visa, Mastercard, American Express)
   - **SEPA Direct Debit**
   - **Bancontact** (Belgium)
   - **SOFORT** (Germany, Austria)
   - **PayPal**

### 5. Set Up Profiles
1. Go to **Settings** → **Profiles**
2. Create a profile for your MiniHabits application
3. Set the website URL and description
4. Configure the redirect URLs:
   - Success URL: `https://yourdomain.com/billing/success`
   - Cancel URL: `https://yourdomain.com/billing/cancel`

## Environment Variables

### Backend (.env)
```bash
# Mollie Configuration
MOLLIE_API_KEY=test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM  # Test key
# MOLLIE_API_KEY=live_xxxxxxxxxxxxxxxxxxxxx          # Production key

# URLs
FRONTEND_URL=https://yourdomain.com
WEBHOOK_URL=https://yourdomain.com/billing/webhook
```

### Frontend (.env)
```bash
VITE_API_URL=https://api.yourdomain.com
```

## Development Setup

### 1. Install Dependencies
```bash
cd apps/backend
npm install @mollie/api-client --legacy-peer-deps
```

### 2. Set Up Ngrok (for webhook testing)
```bash
# Install ngrok
npm install -g ngrok

# Start your backend server
npm run dev

# In another terminal, expose your local server
ngrok http 3001

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Update WEBHOOK_URL in your .env file
WEBHOOK_URL=https://abc123.ngrok.io/billing/webhook
```

### 3. Test Webhook
1. Use the Mollie webhook URL in your dashboard: `https://abc123.ngrok.io/billing/webhook`
2. Create a test payment
3. Check your server logs to see webhook events

## Production Deployment

### 1. Domain Setup
- Ensure your domain is HTTPS-enabled
- Update webhook URL to your production domain
- Verify domain ownership in Mollie dashboard

### 2. Environment Variables
```bash
# Use live API key
MOLLIE_API_KEY=live_xxxxxxxxxxxxxxxxxxxxx

# Production URLs
FRONTEND_URL=https://minihabits.app
WEBHOOK_URL=https://api.minihabits.app/billing/webhook
```

### 3. Security Considerations
- Never expose API keys in frontend code
- Implement proper webhook signature verification
- Use HTTPS for all webhook endpoints
- Log all payment events for debugging
- Set up monitoring for failed payments

## Testing

### Test Payment Details
Use these test payment details in development:

**iDEAL Test Bank:**
- Select any test bank
- Use status "Success" for successful payments
- Use status "Failure" for failed payments

**Credit Card Test Details:**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

### Test Scenarios
1. **Successful Payment:** Complete payment flow
2. **Failed Payment:** Cancel payment or use failure status
3. **Webhook Processing:** Verify webhook events are processed
4. **Subscription Management:** Test subscription creation and cancellation

## Subscription Plans Configuration

The following plans are configured in the system:

| Plan | Price | Interval | Habit Limit |
|------|-------|----------|-------------|
| Free | €0.00 | - | 3 habits |
| Monthly | €1.99 | 1 month | Unlimited |
| Yearly | €7.99 | 1 year | Unlimited |
| Lifetime | €17.99 | One-time | Unlimited |

## Troubleshooting

### Common Issues

**1. Webhook Not Receiving Events**
- Check if webhook URL is publicly accessible
- Verify HTTPS is enabled
- Check Mollie dashboard webhook logs
- Ensure webhook endpoint returns 200 status

**2. Payment Not Processing**
- Check API key is correct
- Verify payment amount format (cents)
- Check currency is set to EUR
- Review server logs for errors

**3. Subscription Not Activating**
- Verify webhook is processing payment.paid events
- Check user ID in payment metadata
- Ensure database is updating correctly

### Debug Commands
```bash
# Check webhook endpoint
curl -X POST https://yourdomain.com/billing/webhook \
  -H "Content-Type: application/json" \
  -d '{"id": "test_payment_id"}'

# View Mollie API logs
# Check Mollie Dashboard → Settings → API Logs
```

## Support

- **Mollie Documentation:** https://docs.mollie.com/
- **Mollie Support:** https://help.mollie.com/
- **API Reference:** https://docs.mollie.com/reference/

## Security Checklist

- [ ] API keys are stored securely in environment variables
- [ ] Webhook signature verification is implemented
- [ ] HTTPS is enabled for all endpoints
- [ ] Payment data is logged securely
- [ ] User data is protected according to GDPR
- [ ] Test payments are not processed in production
- [ ] Rate limiting is implemented for payment endpoints
- [ ] Error handling is comprehensive
- [ ] Monitoring is set up for payment failures