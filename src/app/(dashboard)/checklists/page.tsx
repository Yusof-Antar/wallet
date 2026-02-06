"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getChecklistItems,
  toggleChecklistItem,
  deleteChecklistItem,
} from "@/services/checklists/actions";
import { ChecklistItem } from "@/types";

export default function ChecklistsPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await getChecklistItems();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch checklist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleChecklistItem(id, !currentStatus);
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, is_completed: !currentStatus } : item,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteChecklistItem(id);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Planned Payments
          </h2>
          <p className="text-muted-foreground">
            Track your recurring expenses and bucket list
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={item.is_completed}
                  onCheckedChange={() =>
                    handleToggle(item.id, item.is_completed)
                  }
                />
                <div className="space-y-1">
                  <p
                    className={`font-medium leading-none ${item.is_completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.frequency}
                    </Badge>
                    <span className="text-xs text-muted-foreground capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">
                  {formatCurrency(item.price)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}

          {items.length === 0 && (
            <div className="py-20 text-center border rounded-xl border-dashed">
              <p className="text-muted-foreground text-sm">No items found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
