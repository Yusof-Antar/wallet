"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAccount, updateAccount } from "@/services/accounts/actions";
import { toast } from "sonner";
import { Account } from "@/types";

const accountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["wallet", "bank", "cash", "savings", "other"]),
  balance: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Balance must be a number",
  }),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
  is_included_in_balance: z.boolean(),
});

interface AccountDialogProps {
  children?: React.ReactNode;
  account?: Account;
}

export function AccountDialog({ children, account }: AccountDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account?.name || "",
      type: account?.type || "bank",
      balance: account?.balance?.toString() || "0",
      color: account?.color || "#6366f1",
      icon: account?.icon || "Wallet",
      is_included_in_balance: account?.is_included_in_balance ?? true,
    },
  });

  async function onSubmit(values: z.infer<typeof accountSchema>) {
    try {
      if (account) {
        await updateAccount(account.id, {
          name: values.name,
          type: values.type,
          balance: Number(values.balance),
          color: values.color,
          icon: values.icon,
          is_included_in_balance: values.is_included_in_balance,
        });
        toast.success("Account updated successfully!");
      } else {
        await createAccount({
          name: values.name,
          type: values.type,
          balance: Number(values.balance),
          color: values.color,
          icon: values.icon,
          is_included_in_balance: values.is_included_in_balance,
        });
        toast.success("Account created successfully!");
      }
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        `Failed to ${account ? "update" : "create"} account. Please try again.`,
      );
      console.error(
        `Failed to ${account ? "update" : "create"} account:`,
        error,
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" className="rounded-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{account ? "Edit Account" : "Add Account"}</DialogTitle>
          <DialogDescription>
            {account
              ? "Update your account details."
              : "Create a new account to track your finances."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Main Savings" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bank">Bank Account</SelectItem>
                        <SelectItem value="wallet">Digital Wallet</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {account ? "Current Balance" : "Initial Balance"}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_included_in_balance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include in total balance</FormLabel>
                    <p className="text-[12px] text-muted-foreground">
                      This account's balance will be added to your total net
                      worth.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {account ? "Update Account" : "Create Account"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
