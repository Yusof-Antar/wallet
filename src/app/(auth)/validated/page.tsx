"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ValidatedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <Card className="max-w-md w-full border-none shadow-2xl bg-background/80 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">
            Email Verified!
          </CardTitle>
          <CardDescription className="text-base font-medium text-muted-foreground mt-2">
            Your account has been successfully validated. You can now access all
            features of Mony.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Link href="/login" className="w-full">
            <Button className="w-full h-12 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
              Continue to Login
            </Button>
          </Link>
          <p className="text-center text-xs text-muted-foreground mt-6 font-medium uppercase tracking-widest">
            Welcome to the premium experience
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
