import useClickOutside from "../../../hooks/use-click-outside"
import { cn } from "../../../lib/utils"

import { useDropdownContext } from "./DropdownProvider"

type DropdownContentProps = {
  align?: "start" | "end" | "center";
  className?: string;
  children: React.ReactNode;
}

const DropdownContent = ({
  children,
  align = "center",
  className,
}: DropdownContentProps) => {
  const { isOpen, handleClose } = useDropdownContext()

  const contentRef = useClickOutside<HTMLDivElement>(() => {
    if (isOpen) handleClose()
  })

  if (!isOpen) return null

  return (
    <div
      ref={contentRef}
      role="menu"
      aria-orientation="vertical"
      // eslint-disable-next-line
      className={cn(
        "fade-in-0 zoom-in-95 pointer-events-auto absolute z-99 mt-2 min-w-32 origin-top-right rounded-lg",
        {
          "animate-in right-0": align === "end",
          "left-0": align === "start",
          "left-1/2 -translate-x-1/2": align === "center",
        },
        className,
      )}
    >
      {children}
    </div>
  )
}

export default DropdownContent
