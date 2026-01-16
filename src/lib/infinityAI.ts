import type { Stock, PortfolioHolding } from './types'

export interface InfinityStockScore {
  stock: Stock
  overallScore: number
  momentumScore: number
  valueScore: number
  scarcityScore: number
  appreciationScore: number
  infinityPotential: number
  reasoning: string
  confidenceLevel: 'very-high' | 'high' | 'moderate' | 'low'
  recommendation: 'strong-buy' | 'buy' | 'hold' | 'sell'
}

export interface AIAnalysisResult {
  topPicks: InfinityStockScore[]
  avoidStocks: InfinityStockScore[]
  portfolioAnalysis: string
  marketSentiment: string
  timestamp: number
}

export class InfinityAI {
  private static calculateMomentumScore(stock: Stock): number {
    if (!stock.priceHistory || stock.priceHistory.length < 2) {
      return 50
    }

    const recentHistory = stock.priceHistory.slice(-20)
    const priceChanges = recentHistory.map((point, idx) => {
      if (idx === 0) return 0
      return point.price - recentHistory[idx - 1].price
    })

    const avgChange = priceChanges.reduce((a, b) => a + b, 0) / priceChanges.length
    const consistency = priceChanges.filter(c => c > 0).length / priceChanges.length

    const momentumScore = Math.min(100, (avgChange * 100 + consistency * 50))
    return Math.max(0, momentumScore)
  }

  private static calculateValueScore(stock: Stock): number {
    const priceToSupplyRatio = stock.currentPrice / stock.totalSupply
    const averageRatio = 0.5
    
    const relativeValue = (averageRatio / priceToSupplyRatio) * 100
    
    return Math.min(100, Math.max(0, relativeValue))
  }

  private static calculateScarcityScore(stock: Stock): number {
    const availabilityRatio = stock.availableTokens / stock.totalSupply
    
    const scarcityScore = (1 - availabilityRatio) * 100
    
    return scarcityScore
  }

  private static calculateAppreciationScore(stock: Stock): number {
    const priceGrowth = ((stock.currentPrice - stock.basePrice) / stock.basePrice) * 100
    
    const normalizedScore = Math.min(100, priceGrowth * 2)
    
    return Math.max(0, normalizedScore)
  }

  private static calculateInfinityPotential(stock: Stock): number {
    const liquidityScore = (stock.availableTokens / stock.totalSupply) * 30
    
    const categoryMultiplier = stock.category === 'Tech' ? 1.3 : 
                               stock.category === 'Finance' ? 1.2 :
                               stock.category === 'Healthcare' ? 1.15 : 1.0
    
    const priceEfficiency = (stock.currentPrice > 100 && stock.currentPrice < 500) ? 1.2 : 1.0
    
    const baseScore = (liquidityScore + 50) * categoryMultiplier * priceEfficiency
    
    return Math.min(100, baseScore)
  }

  private static determineRecommendation(overallScore: number): 'strong-buy' | 'buy' | 'hold' | 'sell' {
    if (overallScore >= 80) return 'strong-buy'
    if (overallScore >= 65) return 'buy'
    if (overallScore >= 40) return 'hold'
    return 'sell'
  }

  private static determineConfidence(overallScore: number, consistency: number): 'very-high' | 'high' | 'moderate' | 'low' {
    if (overallScore >= 85 && consistency > 0.8) return 'very-high'
    if (overallScore >= 70 && consistency > 0.6) return 'high'
    if (overallScore >= 50) return 'moderate'
    return 'low'
  }

