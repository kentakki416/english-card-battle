"use client"

import Image from "next/image"
import Link from "next/link"
import React from "react"

import SearchIcon from "../../icons/SearchIcon"
import { useSidebarContext } from "../sidebar/SidebarProvider"

import MenuIcon from "./MenuIcon"
import Notification from "./Notification"
import ThemeToggleSwitch from "./ThemeToggleSwitch"
import UserInfo from "./UserInfo"

const Header = () => {
  const { toggleSidebar, isMobile } = useSidebarContext()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <button
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
        onClick={toggleSidebar}
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {isMobile && (
        <Link className="ml-2 max-[430px]:hidden min-[375px]:ml-4" href={"/"}>
          <Image
            alt=""
            height={32}
            role="presentation"
            src={"/images/logo/logo-icon.svg"}
            width={32}
          />
        </Link>
      )}

      <div className="max-xl:hidden">
        <h1 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
          Dashboard
        </h1>
        <p className="font-medium">Next.js Admin Dashboard Solution</p>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <div className="relative w-full max-w-[300px]">
          <input
            className="flex w-full items-center gap-3.5 rounded-full border bg-gray-2 py-3 pl-[53px] pr-5 outline-none transition-colors focus-visible:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-dark-4 dark:hover:bg-dark-3 dark:hover:text-dark-6 dark:focus-visible:border-primary"
            placeholder="Search"
            type="search"
          />

          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 max-[1015px]:size-5" />
        </div>

        <ThemeToggleSwitch />

        <Notification />

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  )
}

export default Header
