"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getUserSettings } from "@/services/settings/actions";
import { Profile } from "@/types";

export function Header() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserSettings();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile for header:", error);
      }
    }
    fetchProfile();
  }, []);

  const getTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/accounts":
        return "My Accounts";
      case "/transactions":
        return "Transactions";
      case "/statistics":
        return "Analytics";
      case "/settings":
        return "Settings";
      case "/checklists":
        return "Checklists";
      default:
        return "Mony";
    }
  };

  const displayName = profile?.full_name || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border/40 bg-background/60 px-8 backdrop-blur-xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          {getTitle()}
        </h1>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
          Personal Finance
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-sm font-bold">{displayName}</span>
          <span className="text-[10px] text-emerald-500 font-black uppercase">
            Premium Plan
          </span>
        </div>
        <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-primary/20 ring-offset-2 transition-all hover:ring-primary/40">
          <AvatarImage
            src={profile?.avatar_url || "https://github.com/shadcn.png"}
          />
          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
