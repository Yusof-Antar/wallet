import { TransactionItem } from "@/components/transactions/transaction-item";
import { TransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { CategoryDialog } from "@/components/categories/add-category-dialog";
import { getTransactions } from "@/services/transactions/actions";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { TransactionFilters } from "@/components/transactions/transaction-filters";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ timeframe?: string }>;
}) {
  const { timeframe = "all" } = await searchParams;
  const transactions = await getTransactions({ timeframe, limit: 100 });

  // Group transactions by date
  const groupedTransactions = transactions.reduce(
    (groups, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {} as Record<string, typeof transactions>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            A detailed history of your money flow
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CategoryDialog />
          <TransactionDialog />
        </div>
      </div>

      <TransactionFilters />

      <div className="space-y-8">
        {Object.entries(groupedTransactions).map(([date, items]) => (
          <div key={date} className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground ml-1 sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
              {date}
            </h3>
            <div className="grid gap-3">
              {items.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="py-20 text-center border rounded-xl border-dashed">
            <p className="text-muted-foreground text-sm">
              No transactions found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
