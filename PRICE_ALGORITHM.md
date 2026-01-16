# Infinity Trading Price Algorithm

## Overview

Infinity Trading uses a revolutionary **guaranteed appreciation algorithm** where stock prices **only increase and never drop**. This creates a fundamentally different trading experience from traditional volatile markets.

## How It Works

### Core Principle
Every stock price increases continuously at a rate determined by the current hour of the day. Updates happen **every 3 seconds**, 24/7, 365 days a year.

### Hourly Rate Schedule

The appreciation rate changes every hour on a predefined schedule:

| Hour | Rate (cents per 3 seconds) | $ per minute | $ per hour |
|------|---------------------------|--------------|------------|
| 00:00 | 1¢ | $0.20 | $12.00 |
| 01:00 | 3¢ | $0.60 | $36.00 |
| 02:00 | 6¢ | $1.20 | $72.00 |
| 03:00 | 2¢ | $0.40 | $24.00 |
| 04:00 | 4¢ | $0.80 | $48.00 |
| 05:00 | 8¢ | $1.60 | $96.00 |
| 06:00 | 5¢ | $1.00 | $60.00 |
| 07:00 | 3¢ | $0.60 | $36.00 |
| 08:00 | 7¢ | $1.40 | $84.00 |
| 09:00 | 4¢ | $0.80 | $48.00 |
| 10:00 | 6¢ | $1.20 | $72.00 |
| 11:00 | 5¢ | $1.00 | $60.00 |
| 12:00 | 9¢ | $1.80 | $108.00 |
| 13:00 | 3¢ | $0.60 | $36.00 |
| 14:00 | 6¢ | $1.20 | $72.00 |
| 15:00 | 4¢ | $0.80 | $48.00 |
| 16:00 | 8¢ | $1.60 | $96.00 |
| 17:00 | 5¢ | $1.00 | $60.00 |
| 18:00 | 3¢ | $0.60 | $36.00 |
| 19:00 | 6¢ | $1.20 | $72.00 |
| 20:00 | 4¢ | $0.80 | $48.00 |
| 21:00 | 7¢ | $1.40 | $84.00 |
| 22:00 | 5¢ | $1.00 | $60.00 |
| 23:00 | 15¢ | $3.00 | $180.00 |

**Average Daily Increase**: ~$60 per stock

### Example Price Growth

Starting price: **$231.00** at 3:31 AM (Hour 3: 2¢/3s rate)

| Time | Updates | Increase | New Price |
|------|---------|----------|-----------|
| 3:31:00 | 0 | $0.00 | $231.00 |
| 3:31:03 | 1 | $0.02 | $231.02 |
| 3:31:06 | 2 | $0.04 | $231.04 |
| 3:31:30 | 10 | $0.20 | $231.20 |
| 3:32:00 | 20 | $0.40 | $231.40 |
| 3:33:00 | 40 | $0.80 | $231.80 |
| 4:00:00 | 580 | $11.60 | $242.60 |
| 4:31:00 | 1200 | $35.60 | $266.60 |

At 4:00 AM the rate changes to 4¢/3s, so growth accelerates further.

### Occasional Bonuses

Approximately **once per month**, the system randomly adds a **30¢ bonus** to a single update instead of the hourly rate. This creates exciting moments of accelerated growth.

## Benefits of Guaranteed Appreciation

1. **No Losses**: Holdings can never decrease in value
2. **Predictable Growth**: You can calculate expected appreciation
3. **Peace of Mind**: No need to watch for crashes or drops
4. **Always Positive**: Every position shows green gains over time
5. **Compound Effects**: The longer you hold, the more total appreciation

## Stock Source & Supply

All tokenized stocks are backed by real shares acquired from users who import their portfolios:

- Users connect Robinhood/other brokerages via Plaid
- Real shares are transferred to platform control
- Users receive Infinity Tokens in exchange
- Platform liquidates real shares for tangible assets (gold, silver, land)
- Tokenized versions are sold with guaranteed appreciation

This ensures legitimate backing while the platform owner builds real wealth.

## Trading Strategy

Since prices always increase, the optimal strategy is:

1. **Buy Early**: Earlier prices are always lower
2. **Hold Long**: Maximize total appreciation
3. **Dollar-Cost Average**: Regular purchases reduce average cost
4. **Buy During Slow Hours**: Acquire during 1-2¢/3s hours for better deals

## Technical Implementation

- Update interval: Exactly 3000ms (3 seconds)
- Precision: 2 decimal places
- Algorithm: `newPrice = currentPrice + (hourlyRate / 100)`
- Storage: All price history tracked in Infinity Bank
- Verification: System validates minimum appreciation thresholds

## Frequently Asked Questions

**Q: Can prices ever drop?**  
A: No. The system only adds value, never subtracts.

**Q: What happens if there's a system outage?**  
A: When the system comes back online, it calculates the missed appreciation and applies it to ensure no user loses potential gains.

**Q: Are the hourly rates random?**  
A: No, they follow a fixed 24-hour schedule that repeats daily.

**Q: Can I sell at any time?**  
A: Yes, you can sell anytime. The current price is always higher than your purchase price.

**Q: How is this sustainable?**  
A: The platform acquires real shares from users at traditional market prices and converts them to the Infinity ecosystem. Real shares are liquidated for tangible assets while users enjoy guaranteed digital appreciation.

---

**Algorithm Start Date**: January 1, 2024 at 3:31 AM  
**Current Version**: 2.0  
**Last Updated**: 2024
