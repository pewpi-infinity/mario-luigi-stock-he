import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Toaster } from '@/components/ui/sonner'
import { Upload, TrendUp, Bank, Lightning, Coins, Shield, ArrowsClockwise } from '@phosphor-icons/react'
import { StockCard } from '@/components/StockCard'
import { PortfolioCard } from '@/components/PortfolioCard'
import { TradePanel } from '@/components/TradePanel'
import { MarioCharacter } from '@/components/MarioCharacter'
import { LuigiCharacter } from '@/components/LuigiCharacter'
import { PortfolioImportDialog } from '@/components/PortfolioImportDialog'
import { InfinityBankStatus } from '@/components/InfinityBankStatus'
import type { Stock, PortfolioHolding, Portfolio, Transaction } from '@/lib/types'
import { toast } from 'sonner'
import { generateInfinityBankId, InfinityBank } from '@/lib/infinityBank'
import { initializePriceUpdates } from '@/lib/priceAlgorithm'

const INITIAL_STOCKS: Stock[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 178.50,
    basePrice: 178.50,
    priceChange: 0,
    priceChangePercent: 0,
    totalSupply: 1000,
    availableTokens: 742,
    category: 'Tech',
    lastPriceUpdate: Date.now(),
    priceHistory: [],
  },
  {
    id: '2',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 142.80,
    basePrice: 142.80,
    priceChange: 0,
    priceChangePercent: 0,
    totalSupply: 1000,
    availableTokens: 521,
    category: 'Tech',
    lastPriceUpdate: Date.now(),
    priceHistory: [],
  },
  {
    id: '3',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 412.30,
    basePrice: 412.30,
    priceChange: 0,
    priceChangePercent: 0,
    totalSupply: 1000,
    availableTokens: 890,
    category: 'Tech',
    lastPriceUpdate: Date.now(),
    priceHistory: [],
  },
  {
    id: '4',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    currentPrice: 248.90,
    basePrice: 248.90,
    priceChange: 0,
    priceChangePercent: 0,
    totalSupply: 1000,
    availableTokens: 145,
    category: 'Auto',
    lastPriceUpdate: Date.now(),
    priceHistory: [],
  },
  {
    id: '5',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    currentPrice: 875.40,
    basePrice: 875.40,
    priceChange: 0,
    priceChangePercent: 0,
    totalSupply: 1000,
    availableTokens: 67,
    category: 'Tech',
    lastPriceUpdate: Date.now(),
    priceHistory: [],
  },
  {
    id: '6',
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    currentPrice: 178.25,
    basePrice: 178.25,
    priceChange: 0,
    priceChangePercent: 0,
    totalSupply: 1000,
    availableTokens: 423,
    category: 'Retail',
    lastPriceUpdate: Date.now(),
    priceHistory: [],
  },
]

