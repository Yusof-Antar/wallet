import { createClient } from "@supabase/supabase-js";

// This helper works for both Server Actions/Components and Client Components
// because it uses the standard supabase-js client.
// Note: In an ideal world we'd use @supabase/ssr, but sticking to basics for now.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Helper specific to formatting currency
export const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};
