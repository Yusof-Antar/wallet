"use client";

import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft } from "lucide-react";
import { format } from "date-fns";

interface TransactionItemProps {
  transaction: Transaction;
}

import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionDialog } from "@/components/transactions/add-transaction-dialog";

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isExpense = transaction.type === "expense";
  const isIncome = transaction.type === "income";
  const isTransfer = transaction.type === "transfer";

  return (
    <div className="group flex items-center justify-between py-3 px-1 transition-colors hover:bg-muted/30 rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105",
            isExpense && "bg-destructive/10 text-destructive",
            isIncome && "bg-emerald-500/10 text-emerald-500",
            isTransfer && "bg-primary/10 text-primary",
          )}
        >
          {isExpense && <ArrowUpRight className="h-5 w-5" />}
          {isIncome && <ArrowDownLeft className="h-5 w-5" />}
          {isTransfer && <ArrowRightLeft className="h-4 w-4" />}
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">
            {transaction.description || "Untitled"}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">
              {format(new Date(transaction.date), "MMM d")}
            </span>
            <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30" />
            <span className="text-[10px] text-muted-foreground capitalize">
              {transaction.type}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "text-sm font-semibold tracking-tight",
            isExpense && "text-destructive",
            isIncome && "text-emerald-500",
            isTransfer && "text-primary",
          )}
        >
          {isExpense ? "-" : isIncome ? "+" : ""}
          {formatCurrency(transaction.amount)}
        </div>
        <TransactionDialog transaction={transaction}>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <PenLine className="h-3.5 w-3.5" />
          </Button>
        </TransactionDialog>
      </div>
    </div>
  );
}
