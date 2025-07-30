"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { cn } from "@/lib/utils"

import ChevronUpIcon from "../../icons/ChevronUpIcon"
import LogOutIcon from "../../icons/LogoutIcon"
import SettingsIcon from "../../icons/SettingsIcon"
import UserIcon from "../../icons/UserIcon"
import DropdownContent from "../../ui/dropdown/DropdownContent"
import DropdownProvider from "../../ui/dropdown/DropdownProvider"
import DropdownTrigger from "../../ui/dropdown/DropdownTrigger"


const UserInfo = () => {
  const [isOpen, setIsOpen] = useState(false)

  const USER = {
    name: "John Smith",
    email: "johnson@nextadmin.com",
    img: "/images/user/user-03.png",
  }

  return (
    <DropdownProvider isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <Image
            alt={`Avatar of ${USER.name}`}
            className="size-12"
            height={200}
            role="presentation"
            src={USER.img}
            width={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{USER.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        align="end"
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-70"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            alt={`Avatar for ${USER.name}`}
            className="size-12"
            height={200}
            role="presentation"
            src={USER.img}
            width={200}
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {USER.name}
            </div>

            <div className="leading-none text-gray-6">{USER.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            href={"/profile"}
            onClick={() => setIsOpen(false)}
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </DropdownProvider>
  )
}

export default UserInfo
