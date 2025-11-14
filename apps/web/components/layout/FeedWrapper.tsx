import React from 'react'

type Props = {
  children: React.ReactNode
}

const FeedWrapper = ({ children }: Props) => {
  return (
    <div className="relative top-0 flex-1 pb-10">{children}</div>
  )
}

export default FeedWrapper
