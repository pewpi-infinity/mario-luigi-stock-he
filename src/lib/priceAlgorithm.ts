import type { PriceAlgorithmConfig } from './types'

const HOURLY_INCREASE_SCHEDULE = [3, 6, 2, 4, 8, 5, 3, 7, 4, 6, 5, 9, 3, 6, 4, 8, 5, 3, 6, 4, 7, 5, 3, 6]

export class PriceAlgorithm {
  private static getCurrentHourRate(): number {
    const hour = new Date().getHours()
    return HOURLY_INCREASE_SCHEDULE[hour]
  }

  private static getNextHourRate(): number {
    const nextHour = (new Date().getHours() + 1) % 24
    return HOURLY_INCREASE_SCHEDULE[nextHour]
  }

  private static getOccasionalBonus(): number {
    return Math.random() < 0.15 ? 30 : 0
  }

  static calculatePriceIncrease(): number {
    const baseRate = this.getCurrentHourRate()
    const bonus = this.getOccasionalBonus()
    return (baseRate + bonus) / 100
  }

  static updateStockPrice(currentPrice: number): number {
    const increase = this.calculatePriceIncrease()
    return parseFloat((currentPrice + increase).toFixed(2))
  }

  static getAlgorithmConfig(): PriceAlgorithmConfig {
    const now = new Date()
    const nextHour = new Date(now)
    nextHour.setHours(now.getHours() + 1, 0, 0, 0)

    return {
      currentHourRate: this.getCurrentHourRate(),
      nextUpdateTime: nextHour.getTime(),
      hourlySchedule: HOURLY_INCREASE_SCHEDULE,
    }
  }

  static calculateExpectedIncrease(seconds: number): number {
    const updates = Math.floor(seconds / 3)
    const currentRate = this.getCurrentHourRate()
    const baseIncrease = (currentRate / 100) * updates
    const bonusCount = Math.floor(updates * 0.15)
    const bonusIncrease = (30 / 100) * bonusCount
    return baseIncrease + bonusIncrease
  }

  static verifyMinimumIncrease(startPrice: number, endPrice: number, seconds: number): boolean {
    const expectedMinimum = (seconds / 60) * 0.60
    const actualIncrease = endPrice - startPrice
    return actualIncrease >= expectedMinimum
  }
}

export function initializePriceUpdates(
  stocks: any[],
  setStocks: (updater: (current: any[]) => any[]) => void
): () => void {
  const interval = setInterval(() => {
    setStocks((currentStocks) => {
      return currentStocks.map((stock) => {
        const newPrice = PriceAlgorithm.updateStockPrice(stock.currentPrice)
        const priceChange = newPrice - stock.basePrice
        const priceChangePercent = ((priceChange / stock.basePrice) * 100)

        const newPricePoint = {
          timestamp: Date.now(),
          price: newPrice,
        }

        const priceHistory = [...(stock.priceHistory || []), newPricePoint]
        if (priceHistory.length > 100) {
          priceHistory.shift()
        }

        return {
          ...stock,
          currentPrice: newPrice,
          priceChange,
          priceChangePercent,
          lastPriceUpdate: Date.now(),
          priceHistory,
        }
      })
    })
  }, 3000)

  return () => clearInterval(interval)
}
