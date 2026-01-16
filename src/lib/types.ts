export interface Stock {
  id: string
  symbol: string
  name: string
  currentPrice: number
  priceChange: number
  priceChangePercent: number
  totalSupply: number
  availableTokens: number
  category: string
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
  type: 'buy' | 'sell'
  stockId: string
  symbol: string
  quantity: number
  price: number
  total: number
  timestamp: number
}

export interface Portfolio {
  totalValue: number
  totalGainLoss: number
  totalGainLossPercent: number
  holdings: PortfolioHolding[]
}
