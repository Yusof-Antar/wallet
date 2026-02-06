"use client";

import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft } from "lucide-react";
import { format } from "date-fns";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isExpense = transaction.type === "expense";
  const isIncome = transaction.type === "income";
  const isTransfer = transaction.type === "transfer";

  return (
    <div className="group flex items-center justify-between py-4 transition-all duration-300 hover:bg-white/40 hover:px-2 hover:-mx-2 rounded-2xl">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl shadow-xs transition-transform duration-300 group-hover:scale-110",
            isExpense && "bg-rose-50 text-rose-500",
            isIncome && "bg-emerald-50 text-emerald-500",
            isTransfer && "bg-blue-50 text-blue-500",
          )}
        >
          {isExpense && <ArrowUpRight className="h-6 w-6" />}
          {isIncome && <ArrowDownLeft className="h-6 w-6" />}
          {isTransfer && <ArrowRightLeft className="h-5 w-5" />}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">
            {transaction.description || "Untitled Transaction"}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              {format(new Date(transaction.date), "MMM d, yyyy")}
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
              {transaction.type}
            </span>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "text-lg font-black tracking-tight",
          isExpense && "text-rose-500",
          isIncome && "text-emerald-500",
          isTransfer && "text-blue-500",
        )}
      >
        {isExpense ? "-" : "+"}
        {formatCurrency(transaction.amount)}
      </div>
    </div>
  );
}
