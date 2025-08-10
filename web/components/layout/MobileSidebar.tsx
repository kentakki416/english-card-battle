import React from 'react'

import { Menu } from 'lucide-react'

import Sidebar from './Sidebar'
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet'

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white" />
      </SheetTrigger>
      <SheetContent className="z-[100] p-0" side="left">
        <Sidebar></Sidebar>
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
