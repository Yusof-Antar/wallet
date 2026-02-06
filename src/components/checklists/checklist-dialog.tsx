"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, PenLine } from "lucide-react";
import {
  addChecklistItem,
  updateChecklistItem,
} from "@/services/checklists/actions";
import { ChecklistItem } from "@/types";
import { toast } from "sonner";

interface ChecklistDialogProps {
  children?: React.ReactNode;
  item?: ChecklistItem;
  onSuccess?: () => void;
}

export function ChecklistDialog({
  children,
  item,
  onSuccess,
}: ChecklistDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || "",
    price: item?.price.toString() || "",
    category: item?.category || "",
    frequency: (item?.frequency || "monthly") as ChecklistItem["frequency"],
  });

  useEffect(() => {
    if (open && item) {
      setFormData({
        name: item.name,
        price: item.price.toString(),
        category: item.category,
        frequency: item.frequency,
      });
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (item) {
        await updateChecklistItem(item.id, {
          name: formData.name,
          price: parseFloat(formData.price),
          category: formData.category,
          frequency: formData.frequency,
        });
        toast.success("Item updated!");
      } else {
        await addChecklistItem({
          name: formData.name,
          price: parseFloat(formData.price),
          category: formData.category,
          frequency: formData.frequency,
        });
        toast.success("Item added!");
      }
      setOpen(false);
      if (onSuccess) onSuccess();
      if (!item) {
        setFormData({
          name: "",
          price: "",
          category: "",
          frequency: "monthly",
        });
      }
    } catch (error) {
      toast.error(`Failed to ${item ? "update" : "add"} item.`);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" className="rounded-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add Checklist Item"}</DialogTitle>
          <DialogDescription>
            {item
              ? "Update item details."
              : "Add a new recurring expense or planned payment."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Netflix Subscription"
              required
              className="rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
                required
                className="rounded-lg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value: ChecklistItem["frequency"]) =>
                  setFormData({ ...formData, frequency: value })
                }
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="e.g. Entertainment"
              required
              className="rounded-lg"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-lg"
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {item ? "Update Item" : "Add Item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
