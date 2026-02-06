"use client";

import { Account } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  Banknote,
  Landmark,
  PiggyBank,
  CreditCard,
} from "lucide-react";
import { formatCurrency } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, any> = {
  wallet: Wallet,
  cash: Banknote,
  bank: Landmark,
  savings: PiggyBank,
  other: CreditCard,
};

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  const Icon = iconMap[account.icon] || Wallet;

  return (
    <Card className="group overflow-hidden border-none shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-white/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          {account.name}
        </CardTitle>
        <div
          className="rounded-2xl p-3 shadow-inner transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${account.color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: account.color }} />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-3xl font-black tracking-tight text-foreground">
          {formatCurrency(account.balance)}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Badge
            variant="outline"
            className="rounded-lg font-bold capitalize bg-white/50 border-none px-3 py-1 text-xs"
          >
            {account.type}
          </Badge>
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: account.color }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
