'use client'

import { BalanceCard } from '@/components/balance-card'
import { TransactionList } from '@/components/transaction-list'
import { AddTransactionDialog } from '@/components/add-transaction-dialog'
import type { Account, Category, Transaction } from '@/lib/types'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DashboardClientProps {
  accounts: Account[]
  categories: Category[]
  transactions: Transaction[]
  monthlyIncome: number
  monthlyExpense: number
  totalBalance: number
  displayName: string | null
  currency?: string
}

export function DashboardClient({
  accounts,
  categories,
  transactions,
  monthlyIncome,
  monthlyExpense,
  totalBalance,
  displayName,
  currency = 'USD',
}: DashboardClientProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const router = useRouter()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{greeting()}</p>
            <h1 className="text-xl font-bold text-foreground">
              {displayName || 'Welcome'}
            </h1>
          </div>
        </div>

        {/* Balance Card */}
        <BalanceCard
          totalBalance={totalBalance}
          monthlyIncome={monthlyIncome}
          monthlyExpense={monthlyExpense}
          currency={currency}
        />

        {/* Recent Transactions */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent Transactions</h2>
          </div>
          <TransactionList
            transactions={transactions}
            currency={currency}
          />
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        type="button"
        onClick={() => setShowAddDialog(true)}
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Add transaction"
      >
        <Plus className="h-6 w-6" />
      </button>

      <AddTransactionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        accounts={accounts}
        categories={categories}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}
