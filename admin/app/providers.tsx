"use client"

import { ThemeProvider } from "next-themes"

import SidebarProvider from "@/components/layout/sidebar/SidebarProvider"

const Providers = ({children}: {children: React.ReactNode}) => {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  )
}

export default Providers
