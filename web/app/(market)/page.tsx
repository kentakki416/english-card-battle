import React from 'react'

import { ClerkLoaded, ClerkLoading, SignedOut, SignedIn, SignUpButton, SignInButton } from '@clerk/nextjs'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '../../components/ui/button'


const MarketPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-[988px] flex-1 flex-col items-center 
      justify-center gap-2 p-4 lg:flex-row"
    >
      <div className="relative mb-8 size-[240px] lg:mb-0 lg:size-[424px]">
        <Image src="/duolingo-main.jpg" alt="logo" fill/>
      </div>
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="lg:txt-3xl max-w-[480px] text-center text-xl font-bold text-neutral-600">
          Learn, practice, and master new languages with Lingo
        </h1>
        <div className="flex w-full max-w-[330px] flex-col items-center gap-y-3">
          <ClerkLoading>
            <Loader className="size-5 animate-spin text-muted-foreground"/>
          </ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
              <SignUpButton mode="modal" signInFallbackRedirectUrl="/learn">
                <Button size="lg" variant="secondary" className="w-full"> Get Started</Button>
              </SignUpButton>

              <SignInButton mode="modal" fallbackRedirectUrl="/learn">
                <Button size="lg" variant="primaryOutline" className="w-full"> I already have an account</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                <Link href="/learn">
                Contiune Learning
                </Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  )
}

export default MarketPage
