'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { currencies } from '@/lib/currency'
import type { Profile } from '@/lib/types'
import { ChevronRight, LogOut, User } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile, signOut } from '@/app/(app)/settings/actions'
import { toast } from 'sonner'

interface SettingsClientProps {
  profile: Profile | null
  email: string | undefined
  displayName: string | null
}

export function SettingsClient({
  profile,
  email,
  displayName: initialDisplayName,
}: SettingsClientProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName || '')
  const [currency, setCurrency] = useState(profile?.currency || 'USD')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSave = () => {
    const formData = new FormData()
    formData.set('display_name', displayName)
    formData.set('currency', currency)

    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Settings saved')
        router.refresh()
      }
    })
  }

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
      router.push('/auth/login')
    })
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl bg-card p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-medium text-foreground">
              {displayName || 'User'}
            </p>
            <p className="truncate text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="flex flex-col gap-4 rounded-2xl bg-card p-4">
        <h2 className="font-semibold text-foreground">Profile</h2>

        <div className="grid gap-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            placeholder="Your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-12 rounded-xl"
          />
        </div>

        <div className="grid gap-2">
          <Label>Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} {c.code} - {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSave}
          className="h-12 rounded-xl"
          disabled={isPending}
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* App Info */}
      <div className="flex flex-col gap-2 rounded-2xl bg-card p-4">
        <h2 className="mb-2 font-semibold text-foreground">About</h2>

        <div className="flex items-center justify-between py-2">
          <span className="text-muted-foreground">Version</span>
          <span className="text-foreground">1.0.0</span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-muted-foreground">Built with</span>
          <span className="text-foreground">Next.js + Supabase</span>
        </div>
      </div>

      {/* Sign Out */}
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className="flex items-center gap-3 rounded-2xl bg-card p-4 text-destructive transition-colors hover:bg-destructive/10"
      >
        <LogOut className="h-5 w-5" />
        <span className="flex-1 text-left font-medium">Sign Out</span>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>
    </div>
  )
}
