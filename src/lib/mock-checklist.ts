import { ChecklistItem } from "@/types";

export const MOCK_CHECKLIST: ChecklistItem[] = [
  {
    id: "cl1",
    user_id: "user_1",
    name: "New Laptop",
    price: 1500,
    category: "tech",
    frequency: "one-time",
    is_completed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "cl2",
    user_id: "user_1",
    name: "Monthly Rent",
    price: 1200,
    category: "rent",
    frequency: "monthly",
    is_completed: false,
    created_at: new Date().toISOString(),
  },
];
