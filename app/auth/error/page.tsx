import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Wallet } from 'lucide-react'
import Link from 'next/link'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {params?.error ? (
              <p className="text-sm text-muted-foreground">
                Error: {params.error}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                An unexpected error occurred. Please try again.
              </p>
            )}
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
