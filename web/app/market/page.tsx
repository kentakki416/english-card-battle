import React from 'react'

import Image from 'next/image'

const MarketPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-[988px] flex-1 flex-col items-center 
    justify-center gap-2 p-4 lg:flex-row"
    >
      <div className="relative mb-8 size-[240px] lg:mb-0 lg:size-[424px]">
        <Image src="/assets/PNG/Square/snake.png" alt="logo" fill className="object-contain" />
      </div>
    </div>
  )
}

export default MarketPage
