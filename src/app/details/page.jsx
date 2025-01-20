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
        <div className='box-border flex flex-col gap-[50px] py-[5%] nav-obscure-view'>
            <div className='box-border flex justify-center items-center w-full'>
                <div className='box-border bg-[#a8a8a80c] pl-[40px] border rounded-[10px] w-full detail-p'>
                    <section className='box-border rounded-2xl overflow-hidden detail detail-img-con'>
                        <img className='w-full h-full' src={detailPro?.img} alt={detailPro?.title} width={400} height={400} />
                    </section>
                    <section className='relative box-border flex flex-col justify-center items-center gap-2 ml-4 p-[30px] detail2'>
                        <h1 className='font-bold text-3xl nunitoextralight_italic detail2-title'>{detailPro?.title}</h1>
                        <p className='text-[30px] text-center nunitoextralight_italic detail2-des'>{detailPro?.content}</p>
                        <h1>
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                            <FaStar color='gold' className='inline' />
                        </h1>
                        <h1 className='font-[600] text-[20px] text-[gold]'>${detailPro?.price}</h1>
                        <div className='flex gap-5'>
                            <button className='hover:bg-[#9b1d1d] px-9 py-2 border rounded-[4px] font-[600] text-[15px] hover:text-white nunitoextralight_italic transition-all' onClick={() => { handleAddToCart(detailPro); }}>
                                <Qty productId={detailPro?._id} />
                                ADD TO CART</button>
                        </div>
                    </section>
                </div>
            </div>
            <h1 className='font-[600] text-[30px] text-center detail-arr-title'>YOU MAY ALSO LIKE</h1>
            <ul className='detail-arr'>
                {
                    api?.map((item, index) => {
                        return (
                            <li key={index} className='box-border border-[#c0c0c065] border-[1px] bg-[#c0c0c00c] py-[10px] detail-arr-i'>
                                <img className='detail-arr-img' src={item.img} alt={item.title} width={700} height={700} onClick={() => { handlePro(item); navigation.push(`/details?title=${item.title.toLowerCase()}`) }} />
                                <h1 className='font-[600] text-[14px] detail-arr-t'>{item.title}</h1>
                                {/* <p  className='h-[40px] text-[13px] text-center'>{item.content.slice(0,40)}</p> */}
                                <h1>
                                    <FaStar color='gold' className='inline' />
                                    <FaStar color='gold' className='inline' />
                                    <FaStar color='gold' className='inline' />
                                    <FaStar color='gold' className='inline' />
                                </h1>
                                <h1 className='font-[600] text-[#f1ce07] text-[15px]'>${item.price}</h1>
                                <button className='hover:bg-[#9b1d1d] px-9 py-2 qty-p-i border font-[500]rounded-[3px] text-[11px] hover:text-white nunitoextralight_italic detail-btn-arr' onClick={() => { handleAddToCart(item); }}>
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
