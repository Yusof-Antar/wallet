import { Account } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  Banknote,
  Landmark,
  PiggyBank,
  CreditCard,
  PenLine,
} from "lucide-react";
import { formatCurrency } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccountDialog } from "@/components/accounts/add-account-dialog";

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
  const Icon = iconMap[account.icon.toLowerCase()] || Wallet;

  return (
    <Card className="group relative overflow-hidden border border-border/50 transition-all hover:border-border hover:shadow-sm bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {account.name}
        </CardTitle>
        <div className="flex items-center gap-1">
          <AccountDialog account={account}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <PenLine className="h-3.5 w-3.5" />
            </Button>
          </AccountDialog>
          <div
            className="rounded-lg p-2"
            style={{ backgroundColor: `${account.color}10` }}
          >
            <Icon className="h-4 w-4" style={{ color: account.color }} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {formatCurrency(account.balance)}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Badge
            variant="secondary"
            className="rounded-md font-medium capitalize px-2 py-0 h-5 text-[10px]"
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
