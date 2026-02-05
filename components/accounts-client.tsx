'use client'

import { AccountCard } from '@/components/account-card'
import { AddAccountDialog } from '@/components/add-account-dialog'
import { formatCurrency } from '@/lib/currency'
import type { Account } from '@/lib/types'
import { CreditCard, Plus } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AccountsClientProps {
  accounts: Account[]
  currency?: string
}

export function AccountsClient({ accounts, currency = 'USD' }: AccountsClientProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const router = useRouter()

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0)

  return (
    <>
      <div className="flex flex-col gap-6 p-4">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-foreground">Accounts</h1>
          <p className="text-sm text-muted-foreground">
            Total: {formatCurrency(totalBalance, currency)}
          </p>
        </div>

        {/* Account List */}
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">No accounts yet</p>
            <p className="text-xs text-muted-foreground">
              Add your first account to start tracking
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                currency={currency}
                onClick={() => {
                  setEditingAccount(account)
                  setShowAddDialog(true)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        type="button"
        onClick={() => {
          setEditingAccount(null)
          setShowAddDialog(true)
        }}
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Add account"
      >
        <Plus className="h-6 w-6" />
      </button>

      <AddAccountDialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open)
          if (!open) setEditingAccount(null)
        }}
        account={editingAccount}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}
