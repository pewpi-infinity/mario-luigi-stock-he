import { motion } from 'framer-motion'
import { TrendUp, TrendDown, Coins } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { Stock } from '@/lib/types'

interface StockCardProps {
  stock: Stock
  onClick: () => void
}

export function StockCard({ stock, onClick }: StockCardProps) {
  const isPositive = stock.priceChange >= 0
  const supplyPercent = (stock.availableTokens / stock.totalSupply) * 100

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="p-6 cursor-pointer hover:shadow-xl transition-shadow border-2"
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="font-game text-lg mb-1">{stock.symbol}</div>
            <div className="text-sm text-muted-foreground">{stock.name}</div>
          </div>
          <Badge variant="outline" className="font-medium">
            {stock.category}
          </Badge>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <div className="text-2xl font-bold">${stock.currentPrice.toFixed(2)}</div>
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-secondary' : 'text-primary'}`}>
            {isPositive ? <TrendUp size={16} weight="bold" /> : <TrendDown size={16} weight="bold" />}
            {isPositive ? '+' : ''}{stock.priceChangePercent.toFixed(2)}%
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Coins size={14} weight="fill" className="text-coin-gold" />
              Available Tokens
            </div>
            <div className="font-bold">{stock.availableTokens.toLocaleString()} / {stock.totalSupply.toLocaleString()}</div>
          </div>
          <Progress value={supplyPercent} className="h-2" />
        </div>
      </Card>
    </motion.div>
  )
}
