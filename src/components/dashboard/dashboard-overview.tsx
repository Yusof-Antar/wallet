"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/supabase";

interface DashboardOverviewProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export function DashboardOverview({
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
}: DashboardOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-linear-to-br from-indigo-500 to-purple-600 text-primary-foreground border-none shadow-xl shadow-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">
            Total Balance
          </CardTitle>
          <div className="rounded-full bg-white/20 p-2">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white tracking-tight">
            {formatCurrency(totalBalance)}
          </div>
          <p className="text-xs text-white/70 mt-1 font-medium">
            Across all accounts
          </p>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-emerald-400 to-teal-600 text-white border-none shadow-xl shadow-emerald-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">
            Monthly Income
          </CardTitle>
          <div className="rounded-full bg-white/20 p-2">
            <ArrowUpIcon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white tracking-tight">
            {formatCurrency(monthlyIncome)}
          </div>
          <p className="text-xs text-white/70 font-medium pt-1">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-rose-400 to-coral-600 text-white border-none shadow-xl shadow-rose-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">
            Monthly Expenses
          </CardTitle>
          <div className="rounded-full bg-white/20 p-2">
            <ArrowDownIcon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white tracking-tight">
            {formatCurrency(monthlyExpenses)}
          </div>
          <p className="text-xs text-white/70 font-medium pt-1">
            +4% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
