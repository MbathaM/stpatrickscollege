'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function GlobalError({
  // error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <html>
      <body className="h-svh w-full flex items-center justify-center">
        <div className={cn('text-center')}>
          <h1 className="text-[7rem] font-bold leading-tight">500</h1>
          <span className="font-medium">Oops! Something went wrong {`:')`}</span>
          <p className="text-muted-foreground">
            We apologize for the inconvenience. <br /> Please try again later.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Go Back
            </Button>
            <Button size="sm" onClick={() => router.push('/')}>
              Back to Home
            </Button>
            <Button size="sm" onClick={reset}>
              Try Again
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
