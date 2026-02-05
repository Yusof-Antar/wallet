'use client'

import { formatCurrency } from '@/lib/currency'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

interface BalanceCardProps {
  totalBalance: number
  monthlyIncome: number
  monthlyExpense: number
  currency?: string
}

export function BalanceCard({
  totalBalance,
  monthlyIncome,
  monthlyExpense,
  currency = 'USD',
}: BalanceCardProps) {
  return (
    <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
      <p className="text-sm opacity-80">Total Balance</p>
      <p className="mt-1 text-3xl font-bold">{formatCurrency(totalBalance, currency)}</p>

      <div className="mt-6 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
            <ArrowDownLeft className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs opacity-80">Income</p>
            <p className="font-semibold">{formatCurrency(monthlyIncome, currency)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
            <ArrowUpRight className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs opacity-80">Expense</p>
            <p className="font-semibold">{formatCurrency(monthlyExpense, currency)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
