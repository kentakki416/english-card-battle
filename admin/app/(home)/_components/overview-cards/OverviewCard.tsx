import React, { SVGProps } from "react"

import ArrowDownIcon from "../../../../components/icons/ArrowDownIcon"
import ArrowUpIcon from "../../../../components/icons/ArrowUpIcon"
import { cn } from "../../../../lib/utils"

type OverviewCardProps = {
  label: string
  data: {
    value: string
    growthRate: number
  }
  Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element
}

const OverviewCard = ({ label, data, Icon }: OverviewCardProps) => {
  const isDecreasing = data.growthRate < 0

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <Icon />

      <div className="mt-6 flex items-end justify-between">
        <dl>
          <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            {data.value}
          </dt>

          <dd className="text-sm font-medium text-dark-6">{label}</dd>
        </dl>

        <dl
          className={cn(
            "text-sm font-medium",
            isDecreasing ? "text-red" : "text-green",
          )}
        >
          <dt className="flex items-center gap-1.5">
            {data.growthRate}%
            {isDecreasing ? (
              <ArrowDownIcon aria-hidden />
            ) : (
              <ArrowUpIcon aria-hidden />
            )}
          </dt>

          <dd className="sr-only">
            {label} {isDecreasing ? "Decreased" : "Increased"} by{" "}
            {data.growthRate}%
          </dd>
        </dl>
      </div>
    </div>
  )
}

export default OverviewCard
