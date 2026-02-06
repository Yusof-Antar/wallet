import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { AccountCard } from "@/components/dashboard/account-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { getAccounts } from "@/services/accounts/actions";
import { getTransactions } from "@/services/transactions/actions";
import { getStatistics } from "@/services/statistics/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const [accounts, transactions, stats] = await Promise.all([
    getAccounts(),
    getTransactions(5),
    getStatistics("month"),
  ]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyIncome = stats.totalIncome;
  const monthlyExpenses = stats.totalExpense;

  // Real stats calculations
  const daysInMonth = stats.chartData.length || 30;
  const dailyAverage = monthlyExpenses / daysInMonth;
  const savingsRate =
    monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
      : 0;

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your money.
          </p>
        </div>
        <AddTransactionDialog />
      </div>

      <DashboardOverview
        totalBalance={totalBalance}
        monthlyIncome={monthlyIncome}
        monthlyExpenses={monthlyExpenses}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Your Accounts</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
            {accounts.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-2 py-8 text-center border rounded-xl border-dashed">
                No accounts found. Add one to get started.
              </p>
            )}
          </div>
        </div>
        <div className="col-span-3">
          <RecentTransactions transactions={transactions} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">
              Spending Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardChart data={stats.chartData} />
          </CardContent>
        </Card>
        <Card className="col-span-3 border-none shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    Daily Average
                  </p>
                  <p className="text-2xl font-black mt-1">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(dailyAverage)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/40 pt-6">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    Savings Rate
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-black mt-1",
                      savingsRate >= 0 ? "text-emerald-500" : "text-rose-500",
                    )}
                  >
                    {savingsRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
