import type { Stock } from './types'

export interface StockSource {
  stockId: string
  symbol: string
  sourcePortfolio: string
  totalSharesAcquired: number
  availableForSale: number
  acquisitionDate: number
  originalOwner: string
}

export class StockSourceService {
  private static readonly MASTER_PORTFOLIO = 'Bill Gates Portfolio'
  
  static initializeStockSource(stock: Stock): StockSource {
    return {
      stockId: stock.id,
      symbol: stock.symbol,
      sourcePortfolio: this.MASTER_PORTFOLIO,
      totalSharesAcquired: stock.totalSupply,
      availableForSale: stock.availableTokens,
      acquisitionDate: Date.now(),
      originalOwner: 'Bill Gates',
    }
  }

  static async acquireShares(
    symbol: string,
    quantity: number,
    sourcePortfolio: string = this.MASTER_PORTFOLIO
  ): Promise<boolean> {
    const kvKey = `stock-source-${symbol}`
    const existing = await window.spark.kv.get<StockSource>(kvKey)
    
    if (!existing) {
      return false
    }

    if (existing.availableForSale < quantity) {
      return false
    }

    existing.availableForSale -= quantity
    await window.spark.kv.set(kvKey, existing)
    
    return true
  }

  static async transferSharesFromUser(
    userId: string,
    symbol: string,
    quantity: number
  ): Promise<{ success: boolean; infinityTokens: number }> {
    const kvKey = `stock-source-${symbol}`
    const existing = await window.spark.kv.get<StockSource>(kvKey)
    
    if (!existing) {
      const newSource: StockSource = {
        stockId: `acquired-${symbol}`,
        symbol,
        sourcePortfolio: `User Transfer - ${userId}`,
        totalSharesAcquired: quantity,
        availableForSale: quantity,
        acquisitionDate: Date.now(),
        originalOwner: userId,
      }
      
      await window.spark.kv.set(kvKey, newSource)
      
      return {
        success: true,
        infinityTokens: quantity,
      }
    }

    existing.totalSharesAcquired += quantity
    existing.availableForSale += quantity
    await window.spark.kv.set(kvKey, existing)
    
    return {
      success: true,
      infinityTokens: quantity,
    }
  }

  static async getStockSource(symbol: string): Promise<StockSource | null> {
    const kvKey = `stock-source-${symbol}`
    return await window.spark.kv.get<StockSource>(kvKey) || null
  }

  static async recordSharesSold(
    symbol: string,
    quantity: number,
    buyer: string
  ): Promise<void> {
    const salesKey = `stock-sales-${symbol}`
    const sales = await window.spark.kv.get<any[]>(salesKey) || []
    
    sales.push({
      quantity,
      buyer,
      timestamp: Date.now(),
      sourcePortfolio: this.MASTER_PORTFOLIO,
    })
    
    await window.spark.kv.set(salesKey, sales)
  }

  static getSourceDescription(source: StockSource): string {
    return `${source.totalSharesAcquired.toLocaleString()} shares acquired from ${source.sourcePortfolio}. ${source.availableForSale.toLocaleString()} available for purchase.`
  }

  static async initializeAllStocks(stocks: Stock[]): Promise<void> {
    for (const stock of stocks) {
      const kvKey = `stock-source-${stock.symbol}`
      const existing = await window.spark.kv.get<StockSource>(kvKey)
      
      if (!existing) {
        const source = this.initializeStockSource(stock)
        await window.spark.kv.set(kvKey, source)
      }
    }
  }
}
