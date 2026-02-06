"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase";
import { ChecklistItem } from "@/types";

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
