import React from 'react'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '../../../components/ui/button'

type Props = {
  title: string
}

const Header = ({ title }: Props) => {
  // TODO: サーバーからユーザー情報を取得

  
  return (
    <div className="sticky top-0 mb-5 flex items-center justify-between border-b-2 bg-white pb-3 text-neutral-400 lg:z-50 lg:mt-[-28px] lg:pt-[28px]">
      <Link href="/courses" className="hidden lg:block">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="size-5 stroke-2 text-neutral-400"/>
        </Button>
      </Link>
      <h1 className="text-lg font-bold">
        {title}
       </h1>
      <div />
    </div>
  )
}

export default Header
