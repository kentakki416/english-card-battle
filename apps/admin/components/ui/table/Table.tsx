import { cn } from '../../../lib/utils'

const Table = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>)  => {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
}
export default Table
