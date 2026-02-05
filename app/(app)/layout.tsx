import React from "react"
import { BottomNav } from '@/components/bottom-nav'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-background pb-20">
      <main className="mx-auto max-w-lg">{children}</main>
      <BottomNav />
    </div>
  )
}
