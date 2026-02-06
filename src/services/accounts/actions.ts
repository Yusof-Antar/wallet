"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { Account } from "@/types";

export async function getAccounts() {
  const supabase = await createClient();
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
  const supabase = await createClient();
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
