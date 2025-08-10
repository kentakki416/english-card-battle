import React from 'react'

import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import SidebarItem from './SidebarItem'
import { cn } from '../../lib/utils'

type SidebarProps = {
  className?: string
}

const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div className={cn(
      'left-0 top-0 flex min-h-screen flex-col border-2 px-4 lg:fixed lg:w-[256px] lg:border-none', 
      className)}
    >
      <Link href="/learn">
      <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
        <Image src="/duolingo-icon.png" alt="logo" width={40} height={40} />
        <h1 className="text-2xl font-extrabold tracking-wide text-green-600">English Card Battle</h1>
      </div>
      </Link>
      <div className="flex flex-1 flex-col gap-y-2">
        <SidebarItem label="Learn" iconSrc="/book.png" href="/learn" />
        <SidebarItem label="LeaderBoard" iconSrc="/leaderboard.jpg" href="/leaderboard" />
        <SidebarItem label="Quest" iconSrc="/quest.jpeg" href="/quest" />
        <SidebarItem label="Shop" iconSrc="/shop.png" href="/shop" />
      </div>
      <div className="p-4">
        <ClerkLoading>
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSwitchSessionUrl="/"/>
        </ClerkLoaded>
      </div>
    </div>
  )
}

export default Sidebar
