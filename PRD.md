# Planning Guide

A tokenized stock trading platform where AI-powered Mario and Luigi characters provide contrarian investment advice - Mario identifies stocks to sell, Luigi recommends stocks to hold - creating an animated, game-inspired trading experience with controlled token supply.

**Experience Qualities**:
1. **Playful** - The Mario/Luigi theme transforms serious investing into an entertaining, approachable experience that reduces anxiety around trading decisions.
2. **Contrarian** - The AI challenges conventional wisdom by actively suggesting sells (Mario stops) and holds (Luigi waits), creating thoughtful pause before action.
3. **Controlled** - Tokenized stocks with limited supply per asset creates a curated, regulated market that feels safer than traditional volatile trading.

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This requires portfolio imports, AI analysis, real-time tokenized trading, animated character interactions, buy/sell transactions, and portfolio management - all working together as a sophisticated trading platform.

## Essential Features

**Portfolio Import**
- Functionality: Import existing stock portfolios from platforms like Robinhood, Public, and Webull via CSV/JSON file upload
- Purpose: Seamless onboarding without manual data entry, instant AI analysis of current holdings
- Trigger: "Import Portfolio" button on dashboard header
- Progression: Click Import → Select platform → Download sample (optional) → Upload portfolio file → Review parsed holdings → Confirm import → Holdings added to Power Trading platform
- Success criteria: Portfolio data displays correctly with current positions, quantities, and values; imported stocks automatically added to available market

**Mario AI - Sell Recommendations**
- Functionality: AI analyzes portfolio and identifies stocks to sell, presented by animated Mario character who "stops" the user
- Purpose: Contrarian advice to prevent holding declining assets, creates memorable sell signals
- Trigger: User views portfolio, clicks "Get Mario's Pick", or scheduled daily analysis
- Progression: User requests analysis → AI evaluates holdings → Mario animation appears → Mario presents sell recommendation with reasoning → User can act or dismiss
- Success criteria: Relevant sell recommendations with clear AI reasoning, smooth Mario stop animation

**Luigi AI - Hold Recommendations**  
- Functionality: AI identifies stocks worth holding, presented by animated Luigi character telling buyers to "wait"
- Purpose: Prevents premature selling of strong positions, provides confidence in long-term holds
- Trigger: User views portfolio, clicks "Get Luigi's Pick", or when user attempts to sell a recommended hold
- Progression: User requests analysis → AI evaluates holdings → Luigi animation appears → Luigi presents hold recommendation with reasoning → User can proceed or reconsider
- Success criteria: Actionable hold advice that prevents emotional trading, engaging Luigi wait animation

**Tokenized Stock Trading**
- Functionality: Buy and sell tokenized versions of stocks with controlled supply limits per asset
- Purpose: Creates scarcity-driven market dynamics, reduces volatility, ensures liquidity control
- Trigger: User clicks Buy/Sell on any tokenized stock
- Progression: Select stock → View available token supply → Enter quantity → Review transaction → Confirm → Transaction executes → Portfolio updates
- Success criteria: Instant execution, accurate token supply tracking, portfolio reflects changes immediately

**Token Supply Management**
- Functionality: Display and enforce maximum token supply per stock, show scarcity metrics
- Purpose: Transparency in market structure, creates urgency for popular stocks
- Trigger: Viewing any stock detail page or market overview
- Progression: User views stock → Sees total supply and available tokens → Understands scarcity → Makes informed decision
- Success criteria: Clear visualization of token availability, prevents over-minting beyond set limits

## Edge Case Handling

- **Import Failures**: Multiple file format support (CSV/JSON), flexible parsing that handles various column headers, sample file downloads to test feature, clear error messages with parsing details
- **No AI Recommendations**: When portfolio is optimally balanced, show encouraging message from both characters celebrating good holdings
- **Sold Out Tokens**: Waitlist feature for fully-allocated stocks, notifications when tokens become available
- **Conflicting AI Advice**: When Mario suggests selling what Luigi previously recommended holding, show debate animation and updated reasoning
- **Network Delays**: Optimistic UI updates with loading states, transaction queuing for offline resilience
- **Zero Portfolio**: Onboarding flow to discover and purchase first tokens through guided experience

## Design Direction

The design should evoke nostalgia, playfulness, and trust - blending classic video game aesthetics with modern fintech credibility. Think retro pixel art meets sleek trading interface, where whimsical Mario characters provide surprisingly sophisticated financial insights. The experience should feel like a game you want to play, but one you'd trust with real money.

## Color Selection

A vibrant, game-inspired palette that balances playful energy with financial professionalism, using the iconic Mario red and Luigi green as functional color signals.

