'use client'

import React from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '../ui/button'

type SidebarItemProps = {
  href: string
  iconSrc: string
  label: string
}

const SidebarItem = ({ label, iconSrc, href }: SidebarItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Button
      variant={isActive ? 'sidebarOutline' : 'sidebar'}
      className="h-[52px] justify-start"
      asChild
    >
      <Link href={href}>
      <Image src={iconSrc} alt={label} width={32} height={32} className="mr-5" />
        {label}
      </Link>
    </Button>
  )
}

export default SidebarItem
