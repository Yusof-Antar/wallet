"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase";
import { Transaction, Category } from "@/types";

export async function getTransactions(limit = 10) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(*)")
    .order("date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as (Transaction & { categories: Category })[];
}

export async function createTransaction(
  transaction: Omit<Transaction, "id" | "created_at" | "user_id">,
) {
  const supabase = createSupabaseClient();
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
