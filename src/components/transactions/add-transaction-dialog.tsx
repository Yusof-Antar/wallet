"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/forms/transaction-form";
import { Plus, Loader2 } from "lucide-react";
import { getAccounts } from "@/services/accounts/actions";
import { getCategories } from "@/services/categories/actions";
import { Account, Category } from "@/types";

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [accs, cats] = await Promise.all([getAccounts(), getCategories()]);
      setAccounts(accs);
      setCategories(cats);
    } catch (error) {
      console.error("Failed to fetch data for transaction form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg h-12 w-12 p-0 md:h-10 md:w-auto md:px-4 md:rounded-md">
          <Plus className="h-6 w-6 md:mr-2 md:h-4 md:w-4" />
          <span className="hidden md:inline">Add Transaction</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Record an income, expense, or transfer.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TransactionForm
            accounts={accounts}
            categories={categories}
            onSuccess={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
