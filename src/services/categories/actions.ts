"use server";

import { createSupabaseClient } from "@/lib/supabase";
import { Category } from "@/types";

export async function getCategories() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data as Category[];
}
