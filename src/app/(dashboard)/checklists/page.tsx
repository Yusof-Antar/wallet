"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getChecklistItems,
  toggleChecklistItem,
  deleteChecklistItem,
  addChecklistItem,
} from "@/services/checklists/actions";
import { ChecklistItem } from "@/types";
import { toast } from "sonner";

import { ChecklistDialog } from "@/components/checklists/checklist-dialog";
import { PenLine } from "lucide-react";

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
      await toggleChecklistStatus(id, !currentStatus);
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, is_completed: !currentStatus } : item,
        ),
      );
      toast.success(currentStatus ? "Item unmarked" : "Item completed!");
    } catch (error) {
      toast.error("Failed to update item.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      setItems(items.filter((item) => item.id !== id));
      toast.success("Item deleted");
    } catch (error) {
      toast.error("Failed to delete item.");
    }
  };

  // Re-fetch items on success
  const onSuccess = () => {
    fetchItems();
  };

  // Alias actions for clarity
  const toggleChecklistStatus = toggleChecklistItem;
  const deleteItem = deleteChecklistItem;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Planned Payments
          </h2>
          <p className="text-muted-foreground">
            Manage your recurring expenses and subscriptions
          </p>
        </div>
        <ChecklistDialog onSuccess={onSuccess} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-4 border border-border/50 bg-card rounded-xl hover:border-border transition-colors"
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={item.is_completed}
                  onCheckedChange={() =>
                    handleToggle(item.id, item.is_completed)
                  }
                  className="rounded-md h-5 w-5"
                />
                <div className="space-y-0.5">
                  <p
                    className={cn(
                      "font-medium transition-all",
                      item.is_completed
                        ? "line-through text-muted-foreground/60"
                        : "text-foreground",
                    )}
                  >
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="px-1.5 py-0 h-4 text-[10px] font-medium rounded-md uppercase tracking-wider"
                    >
                      {item.frequency}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm mr-2">
                  {formatCurrency(item.price)}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChecklistDialog item={item} onSuccess={onSuccess}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <PenLine className="h-4 w-4" />
                    </Button>
                  </ChecklistDialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="py-20 text-center border border-dashed border-border/50 rounded-2xl">
              <p className="text-muted-foreground text-sm">
                No items planned yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
