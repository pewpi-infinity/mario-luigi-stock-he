import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkle, TrendUp, ShieldCheck, Lightning, ChartBar, X } from '@phosphor-icons/react'
import type { Stock } from '@/lib/types'
import type { InfinityStockScore, AIAnalysisResult } from '@/lib/infinityAI'
import { InfinityAI } from '@/lib/infinityAI'
import { toast } from 'sonner'

interface AIStockSearchProps {
  isOpen: boolean
  onClose: () => void
  stocks: Stock[]
  onSelectStock: (stock: Stock) => void
}

export function AIStockSearch({ isOpen, onClose, stocks, onSelectStock }: AIStockSearchProps) {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedView, setSelectedView] = useState<'top' | 'avoid'>('top')

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const result = await InfinityAI.analyzeAllStocks(stocks)
      setAnalysis(result)
      toast.success('AI analysis complete!', {
        description: `Found ${result.topPicks.length} top opportunities`,
      })
    } catch (error) {
      toast.error('Analysis failed', {
        description: 'Unable to complete AI analysis. Please try again.',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleStockClick = (stock: Stock) => {
    onSelectStock(stock)
    onClose()
  }

  const getRecommendationBadge = (recommendation: string) => {
    const variants = {
      'strong-buy': 'bg-secondary text-secondary-foreground',
      'buy': 'bg-accent text-accent-foreground',
      'hold': 'bg-muted text-muted-foreground',
      'sell': 'bg-destructive text-destructive-foreground',
    }
    return variants[recommendation as keyof typeof variants] || variants.hold
  }

  const getConfidenceBadge = (confidence: string) => {
    const variants = {
      'very-high': 'bg-secondary/20 text-secondary border-secondary',
      'high': 'bg-accent/20 text-accent border-accent',
      'moderate': 'bg-muted text-muted-foreground border-border',
      'low': 'bg-destructive/20 text-destructive border-destructive',
    }
    return variants[confidence as keyof typeof variants] || variants.moderate
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-display">
            <Sparkle size={28} weight="duotone" className="text-accent" />
            AI Stock Search
          </DialogTitle>
          <DialogDescription>
            Powered by Infinity-minded algorithms analyzing momentum, scarcity, and appreciation potential
          </DialogDescription>
        </DialogHeader>

        {!analysis ? (
          <div className="py-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full blur-2xl opacity-20 animate-pulse" />
                <Sparkle size={64} weight="duotone" className="text-primary relative" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Discover Top Investment Opportunities</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Our advanced AI analyzes all available stocks using sophisticated Infinity algorithms to find the best picks for you.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-muted/50 rounded-lg p-4">
                <TrendUp size={24} weight="duotone" className="text-secondary mx-auto mb-2" />
                <div className="text-xs font-medium">Momentum Analysis</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <ShieldCheck size={24} weight="duotone" className="text-primary mx-auto mb-2" />
                <div className="text-xs font-medium">Scarcity Scoring</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <ChartBar size={24} weight="duotone" className="text-accent mx-auto mb-2" />
                <div className="text-xs font-medium">Value Assessment</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <Lightning size={24} weight="duotone" className="text-secondary mx-auto mb-2" />
                <div className="text-xs font-medium">Infinity Potential</div>
              </div>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              size="lg"
              className="gap-2 font-semibold"
            >
              {isAnalyzing ? (
                <>
                  <Sparkle size={20} weight="duotone" className="animate-spin" />
                  Analyzing {stocks.length} Stocks...
                </>
              ) : (
                <>
                  <Sparkle size={20} weight="duotone" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-lg p-6 border border-border/50">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Lightning size={20} weight="duotone" className="text-accent" />
                Market Sentiment
              </h3>
              <p className="text-sm text-muted-foreground">{analysis.marketSentiment}</p>
              <div className="mt-4 pt-4 border-t border-border/50">
                <h3 className="font-semibold mb-2 text-sm">Portfolio Strategy</h3>
                <p className="text-sm text-muted-foreground">{analysis.portfolioAnalysis}</p>
              </div>
            </div>

            <div className="flex gap-2 border-b border-border">
              <button
                onClick={() => setSelectedView('top')}
                className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
                  selectedView === 'top'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Top Picks ({analysis.topPicks.length})
              </button>
              <button
                onClick={() => setSelectedView('avoid')}
                className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
                  selectedView === 'avoid'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Avoid ({analysis.avoidStocks.length})
              </button>
            </div>

            <div className="space-y-4">
              {(selectedView === 'top' ? analysis.topPicks : analysis.avoidStocks).map((score: InfinityStockScore) => (
                <div
                  key={score.stock.id}
                  className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => handleStockClick(score.stock)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg">{score.stock.symbol}</h4>
                        <Badge className={getRecommendationBadge(score.recommendation)}>
                          {score.recommendation.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getConfidenceBadge(score.confidenceLevel)}>
                          {score.confidenceLevel.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{score.stock.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono tabular-nums">
                        ${score.stock.currentPrice.toFixed(2)}
                      </div>
                      <div className="text-sm text-secondary">
                        +{score.stock.priceChangePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm leading-relaxed">{score.reasoning}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-xs text-muted-foreground mb-1">Overall</div>
                      <div className="text-lg font-bold">{score.overallScore.toFixed(0)}</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-xs text-muted-foreground mb-1">Momentum</div>
                      <div className="text-lg font-bold">{score.momentumScore.toFixed(0)}</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-xs text-muted-foreground mb-1">Scarcity</div>
                      <div className="text-lg font-bold">{score.scarcityScore.toFixed(0)}</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-xs text-muted-foreground mb-1">Value</div>
                      <div className="text-lg font-bold">{score.valueScore.toFixed(0)}</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-xs text-muted-foreground mb-1">Infinity</div>
                      <div className="text-lg font-bold">{score.infinityPotential.toFixed(0)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                      {score.stock.availableTokens.toLocaleString()} / {score.stock.totalSupply.toLocaleString()} tokens available
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary font-medium">
                      Click to trade →
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button onClick={handleAnalyze} variant="outline" className="gap-2 flex-1">
                <Sparkle size={18} weight="duotone" />
                Refresh Analysis
              </Button>
              <Button onClick={onClose} variant="outline">
                <X size={18} weight="bold" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
