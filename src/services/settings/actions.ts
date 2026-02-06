"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase";
import { Profile } from "@/types";

export async function getUserSettings() {
  const supabase = createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateUserSettings(
  settings: Partial<Omit<Profile, "id" | "email" | "updated_at">>,
) {
  const supabase = createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select();

  if (error) throw error;
  revalidatePath("/settings");
  return data[0] as Profile;
}
