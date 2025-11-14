'use client'

import { useRouter } from 'next/navigation';
import Card from './card'
import { useTransition } from 'react';

type Props = {
  activeCourseId: number
  courses: {id: number, imageSrc: string; title: string, }[]
}

const List = ({ courses, activeCourseId }: Props) => {

  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const onClick = (id: number) => {
    if (pending) return

    if (id === activeCourseId) {
      return router.push("/learn")
    }

    startTransition(() => {
      
    })
  }
  
  return (
    <div className="lg:grid-cols-[repeat(auto-fill,minmax(210px, 1fr))] grid grid-cols-2 gap-4 pt-6">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={() => {}}
          disabled={false}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  )
}

export default List
