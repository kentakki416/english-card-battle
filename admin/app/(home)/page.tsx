import React, { Suspense } from "react"

import TopChannelsSkeleton from "../../components/ui/skeleton/TopChannelsSkeleton"
import { createTimeFrameExtractor } from "../../lib/timeframe-extractor"

import OverviewCardsGroup from "./_components/overview-cards/OverviewCardsGroup"
import OverviewCardsSkeleton from "./_components/overview-cards/OverviewCardsSkeleton"
import PaymentsOverview from "./_components/payments-overview/PaymentsOverview"
import TopChannels from "./_components/top-channels/TopChannels"
import UsedDevices from "./_components/used-devices/UsedDevices"
import WeeksProfit from "./_components/weeks-profit/WeeksProfit"

type HomeProps = {
  searchParams: Promise<{
    selected_time_frame: string
  }>
}

const Home = async({ searchParams }: HomeProps) => {
  const { selected_time_frame } = await searchParams
  console.log("searchParams", searchParams)
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame)

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <PaymentsOverview
          className="col-span-12 xl:col-span-7"
          key={extractTimeFrame("payments_overview")}
          timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
        />

        <WeeksProfit
          className="col-span-12 xl:col-span-5"
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
         />

        <UsedDevices
          className="col-span-12 xl:col-span-5"
          key={extractTimeFrame("used_devices")}
          timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
        />

        <div className="col-span-12 grid xl:col-span-7">
          <Suspense fallback={<TopChannelsSkeleton />}>
            <TopChannels />
          </Suspense>
        </div>

{/*
        <RegionLabels />

        <div className="col-span-12 grid xl:col-span-8">
          <Suspence fallback={<TopChannelsSkeleton />}>
            <TopChannels />
          </Suspence>
        </div>

        <Suspense fallback={null}>
          <ChartsCard />
        </Suspense> */}

      </div>
    </>
  )
}

export default Home