function App() {
  const [stocks, setStocks] = useKV<Stock[]>('infinity-stocks-v2', INITIAL_STOCKS)
  const [holdings, setHoldings] = useKV<PortfolioHolding[]>('infinity-holdings-v2', [])
  const [transactions, setTransactions] = useKV<Transaction[]>('infinity-transactions-v2', [])
  const [infinityTokenBalance, setInfinityTokenBalance] = useKV<number>('infinity-token-balance', 0)
  const [cashBalance, setCashBalance] = useKV<number>('cash-balance', 10000)
  const [theme, setTheme] = useKV<'professional' | 'retro'>('theme-preference', 'professional')
  
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [tradePanelOpen, setTradePanelOpen] = useState(false)
  const [marioVisible, setMarioVisible] = useState(false)
  const [luigiVisible, setLuigiVisible] = useState(false)
  const [marioRec, setMarioRec] = useState<any>(null)
  const [luigiRec, setLuigiRec] = useState<any>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)

  const currentHoldings = holdings || []
  const currentStocks = stocks || []
  const isRetroTheme = theme === 'retro'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const cleanup = initializePriceUpdates(currentStocks, setStocks)
    return cleanup
  }, [])

  const portfolio: Portfolio = {
    totalValue: currentHoldings.reduce((sum, h) => sum + h.totalValue, 0),
    totalGainLoss: currentHoldings.reduce((sum, h) => sum + h.gainLoss, 0),
    totalGainLossPercent: 0,
    holdings: currentHoldings,
    infinityTokenBalance: infinityTokenBalance || 0,
    cashBalance: cashBalance || 0,
  }

  if (portfolio.totalValue > 0) {
    const totalCost = currentHoldings.reduce((sum, h) => sum + (h.averagePrice * h.quantity), 0)
    portfolio.totalGainLossPercent = totalCost > 0 ? (portfolio.totalGainLoss / totalCost) * 100 : 0
  }

  const handleTrade = async (type: 'buy' | 'sell', quantity: number, price: number) => {
    if (!selectedStock) return

    const infinityBankId = generateInfinityBankId()

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      stockId: selectedStock.id,
      symbol: selectedStock.symbol,
      quantity,
      price,
      total: quantity * price,
      timestamp: Date.now(),
      infinityBankId,
    }

    setTransactions((current) => [newTransaction, ...(current || [])])

    await InfinityBank.store(
      'current-user',
      'transaction',
      newTransaction,
      'plateau'
    )

    if (type === 'buy') {
      setStocks((currentStocks) => {
        if (!currentStocks) return INITIAL_STOCKS
        return currentStocks.map((s) =>
          s.id === selectedStock.id
            ? { ...s, availableTokens: s.availableTokens - quantity }
            : s
        )
      })

      setHoldings((currentHoldings) => {
        const holdingsArray = currentHoldings || []
        const existingIndex = holdingsArray.findIndex((h) => h.stockId === selectedStock.id)
        
        if (existingIndex >= 0) {
          const existing = holdingsArray[existingIndex]
          const newQuantity = existing.quantity + quantity
          const newAveragePrice = ((existing.averagePrice * existing.quantity) + (price * quantity)) / newQuantity
          const newTotalValue = newQuantity * price
          const newGainLoss = newTotalValue - (newAveragePrice * newQuantity)
          const newGainLossPercent = (newGainLoss / (newAveragePrice * newQuantity)) * 100

          const updated = [...holdingsArray]
          updated[existingIndex] = {
            ...existing,
            quantity: newQuantity,
            averagePrice: newAveragePrice,
            currentPrice: price,
            totalValue: newTotalValue,
            gainLoss: newGainLoss,
            gainLossPercent: newGainLossPercent,
          }
          
          InfinityBank.store('current-user', 'holding', updated[existingIndex], 'plus')
          
          return updated
        } else {
          const newHolding: PortfolioHolding = {
            id: Date.now().toString(),
            stockId: selectedStock.id,
            symbol: selectedStock.symbol,
            name: selectedStock.name,
            quantity,
            averagePrice: price,
            currentPrice: price,
            totalValue: quantity * price,
            gainLoss: 0,
            gainLossPercent: 0,
            infinityBankId,
            securityLevel: 'plus',
          }
          
          InfinityBank.store('current-user', 'holding', newHolding, 'plus')
          
          return [...holdingsArray, newHolding]
        }
      })
    } else {
      setStocks((currentStocks) => {
        if (!currentStocks) return INITIAL_STOCKS
        return currentStocks.map((s) =>
          s.id === selectedStock.id
            ? { ...s, availableTokens: s.availableTokens + quantity }
            : s
        )
      })

      setHoldings((currentHoldings) => {
        const holdingsArray = currentHoldings || []
        const existingIndex = holdingsArray.findIndex((h) => h.stockId === selectedStock.id)
        if (existingIndex >= 0) {
          const existing = holdingsArray[existingIndex]
          const newQuantity = existing.quantity - quantity

          if (newQuantity <= 0) {
            return holdingsArray.filter((_, i) => i !== existingIndex)
          } else {
            const newTotalValue = newQuantity * price
            const newGainLoss = newTotalValue - (existing.averagePrice * newQuantity)
            const newGainLossPercent = (newGainLoss / (existing.averagePrice * newQuantity)) * 100

            const updated = [...holdingsArray]
            updated[existingIndex] = {
              ...existing,
              quantity: newQuantity,
              currentPrice: price,
              totalValue: newTotalValue,
              gainLoss: newGainLoss,
              gainLossPercent: newGainLossPercent,
            }
            
            InfinityBank.store('current-user', 'holding', updated[existingIndex], 'plus')
            
            return updated
          }
        }
        return holdingsArray
      })
    }

    setTradePanelOpen(false)
  }

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock)
    setTradePanelOpen(true)
  }

  const handlePortfolioClick = (holding: PortfolioHolding) => {
    const stock = currentStocks.find((s) => s.id === holding.stockId)
    if (stock) {
      setSelectedStock(stock)
      setTradePanelOpen(true)
    }
  }

  const getMarioRecommendation = async () => {
    if (currentHoldings.length === 0) {
      toast.error('No holdings to analyze')
      return
    }

    const worstHolding = currentHoldings.reduce((worst, current) => 
      current.gainLossPercent < worst.gainLossPercent ? current : worst
    )

    const prompt = (window.spark.llmPrompt as any)`You are Mario from Super Mario Bros, giving stock trading advice. Analyze this stock holding and explain why the user should sell it in a fun, Mario-themed way (but with real financial reasoning). Keep it under 100 words.

Stock: ${worstHolding.symbol} - ${worstHolding.name}
Current Performance: ${worstHolding.gainLossPercent.toFixed(2)}% (${worstHolding.gainLoss >= 0 ? 'gain' : 'loss'})
Quantity: ${worstHolding.quantity} tokens
Average Price: $${worstHolding.averagePrice.toFixed(2)}
Current Price: $${worstHolding.currentPrice.toFixed(2)}

Respond with just the advice text, no intro.`

    try {
      const reasoning = await window.spark.llm(prompt, 'gpt-4o-mini', false)
      
      setMarioRec({
        stockSymbol: worstHolding.symbol,
        stockName: worstHolding.name,
        reasoning,
        confidence: 75 + Math.floor(Math.random() * 20),
      })
      setMarioVisible(true)
    } catch (error) {
      toast.error('Failed to get Mario recommendation')
    }
  }

  const getLuigiRecommendation = async () => {
    if (currentHoldings.length === 0) {
      toast.error('No holdings to analyze')
      return
    }

    const bestHolding = currentHoldings.reduce((best, current) => 
      current.gainLossPercent > best.gainLossPercent ? current : best
    )

    const prompt = (window.spark.llmPrompt as any)`You are Luigi from Super Mario Bros, giving stock trading advice. Analyze this stock holding and explain why the user should hold onto it and not sell in a fun, Luigi-themed way (but with real financial reasoning). Keep it under 100 words.

Stock: ${bestHolding.symbol} - ${bestHolding.name}
Current Performance: ${bestHolding.gainLossPercent.toFixed(2)}% (${bestHolding.gainLoss >= 0 ? 'gain' : 'loss'})
Quantity: ${bestHolding.quantity} tokens
Average Price: $${bestHolding.averagePrice.toFixed(2)}
Current Price: $${bestHolding.currentPrice.toFixed(2)}

Respond with just the advice text, no intro.`

    try {
      const reasoning = await window.spark.llm(prompt, 'gpt-4o-mini', false)
      
      setLuigiRec({
        stockSymbol: bestHolding.symbol,
        stockName: bestHolding.name,
        reasoning,
        confidence: 75 + Math.floor(Math.random() * 20),
      })
      setLuigiVisible(true)
    } catch (error) {
      toast.error('Failed to get Luigi recommendation')
    }
  }

  const selectedHolding = selectedStock
    ? currentHoldings.find((h) => h.stockId === selectedStock.id) || null
    : null

  const handleImportPortfolio = async (importedHoldings: Array<{
    symbol: string
    name: string
    quantity: number
    averagePrice: number
    currentPrice: number
  }>) => {
    const newHoldings: PortfolioHolding[] = []
    const updatedStocks = [...currentStocks]

    for (const imported of importedHoldings) {
      let stock = updatedStocks.find(s => s.symbol === imported.symbol)
      
      if (!stock) {
        const newStock: Stock = {
          id: Date.now().toString() + Math.random(),
          symbol: imported.symbol,
          name: imported.name,
          currentPrice: imported.currentPrice,
          basePrice: imported.currentPrice,
          priceChange: 0,
          priceChangePercent: 0,
          totalSupply: 1000,
          availableTokens: 1000 - imported.quantity,
          category: 'Imported',
          lastPriceUpdate: Date.now(),
          priceHistory: [],
        }
        updatedStocks.push(newStock)
        stock = newStock
      } else {
        const index = updatedStocks.findIndex(s => s.id === stock!.id)
        updatedStocks[index] = {
          ...stock,
          availableTokens: Math.max(0, stock.availableTokens - imported.quantity),
        }
      }

      const totalValue = imported.quantity * imported.currentPrice
      const gainLoss = totalValue - (imported.averagePrice * imported.quantity)
      const gainLossPercent = (gainLoss / (imported.averagePrice * imported.quantity)) * 100
      const infinityBankId = generateInfinityBankId()

      const newHolding: PortfolioHolding = {
        id: Date.now().toString() + Math.random(),
        stockId: stock.id,
        symbol: imported.symbol,
        name: imported.name,
        quantity: imported.quantity,
        averagePrice: imported.averagePrice,
        currentPrice: imported.currentPrice,
        totalValue,
        gainLoss,
        gainLossPercent,
        infinityBankId,
        securityLevel: 'plus',
      }

      await InfinityBank.store('current-user', 'holding', newHolding, 'plus')
      
      newHoldings.push(newHolding)
    }

    setStocks(updatedStocks)
    setHoldings((current) => [...(current || []), ...newHoldings])
    
    toast.success(`Imported ${newHoldings.length} holdings to Infinity Bank`, {
      description: 'All positions secured with Plus redundancy',
    })
  }

  const toggleTheme = () => {
    setTheme((current) => current === 'professional' ? 'retro' : 'professional')
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b backdrop-blur-xl bg-card/80 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold mb-1 ${isRetroTheme ? 'font-game' : 'font-display'}`}>
                {isRetroTheme ? 'POWER TRADING' : 'Infinity Trading'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isRetroTheme ? 'Mario & Luigi Stock Platform' : 'Professional Token Trading Platform'}
              </p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                <Label htmlFor="theme-toggle" className="text-xs font-medium cursor-pointer">
                  {isRetroTheme ? '🎮' : '💼'}
                </Label>
                <Switch
                  id="theme-toggle"
                  checked={isRetroTheme}
                  onCheckedChange={toggleTheme}
                />
              </div>
              
              <Button variant="outline" className="gap-2" onClick={() => setImportDialogOpen(true)}>
                <Upload size={20} weight="bold" />
                <span className="hidden sm:inline">Import Portfolio</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 backdrop-blur rounded-xl border border-border/50 p-6 md:p-8 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-card/60 backdrop-blur rounded-lg p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Bank size={20} weight="duotone" className="text-primary" />
                <div className="text-sm font-medium text-muted-foreground">Total Value</div>
              </div>
              <div className={`text-3xl font-bold tabular-nums ${isRetroTheme ? 'font-body' : 'font-mono'}`}>
                ${portfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            <div className="bg-card/60 backdrop-blur rounded-lg p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendUp size={20} weight="duotone" className={portfolio.totalGainLoss >= 0 ? 'text-secondary' : 'text-destructive'} />
                <div className="text-sm font-medium text-muted-foreground">Total Gain/Loss</div>
              </div>
              <div className={`text-3xl font-bold tabular-nums flex items-center gap-2 ${portfolio.totalGainLoss >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                {portfolio.totalGainLoss >= 0 ? '+' : ''}${portfolio.totalGainLoss.toFixed(2)}
                <span className="text-sm">
                  ({portfolio.totalGainLossPercent >= 0 ? '+' : ''}{portfolio.totalGainLossPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            
            <div className="bg-card/60 backdrop-blur rounded-lg p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Coins size={20} weight="duotone" className="text-accent" />
                <div className="text-sm font-medium text-muted-foreground">Infinity Tokens</div>
              </div>
              <div className={`text-3xl font-bold tabular-nums text-accent ${isRetroTheme ? 'font-body' : 'font-mono'}`}>
                {infinityTokenBalance.toLocaleString()} ΞINF
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={getMarioRecommendation}
              className={`flex-1 min-w-[140px] gap-2 font-semibold ${isRetroTheme ? 'font-game text-xs py-6' : ''}`}
              variant={isRetroTheme ? 'default' : 'outline'}
              style={isRetroTheme ? { backgroundColor: 'oklch(0.55 0.22 25)' } : {}}
              disabled={currentHoldings.length === 0}
            >
              {isRetroTheme ? (
                <div>
                  <div className="text-2xl mb-1">🍄</div>
                  <div>MARIO</div>
                </div>
              ) : (
                <>
                  <Lightning size={20} weight="fill" />
                  AI Sell Insights
                </>
              )}
            </Button>
            
            <Button
              onClick={getLuigiRecommendation}
              className={`flex-1 min-w-[140px] gap-2 font-semibold ${isRetroTheme ? 'font-game text-xs py-6' : ''}`}
              variant={isRetroTheme ? 'default' : 'outline'}
              style={isRetroTheme ? { backgroundColor: 'oklch(0.65 0.18 145)' } : {}}
              disabled={currentHoldings.length === 0}
            >
              {isRetroTheme ? (
                <div>
                  <div className="text-2xl mb-1">⭐</div>
                  <div>LUIGI</div>
                </div>
              ) : (
                <>
                  <Lightning size={20} weight="fill" />
                  AI Hold Insights
                </>
              )}
            </Button>
            
            <InfinityBankStatus holdings={currentHoldings} />
          </div>
        </div>

        <Tabs defaultValue="market" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-2 max-w-md ${isRetroTheme ? 'font-game text-xs' : ''}`}>
            <TabsTrigger value="market">
              {isRetroTheme ? 'MARKET' : 'Market'}
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              {isRetroTheme ? 'PORTFOLIO' : 'Portfolio'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold mb-4 ${isRetroTheme ? 'font-game' : 'font-display'}`}>
                {isRetroTheme ? 'Available Stocks' : 'Available Securities'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentStocks.map((stock) => (
                  <StockCard key={stock.id} stock={stock} onClick={() => handleStockClick(stock)} theme={theme} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold mb-4 ${isRetroTheme ? 'font-game' : 'font-display'}`}>
                {isRetroTheme ? 'Your Holdings' : 'Portfolio Holdings'}
              </h2>
              {currentHoldings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">{isRetroTheme ? '🎮' : '📊'}</div>
                  <div className={`text-lg font-bold mb-2 ${isRetroTheme ? 'font-game' : 'font-display'}`}>
                    {isRetroTheme ? 'NO HOLDINGS YET' : 'No Holdings Yet'}
                  </div>
                  <div className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Start by importing your portfolio or buying tokens from the market!
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => setImportDialogOpen(true)} variant="outline" className="gap-2">
                      <Upload size={20} weight="bold" />
                      Import Portfolio
                    </Button>
                    <Button onClick={() => document.querySelector<HTMLButtonElement>('[value="market"]')?.click()}>
                      Browse Market
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentHoldings.map((holding) => (
                    <PortfolioCard key={holding.id} holding={holding} onClick={() => handlePortfolioClick(holding)} theme={theme} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <TradePanel
        isOpen={tradePanelOpen}
        onClose={() => setTradePanelOpen(false)}
        stock={selectedStock}
        holding={selectedHolding}
        onTrade={handleTrade}
        theme={theme}
      />

      {isRetroTheme && (
        <>
          <MarioCharacter
            isVisible={marioVisible}
            recommendation={marioRec}
            onClose={() => setMarioVisible(false)}
          />

          <LuigiCharacter
            isVisible={luigiVisible}
            recommendation={luigiRec}
            onClose={() => setLuigiVisible(false)}
          />
        </>
      )}

      <PortfolioImportDialog
        isOpen={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImportPortfolio}
      />

      <Toaster position="top-center" />
    </div>
  )
}

export default App
