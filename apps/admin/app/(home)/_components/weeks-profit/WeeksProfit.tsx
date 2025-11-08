import React from 'react'

import WeeksProfitChart from './WeeksProfitChart'
import PeriodPicker from '../../../../components/util/PeriodPicker'
import { cn } from '../../../../lib/utils'
import { getWeeksProfitData } from '../../fetch'


type WeeksProfitProps = {
  timeFrame?: string;
  className?: string;
}

const WeeksProfit = async ({timeFrame, className}: WeeksProfitProps) => {
  const data = await getWeeksProfitData(timeFrame)

  return (
    <div
      className={cn(
        'rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Profit {timeFrame || 'this week'}
        </h2>

        <PeriodPicker
          defaultValue={timeFrame || 'this week'}
          items={['this week', 'last week']}
          sectionKey="weeks_profit"
        />
      </div>

      <WeeksProfitChart data={data} />
    </div>
  )
}

export default WeeksProfit
