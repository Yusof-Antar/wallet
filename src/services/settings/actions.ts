"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { Profile } from "@/types";

export async function getUserSettings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;

  // If profile doesn't exist yet, return a skeleton
  if (!data) {
    return {
      id: user.id,
      email: user.email,
      full_name:
        user.user_metadata?.full_name || user.email?.split("@")[0] || "",
      avatar_url: user.user_metadata?.avatar_url || null,
      currency: "USD",
    } as Profile;
  }

  return data as Profile;
}

export async function updateUserSettings(
  settings: Partial<Omit<Profile, "id" | "email" | "updated_at">>,
) {
  const supabase = await createClient();
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