  static async analyzeStock(stock: Stock): Promise<InfinityStockScore> {
    const momentumScore = this.calculateMomentumScore(stock)
    const valueScore = this.calculateValueScore(stock)
    const scarcityScore = this.calculateScarcityScore(stock)
    const appreciationScore = this.calculateAppreciationScore(stock)
    const infinityPotential = this.calculateInfinityPotential(stock)

    const weights = {
      momentum: 0.25,
      value: 0.15,
      scarcity: 0.20,
      appreciation: 0.20,
      infinity: 0.20,
    }

    const overallScore = 
      momentumScore * weights.momentum +
      valueScore * weights.value +
      scarcityScore * weights.scarcity +
      appreciationScore * weights.appreciation +
      infinityPotential * weights.infinity

    const consistency = stock.priceHistory?.length > 0 ? 
      stock.priceHistory.filter((_, idx, arr) => 
        idx === 0 || arr[idx].price >= arr[idx - 1].price
      ).length / stock.priceHistory.length : 0.5

    const recommendation = this.determineRecommendation(overallScore)
    const confidenceLevel = this.determineConfidence(overallScore, consistency)

    const prompt = (window.spark.llmPrompt as any)`You are an advanced AI trading analyst specializing in the Infinity Token ecosystem. Analyze this stock and provide a brief, insightful recommendation (max 80 words).

Stock: ${stock.symbol} - ${stock.name}
Category: ${stock.category}
Current Price: $${stock.currentPrice.toFixed(2)}
Price Growth: ${stock.priceChangePercent.toFixed(2)}%
Available Supply: ${stock.availableTokens}/${stock.totalSupply} tokens
Overall Score: ${overallScore.toFixed(1)}/100
Recommendation: ${recommendation.toUpperCase()}

Key Scores:
- Momentum: ${momentumScore.toFixed(1)}
- Value: ${valueScore.toFixed(1)}
- Scarcity: ${scarcityScore.toFixed(1)}
- Appreciation: ${appreciationScore.toFixed(1)}
- Infinity Potential: ${infinityPotential.toFixed(1)}

Provide a concise explanation focusing on why this stock ${recommendation === 'strong-buy' || recommendation === 'buy' ? 'is a great opportunity' : recommendation === 'hold' ? 'should be held' : 'should be avoided'}. Mention the key factors driving this assessment.`

    let reasoning = ''
    try {
      reasoning = await window.spark.llm(prompt, 'gpt-4o-mini', false)
    } catch (error) {
      reasoning = this.generateFallbackReasoning(stock, recommendation, overallScore)
    }

    return {
      stock,
      overallScore,
      momentumScore,
      valueScore,
      scarcityScore,
      appreciationScore,
      infinityPotential,
      reasoning,
      confidenceLevel,
      recommendation,
    }
  }

  private static generateFallbackReasoning(
    stock: Stock, 
    recommendation: string, 
    score: number
  ): string {
    const scarcityNote = stock.availableTokens < stock.totalSupply * 0.3 ? 
      ' Limited supply creates strong scarcity value.' : ''
    const growthNote = stock.priceChangePercent > 5 ? 
      ' Strong upward momentum detected.' : ''
    
    if (recommendation === 'strong-buy' || recommendation === 'buy') {
      return `${stock.symbol} shows excellent potential with a score of ${score.toFixed(1)}/100.${growthNote}${scarcityNote} The Infinity algorithm predicts continued appreciation.`
    } else if (recommendation === 'hold') {
      return `${stock.symbol} is performing adequately with a score of ${score.toFixed(1)}/100. Consider holding for continued algorithmic appreciation.`
    } else {
      return `${stock.symbol} scores ${score.toFixed(1)}/100, suggesting better opportunities exist in the market.`
    }
  }

  static async analyzeAllStocks(stocks: Stock[]): Promise<AIAnalysisResult> {
    const analyses = await Promise.all(
      stocks.map(stock => this.analyzeStock(stock))
    )

    const sortedByScore = [...analyses].sort((a, b) => b.overallScore - a.overallScore)
    
    const topPicks = sortedByScore.slice(0, 5)
    const avoidStocks = sortedByScore.slice(-3)

    const avgScore = analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length

    const marketSentimentPrompt = (window.spark.llmPrompt as any)`You are a market analyst for the Infinity Trading platform. Based on these stock performance metrics, provide a brief 2-sentence market sentiment summary:

Average Market Score: ${avgScore.toFixed(1)}/100
Top Performing Category: ${this.getMostCommonCategory(topPicks)}
Number of Strong Buys: ${analyses.filter(a => a.recommendation === 'strong-buy').length}
Total Stocks Analyzed: ${stocks.length}

Provide an encouraging yet realistic market overview.`

    let marketSentiment = ''
    try {
      marketSentiment = await window.spark.llm(marketSentimentPrompt, 'gpt-4o-mini', false)
    } catch (error) {
      marketSentiment = `The Infinity market shows ${avgScore >= 60 ? 'strong' : 'moderate'} performance with ${analyses.filter(a => a.recommendation === 'strong-buy').length} exceptional opportunities. All stocks benefit from guaranteed algorithmic appreciation.`
    }

    const portfolioAnalysisPrompt = (window.spark.llmPrompt as any)`Provide a brief 2-sentence portfolio strategy recommendation based on these top picks:

${topPicks.slice(0, 3).map(pick => 
  `${pick.stock.symbol} (${pick.recommendation}, score: ${pick.overallScore.toFixed(1)})`
).join('\n')}

Focus on diversification and Infinity potential.`

    let portfolioAnalysis = ''
    try {
      portfolioAnalysis = await window.spark.llm(portfolioAnalysisPrompt, 'gpt-4o-mini', false)
    } catch (error) {
      portfolioAnalysis = `Consider diversifying across ${topPicks.slice(0, 3).map(p => p.stock.symbol).join(', ')} for optimal returns. These stocks show the strongest Infinity potential with consistent appreciation.`
    }

    return {
      topPicks,
      avoidStocks,
      portfolioAnalysis,
      marketSentiment,
      timestamp: Date.now(),
    }
  }

