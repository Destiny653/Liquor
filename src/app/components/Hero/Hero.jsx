'use client'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import "./hero.css";
import { FaStar } from 'react-icons/fa';
import AOS from "aos";
import "aos/dist/aos.css";
import { SearchContext } from '../../../../context/SearchContext';
import { useRouter } from 'next/navigation';
import { CartContext } from '../../../../context/CartContext';
import SkeletonR, { SkeletonArr } from '../Skeleton/Skeleton';
import { Notyf } from 'notyf'; 
import Qty from '../Quantity/quantity';



export default function Hero() {
    const [data, setData] = useState(null)
    const { handlePro} = useContext(SearchContext)
    const { handleAddToCart } = useContext(CartContext)
    const navigation = useRouter();
    const [loader, setLoader] = useState(false)
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });



    useEffect(() => {

        AOS.init({
            duration: 500,

        });

        const notyf = new Notyf({
            duration: 4000,
            position: {
                x: 'right',
                y: 'top'
            }
        });

        const getData = async () => {
            setLoader(true)
            try {
                const res = await fetch(`/api/posts`)
                console.log(res)

                if (!res.ok) {
                    console.log('failed to fetch data');
                    notyf.error('Network error, please refresh your browser.');
                    setLoader(false)
                }

                setData(await res.json())
                setLoader(false)

            } catch (error) {
                console.log(error);
                setLoader(false)
            }
        }
        getData()
    }, [])

    // return localCartItems.reduce((acc, item) => item.brand === brand? acc + item.quantity : acc, 0);
 

    console.log(data); 
    const brand = 'posts'

    return (
        <div className='hero-gen-con'>
            <ul className='hero-list -[300px] overflow-hidden'>
                <li
                    data-aos="fade-right"
                    data-aos-offset="100"
                    data-aos-duration="1000"
                    className='h-[330px]'>
                    <Image className='hero-list-img' src="/images/Subscribe.png" alt="hero intro" width={300} height={300} />
                </li>
                <li className='h-[330px]'
                    data-aos="fade-down"
                    data-aos-offset="100"
                    data-aos-easing="linear"
                    data-aos-duration="1500"
                >
                    <Image className='hero-list-img' src="/images/new.png" alt="hero intro" width={300} height={300} />
                </li>
                <li className='h-[330px]'
                    data-aos="fade-up"
                    data-aos-offset="100"
                    data-aos-easing="linear"
                    data-aos-duration="1500"
                >
                    <Image className='hero-list-img scale-[0.9]' src="/images/gift_basket.png" alt="hero intro" width={300} height={300} />
                </li>
                <li className='h-[330px]'
                    data-aos="fade-left"
                    data-aos-offset="100"
                    data-aos-easing="linear"
                    data-aos-duration="1500"
                >
                    <Image className='hero-list-img' src="/images/img9.png" alt="hero intro" width={300} height={300} />
                </li>
            </ul>
            <section className='hero-list2-p box-border'>
                <h1 className='text-center hero-t'>SHOP BY SPIRIT</h1>
                <div>
                    {
                        loader ? <SkeletonR /> :
                            <ul className='hero-list2'>
                                {

                                    data?.slice(1, 13).map((item, index) => (
                                        <div key={item._id} >
                                            <li
                                                data-aos="flip-left"
                                                data-aos-offset="100"
                                                data-aos-easing="ease-out-cubic"
                                                data-aos-duration="1500" key={index}>
                                                <Image className='hero-list-img2' src={item.img} alt={item.title} width={300} height={300} onClick={() => { handlePro(item); navigation.push(`/details?title=${item.title.toLowerCase()}`) }} />
                                            </li>
                                            <h3 className='hero-list2-title text-center py-3'>{item.title.slice(0, 10)}</h3>
                                        </div>
                                    ))
                                }
                            </ul>
                    }
                </div>
            </section>
            <div className='hero-high-light text-white text-center'>
                <h3 className='text-2xl text-[#da9226]'>Personalize it!</h3>
                <h1 className='hero-high-light-h1 text-6xl'>CUSTOM ENGRAVING AVAILABLE</h1>
                <p>Choose from our Engraving Collection and add a special message to send a memorable gift!</p>
                <button onClick={()=>navigation.push('/shop')} className='border hero-btn border-white'>SHOP NOW</button>
            </div>
            <div className='hero-best-sellers-p'>
                <h1 className='hero-title'>BEST SELLERS</h1>
                <div className='top-rated-p w-full'>
                    <ul className='top-rated hero-gift'>
                        <li
                            className='relative'
                            data-aos="fade-left"
                            data-aos-easing="linear"
                            data-aos-duration="1500"
                        >
                            <Image className='hero-sell-img w-full' src="/images/bestsell1.jpg" alt='intro img' width={300} height={300} />
                        </li>
                        <li
                            data-aos="fade-down"
                            data-aos-duration="3000"
                        >
                            <Image className='hero-sell-img w-full' src="/images/bestsell2.jpg" alt='intro img' width={300} height={300} />
                        </li>
                        <li
                            data-aos="fade-right"
                            data-aos-easing="linear"
                            data-aos-duration="1500"
                        >
                            <Image className='hero-sell-img w-full' src="/images/bestsell3.jpg" alt='intro img' width={300} height={300} />
                        </li>
                    </ul>
                </div>
                <h1 className='hero-title'>RATED CONTENT</h1>
                {
                    loader ? <SkeletonArr /> :
                        <ul className='hero-arr'>
                            {
                                data?.slice(4, 16).map((item, index) => (
                                    <>
                                        <li key={index} className='hero-arr-i bg-[#c0c0c00c] border-[1px] border-[#c0c0c065] box-border py-[19px]'>
                                            <Image className='hero-arr-img' src={item.img} alt={item.title} width={500} height={500} onClick={() =>{ handlePro(item); navigation.push(`/details?title=${item.title.toLowerCase()}`) }} />
                                            <h1 className='text-[14.5px] font-[600] hero-arr-title'>{item.title}</h1>
                                            <p className='text-[13px] text-center h-[52px]'>{item.content}</p>
                                            <h1>
                                                <FaStar color='gold' className='inline' />
                                                <FaStar color='gold' className='inline' />
                                                <FaStar color='gold' className='inline' />
                                                <FaStar color='gold' className='inline' />
                                            </h1>
                                            <p>From </p>
                                            <h1 className='text-[15px] font-[600] text-[#f1ce07]'>{formatter.format(item.price)}</h1>
                                            <button className='hero-btn-arr qty-p-i px-9 py-2 hover:bg-[#9b1d1d] border hover:text-[#fff] text-[11px] font-[500] rounded-[3px] nunitoextralight_italic' onClick={() => { handleAddToCart(item); }}>
                                            <Qty productId={item._id}/>
                                            ADD TO CART</button>
                                        </li>
                                    </>
                                ))

                            }
                        </ul>
                }
            </div>
            <div className='hero-gift-p'>
                <ul className='hero-gift'>
                    <li className='bg-[]'
                        data-aos="zoom-in-left"
                        data-aos-duration="1500"
                    ><Image className='w-full hero-gift-img' src="/images/gift3.jpg" alt='gift images' width={700} height={700} /></li>
                    <li className='bg-[]'
                        data-aos="zoom-out-up"
                        data-aos-offset="100"
                        data-aos-duration="1500"
                        data-aos-easing="ease-in-sine"
                    ><Image className='w-full hero-gift-img' src="/images/gift1.jpg" alt='gift images' width={700} height={700} /></li>
                    <li className='bg-[]'
                        data-aos="zoom-in-right"
                        data-aos-easing="linear"
                        data-aos-offset="100"
                        data-aos-duration="1500"
                    ><Image className='w-full hero-gift-img' src="/images/gift2.jpg" alt='gift images' width={700} height={700} /></li>
                </ul>
            </div>

        </div>
    )
}
