'use client'

import { TransactionList } from '@/components/transaction-list'
import { AddTransactionDialog } from '@/components/add-transaction-dialog'
import { EditTransactionDialog } from '@/components/edit-transaction-dialog'
import type { Account, Category, Transaction } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Plus, Filter } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TransactionsClientProps {
  accounts: Account[]
  categories: Category[]
  transactions: Transaction[]
  currency?: string
}

export function TransactionsClient({
  accounts,
  categories,
  transactions,
  currency = 'USD',
}: TransactionsClientProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const router = useRouter()

  const filteredTransactions =
    filterType === 'all'
      ? transactions
      : transactions.filter((t) => t.type === filterType)

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Transactions</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                {filterType === 'all' ? 'All' : filterType === 'income' ? 'Income' : 'Expense'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                All Transactions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('income')}>
                Income Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('expense')}>
                Expense Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
              filterType === 'all'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterType('income')}
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
              filterType === 'income'
                ? 'bg-income text-white'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setFilterType('expense')}
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
              filterType === 'expense'
                ? 'bg-expense text-white'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Expense
          </button>
        </div>

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          currency={currency}
          onTransactionClick={(transaction) => setEditingTransaction(transaction)}
        />
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

      <EditTransactionDialog
        open={!!editingTransaction}
        onOpenChange={(open) => {
          if (!open) setEditingTransaction(null)
        }}
        transaction={editingTransaction}
        accounts={accounts}
        categories={categories}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}
