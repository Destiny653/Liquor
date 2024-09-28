import React from 'react'
import SkeletonR, { SkeletonArr } from '../components/Skeleton/Skeleton'

export default function page() {
  return (
    <div className='flex flex-col gap-[50px] box-border py-[40px]'>
      <section>
        <SkeletonR />
      </section>
      <section>
        <SkeletonArr />
      </section>
    </div>
  )
}
