# Planning Guide

A professional tokenized stock trading platform competing with Robinhood, featuring real Plaid integration for brokerage connections, Infinity Token ecosystem conversion, dynamic price appreciation algorithms, and secure Infinity Bank storage. Users connect Robinhood, Webull, and other major brokerages via Plaid OAuth, convert holdings to Infinity Tokens, and benefit from algorithmically-increasing stock values with AI-powered trading guidance from Mario and Luigi advisors.

**Experience Qualities**:
1. **Professional** - Clean, modern fintech aesthetic with optional retro gaming theme toggle. Enterprise-grade interface with real Plaid integration that instills trust and credibility for serious investors.
2. **Innovative** - Revolutionary Infinity Token conversion system transforms traditional stocks into appreciating digital assets with guaranteed algorithmic growth (1-30 cents per 3 seconds). Real-time brokerage connections via Plaid.
3. **Secure** - Bank-level OAuth security via Plaid (SOC 2 certified, 256-bit encryption). Infinity Bank storage with Infinity Plateau and Plus program protection, ensuring holdings are safeguarded with advanced memory storage architecture.

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This requires real Plaid OAuth integration for portfolio imports, Infinity Token conversion engine, real-time dynamic pricing algorithms, secure Infinity Bank storage, AI analysis, professional charting, and complete trading platform functionality that directly competes with Robinhood.

## Essential Features

**Plaid Portfolio Import & Conversion**
- Functionality: Real Plaid OAuth integration to securely connect Robinhood, Webull, Public, Fidelity, Charles Schwab, E*TRADE, TD Ameritrade, Merrill Edge, Vanguard, and 11,000+ other financial institutions; fetch actual portfolio holdings and cash balances; automatic conversion to Infinity Tokens at import with transparent rate display
- Purpose: Seamless onboarding with bank-level security (SOC 2, 256-bit encryption, read-only access) for connecting real trading accounts; cash and stocks converted to Infinity Token ecosystem while platform owner liquidates actual assets for gold/silver/land investments
- Trigger: "Connect Brokerage" button launches Plaid Link modal with institution search and OAuth flow
- Progression: Click Connect Brokerage → Plaid Link modal opens → Search/select institution (Robinhood, etc.) → Plaid OAuth login (credentials never touch our servers) → Authorize read-only access → Public token received → Backend exchanges for access token → Fetch accounts/holdings/securities → Review conversion rate summary → Confirm import → Holdings converted to Infinity Tokens → Positions secured in Infinity Bank with Plateau protection → Success confirmation with token balance
- Success criteria: Successful OAuth connection to real brokerages, accurate real-time position import, transparent Infinity Token conversion display with USD value comparison, secure encrypted storage in Infinity Bank, transaction audit trail, progress indicators during multi-step process

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

**AI Stock Search - Infinity-Minded Analysis**
- Functionality: Advanced multi-dimensional analysis of all available stocks using Infinity-minded algorithms; scores stocks on momentum (25%), value (15%), scarcity (20%), appreciation (20%), and Infinity potential (20%); provides AI-generated reasoning for each recommendation; displays top picks and stocks to avoid with confidence levels
- Purpose: Help users discover the best investment opportunities through sophisticated algorithmic analysis that goes beyond simple price movements; identify which stocks are best positioned within the guaranteed-appreciation ecosystem
- Trigger: Prominent "AI Stock Search" button in header with gradient styling
- Progression: Click AI Stock Search → Modal opens with feature overview → Click "Run AI Analysis" → System analyzes all stocks (shows progress) → Results display with market sentiment, portfolio strategy, and ranked stocks → Toggle between "Top Picks" and "Avoid" tabs → Click any stock to view detailed score breakdown → Click stock card to open trade panel → Can refresh analysis or close modal
- Success criteria: Analysis completes in <10 seconds for 20+ stocks, AI reasoning is relevant and actionable, scores accurately reflect stock characteristics, recommendations lead to profitable trades, users can easily compare multiple opportunities

## Edge Case Handling

- **Plaid Connection Failures**: Clear error messages with retry logic and exponential backoff; fallback to manual CSV/JSON import if Plaid unavailable; institution status indicators; alternative connection methods
- **Plaid Token Expiration**: Automatic token refresh workflow; re-authentication prompts; graceful degradation to last-known portfolio state
- **Unsupported Institutions**: Clear messaging about 11,000+ supported institutions; manual import alternative for niche brokerages
- **Incomplete Portfolio Data**: Handle missing cost basis with current price estimation; partial import success with notifications
- **Duplicate Imports**: Detect and prevent duplicate holdings from multiple import attempts; merge or update existing positions
- **Infinity Token Conversion Disputes**: Transparent conversion history with timestamps; rate locked at import time; detailed breakdown showing USD→ΞINF calculation; immutable audit trail in Infinity Bank
- **Algorithm Timing Drift**: Server-side clock synchronization with NTP; correction mechanisms if timing falls behind schedule; guaranteed minimum appreciation enforcement
- **Rapid Price Increases**: Optimized UI rendering for constant updates without performance degradation; virtualized charts; throttled re-renders
- **Network Interruptions During Import**: Resumable import process; saved progress state; background sync when connection restored; no data loss
- **Theme Toggle Mid-Transaction**: State preserved across theme changes; transactions complete regardless of UI mode; visual consistency maintained
- **Zero Infinity Balance**: Prominent onboarding flow encouraging Plaid connection or cash deposit; demo mode to explore platform features
- **Conflicting AI Recommendations**: Show both Mario and Luigi perspectives side-by-side; explain reasoning differences; let user decide based on full context
- **Large Portfolio Imports**: Progress indicators for 100+ position imports; chunked processing; estimated time remaining

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
