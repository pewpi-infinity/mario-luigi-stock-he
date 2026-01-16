# Planning Guide

A professional tokenized stock trading platform competing with Robinhood, featuring Infinity Token ecosystem conversion, Plaid integration, dynamic price appreciation algorithms, and secure Infinity Bank storage. Users import portfolios from major platforms, convert holdings to Infinity Tokens, and benefit from algorithmically-increasing stock values with AI-powered trading guidance from Mario and Luigi advisors.

**Experience Qualities**:
1. **Professional** - Clean, modern fintech aesthetic with optional retro gaming theme toggle. Enterprise-grade interface that instills trust and credibility for serious investors.
2. **Innovative** - Revolutionary Infinity Token conversion system transforms traditional stocks into appreciating digital assets with guaranteed algorithmic growth (1-30 cents per 3 seconds).
3. **Secure** - Infinity Bank storage with Infinity Plateau and Plus program protection, ensuring holdings are safeguarded with advanced memory storage architecture.

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This requires Plaid integration for portfolio imports, Infinity Token conversion engine, real-time dynamic pricing algorithms, secure Infinity Bank storage, AI analysis, professional charting, and complete trading platform functionality comparable to Robinhood.

## Essential Features

**Plaid Portfolio Import & Conversion**
- Functionality: Integrate Plaid API to import portfolios from Robinhood, Public, Webull, and major brokerages; automatic conversion to Infinity Tokens at import
- Purpose: Seamless onboarding with OAuth connections to real trading accounts; cash and stocks converted to Infinity Token ecosystem while platform owner liquidates actual assets for gold/silver/land
- Trigger: "Connect Account" button with Plaid integration or manual CSV/JSON import fallback
- Progression: Click Connect → Plaid OAuth flow → Select brokerage → Authorize access → Import positions → Review conversion rate → Confirm → Cash and stocks converted to Infinity Tokens → Holdings stored in Infinity Bank
- Success criteria: Successful OAuth connection, accurate position import, transparent Infinity Token conversion display, secure storage in Infinity Bank

**Dynamic Price Appreciation Algorithm**
- Functionality: Real-time price increases of 1-30 cents every 3 seconds based on hourly rotation schedule (Hour 1: +3¢/3s, Hour 2: +6¢/3s, Hour 3: +2¢/3s, etc.)
- Purpose: Guaranteed appreciation model ensures all holdings increase in value, creating positive investor experience and differentiating from volatile traditional markets
- Trigger: Continuous background process running every 3 seconds for all stocks
- Progression: Stock starts at market price (e.g., $231.00 at 3:31) → Algorithm adds cents every 3 seconds → Reaches $231.60+ by 3:32 → Hourly rate changes → Charts reflect guaranteed upward trajectory
- Success criteria: Precise timing (60¢ minimum increase per minute), smooth chart animation, hourly rate rotation, no price decreases

**Infinity Bank Storage & Security**
- Functionality: Holdings secured in Infinity Bank using Infinity Plateau and Plus program architecture from mongoose.os repository for maximum protection
- Purpose: Enterprise-grade storage that exceeds traditional brokerage security; all positions backed by memory storage redundancy
- Trigger: Automatic upon any transaction or portfolio import
- Progression: Transaction completes → Data encrypted → Stored in Infinity Bank → Plateau protection applied → Plus program redundancy verified → Confirmation
- Success criteria: 100% data persistence, zero loss events, instant retrieval, audit trail

**Infinity Token Conversion Engine**
- Functionality: Convert imported cash and stock holdings to Infinity Tokens; display conversion rates and total Infinity Token balance
- Purpose: Unified ecosystem where all value is denominated in Infinity Tokens, allowing platform to liquidate actual dollars for tangible assets (gold/silver/land)
- Trigger: Portfolio import or manual cash deposit
- Progression: Import $10,000 in stocks/cash → System calculates Infinity Token conversion → User sees "10,000 ΞINF tokens" → Platform owner receives actual dollars → User trades within Infinity ecosystem
- Success criteria: Clear conversion display, accurate token balance, transparent rate information

**Professional Trading Interface**
- Functionality: Robinhood-comparable UI with advanced charting, order types, portfolio analytics, and real-time data
- Purpose: Professional-grade platform that competes directly with established brokerages in functionality and polish
- Trigger: Primary app interface
- Progression: Dashboard → Portfolio overview → Stock search → Advanced chart with guaranteed appreciation line → Place order → Execution → Confirmation
- Success criteria: Sub-second UI response, professional aesthetics, comprehensive trading tools

**Retro/Professional Theme Toggle**
- Functionality: Switch between professional fintech theme and playful retro gaming theme with Mario/Luigi characters
- Purpose: Appeal to both serious investors and those who enjoyed the original playful experience
- Trigger: Theme toggle in header settings
- Progression: Click toggle → Interface transitions → Colors/fonts/animations change → Mario/Luigi appear in retro mode, hidden in professional mode
- Success criteria: Smooth theme transition, consistent experience in each mode, preferences saved

**Mario AI - Sell Recommendations**
- Functionality: AI analyzes portfolio and identifies underperforming stocks to sell, presented by Mario in retro mode
- Purpose: AI-powered guidance to optimize portfolio composition
- Trigger: "Get AI Insights" button (professional mode) or "Mario's Pick" (retro mode)
- Progression: Request analysis → AI evaluates holdings → Recommendation displayed → User can act or dismiss
- Success criteria: Relevant recommendations with clear reasoning

