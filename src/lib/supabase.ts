import { createClient as createServerClient } from "./supabase-server";
import { createClient as createBrowserClient } from "./supabase-client";

// This file now acts as a proxy to avoid importing server-only code in client components
export const createSupabaseClient = () => {
  if (typeof window === "undefined") {
    // This will still fail if imported into a client component because the import itself
    // of supabase-server.ts will trigger the cookies() error.
    // Instead, we should use dynamic imports or just change the imports in the callers.
    throw new Error(
      "Use createClient from @/lib/supabase-server or @/lib/supabase-client directly",
    );
  }
  return createBrowserClient();
};

export const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};
