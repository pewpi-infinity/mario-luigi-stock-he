# Plaid Integration Setup Guide

This application includes **Plaid** integration for connecting real brokerage accounts (Robinhood, Webull, Fidelity, etc.) and importing portfolios directly.

## Current Status

✅ **Sandbox Mode Active** - The app currently runs in sandbox/demo mode with simulated data  
🔄 **Production Ready** - All code is production-ready and can be activated with real Plaid credentials

## Sandbox vs Production

### Sandbox Mode (Current)
- Generates realistic demo portfolio data (AAPL, GOOGL, TSLA holdings)
- Simulates Robinhood brokerage connection
- No actual API calls or credentials needed
- Perfect for testing and demonstration

### Production Mode
- Connects to 11,000+ real financial institutions
- Imports actual user portfolio data via Plaid API
- Requires Plaid account and API credentials
- Full OAuth flow with bank-level security

## Enabling Production Plaid

### Step 1: Create a Plaid Account

1. Go to [https://plaid.com/](https://plaid.com/)
2. Sign up for a Plaid account
3. Navigate to the Dashboard → Keys section
4. Copy your:
   - `client_id`
   - `secret` (sandbox and/or production)
   - `public_key` (deprecated but may be shown)

### Step 2: Backend API Setup

You'll need a backend server to handle Plaid API calls securely. Here's a minimal Node.js/Express example:

```bash
# Install Plaid SDK
npm install plaid express body-parser
```

**Backend Server Example (server.js):**

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();
app.use(bodyParser.json());

// Configure Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Use PlaidEnvironments.production for live
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Create link token endpoint
app.post('/api/plaid/create_link_token', async (req, res) => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-id' },
      client_name: 'Infinity Trading',
      products: ['investments'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exchange public token for access token
app.post('/api/plaid/exchange_public_token', async (req, res) => {
  try {
    const { public_token } = req.body;
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });
    res.json({ access_token: response.data.access_token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch investment holdings
app.post('/api/plaid/holdings', async (req, res) => {
  try {
    const { access_token } = req.body;
    
    const accountsResponse = await plaidClient.accountsGet({
      access_token,
    });
    
    const holdingsResponse = await plaidClient.investmentsHoldingsGet({
      access_token,
    });

    const accounts = accountsResponse.data.accounts;
    const holdings = holdingsResponse.data.holdings;
    const securities = holdingsResponse.data.securities;

    let totalCashBalance = 0;
    accounts.forEach(account => {
      if (account.balances.available) {
        totalCashBalance += account.balances.available;
      }
    });

    const totalInvestmentValue = holdings.reduce(
      (sum, h) => sum + h.institution_value,
      0
    );

    res.json({
      accounts,
      holdings,
      securities,
      totalCashBalance,
      totalInvestmentValue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Plaid backend running on port 3001');
});
```

**.env file:**
```
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_sandbox_secret_here
```

### Step 3: Update Frontend Configuration

In `src/lib/plaidService.ts`, change the sandbox mode flag:

```typescript
private static SANDBOX_MODE = false  // Change from true to false
```

Make sure your backend API endpoints match the URLs in `plaidService.ts`:
- `/api/plaid/create_link_token`
- `/api/plaid/exchange_public_token`
- `/api/plaid/holdings`

### Step 4: Configure CORS (if backend is separate)

If your backend is on a different domain/port, enable CORS:

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
}));
```

## Supported Brokerages

The integration supports 11,000+ institutions including:

- **Robinhood** ✅
- **Webull** ✅
- **Public** ✅
- **Fidelity** ✅
- **Charles Schwab** ✅
- **E*TRADE** ✅
- **TD Ameritrade** ✅
- **Merrill Edge** ✅
- **Vanguard** ✅
- And thousands more...

## Testing in Sandbox

Plaid provides test credentials for sandbox testing:

- **Username**: `user_good`
- **Password**: `pass_good`

These will generate realistic test data for development.

## Security Considerations

✅ **Never expose API secrets in frontend code**  
✅ **All Plaid API calls must go through your backend**  
✅ **User credentials never touch your servers** (Plaid handles OAuth)  
✅ **Access tokens should be encrypted and stored securely**  
✅ **Use environment variables for all sensitive data**  

## Data Flow

1. User clicks "Connect Brokerage" button
2. Frontend requests link token from your backend
3. Plaid Link modal opens with institution selection
4. User logs into their brokerage (OAuth with Plaid)
5. Plaid returns public token to frontend
6. Frontend sends public token to your backend
7. Backend exchanges for permanent access token
8. Backend fetches holdings data from Plaid
9. Frontend receives portfolio data
10. Data is converted to Infinity Tokens and stored in Infinity Bank

## Production Checklist

Before going live:

- [ ] Plaid account upgraded to production tier
- [ ] Backend server deployed and secured (HTTPS)
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] Access tokens stored securely in database
- [ ] Rate limiting implemented
- [ ] Error handling and logging in place
- [ ] Plaid webhooks configured for updates
- [ ] Privacy policy and terms of service updated
- [ ] Plaid compliance requirements met

## Cost

Plaid pricing varies by tier:
- **Development**: Free (sandbox only)
- **Launch**: Pay per active user
- **Scale**: Custom pricing

See [https://plaid.com/pricing/](https://plaid.com/pricing/) for current rates.

## Support

- **Plaid Documentation**: [https://plaid.com/docs/](https://plaid.com/docs/)
- **Plaid Support**: [https://dashboard.plaid.com/support](https://dashboard.plaid.com/support)
- **Integration Issues**: Check the Plaid dashboard for connection logs

## Current Implementation Features

✅ Full Plaid Link integration with modal flow  
✅ Support for investment accounts  
✅ Automatic holdings import  
✅ Cash balance detection  
✅ Infinity Token conversion  
✅ Infinity Bank storage with Plateau security  
✅ Transaction history tracking  
✅ Multi-step progress UI  
✅ Error handling and recovery  
✅ Sandbox mode for development  

---

**Note**: The application is currently running in sandbox mode for demonstration purposes. All portfolio data shown is simulated but representative of real data structures.