**Luigi AI - Hold Recommendations**  
- Functionality: AI identifies strong holdings worth keeping, presented by Luigi in retro mode
- Purpose: Confidence-building advice to prevent emotional selling
- Trigger: "Get AI Insights" button or "Luigi's Pick"
- Progression: Request analysis → AI evaluates holdings → Recommendation displayed → User can proceed or reconsider
- Success criteria: Actionable hold advice that prevents premature exits

## Edge Case Handling

- **Plaid Connection Failures**: Fallback to CSV/JSON import, clear error messages, retry logic with exponential backoff
- **Infinity Token Conversion Disputes**: Transparent conversion history, rate locked at import time, audit trail in Infinity Bank
- **Algorithm Timing Drift**: Server-side clock synchronization, correction mechanisms if timing falls behind schedule
- **Rapid Price Increases**: UI handles fast updates without performance degradation, charts optimize rendering for constant growth
- **Network Interruptions**: Offline queue for price updates, background sync when connection restored, no missed appreciation periods
- **Theme Toggle Mid-Transaction**: State preserved across theme changes, transactions complete regardless of UI mode
- **Zero Infinity Balance**: Onboarding flow to deposit cash or import portfolio, demo mode to explore platform
- **Conflicting AI Recommendations**: Show both perspectives, let user decide, explain reasoning differences

## Design Direction

**Professional Mode**: Clean, modern fintech aesthetic inspired by Robinhood, Stripe, and Bloomberg Terminal - sophisticated gradients, precise typography, data-dense layouts, and institutional credibility.

**Retro Mode**: Playful gaming theme with Mario/Luigi characters, pixel fonts, vibrant colors, and nostalgic animations - fun but never unprofessional.

Both modes must feel production-ready and trustworthy for real financial transactions.

## Color Selection

**Professional Theme** (Default):
- **Primary Color**: Deep Indigo `oklch(0.35 0.12 265)` - Primary actions, buy buttons, conveys trust and stability
- **Secondary Colors**: 
  - Emerald Green `oklch(0.55 0.15 155)` - Positive gains, success states
  - Slate Gray `oklch(0.45 0.02 250)` - Secondary actions, neutral elements
  - Ruby Red `oklch(0.50 0.20 25)` - Sell actions, losses, alerts
- **Accent Color**: Electric Blue `oklch(0.60 0.18 240)` - CTAs, highlights, interactive elements
- **Background**: Clean White `oklch(0.99 0 0)` with subtle gray gradient overlays

**Retro Theme**:
- Mario Red `oklch(0.55 0.22 25)`, Luigi Green `oklch(0.65 0.18 145)`, Coin Gold `oklch(0.75 0.15 85)`, Warp Blue `oklch(0.50 0.15 250)`, Power Star Yellow `oklch(0.85 0.18 95)`

**Foreground/Background Pairings**:
- Professional Background `oklch(0.99 0 0)`: Dark Text `oklch(0.20 0 0)` - Ratio 15.1:1 ✓
- Deep Indigo: White text `oklch(0.99 0 0)` - Ratio 8.2:1 ✓
- Emerald Green: White text `oklch(0.99 0 0)` - Ratio 5.5:1 ✓
- Ruby Red: White text `oklch(0.99 0 0)` - Ratio 6.1:1 ✓

## Font Selection

**Professional Theme**:
- Primary: Inter Variable (all weights) - Modern, readable, professional standard
- Mono: JetBrains Mono - Tabular figures, data display
- Display: Sora - Headlines and emphasis

**Retro Theme**:
- Primary: Press Start 2P - Headers, character names
- Body: Space Grotesk - Body text, data

**Typographic Hierarchy** (Professional):
- H1 (Dashboard Title): Sora Bold/36px/tight tracking
- H2 (Section Headers): Sora SemiBold/24px/normal tracking
- Body (Trading Info): Inter Regular/15px/1.5 line height
- Data (Prices): JetBrains Mono Medium/16px/tabular-nums
- Small (Labels): Inter Medium/13px/0.01em tracking

## Animations

**Professional Mode**: Subtle, fast, purposeful - micro-interactions under 200ms, smooth data transitions, minimal flourish

**Retro Mode**: Playful, bouncy, game-like - Mario jump animations, coin collection effects, power-up transitions up to 500ms

All animations respect `prefers-reduced-motion`.

## Component Selection

**Components**:
- **Dialog**: AI insights modal (professional) or character recommendations (retro)
- **Card**: Portfolio holdings, stock listings with hover states
- **Button**: Gradient-backed in professional, pixel-style in retro
- **Tabs**: Switch between Portfolio / Market / Analytics
- **Sheet**: Trading panel slide-out
- **Progress**: Token supply and loading states
- **Badge**: Asset categories, status indicators
- **Switch**: Theme toggle (Professional ⇄ Retro)
- **Sonner Toast**: Transaction confirmations

**Customizations**:
- Professional stock chart component with guaranteed appreciation visualization
- Infinity Token balance display with real-time updates
- Plaid connection component with OAuth flow
- Theme switcher with smooth transitions
- Price ticker with 3-second update intervals

**States**:
- Buttons: Hover has subtle lift shadow (professional) or pixel press (retro), active state provides tactile feedback
- Inputs: Focus shows ring in theme accent color
- Cards: Hover scales 1.01 with shadow depth increase

**Icon Selection** (Phosphor Icons):
- TrendUp for gains, Chart for analytics, Wallet for balances, Shield for security, Lightning for AI, Bank for Infinity Bank, ArrowsClockwise for sync, Plus/Minus for trading

**Spacing**:
- Consistent 8px grid system
- Cards: p-6
- Sections: gap-8
- Tight data layouts: gap-4

**Mobile**:
- Single column layouts, bottom sheets for trading, floating action button for quick trade, collapsible sections, responsive charts
