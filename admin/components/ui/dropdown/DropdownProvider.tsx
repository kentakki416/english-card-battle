import { createContext, useContext, useEffect, useRef } from "react"

type DropdownContextType = {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

const DropdownContext = createContext<DropdownContextType | null> (null)

export const useDropdownContext = () => {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error("useDropdownContext must be used within a DropdownProvider")
  }
  return context
}

type DropdownProviderProps = {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const DropdownProvider = ({ children, isOpen, setIsOpen }: DropdownProviderProps) => {
  const triggerRef = useRef<HTMLElement>(null)

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }


  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement

      document.body.style.pointerEvents = "none"
    } else {
      document.body.style.removeProperty("pointer-events")

      setTimeout(() => {
        triggerRef.current?.focus()
      }, 0)
    }
  }, [isOpen])

  return (
    <DropdownContext.Provider value={{ isOpen, handleOpen, handleClose }}>
      <div className="relative" onKeyDown={handleKeyDown}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export default DropdownProvider
