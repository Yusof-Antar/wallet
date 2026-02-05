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
import type { Account, Category, Transaction } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Briefcase,
  Car,
  Coffee,
  DollarSign,
  Film,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Pill,
  Plane,
  ShoppingBag,
  Smartphone,
  Utensils,
  Wallet,
  Zap,
} from 'lucide-react'
import { useState, useTransition, useEffect } from 'react'
import { updateTransaction, deleteTransaction } from '@/app/(app)/transactions/actions'
import { toast } from 'sonner'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  briefcase: Briefcase,
  car: Car,
  coffee: Coffee,
  dollar: DollarSign,
  film: Film,
  gift: Gift,
  graduation: GraduationCap,
  heart: Heart,
  home: Home,
  pill: Pill,
  plane: Plane,
  shopping: ShoppingBag,
  smartphone: Smartphone,
  utensils: Utensils,
  wallet: Wallet,
  zap: Zap,
}

interface EditTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
  accounts: Account[]
  categories: Category[]
  onSuccess?: () => void
}

export function EditTransactionDialog({
  open,
  onOpenChange,
  transaction,
  accounts,
  categories,
  onSuccess,
}: EditTransactionDialogProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (transaction) {
      setType(transaction.type)
      setAmount(transaction.amount.toString())
      setAccountId(transaction.account_id)
      setCategoryId(transaction.category_id)
      setDescription(transaction.description || '')
      setDate(transaction.date)
    }
  }, [transaction])

  const filteredCategories = categories.filter((c) => c.type === type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!transaction || !amount || !accountId || !categoryId) {
      toast.error('Please fill in all required fields')
      return
    }

    const formData = new FormData()
    formData.set('type', type)
    formData.set('amount', amount)
    formData.set('account_id', accountId)
    formData.set('category_id', categoryId)
    formData.set('description', description)
    formData.set('date', date)

    startTransition(async () => {
      const result = await updateTransaction(transaction.id, formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Transaction updated')
        onOpenChange(false)
        onSuccess?.()
      }
    })
  }

  const handleDelete = () => {
    if (!transaction) return

    startTransition(async () => {
      const result = await deleteTransaction(transaction.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Transaction deleted')
        onOpenChange(false)
        onSuccess?.()
      }
    })
  }

  if (!transaction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Type Toggle */}
          <div className="flex gap-2 rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => {
                setType('expense')
                setCategoryId('')
              }}
              className={cn(
                'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
                type === 'expense'
                  ? 'bg-expense text-white'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income')
                setCategoryId('')
              }}
              className={cn(
                'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
                type === 'income'
                  ? 'bg-income text-white'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div className="grid gap-2">
            <Label htmlFor="edit-amount">Amount</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 rounded-xl text-lg"
              required
            />
          </div>

          {/* Account */}
          <div className="grid gap-2">
            <Label>Account</Label>
            <Select value={accountId} onValueChange={setAccountId} required>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => {
                  const IconComponent = iconMap[category.icon] || Wallet
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <IconComponent
                          className="h-4 w-4"
                          style={{ color: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="grid gap-2">
            <Label htmlFor="edit-date">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Input
              id="edit-description"
              placeholder="Add a note"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            className="h-12 rounded-xl"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>

          <Button
            type="button"
            variant="destructive"
            className="h-12 rounded-xl"
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
