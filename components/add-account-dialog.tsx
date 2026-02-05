'use client'

import React from "react"

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Account } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Banknote,
  Building2,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { useState, useTransition } from 'react'
import { addAccount, updateAccount, deleteAccount } from '@/app/(app)/accounts/actions'
import { toast } from 'sonner'

const icons = [
  { id: 'wallet', icon: Wallet, label: 'Wallet' },
  { id: 'bank', icon: Building2, label: 'Bank' },
  { id: 'card', icon: CreditCard, label: 'Card' },
  { id: 'cash', icon: Banknote, label: 'Cash' },
  { id: 'piggy', icon: PiggyBank, label: 'Savings' },
  { id: 'chart', icon: TrendingUp, label: 'Investment' },
]

const colors = [
  '#14b8a6', // teal (primary)
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#22c55e', // green
  '#ec4899', // pink
  '#6b7280', // gray
]

const accountTypes: { value: Account['type']; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank Account' },
  { value: 'credit', label: 'Credit Card' },
  { value: 'savings', label: 'Savings' },
  { value: 'investment', label: 'Investment' },
]

interface AddAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: Account | null
  onSuccess?: () => void
}

export function AddAccountDialog({
  open,
  onOpenChange,
  account,
  onSuccess,
}: AddAccountDialogProps) {
  const isEditing = !!account
  const [name, setName] = useState(account?.name || '')
  const [type, setType] = useState<Account['type']>(account?.type || 'bank')
  const [balance, setBalance] = useState(account?.balance?.toString() || '0')
  const [selectedIcon, setSelectedIcon] = useState(account?.icon || 'wallet')
  const [selectedColor, setSelectedColor] = useState(account?.color || colors[0])
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Please enter an account name')
      return
    }

    const formData = new FormData()
    formData.set('name', name)
    formData.set('type', type)
    formData.set('balance', balance)
    formData.set('icon', selectedIcon)
    formData.set('color', selectedColor)

    startTransition(async () => {
      const result = isEditing
        ? await updateAccount(account.id, formData)
        : await addAccount(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(isEditing ? 'Account updated' : 'Account created')
        onOpenChange(false)
        resetForm()
        onSuccess?.()
      }
    })
  }

  const handleDelete = () => {
    if (!account) return

    startTransition(async () => {
      const result = await deleteAccount(account.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Account deleted')
        onOpenChange(false)
        resetForm()
        onSuccess?.()
      }
    })
  }

  const resetForm = () => {
    setName('')
    setType('bank')
    setBalance('0')
    setSelectedIcon('wallet')
    setSelectedColor(colors[0])
  }

  // Reset form when account changes
  if (account && name !== account.name) {
    setName(account.name)
    setType(account.type)
    setBalance(account.balance.toString())
    setSelectedIcon(account.icon)
    setSelectedColor(account.color)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Account' : 'Add Account'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              placeholder="e.g. Main Bank Account"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>

          {/* Type */}
          <div className="grid gap-2">
            <Label>Account Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as Account['type'])}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Balance */}
          <div className="grid gap-2">
            <Label htmlFor="balance">Current Balance</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          {/* Icon */}
          <div className="grid gap-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {icons.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedIcon(id)}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-colors',
                    selectedIcon === id
                      ? 'border-primary bg-accent'
                      : 'border-transparent bg-muted hover:bg-muted/80'
                  )}
                >
                  <Icon className="h-5 w-5" style={{ color: selectedColor }} />
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'h-8 w-8 rounded-full transition-transform',
                    selectedColor === color && 'scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 rounded-xl"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Account'}
          </Button>

          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              className="h-12 rounded-xl"
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete Account
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
