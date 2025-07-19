import { useDropdownContext } from "./DropdownProvider"

type DropdownTriggerProps = React.HTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const DropdownTrigger = ({ children, className }: DropdownTriggerProps) => {
  const { handleOpen, isOpen } = useDropdownContext()

  return (
    <button
      className={className}
      onClick={handleOpen}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      data-state={isOpen ? "open" : "closed"}
    >
      {children}
    </button>
  )
}

export default DropdownTrigger
