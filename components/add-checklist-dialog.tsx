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
import type { ChecklistItem } from '@/lib/types'
import { useState, useTransition, useEffect } from 'react'
import {
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from '@/app/(app)/checklists/actions'
import { toast } from 'sonner'

const priorities: { value: ChecklistItem['priority']; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#22c55e' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
]

interface AddChecklistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: ChecklistItem | null
  onSuccess?: () => void
}

export function AddChecklistDialog({
  open,
  onOpenChange,
  item,
  onSuccess,
}: AddChecklistDialogProps) {
  const isEditing = !!item
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [savedAmount, setSavedAmount] = useState('')
  const [priority, setPriority] = useState<ChecklistItem['priority']>('medium')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (item) {
      setTitle(item.title)
      setTargetAmount(item.target_amount.toString())
      setSavedAmount(item.saved_amount.toString())
      setPriority(item.priority)
    } else {
      resetForm()
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    const formData = new FormData()
    formData.set('title', title)
    formData.set('target_amount', targetAmount || '0')
    formData.set('saved_amount', savedAmount || '0')
    formData.set('priority', priority)

    startTransition(async () => {
      const result = isEditing
        ? await updateChecklistItem(item.id, formData)
        : await addChecklistItem(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(isEditing ? 'Item updated' : 'Item added')
        onOpenChange(false)
        resetForm()
        onSuccess?.()
      }
    })
  }

  const handleDelete = () => {
    if (!item) return

    startTransition(async () => {
      const result = await deleteChecklistItem(item.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Item deleted')
        onOpenChange(false)
        resetForm()
        onSuccess?.()
      }
    })
  }

  const resetForm = () => {
    setTitle('')
    setTargetAmount('')
    setSavedAmount('')
    setPriority('medium')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Goal' : 'Add Goal'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="checklist-title">What do you want to save for?</Label>
            <Input
              id="checklist-title"
              placeholder="e.g. New iPhone, Vacation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>

          {/* Target Amount */}
          <div className="grid gap-2">
            <Label htmlFor="target-amount">Target Amount</Label>
            <Input
              id="target-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          {/* Saved Amount */}
          <div className="grid gap-2">
            <Label htmlFor="saved-amount">Already Saved</Label>
            <Input
              id="saved-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={savedAmount}
              onChange={(e) => setSavedAmount(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          {/* Priority */}
          <div className="grid gap-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as ChecklistItem['priority'])}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      {p.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="h-12 rounded-xl"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Goal'}
          </Button>

          {isEditing && (
            <Button
              type="button"
              variant="destructive"
              className="h-12 rounded-xl"
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete Goal
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
