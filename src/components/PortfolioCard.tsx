import { motion } from 'framer-motion'
import { TrendUp, TrendDown } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import type { PortfolioHolding } from '@/lib/types'

interface PortfolioCardProps {
  holding: PortfolioHolding
  onClick: () => void
}

export function PortfolioCard({ holding, onClick }: PortfolioCardProps) {
  const isPositive = holding.gainLoss >= 0

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
            <div className="font-game text-lg mb-1">{holding.symbol}</div>
            <div className="text-sm text-muted-foreground">{holding.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Quantity</div>
            <div className="font-bold">{holding.quantity}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Avg Cost</div>
            <div className="font-medium">${holding.averagePrice.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Current</div>
            <div className="font-medium">${holding.currentPrice.toFixed(2)}</div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Total Value</div>
              <div className="text-xl font-bold">${holding.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-1 font-bold ${isPositive ? 'text-secondary' : 'text-primary'}`}>
                {isPositive ? <TrendUp size={20} weight="bold" /> : <TrendDown size={20} weight="bold" />}
                <div>
                  <div>{isPositive ? '+' : ''}${Math.abs(holding.gainLoss).toFixed(2)}</div>
                  <div className="text-sm">{isPositive ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
