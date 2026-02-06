export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  currency: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: "wallet" | "bank" | "cash" | "savings" | "other";
  balance: number;
  color: string;
  icon: string;
  is_included_in_balance: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  user_id?: string; // null for default categories
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  amount: number;
  type: "income" | "expense" | "transfer";
  category_id: string;
  date: string;
  description: string | null;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  user_id: string;
  name: string;
  price: number;
  category: string;
  frequency: "one-time" | "daily" | "weekly" | "monthly";
  is_completed: boolean;
  created_at: string;
}
