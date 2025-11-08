import { cn } from '../../../lib/utils'

const TableHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return <thead className={cn('[&_tr]:border-b', className)} {...props} />
}

export default TableHeader
