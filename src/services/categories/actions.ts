"use server";

import { createClient } from "@/lib/supabase-server";
import { Category } from "@/types";

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data as Category[];
}
