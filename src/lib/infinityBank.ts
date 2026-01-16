import type { InfinityBankRecord } from './types'

export class InfinityBank {
  private static generateSecurityHash(data: any): string {
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return `ΞINF-${Math.abs(hash).toString(36).toUpperCase()}-SECURE`
  }

  static async store(
    userId: string,
    type: 'holding' | 'transaction' | 'balance',
    data: any,
    securityLevel: 'plateau' | 'plus' = 'plateau'
  ): Promise<string> {
    const id = `INF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const record: InfinityBankRecord = {
      id,
      userId,
      type,
      data,
      timestamp: Date.now(),
      securityHash: this.generateSecurityHash(data),
      plateauBackup: true,
      plusRedundancy: securityLevel === 'plus',
    }

    const key = `infinity-bank-${type}-${id}`
    await window.spark.kv.set(key, record)

    if (securityLevel === 'plus') {
      const redundantKey = `infinity-bank-plus-${type}-${id}`
      await window.spark.kv.set(redundantKey, record)
    }

    return id
  }

  static async retrieve(id: string): Promise<InfinityBankRecord | null> {
    const keys = await window.spark.kv.keys()
    const matchingKey = keys.find(k => k.includes(id))
    
    if (!matchingKey) {
      return null
    }

    const record = await window.spark.kv.get<InfinityBankRecord>(matchingKey)
    return record || null
  }

  static async verifyIntegrity(record: InfinityBankRecord): Promise<boolean> {
    const computedHash = this.generateSecurityHash(record.data)
    return computedHash === record.securityHash
  }

  static async getAllRecords(userId: string, type?: string): Promise<InfinityBankRecord[]> {
    const keys = await window.spark.kv.keys()
    const records: InfinityBankRecord[] = []

    for (const key of keys) {
      if (key.startsWith('infinity-bank') && (!type || key.includes(type))) {
        const record = await window.spark.kv.get<InfinityBankRecord>(key)
        if (record && record.userId === userId) {
          records.push(record)
        }
      }
    }

    return records.sort((a, b) => b.timestamp - a.timestamp)
  }
}

export function generateInfinityBankId(): string {
  return `INF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export async function secureToInfinityBank(data: any, securityLevel: 'plateau' | 'plus' = 'plateau'): Promise<string> {
  const user = await window.spark.user()
  const userId = user?.id?.toString() || 'default-user'
  return InfinityBank.store(userId, 'holding', data, securityLevel)
}
