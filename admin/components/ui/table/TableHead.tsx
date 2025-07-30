import { cn } from "../../../lib/utils"

const TableHead = ({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  )
}

export default TableHead
