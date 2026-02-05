'use client'

import React from "react"

import { formatCurrency } from '@/lib/currency'
import type { CategoryStats, MonthlyStats } from '@/lib/types'
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
import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts'

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

interface StatisticsClientProps {
  totalIncome: number
  totalExpense: number
  categoryStats: CategoryStats[]
  monthlyStats: MonthlyStats[]
  currency?: string
}

export function StatisticsClient({
  totalIncome,
  totalExpense,
  categoryStats,
  monthlyStats,
  currency = 'USD',
}: StatisticsClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories'>('overview')

  const balance = totalIncome - totalExpense

  // Compute colors for charts
  const incomeColor = '#14b8a6'
  const expenseColor = '#ef4444'

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Statistics</h1>
        <p className="text-sm text-muted-foreground">This month</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card p-4">
          <p className="text-sm text-muted-foreground">Income</p>
          <p className="mt-1 text-xl font-bold text-income">
            +{formatCurrency(totalIncome, currency)}
          </p>
        </div>
        <div className="rounded-2xl bg-card p-4">
          <p className="text-sm text-muted-foreground">Expense</p>
          <p className="mt-1 text-xl font-bold text-expense">
            -{formatCurrency(totalExpense, currency)}
          </p>
        </div>
      </div>

      {/* Balance */}
      <div className="rounded-2xl bg-card p-4">
        <p className="text-sm text-muted-foreground">Balance</p>
        <p
          className={cn(
            'mt-1 text-2xl font-bold',
            balance >= 0 ? 'text-income' : 'text-expense'
          )}
        >
          {balance >= 0 ? '+' : ''}
          {formatCurrency(balance, currency)}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl bg-muted p-1">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={cn(
            'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
            activeTab === 'overview'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={cn(
            'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
            activeTab === 'categories'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Categories
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Monthly Chart */}
          <div className="rounded-2xl bg-card p-4">
            <h3 className="mb-4 font-semibold text-foreground">Monthly Overview</h3>
            {monthlyStats.length > 0 && monthlyStats.some((m) => m.income > 0 || m.expense > 0) ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStats} barCategoryGap="20%">
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Bar dataKey="income" fill={incomeColor} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill={expenseColor} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                No data available
              </div>
            )}
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-income" />
                <span className="text-xs text-muted-foreground">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-expense" />
                <span className="text-xs text-muted-foreground">Expense</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Category Breakdown */}
          <div className="rounded-2xl bg-card p-4">
            <h3 className="mb-4 font-semibold text-foreground">Expense by Category</h3>
            {categoryStats.length > 0 ? (
              <>
                <div className="mb-4 flex justify-center">
                  <div className="h-40 w-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryStats}
                          dataKey="total"
                          nameKey="category_name"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                        >
                          {categoryStats.map((entry) => (
                            <Cell key={entry.category_id} fill={entry.category_color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {categoryStats.map((stat) => {
                    const IconComponent = iconMap[stat.category_icon] || Wallet
                    return (
                      <div key={stat.category_id} className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `${stat.category_color}20` }}
                        >
                          <IconComponent
                            className="h-5 w-5"
                            style={{ color: stat.category_color }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-foreground">{stat.category_name}</p>
                            <p className="font-semibold text-foreground">
                              {formatCurrency(stat.total, currency)}
                            </p>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${stat.percentage}%`,
                                backgroundColor: stat.category_color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                No expense data available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
