import type { Stock, PortfolioHolding } from './types'

export interface PlaidAccount {
  id: string
  name: string
  mask: string
  type: string
  subtype: string
  balances: {
    available: number | null
    current: number | null
    limit: number | null
  }
}

export interface PlaidHolding {
  account_id: string
  security_id: string
  institution_price: number
  institution_price_as_of: string
  institution_value: number
  cost_basis: number | null
  quantity: number
  iso_currency_code: string
  unofficial_currency_code: string | null
}

export interface PlaidSecurity {
  security_id: string
  isin: string | null
  cusip: string | null
  sedol: string | null
  institution_security_id: string | null
  institution_id: string | null
  proxy_security_id: string | null
  name: string
  ticker_symbol: string
  is_cash_equivalent: boolean
  type: string
  close_price: number
  close_price_as_of: string | null
  iso_currency_code: string
  unofficial_currency_code: string | null
}

export interface PlaidImportResult {
  accounts: PlaidAccount[]
  holdings: PlaidHolding[]
  securities: PlaidSecurity[]
  totalCashBalance: number
  totalInvestmentValue: number
}

export class PlaidService {
  private static SANDBOX_MODE = true
  private static INFINITY_TOKEN_CONVERSION_RATE = 1.0

  static async createLinkToken(): Promise<string> {
    if (this.SANDBOX_MODE) {
      return `link-sandbox-${Date.now()}`
    }

    try {
      const response = await fetch('/api/plaid/create_link_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create link token')
      }

      const data = await response.json()
      return data.link_token
    } catch (error) {
      console.error('Error creating link token:', error)
      throw error
    }
  }

  static async exchangePublicToken(publicToken: string): Promise<string> {
    if (this.SANDBOX_MODE) {
      return `access-sandbox-${Date.now()}`
    }

    try {
      const response = await fetch('/api/plaid/exchange_public_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token: publicToken }),
      })

      if (!response.ok) {
        throw new Error('Failed to exchange public token')
      }

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Error exchanging public token:', error)
      throw error
    }
  }

  static async fetchAccountData(accessToken: string): Promise<PlaidImportResult> {
    if (this.SANDBOX_MODE) {
      return this.generateSandboxData()
    }

    try {
      const response = await fetch('/api/plaid/holdings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: accessToken }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch account data')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching account data:', error)
      throw error
    }
  }

  private static generateSandboxData(): PlaidImportResult {
    const holdings: PlaidHolding[] = [
      {
        account_id: 'acc_001',
        security_id: 'sec_AAPL',
        institution_price: 178.50,
        institution_price_as_of: new Date().toISOString(),
        institution_value: 1785.00,
        cost_basis: 1650.00,
        quantity: 10,
        iso_currency_code: 'USD',
        unofficial_currency_code: null,
      },
      {
        account_id: 'acc_001',
        security_id: 'sec_GOOGL',
        institution_price: 142.80,
        institution_price_as_of: new Date().toISOString(),
        institution_value: 2856.00,
        cost_basis: 2640.00,
        quantity: 20,
        iso_currency_code: 'USD',
        unofficial_currency_code: null,
      },
      {
        account_id: 'acc_001',
        security_id: 'sec_TSLA',
        institution_price: 248.90,
        institution_price_as_of: new Date().toISOString(),
        institution_value: 1244.50,
        cost_basis: 1400.00,
        quantity: 5,
        iso_currency_code: 'USD',
        unofficial_currency_code: null,
      },
    ]

    const securities: PlaidSecurity[] = [
      {
        security_id: 'sec_AAPL',
        isin: 'US0378331005',
        cusip: '037833100',
        sedol: null,
        institution_security_id: 'AAPL',
        institution_id: 'ins_robinhood',
        proxy_security_id: null,
        name: 'Apple Inc.',
        ticker_symbol: 'AAPL',
        is_cash_equivalent: false,
        type: 'equity',
        close_price: 178.50,
        close_price_as_of: new Date().toISOString(),
        iso_currency_code: 'USD',
        unofficial_currency_code: null,
      },
      {
        security_id: 'sec_GOOGL',
        isin: 'US02079K3059',
        cusip: '02079K305',
        sedol: null,
        institution_security_id: 'GOOGL',
        institution_id: 'ins_robinhood',
        proxy_security_id: null,
        name: 'Alphabet Inc. Class A',
        ticker_symbol: 'GOOGL',
        is_cash_equivalent: false,
        type: 'equity',
        close_price: 142.80,
        close_price_as_of: new Date().toISOString(),
        iso_currency_code: 'USD',
        unofficial_currency_code: null,
      },
      {
        security_id: 'sec_TSLA',
        isin: 'US88160R1014',
        cusip: '88160R101',
        sedol: null,
        institution_security_id: 'TSLA',
        institution_id: 'ins_robinhood',
        proxy_security_id: null,
        name: 'Tesla, Inc.',
        ticker_symbol: 'TSLA',
        is_cash_equivalent: false,
        type: 'equity',
        close_price: 248.90,
        close_price_as_of: new Date().toISOString(),
        iso_currency_code: 'USD',
        unofficial_currency_code: null,
      },
    ]

    const accounts: PlaidAccount[] = [
      {
        id: 'acc_001',
        name: 'Robinhood Brokerage',
        mask: '1234',
        type: 'investment',
        subtype: 'brokerage',
        balances: {
          available: 5430.25,
          current: 11315.75,
          limit: null,
        },
      },
    ]

    const totalCashBalance = 5430.25
    const totalInvestmentValue = 5885.50

    return {
      accounts,
      holdings,
      securities,
      totalCashBalance,
      totalInvestmentValue,
    }
  }

  static convertToInfinityTokens(usdAmount: number): number {
    return usdAmount * this.INFINITY_TOKEN_CONVERSION_RATE
  }

  static transformPlaidToHoldings(
    plaidData: PlaidImportResult,
    existingStocks: Stock[]
  ): {
    newHoldings: Omit<PortfolioHolding, 'id' | 'infinityBankId' | 'securityLevel'>[]
    newStocks: Stock[]
    totalInfinityTokens: number
  } {
    const newHoldings: Omit<PortfolioHolding, 'id' | 'infinityBankId' | 'securityLevel'>[] = []
    const newStocks: Stock[] = []
    const stockMap = new Map(existingStocks.map(s => [s.symbol, s]))

    plaidData.holdings.forEach(holding => {
      const security = plaidData.securities.find(s => s.security_id === holding.security_id)
      if (!security) return

      let stock = stockMap.get(security.ticker_symbol)
      
      if (!stock) {
        const newStock: Stock = {
          id: `stock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          symbol: security.ticker_symbol,
          name: security.name,
          currentPrice: security.close_price,
          basePrice: security.close_price,
          priceChange: 0,
          priceChangePercent: 0,
          totalSupply: 10000,
          availableTokens: 10000 - holding.quantity,
          category: 'Imported',
          lastPriceUpdate: Date.now(),
          priceHistory: [],
        }
        newStocks.push(newStock)
        stock = newStock
        stockMap.set(security.ticker_symbol, stock)
      }

      const averagePrice = holding.cost_basis ? holding.cost_basis / holding.quantity : holding.institution_price
      const currentPrice = holding.institution_price
      const totalValue = holding.institution_value
      const gainLoss = totalValue - (averagePrice * holding.quantity)
      const gainLossPercent = (gainLoss / (averagePrice * holding.quantity)) * 100

      newHoldings.push({
        stockId: stock.id,
        symbol: security.ticker_symbol,
        name: security.name,
        quantity: holding.quantity,
        averagePrice,
        currentPrice,
        totalValue,
        gainLoss,
        gainLossPercent,
      })
    })

    const totalUsdValue = plaidData.totalCashBalance + plaidData.totalInvestmentValue
    const totalInfinityTokens = this.convertToInfinityTokens(totalUsdValue)

    return {
      newHoldings,
      newStocks,
      totalInfinityTokens,
    }
  }

  static getSupportedInstitutions(): Array<{
    id: string
    name: string
    logo: string
  }> {
    return [
      { id: 'ins_robinhood', name: 'Robinhood', logo: '🏹' },
      { id: 'ins_webull', name: 'Webull', logo: '🐂' },
      { id: 'ins_public', name: 'Public', logo: '📈' },
      { id: 'ins_fidelity', name: 'Fidelity', logo: '🏛️' },
      { id: 'ins_schwab', name: 'Charles Schwab', logo: '💼' },
      { id: 'ins_etrade', name: 'E*TRADE', logo: '💻' },
      { id: 'ins_tdameritrade', name: 'TD Ameritrade', logo: '📊' },
      { id: 'ins_merrill', name: 'Merrill Edge', logo: '🦬' },
      { id: 'ins_vanguard', name: 'Vanguard', logo: '⚓' },
    ]
  }
}
