export const SAMPLE_ROBINHOOD_CSV = `Symbol,Name,Quantity,Average Price,Current Price,Total Value,Gain/Loss
AAPL,Apple Inc.,10,150.00,178.50,1785.00,285.00
GOOGL,Alphabet Inc.,5,140.00,142.80,714.00,14.00
MSFT,Microsoft Corporation,8,400.00,412.30,3298.40,98.40
TSLA,Tesla Inc.,3,260.00,248.90,746.70,-33.30
NVDA,NVIDIA Corporation,2,850.00,875.40,1750.80,50.80`

export const SAMPLE_PUBLIC_CSV = `Ticker,Company Name,Shares,Cost Basis per Share,Current Market Price,Market Value,Unrealized Gain/Loss
AAPL,Apple Inc.,10,$150.00,$178.50,$1785.00,$285.00
GOOGL,Alphabet Inc.,5,$140.00,$142.80,$714.00,$14.00
MSFT,Microsoft Corporation,8,$400.00,$412.30,$3298.40,$98.40
TSLA,Tesla Inc.,3,$260.00,$248.90,$746.70,-$33.30
NVDA,NVIDIA Corporation,2,$850.00,$875.40,$1750.80,$50.80`

export const SAMPLE_WEBULL_CSV = `Stock Symbol,Stock Name,Amount,Avg Cost,Last Price,Total Market Value,P&L
AAPL,Apple Inc.,10,150.00,178.50,1785.00,285.00
GOOGL,Alphabet Inc.,5,140.00,142.80,714.00,14.00
MSFT,Microsoft Corporation,8,400.00,412.30,3298.40,98.40
TSLA,Tesla Inc.,3,260.00,248.90,746.70,-33.30
NVDA,NVIDIA Corporation,2,850.00,875.40,1750.80,50.80`

export const SAMPLE_JSON = `{
  "positions": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "quantity": 10,
      "average_buy_price": 150.00,
      "current_price": 178.50
    },
    {
      "symbol": "GOOGL",
      "name": "Alphabet Inc.",
      "quantity": 5,
      "average_buy_price": 140.00,
      "current_price": 142.80
    },
    {
      "symbol": "MSFT",
      "name": "Microsoft Corporation",
      "quantity": 8,
      "average_buy_price": 400.00,
      "current_price": 412.30
    },
    {
      "symbol": "TSLA",
      "name": "Tesla Inc.",
      "quantity": 3,
      "average_buy_price": 260.00,
      "current_price": 248.90
    },
    {
      "symbol": "NVDA",
      "name": "NVIDIA Corporation",
      "quantity": 2,
      "average_buy_price": 850.00,
      "current_price": 875.40
    }
  ]
}`

export function downloadSampleFile(platform: 'robinhood' | 'public' | 'webull' | 'json') {
  let content = ''
  let filename = ''
  let type = 'text/csv'

  switch (platform) {
    case 'robinhood':
      content = SAMPLE_ROBINHOOD_CSV
      filename = 'robinhood-portfolio-sample.csv'
      break
    case 'public':
      content = SAMPLE_PUBLIC_CSV
      filename = 'public-portfolio-sample.csv'
      break
    case 'webull':
      content = SAMPLE_WEBULL_CSV
      filename = 'webull-portfolio-sample.csv'
      break
    case 'json':
      content = SAMPLE_JSON
      filename = 'portfolio-sample.json'
      type = 'application/json'
      break
  }

  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
