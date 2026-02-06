"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { Category } from "@/types";

export async function getCategories() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (error) throw error;
  return data as Category[];
}

export async function createCategory(
  category: Omit<Category, "id" | "user_id">,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("categories")
    .insert([{ ...category, user_id: user.id }])
    .select();

  if (error) throw error;
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return data[0] as Category;
}
export async function updateCategory(
  id: string,
  category: Partial<Omit<Category, "id" | "user_id">>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error) throw error;
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  return data[0] as Category;
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
}
