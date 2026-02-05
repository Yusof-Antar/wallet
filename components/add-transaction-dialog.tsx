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
import type { Account, Category } from '@/lib/types'
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
import { useState, useTransition } from 'react'
import { addTransaction } from '@/app/(app)/dashboard/actions'
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

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accounts: Account[]
  categories: Category[]
  onSuccess?: () => void
}

export function AddTransactionDialog({
  open,
  onOpenChange,
  accounts,
  categories,
  onSuccess,
}: AddTransactionDialogProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isPending, startTransition] = useTransition()

  const filteredCategories = categories.filter((c) => c.type === type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !accountId || !categoryId) {
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
      const result = await addTransaction(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Transaction added successfully')
        onOpenChange(false)
        resetForm()
        onSuccess?.()
      }
    })
  }

  const resetForm = () => {
    setAmount('')
    setAccountId('')
    setCategoryId('')
    setDescription('')
    setDate(new Date().toISOString().split('T')[0])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
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
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
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
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Add a note"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            className="h-12 rounded-xl"
            disabled={isPending || accounts.length === 0}
          >
            {isPending ? 'Adding...' : 'Add Transaction'}
          </Button>

          {accounts.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Please add an account first in the Accounts tab
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
