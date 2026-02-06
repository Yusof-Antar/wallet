import { Account, Category, Transaction } from "@/types";

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: "1",
    user_id: "user_1",
    name: "Main Wallet",
    type: "wallet",
    balance: 1250.5,
    color: "#4f46e5", // Indigo
    icon: "wallet",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "user_1",
    name: "Savings",
    type: "savings",
    balance: 5000.0,
    color: "#10b981", // Emerald
    icon: "piggy-bank",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    user_id: "user_1",
    name: "Cash",
    type: "cash",
    balance: 150.0,
    color: "#f59e0b", // Amber
    icon: "banknote",
    created_at: new Date().toISOString(),
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    user_id: "user_1",
    account_id: "1",
    amount: 50.0,
    type: "expense",
    category_id: "cat_food",
    date: new Date().toISOString(),
    description: "Grocery Shopping",
    created_at: new Date().toISOString(),
  },
  {
    id: "t2",
    user_id: "user_1",
    account_id: "1",
    amount: 1200.0,
    type: "income",
    category_id: "cat_salary",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    description: "Salary",
    created_at: new Date().toISOString(),
  },
];
