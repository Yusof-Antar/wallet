import { AccountCard } from "@/components/dashboard/account-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getAccounts } from "@/services/accounts/actions";
import { AddAccountDialog } from "@/components/accounts/add-account-dialog";

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
          <p className="text-muted-foreground">
            Manage your wallets and bank accounts
          </p>
        </div>
        <AddAccountDialog />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}

        {/* Add Account Card (Visual) */}
        <AddAccountDialog>
          <button className="flex h-full min-h-[140px] w-full flex-col items-center justify-center rounded-xl border border-dashed hover:bg-muted/50 transition-colors">
            <div className="rounded-full bg-primary/10 p-4 mb-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <span className="font-medium text-muted-foreground">
              Add New Account
            </span>
          </button>
        </AddAccountDialog>
      </div>
    </div>
  );
}
