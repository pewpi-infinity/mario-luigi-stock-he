import { useState, useEffect } from 'react'
import { Lightning, Clock, TrendUp } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { PriceAlgorithm } from '@/lib/priceAlgorithm'

export function PriceAlgorithmIndicator() {
  const [config, setConfig] = useState(PriceAlgorithm.getAlgorithmConfig())
  const [nextUpdate, setNextUpdate] = useState<string>('')

  useEffect(() => {
    const updateConfig = () => {
      setConfig(PriceAlgorithm.getAlgorithmConfig())
    }

    const updateTimer = () => {
      const now = Date.now()
      const timeUntilNext = config.nextUpdateTime - now
      
      if (timeUntilNext <= 0) {
        updateConfig()
      } else {
        const minutes = Math.floor(timeUntilNext / 60000)
        const seconds = Math.floor((timeUntilNext % 60000) / 1000)
        setNextUpdate(`${minutes}m ${seconds}s`)
      }
    }

    const interval = setInterval(() => {
      updateTimer()
    }, 1000)

    updateTimer()
    return () => clearInterval(interval)
  }, [config.nextUpdateTime])

  const currentHour = new Date().getHours()
  const nextHour = (currentHour + 1) % 24
  const nextHourRate = config.hourlySchedule[nextHour]

  return (
    <Card className="bg-gradient-to-br from-secondary/20 via-accent/10 to-primary/20 border-2 border-secondary/30 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Lightning size={20} weight="fill" className="text-secondary" />
            <span className="text-sm font-semibold text-muted-foreground">Growth Rate</span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-secondary">+{config.currentHourRate}¢</span>
            <span className="text-sm text-muted-foreground">every 3 seconds</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendUp size={14} weight="bold" className="text-secondary" />
            <span>
              ${(config.currentHourRate * 20 / 100).toFixed(2)}/minute • 
              ${(config.currentHourRate * 1200 / 100).toFixed(2)}/hour
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end mb-2">
            <Clock size={16} weight="bold" className="text-accent" />
            <span className="text-xs font-semibold text-muted-foreground">Next Rate Change</span>
          </div>
          
          <div className="text-xl font-bold text-accent mb-1">{nextUpdate}</div>
          
          <div className="text-xs text-muted-foreground">
            Then: +{nextHourRate}¢/3s
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="inline-block w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
          <span className="text-muted-foreground font-medium">
            All prices increase continuously • Never drop
          </span>
        </div>
      </div>
    </Card>
  )
}
