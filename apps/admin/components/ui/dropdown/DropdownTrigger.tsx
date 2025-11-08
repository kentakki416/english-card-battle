import { useDropdownContext } from './DropdownProvider'

type DropdownTriggerProps = React.HTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const DropdownTrigger = ({ children, className }: DropdownTriggerProps) => {
  const { handleOpen, isOpen } = useDropdownContext()

  return (
    <button
      aria-expanded={isOpen}
      aria-haspopup="menu"
      className={className}
      data-state={isOpen ? 'open' : 'closed'}
      onClick={handleOpen}
    >
      {children}
    </button>
  )
}

export default DropdownTrigger
