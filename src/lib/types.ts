export interface Stock {
  id: string
  symbol: string
  name: string
  currentPrice: number
  basePrice: number
  priceChange: number
  priceChangePercent: number
  totalSupply: number
  availableTokens: number
  category: string
  lastPriceUpdate: number
  priceHistory: PricePoint[]
}

export interface PricePoint {
  timestamp: number
  price: number
}

export interface PortfolioHolding {
  id: string
  stockId: string
  symbol: string
  name: string
  quantity: number
  averagePrice: number
  currentPrice: number
  totalValue: number
  gainLoss: number
  gainLossPercent: number
  infinityBankId: string
  securityLevel: 'plateau' | 'plus'
}

export interface AIRecommendation {
  id: string
  type: 'sell' | 'hold'
  character: 'mario' | 'luigi'
  stockSymbol: string
  stockName: string
  reasoning: string
  confidence: number
  timestamp: number
}

export interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'import' | 'convert'
  stockId: string
  symbol: string
  quantity: number
  price: number
  total: number
  infinityTokens?: number
  timestamp: number
  infinityBankId: string
}

export interface Portfolio {
  totalValue: number
  totalGainLoss: number
  totalGainLossPercent: number
  holdings: PortfolioHolding[]
  infinityTokenBalance: number
  cashBalance: number
}

export interface InfinityBankRecord {
  id: string
  userId: string
  type: 'holding' | 'transaction' | 'balance'
  data: any
  timestamp: number
  securityHash: string
  plateauBackup: boolean
  plusRedundancy: boolean
}

export interface PriceAlgorithmConfig {
  currentHourRate: number
  nextUpdateTime: number
  hourlySchedule: number[]
}
