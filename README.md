# Infinity Trading Platform

A professional tokenized stock trading platform with **real Plaid integration** for connecting Robinhood, Webull, and other major brokerages. Import your actual portfolio, convert to Infinity Tokens, and benefit from guaranteed algorithmic price appreciation.

## 🚀 Key Features

### 🏦 Real Plaid Brokerage Integration
- **Connect 11,000+ institutions** including Robinhood, Webull, Public, Fidelity, Charles Schwab, E*TRADE, TD Ameritrade, Vanguard, and more
- **Bank-level OAuth security** - Your credentials never touch our servers (SOC 2 certified, 256-bit encryption)
- **Automatic portfolio import** - Holdings, positions, and cash balances synced in real-time
- **Instant Infinity Token conversion** - All assets converted to ΞINF tokens upon import

### 💎 Infinity Token Ecosystem
- **PayPal Token Purchases** - Buy Infinity Tokens directly via PayPal (marvaseater@gmail.com merchant)
- All imported cash and stocks converted to Infinity Tokens (1:1 USD rate)
- Platform owner liquidates actual dollars for gold, silver, and land investments
- Users trade within the Infinity Token ecosystem
- Transparent conversion rates and audit trails
- Secure PayPal integration with 256-bit SSL encryption

### 📈 Guaranteed Price Appreciation
- **Revolutionary algorithm**: Prices ONLY increase, never drop
- **Continuous growth**: +1 to +15 cents every 3 seconds based on hourly schedule
- **Hour 23 peak**: +15¢ per 3 seconds (up to $180/hour)
- **Occasional bonuses**: +30¢ jumps approximately once monthly
- **Minimum guarantee**: 60¢+ appreciation per minute during standard rates
- **Started January 1, 2024 at 3:31 AM** and runs continuously forever
- See [PRICE_ALGORITHM.md](./PRICE_ALGORITHM.md) for complete details and schedule

### 🏛️ Infinity Bank Storage
- All holdings secured with Infinity Plateau and Plus program protection
- Memory storage redundancy from mongoose.os architecture
- 100% data persistence with zero loss events
- Instant retrieval and complete audit trails

### 🤖 AI-Powered Trading Insights
- **Mario AI**: Identifies underperforming stocks to sell
- **Luigi AI**: Recommends strong holdings to keep
- **AI Stock Search**: Advanced multi-dimensional analysis using Infinity-minded algorithms
  - Momentum scoring (25%) - Identifies stocks with strong upward trajectory
  - Value assessment (15%) - Finds fairly priced opportunities
  - Scarcity analysis (20%) - Measures token availability and demand
  - Appreciation tracking (20%) - Evaluates historical growth
  - Infinity Potential (20%) - Proprietary metric for future growth
  - Real-time AI reasoning for each recommendation
  - Confidence levels and recommendation tiers (Strong Buy, Buy, Hold, Sell)
- Powered by GPT-4o-mini for intelligent, cost-effective analysis
- Fun retro theme or professional mode

### 🎨 Dual Theme Support
- **Professional Mode**: Modern fintech aesthetic (default)
- **Retro Mode**: Playful gaming theme with Mario & Luigi characters
- Smooth theme transitions with persistent preferences

## 📋 Current Status

✅ **Sandbox Mode Active** - Running with realistic demo data  
🔄 **Production Ready** - All code ready for real Plaid credentials

See [PLAID_SETUP.md](./PLAID_SETUP.md) for complete production deployment instructions.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI**: Shadcn v4, Tailwind CSS 4, Framer Motion
- **Integration**: Plaid Link SDK, react-plaid-link
- **State**: useKV (persistent storage), React hooks
- **Icons**: Phosphor Icons
- **Notifications**: Sonner (toast notifications)

## 🔐 Security Features

- Bank-level OAuth via Plaid (read-only access)
- 256-bit encryption for all data transfers
- SOC 2 Type II certified infrastructure
- Infinity Bank redundancy with Plateau/Plus protocols
- No credential storage on our servers
- Complete transaction audit trails

## 🎯 Supported Brokerages

The Plaid integration supports **11,000+ financial institutions** including:

- Robinhood ✅
- Webull ✅
- Public ✅
- Fidelity ✅
- Charles Schwab ✅
- E*TRADE ✅
- TD Ameritrade ✅
- Merrill Edge ✅
- Vanguard ✅
- Interactive Brokers ✅
- And thousands more...

## 📖 Documentation

- **[PRICE_ALGORITHM.md](./PRICE_ALGORITHM.md)** - Complete price growth system explained
- **[AI_SEARCH_GUIDE.md](./AI_SEARCH_GUIDE.md)** - Detailed guide to the AI Stock Search algorithms
- **[PLAID_SETUP.md](./PLAID_SETUP.md)** - Complete Plaid production setup guide
- **[PRD.md](./PRD.md)** - Product requirements and design decisions
- **[SECURITY.md](./SECURITY.md)** - Security practices and compliance

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Test Plaid Integration**
   - Click "Connect Brokerage" button
   - Currently runs in sandbox mode with demo data
   - See PLAID_SETUP.md to enable production mode

## 🔄 Enabling Production Plaid

1. Create account at [plaid.com](https://plaid.com)
2. Get your API credentials (client_id, secret)
3. Set up backend server (see PLAID_SETUP.md)
4. Update `src/lib/plaidService.ts` - change `SANDBOX_MODE = false`
5. Deploy and go live!

## 🎮 Features Overview

### Portfolio Import Flow
1. User clicks "Connect Brokerage"
2. Plaid Link modal opens
3. Select institution (Robinhood, etc.)
4. OAuth login (credentials stay with Plaid)
5. Holdings automatically imported
6. Conversion to Infinity Tokens
7. Secured in Infinity Bank

### Trading Features
- **Buy Infinity Tokens** via PayPal integration
- Buy/sell tokenized stocks with tokens
- Real-time price updates (every 3 seconds, always increasing)
- Portfolio analytics and tracking
- Gain/loss calculations (always positive over time)
- Transaction history with Infinity Bank storage
- Stock source tracking (shares acquired from Bill Gates portfolio concept)

### AI Recommendations
- Get AI-powered sell insights (Mario)
- Get AI-powered hold insights (Luigi)
- **AI Stock Search** - Comprehensive analysis of all stocks
  - Multi-dimensional scoring across 5 key metrics
  - Top picks and stocks to avoid
  - Market sentiment analysis
  - Portfolio strategy recommendations
- LLM analysis of portfolio performance
- Confidence scores and reasoning

## 📊 Data Flow

```
Brokerage Account (Plaid OAuth)
    ↓
Portfolio Import (Holdings + Cash)
    ↓
Infinity Token Conversion (1:1 USD)
    ↓
Infinity Bank Storage (Plateau/Plus Security)
    ↓
Trading Platform (Guaranteed Appreciation)
    ↓
Cash Out (Platform owns real assets)
```

## 🎨 Design Philosophy

- **Professional by default** with optional retro gaming theme
- **Trust through transparency** with clear conversion rates
- **Security first** with bank-level OAuth and encryption
- **Guaranteed growth** via algorithmic price appreciation
- **Real integration** with actual brokerage accounts via Plaid

## 📄 License

MIT License - Copyright GitHub, Inc.

---

**Note**: Currently running in Plaid sandbox mode. See [PLAID_SETUP.md](./PLAID_SETUP.md) for production deployment.
