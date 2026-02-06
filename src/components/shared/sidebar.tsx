"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  PieChart,
  Settings,
  LogOut,
  ListTodo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Wallet, label: "Accounts", href: "/accounts" },
  { icon: ArrowRightLeft, label: "Transactions", href: "/transactions" },
  { icon: ListTodo, label: "Checklists", href: "/checklists" },
  { icon: PieChart, label: "Statistics", href: "/statistics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-background/80 backdrop-blur-xl md:flex fixed left-0 top-0 z-50">
      <div className="flex h-16 items-center px-6 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-foreground">
            Mony
          </h1>
        </div>
      </div>
      <nav className="flex-1 space-y-1.5 p-4 mt-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "bg-linear-to-r from-primary/10 to-transparent text-primary shadow-xs border-l-4 border-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mt-auto border-t border-border/40">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 rounded-xl py-6 text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-semibold transition-all"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
