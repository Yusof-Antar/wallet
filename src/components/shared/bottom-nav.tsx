"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  PieChart,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard",
      label: "Home",
      icon: LayoutDashboard,
    },
    {
      href: "/accounts",
      label: "Accounts",
      icon: Wallet,
    },
    {
      href: "/transactions",
      label: "Activity",
      icon: ArrowRightLeft,
    },
    {
      href: "/statistics",
      label: "Stats",
      icon: PieChart,
    },
    {
      href: "/settings",
      label: "More",
      icon: MoreHorizontal,
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex h-16 w-[90%] max-w-md items-center justify-around rounded-2xl border border-border/40 bg-background/80 backdrop-blur-xl px-4 shadow-2xl shadow-primary/10 md:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300",
              isActive
                ? "text-primary sc-110"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6 transition-transform duration-300",
                isActive && "scale-110",
              )}
            />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-widest">
              {label}
            </span>
            {isActive && (
              <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
