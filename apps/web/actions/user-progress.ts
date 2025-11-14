'use server'

import { auth, currentUser } from '@clerk/nextjs/server'

export const upsertUserProgress = async(courseId: number) => {
  const { userId } = await auth()

  const user = await currentUser()

  if (!userId || !user) {
    throw new Error('Unauthorized')
  }

  console.log(courseId)

  // TODO: サーバーから取得する
  // const course = await getCourceById(courseId)


 
}

