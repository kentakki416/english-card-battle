import Table from '../table/Table'
import TableBody from '../table/TableBody'
import TableCell from '../table/TableCell'
import TableHead from '../table/TableHead'
import TableHeader from '../table/TableHeader'
import TableRow from '../table/TableRow'

import Skeleton from './Skeleton'

const TopChannelsSkeleton = () => {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h2 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
        Top Channels
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="!text-left">Source</TableHead>
            <TableHead>Visitors</TableHead>
            <TableHead className="!text-right">Revenues</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead>Conversion</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={100}>
                <Skeleton className="h-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default TopChannelsSkeleton
