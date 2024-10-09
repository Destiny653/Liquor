import React from 'react'
import './Skeleton.css';

export default function SkeletonR() {
    return (
            <section className='skeleton-r-p'>
                <div cla className='ske-r1 flex flex-col items-center gap-[11px]'>
                    <div className="skeleton-r "></div>
                    <p className='skeleton-prg'></p>
                </div>
                <div className='flex flex-col items-center gap-[11px]'>
                    <div className="skeleton-r "></div>
                    <p className='skeleton-prg'></p>
                </div>
                <div className='flex flex-col items-center gap-[11px]'>
                    <div className="skeleton-r "></div>
                    <p className='skeleton-prg'></p>
                </div>
                <div className='flex flex-col items-center gap-[11px]'>
                    <div className="skeleton-r "></div>
                    <p className='skeleton-prg'></p>
                </div>
                <div className='flex flex-col items-center gap-[11px]'>
                    <div className="skeleton-r "></div>
                    <p className='skeleton-prg'></p>
                </div>
                <div className='flex flex-col items-center gap-[11px]'>
                    <div className="skeleton-r "></div>
                    <p className='skeleton-prg'></p>
                </div>
                <div className='flex flex-col items-center gap-[11px]'>
                    <div className="skeleton-r "></div>
                    <p className='skeleton-prg'></p>
                </div>
                <div className='flex flex-col items-center gap-[11px]'>
                    <div className="skeleton-r "></div>
                    <p className='skeleton-prg'></p>
                </div>
                <div className='flex flex-col items-center gap-[11px]'>
                    <div className="skeleton-r "></div>
                    <p className='skeleton-prg'></p>
                </div>
                <div className='flex flex-col items-center gap-[11px]'>
                    <div className="skeleton-r "></div>
                    <p className='skeleton-prg'></p>
                </div>
            </section>
    )
}

export function SkeletonArr(){
    return(
        <section className='skeleton-arr-p'>
             <div className="skeleton-arr"></div>
             <div className="skeleton-arr"></div>
             <div className="skeleton-arr"></div>
             <div className="skeleton-arr"></div>
             <div className="skeleton-arr"></div>
             <div className="skeleton-arr"></div>
             <div className="skeleton-arr"></div>
             <div className="skeleton-arr"></div>
             <div className="skeleton-arr"></div>
             <div className="skeleton-arr"></div>
             <div className="skeleton-arr"></div>
             <div className="skeleton-arr"></div>
        </section>
    )
}
export function SkeletonArr2(){
    return(
        <>
             <div className="skeleton-arr2"></div>
             <div className="skeleton-arr2"></div>
             <div className="skeleton-arr2"></div>
             <div className="skeleton-arr2"></div>
             <div className="skeleton-arr2"></div>
             <div className="skeleton-arr2"></div>
             <div className="skeleton-arr2"></div>
             <div className="skeleton-arr2"></div> 
        </>
    )
}
 
export const Load = () => {
    return (
        <div className='loader-p h-[100%] w-full z-10 bg-[#c6c5ec65] fixed top-0'>
            <div className="loader-con">
                <section className='loader-i'></section>
            </div>
        </div>
    )
}

