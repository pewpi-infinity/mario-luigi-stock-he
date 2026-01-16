import { motion } from 'framer-motion'
import { TrendUp, Coins, Lightning } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { PriceAlgorithm } from '@/lib/priceAlgorithm'
import type { Stock } from '@/lib/types'

interface StockCardProps {
  stock: Stock
  onClick: () => void
}

export function StockCard({ stock, onClick }: StockCardProps) {
  const supplyPercent = (stock.availableTokens / stock.totalSupply) * 100
  const algorithmConfig = PriceAlgorithm.getAlgorithmConfig()

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="p-6 cursor-pointer hover:shadow-xl transition-shadow border-2 relative overflow-hidden"
        onClick={onClick}
      >
        <div className="absolute top-2 right-2 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full px-2 py-1 flex items-center gap-1">
          <Lightning size={12} weight="fill" className="text-secondary" />
          <span className="text-[10px] font-bold text-secondary">+{algorithmConfig.currentHourRate}¢/3s</span>
        </div>

        <div className="flex items-start justify-between mb-4 pr-16">
          <div>
            <div className="font-game text-lg mb-1">{stock.symbol}</div>
            <div className="text-sm text-muted-foreground">{stock.name}</div>
          </div>
          <Badge variant="outline" className="font-medium">
            {stock.category}
          </Badge>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <div className="text-2xl font-bold">${stock.currentPrice.toFixed(2)}</div>
          <div className="flex items-center gap-1 text-sm font-medium text-secondary">
            <TrendUp size={16} weight="bold" />
            +{stock.priceChangePercent.toFixed(2)}%
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
          Always increasing • Never drops
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
