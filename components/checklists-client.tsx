'use client'

import { AddChecklistDialog } from '@/components/add-checklist-dialog'
import { formatCurrency } from '@/lib/currency'
import type { ChecklistItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, ListChecks, Plus, Target } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleChecklistItem } from '@/app/(app)/checklists/actions'
import { toast } from 'sonner'

const priorityColors: Record<ChecklistItem['priority'], string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
}

interface ChecklistsClientProps {
  items: ChecklistItem[]
  currency?: string
}

export function ChecklistsClient({ items, currency = 'USD' }: ChecklistsClientProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const activeItems = items.filter((item) => !item.is_completed)
  const completedItems = items.filter((item) => item.is_completed)

  const totalTarget = activeItems.reduce((sum, item) => sum + Number(item.target_amount), 0)
  const totalSaved = activeItems.reduce((sum, item) => sum + Number(item.saved_amount), 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  const handleToggle = (itemId: string) => {
    startTransition(async () => {
      const result = await toggleChecklistItem(itemId)
      if (result.error) {
        toast.error(result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-4">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-foreground">Savings Goals</h1>
          <p className="text-sm text-muted-foreground">Track your financial goals</p>
        </div>

        {/* Overall Progress */}
        {activeItems.length > 0 && (
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <p className="text-sm opacity-80">Total Progress</p>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-bold">{formatCurrency(totalSaved, currency)}</p>
              <p className="text-sm opacity-80">of {formatCurrency(totalTarget, currency)}</p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-primary-foreground/20">
              <div
                className="h-full rounded-full bg-primary-foreground transition-all"
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-sm opacity-80">{overallProgress.toFixed(0)}% achieved</p>
          </div>
        )}

        {/* Active Goals */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ListChecks className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">No goals yet</p>
            <p className="text-xs text-muted-foreground">
              Add your first savings goal
            </p>
          </div>
        ) : (
          <>
            {activeItems.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-medium text-muted-foreground">
                  Active Goals ({activeItems.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {activeItems.map((item) => {
                    const progress =
                      item.target_amount > 0
                        ? (Number(item.saved_amount) / Number(item.target_amount)) * 100
                        : 0
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setEditingItem(item)
                          setShowAddDialog(true)
                        }}
                        className="flex items-start gap-3 rounded-2xl bg-card p-4 text-left transition-colors hover:bg-muted"
                        disabled={isPending}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggle(item.id)
                          }}
                          className="mt-0.5 text-muted-foreground hover:text-primary"
                          aria-label="Mark as complete"
                        >
                          <Circle className="h-5 w-5" />
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{item.title}</p>
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: priorityColors[item.priority] }}
                            />
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatCurrency(item.saved_amount, currency)}</span>
                            <span>/</span>
                            <span>{formatCurrency(item.target_amount, currency)}</span>
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {completedItems.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-medium text-muted-foreground">
                  Completed ({completedItems.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {completedItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setEditingItem(item)
                        setShowAddDialog(true)
                      }}
                      className="flex items-start gap-3 rounded-2xl bg-card p-4 text-left opacity-60 transition-colors hover:bg-muted"
                      disabled={isPending}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggle(item.id)
                        }}
                        className="mt-0.5 text-primary"
                        aria-label="Mark as incomplete"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      <div className="flex-1">
                        <p className="font-medium text-foreground line-through">{item.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatCurrency(item.target_amount, currency)} saved
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        type="button"
        onClick={() => {
          setEditingItem(null)
          setShowAddDialog(true)
        }}
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Add goal"
      >
        <Plus className="h-6 w-6" />
      </button>

      <AddChecklistDialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open)
          if (!open) setEditingItem(null)
        }}
        item={editingItem}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}
