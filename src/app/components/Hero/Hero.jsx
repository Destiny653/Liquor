'use client'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import "./hero.css"
import { FaStar } from 'react-icons/fa';
import AOS from "aos";
import "aos/dist/aos.css";
import { SearchContext } from '../../../../context/SearchContext';
import { useRouter } from 'next/navigation';

export default function Hero() {
    const [data, setData] = useState([])
    const {handlePro} = useContext(SearchContext)
    const navigation = useRouter()


    useEffect(() => {

        AOS.init({
            duration: 500,
        });

        const getData = async () => {

            try {
                const res = await fetch(`http://localhost:3000/api/posts`)

                if (!res.ok) {
                    console.log('failed to fetch data');
                }

                setData(await res.json())

            } catch (error) {
                console.log(error);
            }
        }
        getData()
    }, [])

    console.log(data);
    const brand = 'posts'

    return (
        <div className=''>
            <ul className='heroList -[300px] overflow-hidden'>
                <li
                    data-aos="fade-right"
                    data-aos-offset="100"
                    data-aos-duration="1000"
                    className='h-[330px]'>
                    <Image className='heroListImg' src="/images/Subscribe.png" alt="hero intro" width={300} height={300} />
                </li>
                <li className='h-[330px]'
                    data-aos="fade-down"
                    data-aos-offset="100"
                    data-aos-easing="linear"
                    data-aos-duration="1500"
                >
                    <Image className='heroListImg' src="/images/Bundle_save.png" alt="hero intro" width={300} height={300} />
                </li>
                <li className='h-[330px]'
                    data-aos="fade-up"
                    data-aos-offset="100"
                    data-aos-easing="linear"
                    data-aos-duration="1500"
                >
                    <Image className='heroListImg scale-[0.9]' src="/images/gift_basket.png" alt="hero intro" width={300} height={300} />
                </li>
                <li className='h-[330px]'
                    data-aos="fade-left"
                    data-aos-offset="100"
                    data-aos-easing="linear"
                    data-aos-duration="1500"
                >
                    <Image className='heroListImg' src="/images/img9.png" alt="hero intro" width={300} height={300} />
                </li>
            </ul>
            <section className='heroList2-p box-border'>
                <h1 className='text-center hero-title'>SHOP BY SPIRIT</h1>
                <div>
                    <ul className='heroList2'>
                        {
                            data?.slice(1, 13).map((item, index) => (
                                <div>
                                    <li
                                        data-aos="flip-left"
                                        data-aos-offset="100"
                                        data-aos-easing="ease-out-cubic"
                                        data-aos-duration="1500" key={index}>
                                        <Image className='heroListImg2' src={item.img} alt={item.title} width={300} height={300} />
                                    </li>
                                    <h3 className='heroList2-title text-center py-3'>{item.title}</h3>
                                </div>
                            ))
                        }
                    </ul>
                </div>
            </section>
            <div className='heroHighLight text-white text-center'>
                <h3 className='text-2xl text-[#da9226]'>Personalize it!</h3>
                <h1 className='text-6xl'>CUSTOM ENGRAVING AVAILABLE</h1>
                <p>Choose from our Engraving Collection and add a special message to send a memorable gift!</p>
                <button className='border hero-btn border-white'>SHOP NOW</button>
            </div>
            <div className='heroBestSellers-p'>
                <h1 className='hero-title'>BEST SELLERS</h1>
                <div className='topRated-p w-full'>
                    <ul className='topRated heroGift'>
                        <li
                            data-aos="fade-right"
                            data-aos-offset="100"
                            data-aos-duration="1500"
                            data-aos-easing="ease-in-sine">
                            <Image className='heroSell-Img w-full' src="/images/bestsell1.jpg" width={300} height={300} />
                        </li>
                        <li
                            data-aos="fade-up"
                            data-aos-duration="3000"
                        >
                            <Image className='heroSell-Img w-full' src="/images/bestsell2.jpg" width={300} height={300} />
                        </li>
                        <li
                            data-aos="fade-down"
                            data-aos-easing="linear"
                            data-aos-duration="1500"
                        >
                            <Image className='heroSell-Img w-full' src="/images/bestsell3.jpg" width={300} height={300} />
                        </li>
                    </ul>
                </div>
                <h1 className='hero-title'>RATED CONTENT</h1>
                <ul className='heroBestSellers'>
                    {
                        data?.slice(4, 9).map((item, index) => (
                            <li key={index} className=' borde border-[#c4b217]'>
                                <div className='heroBestSellersImg-p box-border overflow-hidden '>
                                        <Image className='heroListImg3 align-top h-[230px]'onClick={()=>{handlePro(item); navigation.push('/details')}} src={item.img} alt={item.title} width={300} height={300} />
                                </div>
                                <section className='flex flex-col h-[200px] justify-center items-center gap-1'>
                                    <h3 className='heroList3-title'>{item.title}</h3>
                                    <p className='text-center h-[200px] '>{item.content}</p>
                                    <p>From ${item.price}</p>
                                    <div className='mb-4'>
                                        <FaStar color='gold' className='inline' />
                                        <FaStar color='gold' className='inline' />
                                        <FaStar color='gold' className='inline' />
                                        <FaStar color='gold' className='inline' />
                                        <FaStar color='gold' className='inline' />
                                    </div>
                                    <button className='heroBtnCart'>ADD TO CART</button>
                                </section>
                            </li>
                        ))

                    }
                </ul>
            </div>
            <div className='heroGift-p'>
                <ul className='heroGift'>
                    <li className='bg-[]'
                        data-aos="fade-up"
                        data-aos-duration="1500"
                    ><Image className='w-full heroGift-Img' src="/images/gift3.jpg" alt='gift images' width={400} height={400} /></li>
                    <li className='bg-[]'
                        data-aos="fade-right"
                        data-aos-offset="100"
                        data-aos-duration="1500"
                        data-aos-easing="ease-in-sine"
                    ><Image className='w-full heroGift-Img' src="/images/gift1.jpg" alt='gift images' width={400} height={400} /></li>
                    <li className='bg-[]'
                        data-aos="fade-down"
                        data-aos-easing="linear"
                        data-aos-offset="100"
                        data-aos-duration="1500"
                    ><Image className='w-full heroGift-Img' src="/images/gift2.jpg" alt='gift images' width={400} height={400} /></li>
                </ul>
            </div>

        </div>
    )
}
