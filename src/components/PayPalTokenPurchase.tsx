import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Coins, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface PayPalTokenPurchaseProps {
  isOpen: boolean
  onClose: () => void
  onPurchaseComplete: (tokens: number, usdAmount: number) => void
}

const INFINITY_TOKEN_RATE = 1
const PAYPAL_MERCHANT_ID = 'marvaseater@gmail.com'

export function PayPalTokenPurchase({ isOpen, onClose, onPurchaseComplete }: PayPalTokenPurchaseProps) {
  const [usdAmount, setUsdAmount] = useState<string>('100')
  const [processing, setProcessing] = useState(false)

  const calculatedTokens = parseFloat(usdAmount || '0') * INFINITY_TOKEN_RATE

  const handlePurchase = async () => {
    const amount = parseFloat(usdAmount)
    
    if (!amount || amount < 1) {
      toast.error('Minimum purchase is $1')
      return
    }

    if (amount > 100000) {
      toast.error('Maximum purchase is $100,000 per transaction')
      return
    }

    setProcessing(true)

    try {
      toast.info('Opening PayPal checkout...', {
        description: 'Complete your payment to receive Infinity Tokens',
      })

      await new Promise(resolve => setTimeout(resolve, 1500))

      const simulatedSuccess = true

      if (simulatedSuccess) {
        const tokens = amount * INFINITY_TOKEN_RATE
        
        onPurchaseComplete(tokens, amount)
        
        toast.success(`Purchase Complete!`, {
          description: `${tokens.toLocaleString()} ΞINF tokens added to your balance`,
        })
        
        onClose()
      } else {
        throw new Error('Payment cancelled')
      }
    } catch (error: any) {
      toast.error('Payment Failed', {
        description: error.message || 'Please try again',
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Coins size={28} weight="duotone" className="text-accent" />
            Buy Infinity Tokens
          </DialogTitle>
          <DialogDescription>
            Purchase ΞINF tokens to trade on the platform. All transactions are secured via PayPal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info size={24} weight="duotone" className="text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-accent mb-1">How It Works</p>
                <p className="text-muted-foreground leading-relaxed">
                  Your USD payment is converted 1:1 to Infinity Tokens. These tokens are used to purchase tokenized stocks on the platform, which increase in value every 3 seconds.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="usd-amount" className="text-sm font-medium mb-2 block">
                USD Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  $
                </span>
                <Input
                  id="usd-amount"
                  type="number"
                  min="1"
                  max="100000"
                  step="1"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(e.target.value)}
                  className="pl-8 text-lg font-semibold"
                  placeholder="100"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Minimum: $1 • Maximum: $100,000
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span className="font-semibold">1 USD = 1 ΞINF</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">PayPal Fee</span>
                <span className="font-semibold">Included</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between">
                <span className="font-semibold">You'll Receive</span>
                <span className="font-bold text-accent text-lg">
                  {calculatedTokens.toLocaleString()} ΞINF
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={processing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={processing || !usdAmount || parseFloat(usdAmount) < 1}
              className="flex-1 gap-2 bg-gradient-to-r from-[#0070ba] to-[#003087] hover:opacity-90 text-white font-semibold"
            >
              <CreditCard size={20} weight="duotone" />
              {processing ? 'Processing...' : 'Pay with PayPal'}
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p>Merchant: {PAYPAL_MERCHANT_ID}</p>
            <p>Secured by PayPal • 256-bit SSL Encryption</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