  private static getMostCommonCategory(stocks: InfinityStockScore[]): string {
    const categories = stocks.map(s => s.stock.category)
    const counts = categories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mixed'
  }

  static async analyzePortfolio(holdings: PortfolioHolding[], stocks: Stock[]): Promise<{
    shouldSell: { holding: PortfolioHolding; reason: string; confidence: number }[]
    shouldHold: { holding: PortfolioHolding; reason: string; confidence: number }[]
    recommendations: string
  }> {
    if (holdings.length === 0) {
      return {
        shouldSell: [],
        shouldHold: [],
        recommendations: 'Start building your portfolio with our top-rated stocks for maximum Infinity potential.',
      }
    }

    const holdingAnalyses = await Promise.all(
      holdings.map(async holding => {
        const stock = stocks.find(s => s.id === holding.stockId)
        if (!stock) return null

        const analysis = await this.analyzeStock(stock)
        return { holding, stock, analysis }
      })
    )

    const validAnalyses = holdingAnalyses.filter(a => a !== null) as Array<{
      holding: PortfolioHolding
      stock: Stock
      analysis: InfinityStockScore
    }>

    const sorted = [...validAnalyses].sort((a, b) => 
      a.analysis.overallScore - b.analysis.overallScore
    )

    const shouldSell = sorted
      .filter(a => a.analysis.recommendation === 'sell' || a.holding.gainLossPercent < -5)
      .slice(0, 3)
      .map(a => ({
        holding: a.holding,
        reason: `Underperforming with ${a.holding.gainLossPercent.toFixed(1)}% returns. Score: ${a.analysis.overallScore.toFixed(1)}/100.`,
        confidence: a.analysis.overallScore < 40 ? 85 : 70,
      }))

    const shouldHold = sorted
      .filter(a => a.analysis.recommendation === 'strong-buy' || a.analysis.recommendation === 'buy')
      .slice(-3)
      .map(a => ({
        holding: a.holding,
        reason: `Strong performer with ${a.holding.gainLossPercent.toFixed(1)}% gains. Score: ${a.analysis.overallScore.toFixed(1)}/100.`,
        confidence: a.analysis.overallScore >= 80 ? 95 : 80,
      }))

    const recommendationsPrompt = (window.spark.llmPrompt as any)`You are a portfolio advisor for Infinity Trading. Based on this portfolio analysis, provide 2-3 actionable recommendations (max 100 words):

Total Holdings: ${holdings.length}
Avg Performance: ${(holdings.reduce((sum, h) => sum + h.gainLossPercent, 0) / holdings.length).toFixed(1)}%
Strong Positions: ${shouldHold.length}
Weak Positions: ${shouldSell.length}

Provide practical next steps for optimizing this portfolio.`

    let recommendations = ''
    try {
      recommendations = await window.spark.llm(recommendationsPrompt, 'gpt-4o-mini', false)
    } catch (error) {
      recommendations = `Your portfolio shows ${shouldHold.length} strong positions. ${shouldSell.length > 0 ? `Consider reallocating from ${shouldSell.length} underperforming holdings into top-rated opportunities.` : 'Continue holding your current positions for algorithmic appreciation.'}`
    }

    return {
      shouldSell,
      shouldHold,
      recommendations,
    }
  }
}
