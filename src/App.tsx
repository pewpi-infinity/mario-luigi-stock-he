import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { Upload, TrendUp } from '@phosphor-icons/react'
import { StockCard } from '@/components/StockCard'
import { PortfolioCard } from '@/components/PortfolioCard'
import { TradePanel } from '@/components/TradePanel'
import { MarioCharacter } from '@/components/MarioCharacter'
import { LuigiCharacter } from '@/components/LuigiCharacter'
import { PortfolioImportDialog } from '@/components/PortfolioImportDialog'
import type { Stock, PortfolioHolding, Portfolio, Transaction } from '@/lib/types'
import { toast } from 'sonner'

const INITIAL_STOCKS: Stock[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 178.50,
    priceChange: 2.35,
    priceChangePercent: 1.33,
    totalSupply: 1000,
    availableTokens: 742,
    category: 'Tech',
  },
  {
    id: '2',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 142.80,
    priceChange: -1.20,
    priceChangePercent: -0.83,
    totalSupply: 1000,
    availableTokens: 521,
    category: 'Tech',
  },
  {
    id: '3',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 412.30,
    priceChange: 5.70,
    priceChangePercent: 1.40,
    totalSupply: 1000,
    availableTokens: 890,
    category: 'Tech',
  },
  {
    id: '4',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    currentPrice: 248.90,
    priceChange: -8.45,
    priceChangePercent: -3.28,
    totalSupply: 1000,
    availableTokens: 145,
    category: 'Auto',
  },
  {
    id: '5',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    currentPrice: 875.40,
    priceChange: 22.10,
    priceChangePercent: 2.59,
    totalSupply: 1000,
    availableTokens: 67,
    category: 'Tech',
  },
  {
    id: '6',
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    currentPrice: 178.25,
    priceChange: 1.85,
    priceChangePercent: 1.05,
    totalSupply: 1000,
    availableTokens: 423,
    category: 'Retail',
  },
]

function App() {
  const [stocks, setStocks] = useKV<Stock[]>('stocks', INITIAL_STOCKS)
  const [holdings, setHoldings] = useKV<PortfolioHolding[]>('holdings', [])
  const [transactions, setTransactions] = useKV<Transaction[]>('transactions', [])
  
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [tradePanelOpen, setTradePanelOpen] = useState(false)
  const [marioVisible, setMarioVisible] = useState(false)
  const [luigiVisible, setLuigiVisible] = useState(false)
  const [marioRec, setMarioRec] = useState<any>(null)
  const [luigiRec, setLuigiRec] = useState<any>(null)
  const [importDialogOpen, setImportDialogOpen] = useState(false)

  const currentHoldings = holdings || []
  const currentStocks = stocks || []

  const portfolio: Portfolio = {
    totalValue: currentHoldings.reduce((sum, h) => sum + h.totalValue, 0),
    totalGainLoss: currentHoldings.reduce((sum, h) => sum + h.gainLoss, 0),
    totalGainLossPercent: 0,
    holdings: currentHoldings,
  }

  if (portfolio.totalValue > 0) {
    const totalCost = currentHoldings.reduce((sum, h) => sum + (h.averagePrice * h.quantity), 0)
    portfolio.totalGainLossPercent = (portfolio.totalGainLoss / totalCost) * 100
  }

  const handleTrade = (type: 'buy' | 'sell', quantity: number, price: number) => {
    if (!selectedStock) return

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      stockId: selectedStock.id,
      symbol: selectedStock.symbol,
      quantity,
      price,
      total: quantity * price,
      timestamp: Date.now(),
    }

    setTransactions((current) => [newTransaction, ...(current || [])])

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
          }
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

  const handleImportPortfolio = (importedHoldings: Array<{
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
          priceChange: 0,
          priceChangePercent: 0,
          totalSupply: 1000,
          availableTokens: 1000 - imported.quantity,
          category: 'Imported',
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

      newHoldings.push({
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
      })
    }

    setStocks(updatedStocks)
    setHoldings((current) => [...(current || []), ...newHoldings])
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="border-b-4 border-border bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-game text-2xl mb-2">POWER TRADING</h1>
              <p className="text-sm text-muted-foreground">Mario & Luigi Stock Platform</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => setImportDialogOpen(true)}>
              <Upload size={20} weight="bold" />
              <span className="hidden sm:inline">Import Portfolio</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-card/80 backdrop-blur rounded-lg border-4 border-border p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Total Value</div>
              <div className="text-3xl font-bold">${portfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Total Gain/Loss</div>
              <div className={`text-3xl font-bold flex items-center gap-2 ${portfolio.totalGainLoss >= 0 ? 'text-secondary' : 'text-primary'}`}>
                {portfolio.totalGainLoss >= 0 ? <TrendUp size={32} weight="bold" /> : <TrendUp size={32} weight="bold" className="rotate-180" />}
                {portfolio.totalGainLoss >= 0 ? '+' : ''}${portfolio.totalGainLoss.toFixed(2)}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={getMarioRecommendation} className="flex-1 bg-primary text-primary-foreground font-game text-xs py-6 hover:brightness-110" disabled={currentHoldings.length === 0}>
                <div>
                  <div className="text-2xl mb-1">🍄</div>
                  <div>MARIO</div>
                </div>
              </Button>
              <Button onClick={getLuigiRecommendation} className="flex-1 bg-secondary text-secondary-foreground font-game text-xs py-6 hover:brightness-110" disabled={currentHoldings.length === 0}>
                <div>
                  <div className="text-2xl mb-1">⭐</div>
                  <div>LUIGI</div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="market" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="market" className="font-game text-xs">MARKET</TabsTrigger>
            <TabsTrigger value="portfolio" className="font-game text-xs">PORTFOLIO</TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-6">
            <div>
              <h2 className="font-game text-xl mb-4">Available Stocks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentStocks.map((stock) => (
                  <StockCard key={stock.id} stock={stock} onClick={() => handleStockClick(stock)} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div>
              <h2 className="font-game text-xl mb-4">Your Holdings</h2>
              {currentHoldings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🎮</div>
                  <div className="font-game text-lg mb-2">NO HOLDINGS YET</div>
                  <div className="text-muted-foreground mb-6">
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
                    <PortfolioCard key={holding.id} holding={holding} onClick={() => handlePortfolioClick(holding)} />
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
      />

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
