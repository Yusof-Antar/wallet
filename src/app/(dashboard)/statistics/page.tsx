"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { getStatistics } from "@/services/statistics/actions";
import { Loader2, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = [
  "#f87171",
  "#60a5fa",
  "#fbbf24",
  "#c084fc",
  "#34d399",
  "#10b981",
  "#8b5cf6",
  "#ec4899",
];

export default function StatisticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">(
    "month",
  );

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const stats = await getStatistics(timeframe);
        setData(stats);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [timeframe]);

  if (isLoading) {
    return (
      <div className="flex h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Analytics
          </h2>
          <p className="text-muted-foreground font-medium">
            Deep dive into your spending habits
          </p>
        </div>
        <Select
          value={timeframe}
          onValueChange={(value: any) => setTimeframe(value)}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="year">Past Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border border-border/50 bg-card shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Income
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  {formatCurrency(data.totalIncome)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 bg-card shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-600">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  {formatCurrency(data.totalExpense)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 bg-card shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Net Balance
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  {formatCurrency(data.netBalance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border border-border/50 bg-card shadow-sm transition-all hover:border-border/80">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight">
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {data.categoryDistribution.map(
                    (_entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="opacity-90 hover:opacity-100 transition-opacity"
                      />
                    ),
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ fontSize: "12px", fontWeight: "600" }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card shadow-sm transition-all hover:border-border/80">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight">
              Income vs Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  fontWeight="500"
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  tickFormatter={(value) => value.split("-").slice(1).join("/")}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  fontWeight="500"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ fontSize: "12px", fontWeight: "600" }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                />
                <Bar
                  dataKey="income"
                  fill="oklch(0.65 0.15 150)" /* Emerald */
                  radius={[4, 4, 0, 0]}
                  barSize={timeframe === "year" ? 10 : 20}
                />
                <Bar
                  dataKey="expense"
                  fill="oklch(0.65 0.15 20)" /* Rose */
                  radius={[4, 4, 0, 0]}
                  barSize={timeframe === "year" ? 10 : 20}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
