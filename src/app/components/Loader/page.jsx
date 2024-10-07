import React from 'react' 
import SkeletonR, { SkeletonArr, SkeletonArr2 } from '../Skeleton/Skeleton'

export default function page() {
  return (
    <div className='flex flex-col gap-[50px] box-border py-[40px]'>
      <section>
        <SkeletonR />
      </section>
      <section>
        <SkeletonArr />
      </section>
      <section>
        <SkeletonArr2 />
      </section>
    </div>
  )
}
