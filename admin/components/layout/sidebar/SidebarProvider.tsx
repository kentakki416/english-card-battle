import React, { createContext, useContext, useEffect, useState } from "react"

import { useIsMobile } from "../../../hooks/use-mobile"

type SidebarContextType = {
  state: "expanded" | "collapsed"
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export const useSidebarContext = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

interface Props {
  children: React.ReactNode
  defaultOpen?: boolean
}

const SidebarProvider = ({children, defaultOpen = true}: Props) => {

  const [isOpen, setIsOpen] = useState(defaultOpen)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }, [isMobile])



  return (
    <SidebarContext.Provider value={{
      state: isOpen ? "expanded" : "collapsed",
      isOpen,
      setIsOpen,
      isMobile,
      toggleSidebar: () => setIsOpen(!isOpen)
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export default SidebarProvider