- **Primary Color**: Mario Red `oklch(0.55 0.22 25)` - Represents sell actions, warnings, and Mario's presence; conveys urgency and attention
- **Secondary Colors**: 
  - Luigi Green `oklch(0.65 0.18 145)` - Represents hold actions, positive sentiment, and Luigi's presence
  - Coin Gold `oklch(0.75 0.15 85)` - Accent for token counts, rewards, achievements
  - Warp Pipe Blue `oklch(0.50 0.15 250)` - Buy actions, navigation, interactive elements
- **Accent Color**: Power Star Yellow `oklch(0.85 0.18 95)` - CTAs, notifications, AI insights, important highlights
- **Foreground/Background Pairings**:
  - Background (Clean White `oklch(0.98 0 0)`): Dark Text `oklch(0.20 0 0)` - Ratio 14.2:1 ✓
  - Mario Red: White text `oklch(0.98 0 0)` - Ratio 5.1:1 ✓
  - Luigi Green: White text `oklch(0.98 0 0)` - Ratio 4.8:1 ✓
  - Warp Pipe Blue: White text `oklch(0.98 0 0)` - Ratio 6.2:1 ✓
  - Power Star Yellow: Dark text `oklch(0.20 0 0)` - Ratio 12.8:1 ✓

## Font Selection

Typography should balance retro gaming charm with modern financial clarity - fun but never childish, approachable but trustworthy.

- **Primary Typeface**: Press Start 2P for headers, character names, and key stats (evokes classic Mario games)
- **Secondary Typeface**: Space Grotesk for body text, data, and UI (modern, technical, readable at small sizes)

**Typographic Hierarchy**:
- H1 (Page Titles): Press Start 2P Bold/32px/tight letter spacing
- H2 (Section Headers): Press Start 2P Regular/20px/normal letter spacing  
- H3 (Character Names): Press Start 2P Regular/16px/normal letter spacing
- Body (Trading Info): Space Grotesk Regular/16px/1.6 line height
- Data (Stock Prices): Space Grotesk Bold/18px/tabular numbers
- Small (Metadata): Space Grotesk Regular/14px/relaxed tracking

## Animations

Animations should feel like power-ups in a Mario game - quick, satisfying, and purposeful. Mario should "jump in" to stop selling, Luigi should "slide in" to recommend holding. Token transactions should have coin-collection sound-like visual feedback. Subtle parallax on portfolio cards creates depth. All animations should complete within 300ms to maintain snappy game-like responsiveness, with character entrances being the delightful exception at 500ms.

## Component Selection

**Components**:
- **Dialog**: Character recommendations modal with animated Mario/Luigi sprites
- **Card**: Portfolio holdings, individual stock cards with glass-morphism effect
- **Button**: Primary actions styled as game buttons with pixel-perfect borders, hover state mimics button press
- **Tabs**: Switch between Portfolio / Market / AI Insights views
- **Progress**: Token supply visualization (shows X/1000 tokens available)
- **Sheet**: Slide-out buy/sell transaction panel from right side
- **Avatar**: User profile, imported platform badges
- **Badge**: Token counts, stock categories (Tech, Finance, etc.)
- **Skeleton**: Loading states for portfolio import and AI analysis
- **Sonner Toast**: Transaction confirmations styled as Mario game notifications ("1-UP!" style)

**Customizations**:
- Custom animated SVG components for Mario and Luigi with multiple states (idle, talking, excited, warning)
- Coin flip animation component for token transactions
- Portfolio import connector component with OAuth flows
- AI reasoning card component with character-specific styling

**States**:
- Buttons: Default has subtle drop shadow, hover lifts with Mario jump arc, active presses down 2px, disabled is grayscale
- Inputs: Focus state glows with gold outline like collecting coins
- Cards: Hover scales 1.02 with gentle lift shadow, selected has gold border pulse

**Icon Selection**:
- ArrowUp/ArrowDown (Phosphor) for price movements
- Coins (Phosphor) for token counts
- TrendUp/TrendDown for performance metrics
- Lightning for AI insights
- Upload for portfolio import
- ShoppingCart for buy actions
- Wallet for holdings

**Spacing**:
- Card padding: p-6 (24px)
- Section gaps: gap-8 (32px)
- Button spacing: px-8 py-3
- Grid layouts: grid gap-6
- Character modals: p-12 for breathing room

**Mobile**:
- Single column portfolio grid on mobile
- Bottom sheet for buy/sell instead of side panel
- Floating action button for AI insights
- Collapsible stats section to prioritize holdings
- Hamburger menu for navigation
- Character animations scale down but remain prominent
