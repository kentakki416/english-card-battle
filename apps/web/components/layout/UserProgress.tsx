import React from 'react'

import { InfinityIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '../ui/button'

type Props = {
  activeCource: { imageSrc: string, title: string }
  hasActiveSubscription: boolean
  hearts: number
  points: number
}

const UserProgress = ({ activeCource, hearts, points, hasActiveSubscription }: Props) => {
  return (
    <div className="flex w-full items-center justify-between gap-x-2">
      <Link href="/courses">
        <Button variant="ghost">
          <Image
            src={activeCource.imageSrc}
            alt={activeCource.title}
            className="boder rounded-md"
            width={32}
            height={32}
          />
        </Button>
      </Link>

      <Link href="/shop">
        <Button variant="ghost" className="text-orange-500">
          <Image src="/point.png" height={28} width={28} alt="Point" className="mr-2" />
          {points}
        </Button>
      </Link>

      <Link href="/shop">
      <Button variant="ghost" className="text-rose-500">
        <Image src="/heart.png" height={28} width={28} alt="Heart" className="mr-2" />
        {hasActiveSubscription
          ? <InfinityIcon className="size-4 stroke-[3]"/> 
          : hearts
          }
      </Button>
      </Link>
      
    </div>
      
  )
}

export default UserProgress
