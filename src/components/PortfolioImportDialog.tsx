import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, Link as LinkIcon, CheckCircle, Download, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { downloadSampleFile } from '@/lib/sampleData'

interface ImportedHolding {
  symbol: string
  name: string
  quantity: number
  averagePrice: number
  currentPrice: number
}

interface PortfolioImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (holdings: ImportedHolding[]) => void
}

export function PortfolioImportDialog({ isOpen, onClose, onImport }: PortfolioImportDialogProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<'robinhood' | 'public' | 'webull' | null>(null)
  const [importStep, setImportStep] = useState<'select' | 'upload' | 'review'>('select')
  const [parsedData, setParsedData] = useState<ImportedHolding[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const platforms = [
    {
      id: 'robinhood' as const,
      name: 'Robinhood',
      icon: '🏹',
      description: 'Import from Robinhood CSV export',
      color: 'bg-[#00C805]',
    },
    {
      id: 'public' as const,
      name: 'Public',
      icon: '🏛️',
      description: 'Import from Public.com portfolio',
      color: 'bg-[#212226]',
    },
    {
      id: 'webull' as const,
      name: 'Webull',
      icon: '🐂',
      description: 'Import from Webull statement',
      color: 'bg-[#FFD000]',
    },
  ]

  const handlePlatformSelect = (platformId: 'robinhood' | 'public' | 'webull') => {
    setSelectedPlatform(platformId)
    setImportStep('upload')
  }

  const parseCSV = (text: string): ImportedHolding[] => {
    const lines = text.trim().split('\n')
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim())
    
    const symbolIndex = headers.findIndex(h => h.includes('symbol') || h.includes('ticker'))
    const nameIndex = headers.findIndex(h => h.includes('name') || h.includes('description'))
    const quantityIndex = headers.findIndex(h => h.includes('quantity') || h.includes('shares') || h.includes('amount'))
    const avgPriceIndex = headers.findIndex(h => h.includes('average') || h.includes('avg') || h.includes('cost basis'))
    const currentPriceIndex = headers.findIndex(h => h.includes('current') || h.includes('market') || h.includes('last price'))

    const holdings: ImportedHolding[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/["']/g, ''))
      
      if (values.length > Math.max(symbolIndex, nameIndex, quantityIndex, avgPriceIndex, currentPriceIndex)) {
        const symbol = values[symbolIndex]
        const name = values[nameIndex] || symbol
        const quantity = parseFloat(values[quantityIndex]) || 0
        const averagePrice = parseFloat(values[avgPriceIndex]?.replace('$', '') || '0')
        const currentPrice = parseFloat(values[currentPriceIndex]?.replace('$', '') || averagePrice.toString())

        if (symbol && quantity > 0) {
          holdings.push({
            symbol: symbol.toUpperCase(),
            name,
            quantity,
            averagePrice,
            currentPrice,
          })
        }
      }
    }

    return holdings
  }

  const parseJSON = (text: string): ImportedHolding[] => {
    try {
      const data = JSON.parse(text)
      const holdings: ImportedHolding[] = []

      const positions = data.positions || data.holdings || data.portfolio || [data]
      
      for (const item of positions) {
        const symbol = item.symbol || item.ticker || item.instrument_symbol
        const name = item.name || item.description || item.simple_name || symbol
        const quantity = parseFloat(item.quantity || item.shares || item.amount || 0)
        const averagePrice = parseFloat(item.average_buy_price || item.average_price || item.cost_basis || 0)
        const currentPrice = parseFloat(item.current_price || item.market_price || item.last_trade_price || averagePrice)

        if (symbol && quantity > 0) {
          holdings.push({
            symbol: symbol.toUpperCase(),
            name,
            quantity,
            averagePrice,
            currentPrice,
          })
        }
      }

      return holdings
    } catch (error) {
      throw new Error('Invalid JSON format')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)

    try {
      const text = await file.text()
      let holdings: ImportedHolding[] = []

      if (file.name.endsWith('.csv')) {
        holdings = parseCSV(text)
      } else if (file.name.endsWith('.json')) {
        holdings = parseJSON(text)
      } else {
        throw new Error('Unsupported file format. Please upload CSV or JSON.')
      }

      if (holdings.length === 0) {
        throw new Error('No valid holdings found in file')
      }

      setParsedData(holdings)
      setImportStep('review')
      toast.success(`Found ${holdings.length} holdings`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse file')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirmImport = () => {
    onImport(parsedData)
    toast.success('Portfolio imported successfully! 🎮', {
      description: `Added ${parsedData.length} holdings to your Power Trading portfolio`,
    })
    handleClose()
  }

  const handleClose = () => {
    setSelectedPlatform(null)
    setImportStep('select')
    setParsedData([])
    setIsProcessing(false)
    onClose()
  }

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-game text-xl">IMPORT PORTFOLIO</DialogTitle>
          <DialogDescription>
            Import your existing stock portfolio from popular trading platforms
          </DialogDescription>
        </DialogHeader>

        {importStep === 'select' && (
          <div className="space-y-6 py-4">
            <Alert className="border-accent/50 bg-accent/10">
              <Info size={20} weight="bold" className="text-accent-foreground" />
              <AlertDescription className="text-sm">
                Don't have access to your trading platform? Download a sample file below to test the import feature with demo data.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformSelect(platform.id)}
                  className="flex items-center gap-4 p-6 rounded-lg border-2 border-border hover:border-accent hover:bg-accent/10 transition-all"
                >
                  <div className={`text-4xl ${platform.color} w-16 h-16 rounded-lg flex items-center justify-center`}>
                    {platform.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-lg">{platform.name}</div>
                    <div className="text-sm text-muted-foreground">{platform.description}</div>
                  </div>
                  <LinkIcon size={24} weight="bold" className="text-muted-foreground" />
                </button>
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-game text-sm">HOW TO EXPORT</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadSampleFile('robinhood')}
                  className="gap-2 text-xs"
                >
                  <Download size={16} weight="bold" />
                  Sample CSV
                </Button>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <strong>Robinhood:</strong> Account → Menu → Statements & History → Account Statements → Export as CSV
                </div>
                <div>
                  <strong>Public:</strong> Profile → Settings → Export Portfolio → Download CSV
                </div>
                <div>
                  <strong>Webull:</strong> Account → History → Holdings → Export → Save as CSV
                </div>
              </div>
            </div>
          </div>
        )}

        {importStep === 'upload' && selectedPlatformData && (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
              <div className={`text-3xl ${selectedPlatformData.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                {selectedPlatformData.icon}
              </div>
              <div>
                <div className="font-bold">{selectedPlatformData.name}</div>
                <div className="text-sm text-muted-foreground">{selectedPlatformData.description}</div>
              </div>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-accent transition-colors">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <Upload size={48} weight="bold" className="text-muted-foreground" />
                  <div>
                    <div className="font-bold text-lg mb-1">Upload Portfolio File</div>
                    <div className="text-sm text-muted-foreground">
                      Supports CSV and JSON formats
                    </div>
                  </div>
                  <Button type="button" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Select File'}
                  </Button>
                </div>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="flex items-start gap-3">
                <FileText size={24} weight="bold" className="text-accent mt-1" />
                <div className="flex-1">
                  <div className="font-bold text-sm mb-2">Try a Sample File</div>
                  <div className="text-xs text-muted-foreground mb-3">
                    Download a sample file to test the import feature
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        downloadSampleFile(selectedPlatform!)
                        toast.success('Sample file downloaded')
                      }}
                      className="text-xs"
                    >
                      <Download size={14} weight="bold" className="mr-1" />
                      {selectedPlatformData?.name} Sample
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        downloadSampleFile('json')
                        toast.success('Sample JSON downloaded')
                      }}
                      className="text-xs"
                    >
                      <Download size={14} weight="bold" className="mr-1" />
                      JSON Sample
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setImportStep('select')} className="flex-1">
                Back
              </Button>
            </div>
          </div>
        )}

        {importStep === 'review' && (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/20 border-2 border-secondary">
              <CheckCircle size={32} weight="fill" className="text-secondary" />
              <div>
                <div className="font-bold">Portfolio Parsed Successfully</div>
                <div className="text-sm text-muted-foreground">
                  Found {parsedData.length} holdings ready to import
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border-2 border-border rounded-lg">
              <table className="w-full">
                <thead className="bg-muted sticky top-0">
                  <tr className="text-left text-sm">
                    <th className="p-3 font-game text-xs">SYMBOL</th>
                    <th className="p-3 font-game text-xs">NAME</th>
                    <th className="p-3 font-game text-xs text-right">QTY</th>
                    <th className="p-3 font-game text-xs text-right">AVG PRICE</th>
                    <th className="p-3 font-game text-xs text-right">VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.map((holding, index) => (
                    <tr key={index} className="border-t border-border hover:bg-muted/50">
                      <td className="p-3 font-bold">{holding.symbol}</td>
                      <td className="p-3 text-sm">{holding.name}</td>
                      <td className="p-3 text-right">{holding.quantity}</td>
                      <td className="p-3 text-right">${holding.averagePrice.toFixed(2)}</td>
                      <td className="p-3 text-right font-bold">
                        ${(holding.quantity * holding.currentPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted border-t-2 border-border">
                  <tr>
                    <td colSpan={4} className="p-3 font-game text-sm">TOTAL VALUE</td>
                    <td className="p-3 text-right font-game">
                      ${parsedData.reduce((sum, h) => sum + (h.quantity * h.currentPrice), 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setImportStep('upload')} className="flex-1">
                Back
              </Button>
              <Button onClick={handleConfirmImport} className="flex-1 bg-secondary text-secondary-foreground font-game">
                CONFIRM IMPORT
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
