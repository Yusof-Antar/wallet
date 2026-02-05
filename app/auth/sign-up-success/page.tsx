import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Wallet } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Wallet className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>

        <Card className="rounded-2xl border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription>
              We sent you a confirmation link to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Click the link in the email to activate your account and start tracking your finances.
            </p>
            <Link
              href="/auth/login"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
