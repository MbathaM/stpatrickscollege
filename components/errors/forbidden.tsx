'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Forbidden() {
  const router = useRouter()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>403</h1>
        <span className='font-medium'>Access Forbidden</span>
        <p className='text-center text-muted-foreground'>
          You don&apos;t have the necessary permission <br />
          to view this resource.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' size="sm" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button size="sm" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
