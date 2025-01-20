'use client';
import React, { useContext, useEffect } from 'react';
import { SearchContext } from '../../../context/SearchContext';
import { FaStar } from 'react-icons/fa';
import './details.css';
import Image from 'next/image';
import { CartContext } from '../../../context/CartContext';
import { useRouter } from 'next/navigation';
import Qty from '../components/Quantity/quantity';


export default function Page() {
    const { detailPro, detailArr, api, handlePro } = useContext(SearchContext)
    console.log(api)
    const { handleAddToCart } = useContext(CartContext)
    const navigation = useRouter();
    console.log(detailPro);
    console.log(detailArr);
    // useEffect( async()=>{

    //     return;
    // },[setData])
    return (
        <div className='flex gap-[50px] flex-col box-border py-[5%] nav-obscure-view'>
            <div className='w-full flex items-center justify-center box-border'>
                <div className='detail-p  w-full box-border pl-[40px] bg-[#a8a8a80c] border rounded-[10px]'>
                    <section className='detail detail-img-con  box-border rounded-2xl overflow-hidden'>
                        <Image className='h-full w-full ' src={detailPro?.img} alt={detailPro?.title} width={400} height={400} />
                    </section>
                    <section className='detail2 relative ml-4 flex flex-col justify-center items-center gap-2 box-border p-[30px] '>
                        <h1 className='detail2-title text-3xl font-bold nunitoextralight_italic '>{detailPro?.title}</h1>
                        <p className='detail2-des nunitoextralight_italic text-[30px] text-center'>{detailPro?.content}</p>
                        <h1>
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                        </h1>
                        <h1 className='text-[20px] text-[gold] font-[600] '>${detailPro?.price}</h1>
                        <div className='flex gap-5'>
                            <button className='px-9 py-2 hover:bg-[#9b1d1d] hover:text-white text-[15px] border  transition-all font-[600] rounded-[4px] nunitoextralight_italic' onClick={() => { handleAddToCart(detailPro); }}>
                                <Qty productId={detailPro?._id} />
                                ADD TO CART</button>
                        </div>
                    </section>
                </div>
            </div>
            <h1 className='detail-arr-title text-center text-[30px] font-[600]'>YOU MAY ALSO LIKE</h1>
            <ul className='detail-arr'>
                {
                    api?.map((item, index) => {
                        return (
                            <li key={index} className='detail-arr-i bg-[#c0c0c00c] border-[1px] border-[#c0c0c065] box-border py-[10px]'>
                                <Image className='detail-arr-img' src={item.img} alt={item.title} width={700} height={700} onClick={() => { handlePro(item); navigation.push(`/details?title=${item.title.toLowerCase()}`) }} />
                                <h1 className='detail-arr-t text-[14px] font-[600]'>{item.title}</h1>
                                {/* <p  className='text-[13px] text-center h-[40px]'>{item.content.slice(0,40)}</p> */}
                                <h1>
                                    <FaStar color='gold' className='inline' />
                                    <FaStar color='gold' className='inline' />
                                    <FaStar color='gold' className='inline' />
                                    <FaStar color='gold' className='inline' />
                                </h1>
                                <h1 className='text-[15px] font-[600] text-[#f1ce07]'>${item.price}</h1>
                                <button className='detail-btn-arr qty-p-i px-9 py-2 hover:bg-[#9b1d1d] border hover:text-white text-[11px] font-[500]rounded-[3px] nunitoextralight_italic' onClick={() => { handleAddToCart(item); }}>
                                    <Qty productId={item._id} />
                                    ADD TO CART</button>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}
