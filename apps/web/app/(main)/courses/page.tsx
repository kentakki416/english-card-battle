import React from 'react'

import List from './list'

// TODO: サーバーから取得するように変更する
const getCources = () => {
  return [
    {id: 1, title: 'English', imageSrc: '/english.png'},
    {id: 2, title: 'Spanish', imageSrc: '/spanish.png'},
    {id: 3, title: 'German', imageSrc: '/german.png'},
    {id: 4, title: 'Japanese', imageSrc: '/japan.png'},
  ]
}

const getUserData = () => {
  return {
    activeCourseId: 1,
  }

}

const CouresesPage = () => {
  const data = getCources()
  const user = getUserData()
  return (
    <div className="mx-auto h-full max-w-[912px] px-3">
      <h1 className="text-2xl font-bold text-neutral-700">
        Language Courses
      </h1>

      <List
        courses={data}
        activeCourseId={user.activeCourseId}
      >

      </List>
    </div>
  )
}


export default CouresesPage
