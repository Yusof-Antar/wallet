import { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Register - Mony App",
  description: "Create an account",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col space-y-6 text-center">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <AuthForm type="register" />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="hover:text-brand underline underline-offset-4"
        >
          Already have an account? Sign In
        </Link>
      </p>
    </div>
  );
}
