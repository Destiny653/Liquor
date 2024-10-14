'use client'
import Image from 'next/image';
import React from 'react';
import { FaStar } from 'react-icons/fa'; 


const idItem = async (brand,id)=>{
    const res = await fetch(`http://localhost:3000/api/${brand}/${id}`)
    if (!res.ok) {
        console.log('faild to fetch data');
        
    }
    return await res.json()
}

export default async function Page({params}) {

    const {brand, id} = params;
    console.log(params);
    const data = await idItem(brand, id)

  return (
    <>
      <div className='w-full flex'>
                <div className='detail-p  w-full box-border'>
                    <section className='detail1 detail-img-con  box-border rounded-2xl overflow-hidden'>
                        <Image className='' src={data.img} alt={data.title} width={300} height={300} />
                    </section>
                    <section className='detail2 relative ml-4 flex flex-col gap-2 '>
                        <h1 className='text-3xl font-bold nunitoextralight_italic '>{data.title}</h1>
                        <p className='nunitoextralight_italic text-base'>{data.content}
                        </p>
                        <h1>
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                        </h1>
                        <h1 className='text-3xl text-orange-400 '>${data.price}</h1>
                        <div className='flex gap-5'>
                            <button className='px-9 py-2 bg-[#74610d] text-white text-base nunitoextralight_italic' onClick={() => {handleAddToCart(data); setIndexval(data)}}>ADD TO CART</button>
                        </div>
                    </section>
                </div>
            </div>
    </>
  )
}
