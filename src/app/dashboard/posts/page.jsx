'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import './posts.css';
import { FaStar } from "react-icons/fa";

export default function Page() {

    const [mainindex, setMainindex] = useState(0)
    const [posts, setPosts] = useState([]);
    const formatter = new Intl.NumberFormat('en-US',{style: 'currency', currency:'USD'});



   
    useEffect(() => {

    async function getData() {
        const result = await fetch('/api/posts')

        if (!result.ok) {
            throw new Error('Faild to fetch data')
        }

        setPosts(await result.json())
    }

    getData()
}, [posts]);

    const deletePost = async (option, id) => {
        const res = await fetch(`/api/${option.toLowerCase()}s/${id}`, {
            method: 'DELETE'
        })
        if (res.status === 200) {
            const result = await res.json()
            console.log(result.body);
             alert('Successfully deleted')
        } else {
            alert('Deletion Error')
        }
        setPosts(posts.filter((data, index) => index !== mainindex))
    }





    return (
        <>
                <section className='post-sub-container relative nav-obscure-view'>

                    <div className='post-detail sticky top-[10vh] right-0'>
                        <div className='w-full nunitoextralight_italic flex flex-col gap-2'>
                            <h1 className='text-xl text-[#850303]'>Preview</h1>
                            <div className='box-border flex justify-center'>
                                <Image src={posts && posts[mainindex]?.img} alt='item image' width={300} height={300} />
                            </div>
                            <h1 className='post-detail-t text-xl font-semibold'>{posts[mainindex]?.title}</h1>
                            <h2 className='font-semibold '>{formatter.format(posts[mainindex]?.price)}</h2>
                            <p className=' post-pg'>{posts[mainindex]?.content}</p>
                            <div className='flex justify-center items-center gap-6'>
                              <Link href={`/dashboard/update/${posts[mainindex]?.productModel}/${posts[mainindex]?._id}`}>
                                <button className=' post-btn bg-black  text-white '>Edit</button>
                              </Link>
                                <button onClick={() => { deletePost(posts[mainindex]?.productModel,posts[mainindex]?._id); setMainindex(0) }} className='post-btn bg-[#850303] text-white'>Delete</button>
                            </div>
                        </div>
                    </div>
                    <ul className='post-sub-child'>
                        <div className='post-opt flex gap-4'>
                            <h1 className='text-xl text-[#850303]'>All Posts</h1>
                            <button className=' bg-black  text-white py-2 px-12'>
                                <Link href='/dashboard/create'>Add</Link>
                            </button>
                        </div>

                        <div className='nunitoextralight_italic post-items'>
                            {
                                posts?.map((post, index) => {
                                    return (
                                        <li key={index} onClick={() => setMainindex(index)} className='post-item flex box-border border p-5 gap-4'>
                                            <div className='box-border overflow-hidden'>
                                                <Image className='rounded-xl hover:scale-125 ' alt='image of item' src={post?.img} width={300} height={300} />
                                            </div>
                                            <div className='flex flex-col'>
                                                <h1 className='text  font-semibold  text-base'>{post?.title}</h1>
                                                <p className='post-pg'>{post.content}</p>
                                                <h1>
                                                    <FaStar color='gold' className='inline' />
                                                    <FaStar color='gold' className='inline' />
                                                    <FaStar color='gold' className='inline' />
                                                    <FaStar color='gold' className='inline' />
                                                </h1>
                                                <span className='nunitoextralight_italic font-semibold'>{formatter.format(post.price)}</span>
                                                <div className='flex items-center gap-2'>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </div>
                    </ul>
                </section>
        </>
    )
}
