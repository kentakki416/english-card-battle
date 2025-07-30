import React from "react"

import PeriodPicker from "../../../../components/util/PeriodPicker"
import { cn } from "../../../../lib/utils"
import { getDevicesUsedData } from "../../fetch"

import DonutChart from "./DonutChart"

type UsedDevicesProps = {
  className?: string
  timeFrame?: string
}

const UsedDevices = async({ className, timeFrame = "monthly" }: UsedDevicesProps) => {
  const data = await getDevicesUsedData(timeFrame)

  return (
    <div className={cn(
      "grid grid-cols-1 grid-rows-[auto_1fr] gap-9 rounded-[10px] \
        bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
      className
    )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Used Devices
        </h2>

        <PeriodPicker defaultValue={timeFrame} sectionKey="used_devices" />
       </div>

       <div className="grid place-items-center">
        <DonutChart data={data} />
       </div>
    </div>
  )
}

export default UsedDevices
