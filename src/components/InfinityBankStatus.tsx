import { Shield, Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import type { PortfolioHolding } from '@/lib/types'

interface InfinityBankStatusProps {
  holdings: PortfolioHolding[]
}

export function InfinityBankStatus({ holdings }: InfinityBankStatusProps) {
  const totalSecured = holdings.length
  const plusSecured = holdings.filter(h => h.securityLevel === 'plus').length
  const plateauSecured = holdings.filter(h => h.securityLevel === 'plateau').length

  return (
    <Button
      variant="outline"
      className="flex-1 min-w-[200px] gap-2 bg-gradient-to-r from-primary/5 to-accent/5"
    >
      <Shield size={20} weight="duotone" className="text-primary" />
      <div className="flex flex-col items-start">
        <div className="text-xs font-semibold">Infinity Bank Secured</div>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="flex items-center gap-1">
            <Check size={12} weight="bold" className="text-secondary" />
            {plusSecured} Plus
          </span>
          <span className="flex items-center gap-1">
            <Check size={12} weight="bold" className="text-accent" />
            {plateauSecured} Plateau
          </span>
        </div>
      </div>
    </Button>
  )
}
