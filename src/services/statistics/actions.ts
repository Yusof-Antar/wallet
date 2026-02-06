"use server";

import { createSupabaseClient } from "@/lib/supabase";

export async function getStatistics(
  timeframe: "month" | "week" | "year" = "month",
) {
  const supabase = createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const now = new Date();
  let startDate = new Date();

  if (timeframe === "week") {
    startDate.setDate(now.getDate() - 7);
  } else if (timeframe === "month") {
    startDate.setMonth(now.getMonth() - 1);
  } else if (timeframe === "year") {
    startDate.setFullYear(now.getFullYear() - 1);
  }

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("amount, type, date, categories(name)")
    .eq("user_id", user.id)
    .gte("date", startDate.toISOString())
    .order("date", { ascending: true });

  if (error) throw error;

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Group by date for chart
  const dailyData: Record<string, { income: number; expense: number }> = {};

  // Fill in all days in range to ensure no gaps
  const curr = new Date(startDate);
  while (curr <= now) {
    const dateStr = curr.toISOString().split("T")[0];
    dailyData[dateStr] = { income: 0, expense: 0 };
    curr.setDate(curr.getDate() + 1);
  }

  transactions.forEach((t) => {
    const dateStr = new Date(t.date).toISOString().split("T")[0];
    if (dailyData[dateStr]) {
      if (t.type === "income") dailyData[dateStr].income += t.amount;
      if (t.type === "expense") dailyData[dateStr].expense += t.amount;
    }
  });

  const chartData = Object.entries(dailyData).map(([date, values]) => ({
    date,
    ...values,
  }));

  // Categories distribution
  const categoryData: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const catName = (t.categories as any)?.name || "Uncategorized";
      categoryData[catName] = (categoryData[catName] || 0) + t.amount;
    });

  const categoryDistribution = Object.entries(categoryData).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    chartData,
    categoryDistribution,
  };
}
