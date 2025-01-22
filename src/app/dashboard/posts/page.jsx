'use client'
import React, { useState, useEffect } from 'react' 
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
                <section className='relative nav-obscure-view post-sub-container'>

                    <div className='top-[10vh] right-0 sticky post-detail'>
                        <div className='flex flex-col gap-2 w-full nunitoextralight_italic'>
                            <h1 className='text-[#850303] text-xl'>Preview</h1>
                            <div className='box-border flex justify-center'>
                                <img src={posts && posts[mainindex]?.img} alt='item image' width={300} height={300} />
                            </div>
                            <h1 className='font-semibold text-xl post-detail-t'>{posts[mainindex]?.title}</h1>
                            <h2 className='font-semibold'>{formatter.format(posts[mainindex]?.price)}</h2>
                            <p className='post-pg'>{posts[mainindex]?.content}</p>
                            <div className='flex justify-center items-center gap-6'>
                              <Link href={`/dashboard/update/${posts[mainindex]?.productModel}/${posts[mainindex]?._id}`}>
                                <button className='bg-black text-white post-btn'>Edit</button>
                              </Link>
                                <button onClick={() => { deletePost(posts[mainindex]?.productModel,posts[mainindex]?._id); setMainindex(0) }} className='bg-[#850303] text-white post-btn'>Delete</button>
                            </div>
                        </div>
                    </div>
                    <ul className='post-sub-child'>
                        <div className='flex gap-4 post-opt'>
                            <h1 className='text-[#850303] text-xl'>All Posts</h1>
                            <button className='bg-black px-12 py-2 text-white'>
                                <Link href='/dashboard/create'>Add</Link>
                            </button>
                        </div>

                        <div className='nunitoextralight_italic post-items'>
                            {
                                posts?.map((post, index) => {
                                    return (
                                        <li key={index} onClick={() => setMainindex(index)} className='box-border flex gap-4 p-5 border post-item'>
                                            <div className='box-border overflow-hidden'>
                                                <img className='rounded-xl hover:scale-125' alt='image of item' src={post?.img} width={300} height={300} />
                                            </div>
                                            <div className='flex flex-col'>
                                                <h1 className='font-semibold text-base text'>{post?.title}</h1>
                                                <p className='post-pg'>{post.content}</p>
                                                <h1>
                                                    <FaStar color='gold' className='inline' />
                                                    <FaStar color='gold' className='inline' />
                                                    <FaStar color='gold' className='inline' />
                                                    <FaStar color='gold' className='inline' />
                                                </h1>
                                                <span className='font-semibold nunitoextralight_italic'>{formatter.format(post.price)}</span>
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
