'use client';
import React, { useContext } from 'react';
import { SearchContext } from '../../../context/SearchContext';
import { FaStar } from 'react-icons/fa';
import './details.css';
import Image from 'next/image';


export default function Page() {
    const { detailPro } = useContext(SearchContext)
    console.log(detailPro);
    return (
        <>
            <div className='w-full flex'>
                <div className='detail-p  w-full box-border'>
                    <section className='detail1 detail-img-con  box-border rounded-2xl overflow-hidden'>
                        <Image className='' src={detailPro.img} alt={detailPro.title} width={400} height={400} />
                    </section>
                    <section className='detail2 relative ml-4 flex flex-col gap-2 '>
                        <h1 className='text-3xl font-bold nunitoextralight_italic '>{detailPro.title}</h1>
                        <p className='nunitoextralight_italic text-base'>{detailPro.content}
                        </p>
                        <h1>
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                        </h1>
                        <h1 className='text-3xl text-orange-400 '>${detailPro.price}</h1>
                        <div className='flex gap-5'>
                            <button className='px-9 py-2 bg-[#74610d] text-white text-base nunitoextralight_italic' onClick={() => { handleAddToCart(data); setIndexval(data) }}>ADD TO CART</button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
