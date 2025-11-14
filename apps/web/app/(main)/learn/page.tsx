import React from 'react'

import Header from './header'
import FeedWrapper from '../../../components/layout/FeedWrapper'
import StickyWrapper from '../../../components/layout/StickyWrapper'
import UserProgress from '../../../components/layout/UserProgress'


const LearnPage: React.FC = () => {
  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCource={{ title: 'English', imageSrc:'/english.png' }}
          hearts={5}
          points={100}
          hasActiveSubscription={false}
        />

      </StickyWrapper>
      <FeedWrapper>
        <Header title="English" />
        <div className="space-y-4">
          <div className="h-[700px] w-full"></div>
        </div>
      </FeedWrapper>
    </div>
  )
}

export default LearnPage
