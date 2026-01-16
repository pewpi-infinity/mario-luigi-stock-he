import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Info } from '@phosphor-icons/react'

export function PlaidInfoBanner() {
  return (
    <Alert className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <Info size={20} weight="duotone" className="text-primary" />
      <AlertDescription className="text-sm">
        <strong className="font-semibold">Real Brokerage Integration:</strong> Connect your Robinhood, Webull, or other brokerage accounts securely via Plaid. 
        Your credentials never touch our servers—Plaid uses bank-level OAuth security (SOC 2 certified, 256-bit encryption).{' '}
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Shield size={14} weight="fill" /> Currently in sandbox mode with demo data
        </span>
      </AlertDescription>
    </Alert>
  )
}
