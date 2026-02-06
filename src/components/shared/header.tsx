"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getUserSettings } from "@/services/settings/actions";
import { Profile } from "@/types";

import { ThemeToggle } from "@/components/theme-toggle";

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
        return "Overview";
      case "/accounts":
        return "Accounts";
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
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-background/50 px-6 backdrop-blur-xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {getTitle()}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-sm font-medium">{displayName}</span>
        </div>
        <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-border transition-all hover:ring-primary/40">
          <AvatarImage
            src={profile?.avatar_url || "https://github.com/shadcn.png"}
          />
          <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
