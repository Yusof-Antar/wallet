"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { ChecklistItem } from "@/types";

export async function getChecklistItems() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("checklist_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as ChecklistItem[];
}

export async function toggleChecklistItem(id: string, is_completed: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("checklist_items")
    .update({ is_completed })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/checklists");
}

export async function deleteChecklistItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("checklist_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/checklists");
}

export async function addChecklistItem(
  item: Omit<ChecklistItem, "id" | "is_completed" | "created_at" | "user_id">,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("checklist_items")
    .insert([{ ...item, user_id: user.id }])
    .select();

  if (error) throw error;
  revalidatePath("/checklists");
  return data[0];
}
