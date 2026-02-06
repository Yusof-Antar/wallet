"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase-client";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

interface AuthFormProps {
  type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      if (type === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        router.push("/dashboard");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${location.origin}/validated`,
            data: {
              full_name: values.email.split("@")[0], // Default name from email
            },
          },
        });
        if (error) throw error;

        // Initialize default data for new user
        if (data.user) {
          const userId = data.user.id;

          // 1. Create default accounts
          const defaultAccounts = [
            {
              name: "Main Bank",
              type: "bank",
              balance: 0,
              color: "#6366f1",
              icon: "landmark",
              is_included_in_balance: true,
              user_id: userId,
            },
            {
              name: "Cash Wallet",
              type: "cash",
              balance: 0,
              color: "#10b981",
              icon: "wallet",
              is_included_in_balance: true,
              user_id: userId,
            },
          ];

          await supabase.from("accounts").insert(defaultAccounts);

          // 2. Create default categories
          const defaultCategories = [
            {
              name: "Salary",
              type: "income",
              icon: "briefcase",
              color: "#10b981",
              user_id: userId,
            },
            {
              name: "Gifts",
              type: "income",
              icon: "gift",
              color: "#ec4899",
              user_id: userId,
            },
            {
              name: "Food",
              type: "expense",
              icon: "utensils",
              color: "#f97316",
              user_id: userId,
            },
            {
              name: "Transport",
              type: "expense",
              icon: "bus",
              color: "#3b82f6",
              user_id: userId,
            },
            {
              name: "Rent",
              type: "expense",
              icon: "home",
              color: "#8b5cf6",
              user_id: userId,
            },
            {
              name: "Entertainment",
              type: "expense",
              icon: "clapperboard",
              color: "#f43f5e",
              user_id: userId,
            },
            {
              name: "Health",
              type: "expense",
              icon: "heart",
              color: "#ef4444",
              user_id: userId,
            },
            {
              name: "Shopping",
              type: "expense",
              icon: "shopping-bag",
              color: "#f59e0b",
              user_id: userId,
            },
          ];

          await supabase.from("categories").insert(defaultCategories);
        }

        toast.success(
          "Account created! Please check your email for verification.",
        );
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      // Fallback for demo if no Supabase keys
      if (
        err.message?.includes("missing") ||
        err.message?.includes("configuration")
      ) {
        console.warn("Supabase not configured, proceeding as mock user");
        toast.info("Supabase not configured, using mock mode");
        router.push("/dashboard");
      } else {
        toast.error(err.message || "Authentication failed");
        setError(err.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {type === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
