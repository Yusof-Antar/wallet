"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "./supabase";
import { Account, Transaction, ChecklistItem, Category } from "@/types";

/**
 * ACCOUNTS ACTIONS
 */

export async function getAccounts() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Account[];
}

export async function createAccount(
  account: Omit<Account, "id" | "created_at" | "user_id">,
) {
  const supabase = createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("accounts")
    .insert([{ ...account, user_id: user.id }])
    .select();

  if (error) throw error;
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
  return data[0];
}

/**
 * TRANSACTIONS ACTIONS
 */

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

/**
 * CHECKLIST ACTIONS
 */

export async function getChecklistItems() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("checklist_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as ChecklistItem[];
}

export async function toggleChecklistItem(id: string, is_completed: boolean) {
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from("checklist_items")
    .update({ is_completed })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/checklists");
}

export async function deleteChecklistItem(id: string) {
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from("checklist_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/checklists");
}

/**
 * CATEGORIES ACTIONS
 */

export async function getCategories() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data as Category[];
}
