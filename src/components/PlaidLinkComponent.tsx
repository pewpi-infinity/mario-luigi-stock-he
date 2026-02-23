import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Bank, CheckCircle, LinkSimple, Coins, TrendUp, X } from '@phosphor-icons/react'
import { PlaidService } from '@/lib/plaidService'
import type { PlaidImportResult } from '@/lib/plaidService'
import type { Stock } from '@/lib/types'
import { toast } from 'sonner'

interface PlaidLinkComponentProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: PlaidImportResult) => Promise<void>
  existingStocks: Stock[]
}

export function PlaidLinkComponent({ isOpen, onClose, onSuccess, existingStocks }: PlaidLinkComponentProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  type ProcessingStep = 'idle' | 'connecting' | 'fetching' | 'converting' | 'complete'
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle')
  const [importResult, setImportResult] = useState<PlaidImportResult | null>(null)
  const [conversionSummary, setConversionSummary] = useState<{
    totalUsdValue: number
    totalInfinityTokens: number
    holdingsCount: number
  } | null>(null)

  useEffect(() => {
    if (isOpen && !linkToken) {
      PlaidService.createLinkToken()
        .then(token => setLinkToken(token))
        .catch(error => {
          console.error('Failed to create link token:', error)
          toast.error('Failed to initialize connection')
        })
    }
  }, [isOpen, linkToken])

  const onPlaidSuccess = useCallback(
    async (publicToken: string) => {
      setProcessingStep('connecting')
      setLoading(true)

      try {
        const accessToken = await PlaidService.exchangePublicToken(publicToken)
        
        setProcessingStep('fetching')
        await new Promise(resolve => setTimeout(resolve, 1000))

        const accountData = await PlaidService.fetchAccountData(accessToken)
        setImportResult(accountData)

        setProcessingStep('converting')
        await new Promise(resolve => setTimeout(resolve, 1500))

        const { newHoldings, totalInfinityTokens } = PlaidService.transformPlaidToHoldings(
          accountData,
          existingStocks
        )

        const totalUsdValue = accountData.totalCashBalance + accountData.totalInvestmentValue
        
        setConversionSummary({
          totalUsdValue,
          totalInfinityTokens,
          holdingsCount: newHoldings.length,
        })

        setProcessingStep('complete')
        
        await onSuccess(accountData)

        toast.success('Portfolio imported successfully!', {
          description: `${newHoldings.length} holdings converted to Infinity Tokens`,
        })

      } catch (error) {
        console.error('Error processing Plaid data:', error)
        toast.error('Failed to import portfolio')
        setProcessingStep('idle')
      } finally {
        setLoading(false)
      }
    },
    [existingStocks, onSuccess]
  )

  const handleConnect = () => {
    const mockPublicToken = 'mock-public-token-' + Date.now()
    onPlaidSuccess(mockPublicToken)
  }

  const handleClose = () => {
    setProcessingStep('idle')
    setImportResult(null)
    setConversionSummary(null)
    onClose()
  }

  const supportedInstitutions = PlaidService.getSupportedInstitutions()

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-display">
            <Bank size={28} weight="duotone" className="text-primary" />
            Connect Brokerage Account
          </DialogTitle>
          <DialogDescription>
            Securely import your portfolio from Robinhood, Webull, and other major brokerages. Your holdings will be converted to Infinity Tokens.
          </DialogDescription>
        </DialogHeader>

        {processingStep === 'idle' && (
          <div className="space-y-6 py-4">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border">
              <h3 className="font-semibold text-lg mb-3">🔒 Secure Connection via Plaid</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Plaid connects to 11,000+ financial institutions using bank-level security. We never see your login credentials.
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-secondary" />
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-secondary" />
                  <span>Read-Only Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" className="text-secondary" />
                  <span>SOC 2 Certified</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Supported Brokerages</h4>
              <div className="grid grid-cols-3 gap-3">
                {supportedInstitutions.map(inst => (
                  <Card key={inst.id} className="p-3 hover:bg-accent/5 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{inst.logo}</span>
                      <span className="text-sm font-medium">{inst.name}</span>
                    </div>
                  </Card>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                + 11,000 more institutions supported
              </p>
            </div>

            <div className="bg-accent/5 rounded-lg p-5 border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Coins size={20} weight="duotone" className="text-accent" />
                Infinity Token Conversion
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                All imported cash and stock values will be converted to Infinity Tokens at a 1:1 USD rate.
              </p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div>• <strong>Cash Balance</strong>: Converted to ΞINF tokens</div>
                <div>• <strong>Stock Holdings</strong>: Transferred to platform at current market value</div>
                <div>• <strong>Secured Storage</strong>: Protected by Infinity Bank with Plateau & Plus security</div>
              </div>
            </div>

            <Button 
              onClick={handleConnect} 
              disabled={!linkToken || loading}
              className="w-full h-12 text-base font-semibold gap-2"
              size="lg"
            >
              <LinkSimple size={20} weight="bold" />
              {linkToken ? 'Connect Brokerage Account' : 'Initializing Connection...'}
            </Button>
          </div>
        )}

        {(processingStep === 'connecting' || processingStep === 'fetching' || processingStep === 'converting') && (
          <div className="space-y-6 py-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    processingStep === 'connecting' ? 'bg-primary animate-pulse' : 'bg-secondary'
                  }`}>
                    {processingStep === 'connecting' ? (
                      <LinkSimple size={18} weight="bold" className="text-white" />
                    ) : (
                      <CheckCircle size={18} weight="fill" className="text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">Connecting to Brokerage</div>
                    <div className="text-xs text-muted-foreground">Establishing secure connection</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    processingStep === 'fetching' ? 'bg-primary animate-pulse' : 
                    (processingStep === 'converting') ? 'bg-secondary' : 'bg-muted'
                  }`}>
                    {processingStep === 'fetching' ? (
                      <TrendUp size={18} weight="bold" className="text-white" />
                    ) : (processingStep === 'converting') ? (
                      <CheckCircle size={18} weight="fill" className="text-white" />
                    ) : (
                      <TrendUp size={18} weight="bold" className="text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">Fetching Holdings</div>
                    <div className="text-xs text-muted-foreground">Retrieving portfolio data</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    processingStep === 'converting' ? 'bg-primary animate-pulse' : 'bg-muted'
                  }`}>
                    {processingStep === 'converting' ? (
                      <Coins size={18} weight="bold" className="text-white" />
                    ) : (
                      <Coins size={18} weight="bold" className="text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">Converting to Infinity Tokens</div>
                    <div className="text-xs text-muted-foreground">Processing conversion & storage</div>
                  </div>
                </div>
              </div>
            </div>

            <Progress value={
              processingStep === 'connecting' ? 33 :
              processingStep === 'fetching' ? 66 :
              processingStep === 'converting' ? 90 : 100
            } className="h-2" />

            <p className="text-center text-sm text-muted-foreground">
              Please wait while we securely import your portfolio...
            </p>
          </div>
        )}

        {processingStep === 'complete' && conversionSummary && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} weight="fill" className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Import Complete!</h3>
              <p className="text-muted-foreground">Your portfolio has been successfully converted to Infinity Tokens</p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Total USD Value</div>
                  <div className="text-2xl font-bold tabular-nums font-mono">
                    ${conversionSummary.totalUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-card rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Infinity Tokens</div>
                  <div className="text-2xl font-bold tabular-nums font-mono text-accent">
                    {conversionSummary.totalInfinityTokens.toLocaleString()} ΞINF
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Holdings Imported</div>
                <div className="text-2xl font-bold">
                  {conversionSummary.holdingsCount} Positions
                </div>
              </div>
            </div>

            <div className="bg-accent/5 rounded-lg p-4 border">
              <div className="flex items-start gap-3">
                <Bank size={24} weight="duotone" className="text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold mb-1">Secured in Infinity Bank</div>
                  <div className="text-muted-foreground text-xs">
                    All holdings are now protected with Plateau redundancy and Plus security protocols. Your investments benefit from guaranteed algorithmic price appreciation.
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full" size="lg">
              View My Portfolio
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
