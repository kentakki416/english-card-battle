import React from 'react'

import ProductIcon from '../../../../components/icons/ProductIcon'
import ProfitIcon from '../../../../components/icons/ProfitIcon'
import UsersIcon from '../../../../components/icons/UsersIcon'
import ViewsIcon from '../../../../components/icons/ViewsIcon'
import { compactFormat } from '../../../../lib/format-number'
import { getOverviewData } from '../../fetch'

import OverviewCard from './OverviewCard'


const OverviewCardsGroup = async () => {
  const { views, profit, products, users } = await getOverviewData()

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        data={{
          ...views,
          value: compactFormat(views.value),
        }}
        Icon={ViewsIcon}
        label="Total Views"
      />

      <OverviewCard
        data={{
          ...profit,
          value: '$' + compactFormat(profit.value),
        }}
        Icon={ProfitIcon}
        label="Total Profit"
      />

      <OverviewCard
        data={{
          ...products,
          value: compactFormat(products.value),
        }}
        Icon={ProductIcon}
        label="Total Products"
      />

      <OverviewCard
        data={{
          ...users,
          value: compactFormat(users.value),
        }}
        Icon={UsersIcon}
        label="Total Users"
      />
    </div>
  )
}

export default OverviewCardsGroup
