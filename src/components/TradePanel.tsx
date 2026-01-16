import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Coins } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import type { Stock, PortfolioHolding } from '@/lib/types'

interface TradePanelProps {
  isOpen: boolean
  onClose: () => void
  stock: Stock | null
  holding: PortfolioHolding | null
  onTrade: (type: 'buy' | 'sell', quantity: number, price: number) => void
}

export function TradePanel({ isOpen, onClose, stock, holding, onTrade }: TradePanelProps) {
  const [quantity, setQuantity] = useState('')
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')

  if (!stock) return null

  const currentPrice = stock.currentPrice
  const totalCost = parseFloat(quantity || '0') * currentPrice
  const maxBuy = stock.availableTokens
  const maxSell = holding?.quantity || 0

  const handleTrade = () => {
    const qty = parseFloat(quantity)
    
    if (!qty || qty <= 0) {
      toast.error('Please enter a valid quantity')
      return
    }

    if (activeTab === 'buy' && qty > maxBuy) {
      toast.error(`Only ${maxBuy} tokens available`)
      return
    }

    if (activeTab === 'sell' && qty > maxSell) {
      toast.error(`You only have ${maxSell} tokens`)
      return
    }

    onTrade(activeTab, qty, currentPrice)
    setQuantity('')
    toast.success(`${activeTab === 'buy' ? 'Bought' : 'Sold'} ${qty} ${stock.symbol} tokens! 🎮`, {
      description: `Total: $${totalCost.toFixed(2)}`,
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-game text-xl">{stock.symbol}</SheetTitle>
          <div className="text-sm text-muted-foreground">{stock.name}</div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Current Price</div>
            <div className="text-3xl font-bold">${currentPrice.toFixed(2)}</div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'buy' | 'sell')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy" className="font-game text-xs">BUY</TabsTrigger>
              <TabsTrigger value="sell" className="font-game text-xs">SELL</TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="buy-quantity" className="text-sm font-medium">Quantity</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="buy-quantity"
                    type="number"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="flex-1"
                    min="0"
                    max={maxBuy}
                    step="1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(maxBuy.toString())}
                    disabled={maxBuy === 0}
                  >
                    MAX
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Coins size={12} weight="fill" className="text-coin-gold" />
                  {maxBuy.toLocaleString()} tokens available
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Total Cost</div>
                  <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
                </div>
              </div>

              <Button
                onClick={handleTrade}
                disabled={!quantity || parseFloat(quantity) <= 0 || parseFloat(quantity) > maxBuy}
                className="w-full font-game text-sm py-6"
                style={{ backgroundColor: 'oklch(0.50 0.15 250)' }}
              >
                BUY TOKENS
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="sell-quantity" className="text-sm font-medium">Quantity</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="sell-quantity"
                    type="number"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="flex-1"
                    min="0"
                    max={maxSell}
                    step="1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(maxSell.toString())}
                    disabled={maxSell === 0}
                  >
                    MAX
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  You own {maxSell} tokens
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Total Proceeds</div>
                  <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
                </div>
              </div>

              <Button
                onClick={handleTrade}
                disabled={!quantity || parseFloat(quantity) <= 0 || parseFloat(quantity) > maxSell}
                className="w-full bg-primary text-primary-foreground font-game text-sm py-6"
              >
                SELL TOKENS
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
