'use client' 
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
      <div className='flex w-full'>
                <div className='box-border w-full detail-p'>
                    <section className='box-border rounded-2xl overflow-hidden detail-img-con detail1'>
                        <img className='' src={data.img} alt={data.title} width={300} height={300} />
                    </section>
                    <section className='relative flex flex-col gap-2 ml-4 detail2'>
                        <h1 className='font-bold text-3xl nunitoextralight_italic'>{data.title}</h1>
                        <p className='text-base nunitoextralight_italic'>{data.content}
                        </p>
                        <h1>
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                        </h1>
                        <h1 className='text-3xl text-orange-400'>${data.price}</h1>
                        <div className='flex gap-5'>
                            <button className='bg-[#74610d] px-9 py-2 text-base text-white nunitoextralight_italic' onClick={() => {handleAddToCart(data); setIndexval(data)}}>ADD TO CART</button>
                        </div>
                    </section>
                </div>
            </div>
    </>
  )
}
