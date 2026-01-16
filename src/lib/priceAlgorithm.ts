import type { PriceAlgorithmConfig } from './types'

const HOURLY_INCREASE_SCHEDULE = [1, 3, 6, 2, 4, 8, 5, 3, 7, 4, 6, 5, 9, 3, 6, 4, 8, 5, 3, 6, 4, 7, 5, 15]

const ALGORITHM_START_TIME = new Date('2024-01-01T03:31:00').getTime()

export class PriceAlgorithm {
  private static getCurrentHourRate(): number {
    const now = new Date()
    const hour = now.getHours()
    return HOURLY_INCREASE_SCHEDULE[hour]
  }

  private static getNextHourRate(): number {
    const nextHour = (new Date().getHours() + 1) % 24
    return HOURLY_INCREASE_SCHEDULE[nextHour]
  }

  private static getOccasionalBonus(): number {
    const isMonthlyBonus = Math.random() < (1 / (30 * 24 * 60 * 20))
    return isMonthlyBonus ? 30 : 0
  }

  static calculatePriceIncrease(): number {
    const baseRate = this.getCurrentHourRate()
    const bonus = this.getOccasionalBonus()
    const totalCents = baseRate + bonus
    return totalCents / 100
  }

  static updateStockPrice(currentPrice: number): number {
    const increase = this.calculatePriceIncrease()
    const newPrice = currentPrice + increase
    return parseFloat(newPrice.toFixed(2))
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
    return baseIncrease
  }

  static verifyMinimumIncrease(startPrice: number, endPrice: number, seconds: number): boolean {
    const updates = Math.floor(seconds / 3)
    const currentRate = this.getCurrentHourRate()
    const expectedMinimum = (currentRate / 100) * updates
    const actualIncrease = endPrice - startPrice
    return actualIncrease >= expectedMinimum
  }

  static calculateTotalAppreciation(basePrice: number, startTime: number): number {
    const now = Date.now()
    const elapsedSeconds = Math.floor((now - startTime) / 1000)
    const updates = Math.floor(elapsedSeconds / 3)
    
    const hoursElapsed = Math.floor(elapsedSeconds / 3600)
    let totalIncrease = 0
    
    for (let i = 0; i < hoursElapsed; i++) {
      const hour = (new Date(startTime + i * 3600000).getHours()) % 24
      const rate = HOURLY_INCREASE_SCHEDULE[hour]
      const updatesInHour = 1200
      totalIncrease += (rate / 100) * updatesInHour
    }
    
    const remainingSeconds = elapsedSeconds % 3600
    const remainingUpdates = Math.floor(remainingSeconds / 3)
    const currentRate = this.getCurrentHourRate()
    totalIncrease += (currentRate / 100) * remainingUpdates
    
    return parseFloat((basePrice + totalIncrease).toFixed(2))
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
