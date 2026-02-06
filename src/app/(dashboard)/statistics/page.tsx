"use client";

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

const EXPENSE_DATA = [
  { name: "Food", value: 400, color: "#f87171" },
  { name: "Rent", value: 1200, color: "#60a5fa" },
  { name: "Transport", value: 300, color: "#fbbf24" },
  { name: "Shopping", value: 200, color: "#c084fc" },
  { name: "Utility", value: 150, color: "#34d399" },
];

const MONTHLY_DATA = [
  { name: "Jan", income: 3000, expense: 2000 },
  { name: "Feb", income: 3200, expense: 1800 },
  { name: "Mar", income: 3500, expense: 2200 },
  { name: "Apr", income: 3100, expense: 2100 },
];

export default function StatisticsPage() {
  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-foreground">
          Analytics
        </h2>
        <p className="text-muted-foreground font-medium">
          Deep dive into your spending habits
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-none shadow-xl shadow-black/5 bg-card/60 backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={EXPENSE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {EXPENSE_DATA.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="drop-shadow-lg"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-black/5 bg-card/60 backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">
              Income vs Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MONTHLY_DATA}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.02)" }}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend iconType="circle" />
                <Bar
                  dataKey="income"
                  fill="#10b981"
                  radius={[10, 10, 0, 0]}
                  barSize={30}
                />
                <Bar
                  dataKey="expense"
                  fill="#f43f5e"
                  radius={[10, 10, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
