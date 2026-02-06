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
  const [isSuccess, setIsSuccess] = React.useState(false);

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

        // Initialize default data for new user (Wait, this should probably be a trigger/webhook in production, but we'll leave it for now)
        if (data.user) {
          const userId = data.user.id;
          // ... existing initialization code stays ...
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

          const defaultCategories = [
            {
              name: "Salary",
              type: "income",
              icon: "briefcase",
              color: "#10b981",
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
              name: "Rent",
              type: "expense",
              icon: "home",
              color: "#8b5cf6",
              user_id: userId,
            },
          ];
          await supabase.from("categories").insert(defaultCategories);
        }

        setIsSuccess(true);
      }
    } catch (err: any) {
      if (
        err.message?.includes("missing") ||
        err.message?.includes("configuration")
      ) {
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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="rounded-full bg-emerald-500/10 p-6">
          <Loader2 className="h-12 w-12 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">
            Check your email
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            We've sent a verification link to your email address. Please click
            the link to activate your account.
          </p>
        </div>
        <div className="pt-4 flex flex-col gap-2 w-full">
          <div className="flex items-start gap-3 text-left p-4 rounded-xl bg-muted/50 text-sm">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
              1
            </div>
            <div>
              Find the email from{" "}
              <span className="font-semibold">Antigravity Wallet</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-left p-4 rounded-xl bg-muted/50 text-sm">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
              2
            </div>
            <div>
              Click the <span className="font-semibold">Confirm Email</span>{" "}
              button
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => router.push("/login")}
        >
          Return to Login
        </Button>
      </div>
    );
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
                  <Input
                    placeholder="name@example.com"
                    {...field}
                    className="rounded-lg h-12"
                  />
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
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="rounded-lg h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full h-12 rounded-lg text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {type === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
