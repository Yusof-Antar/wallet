"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { Transaction, Category } from "@/types";

export async function getTransactions(
  options: { timeframe?: string; limit?: number } = {},
) {
  const { timeframe = "all", limit = 100 } = options;
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select("*, categories(*)")
    .order("date", { ascending: false });

  if (timeframe !== "all") {
    const now = new Date();
    let startDate = new Date();
    if (timeframe === "week") startDate.setDate(now.getDate() - 7);
    else if (timeframe === "month") startDate.setMonth(now.getMonth() - 1);
    else if (timeframe === "year") startDate.setFullYear(now.getFullYear() - 1);

    query = query.gte("date", startDate.toISOString());
  }

  const { data, error } = await query.limit(limit);

  if (error) throw error;
  return data as (Transaction & { categories: Category })[];
}

export async function createTransaction(
  transaction: Omit<Transaction, "id" | "created_at" | "user_id">,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("transactions")
    .insert([{ ...transaction, user_id: user.id }])
    .select();

  if (error) throw error;

  // Update account balance
  const amountChange =
    transaction.type === "income" ? transaction.amount : -transaction.amount;

  const { error: balanceError } = await supabase.rpc("increment_balance", {
    account_id: transaction.account_id,
    amount_to_add: amountChange,
  });

  if (balanceError) {
    // If RPC is not set up, we do a manual update (less safe but works)
    await supabase
      .from("accounts")
      .select("balance")
      .eq("id", transaction.account_id)
      .single()
      .then(async ({ data: acc }) => {
        if (acc) {
          await supabase
            .from("accounts")
            .update({ balance: acc.balance + amountChange })
            .eq("id", transaction.account_id);
        }
      });
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
  return data[0];
}
export async function updateTransaction(
  id: string,
  transaction: Partial<Omit<Transaction, "id" | "created_at" | "user_id">>,
  oldTransaction: Transaction,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("transactions")
    .update(transaction)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  // Handle balance adjustment
  if (
    transaction.amount !== undefined ||
    transaction.type !== undefined ||
    transaction.account_id !== undefined
  ) {
    // 1. Revert old transaction
    const oldAmountChange =
      oldTransaction.type === "income"
        ? -oldTransaction.amount
        : oldTransaction.amount;
    await supabase.rpc("increment_balance", {
      account_id: oldTransaction.account_id,
      amount_to_add: oldAmountChange,
    });

    // 2. Apply new transaction
    const newAmount = transaction.amount ?? oldTransaction.amount;
    const newType = transaction.type ?? oldTransaction.type;
    const newAccountId = transaction.account_id ?? oldTransaction.account_id;
    const newAmountChange = newType === "income" ? newAmount : -newAmount;

    await supabase.rpc("increment_balance", {
      account_id: newAccountId,
      amount_to_add: newAmountChange,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/accounts");
  return data;
}
