import { cn } from '../../../lib/utils'

const TableFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <tfoot
      className={cn(
        'border-t bg-neutral-100/50 font-medium dark:bg-neutral-800/50 [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  )
}

export default TableFooter
