import React from 'react'

import Image from 'next/image'

import { Button } from '../../components/ui/button'

const Footer = () => {
  return (
    <footer className="hidden h-20 w-full border-t-2 border-slate-200 p-2 lg:block">
      <div className="mx-auto flex h-full max-w-screen-lg items-center justify-evenly">
        <Button size="lg" variant="ghost" className="w-full">
          <Image src="" alt="Croation" height={32} width={40}/>
        </Button>
      </div>
    </footer>
  )
}

export default Footer
