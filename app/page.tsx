import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, CreditCard, Shield, Wallet } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary">
          <Wallet className="h-10 w-10 text-primary-foreground" />
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
          Mony
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Personal Finance Manager
        </p>

        <p className="mt-6 max-w-md text-balance text-muted-foreground">
          Track your expenses, manage multiple accounts, and achieve your financial goals with our simple and beautiful finance app.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 rounded-xl px-8">
            <Link href="/auth/sign-up">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-xl px-8 bg-transparent"
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>

        {/* Features */}
        <div className="mt-16 grid max-w-2xl gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Multi-Account</h3>
            <p className="text-sm text-muted-foreground">
              Manage all your accounts in one place
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Visualize your spending patterns
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Secure</h3>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted and safe
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        Built with Next.js and Supabase
      </footer>
    </div>
  )
}
