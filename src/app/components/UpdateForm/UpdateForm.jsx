'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import './updateform.css'
import { useRouter } from 'next/navigation';
import Menu from '../menu/Menu';
import '../../dashboard/posts/create/create.css'
import { set } from 'mongoose';

export default function UpdateForm({id, title, content, price, img, rate}) {

    const [newTitle, setNewTitle] = useState(title);
    const [newContent, setNewContent] = useState(content);
    const [newPrice, setNewPrice] = useState(price)
    const [newImg, setNewImg] = useState(img);
    const [selectImg, setSelectImg] = useState(null)
    const [newRate, setNewRate] = useState(rate)
    const navigation = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNewTitle('')
        setNewContent('');
        setNewPrice('')
        setSelectImg('');
        setNewImg('');
        setNewRate('');
 

            try {
                const res = await fetch(`/api/posts/${id}`, {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({ title:newTitle, content:newContent, price:newPrice, rate:newRate, img:newImg })
                })
                if (res.ok) {
                    alert('Post created successfully!')
                    navigation.push('/dashboard/posts')

                } else {
                    throw new Error('Failed to create post')
                }
            } catch (error) {
                console.error(error);
            }
    }
    console.log(newImg);
    console.log(selectImg);  
    

    const SelectednewImg = () => {
        if(selectImg) {
            return (
                <div className='update-newImg-p box-border overflow-hidden w-full h-full rounded-xl'>
                    {/* <Image className=' update-newImg m-auto h-full' src={URL.createObjectURL(selectImg)} width={300} height={300} /> */}
                </div>
            )
        } else {
            return (
                <div className='update-newImg-p box-border overflow-hidden w-full h-full rounded-xl'>
                    <Image className=' update-newImg m-auto h-full' src={newImg} width={300} height={300} />
                </div>
            )
        }
    }


    return (
        <div className='post-gen-p'>
            <Menu />
            <div className='post-content-p'>
                    <form className='create-form flex flex-col gap-2 box-border px-4 py-4 ' onSubmit={handleSubmit}>
                        <label className='cre-title-p flex flex-col' htmlFor="title">
                            <span className="cre-title">
                                Title:
                            </span>
                            <input className=' create-input text-black  py-2 px-3' type="text" value={newTitle} required onChange={(e) => setNewTitle(e.target.value)} />
                        </label>
                        <label className='flex flex-col' htmlFor="content">
                            <span>
                                Description:
                            </span>
                            <textarea className='create-input text-black py-2 px-3' type="text" rows="3" value={newContent} required onChange={(e) => setNewContent(e.target.value)} />
                        </label>
                        <label className='flex flex-col' htmlFor="price">
                            <span>
                                Price:
                            </span>
                            <input className='create-input  text-black  py-2 px-3' type='text' value={newPrice} required onChange={(e) => setNewPrice(e.target.value)} />
                        </label>
                        <label className='flex flex-col' htmlFor="rate">
                            <span>
                                Rate:
                            </span>
                            <input className='create-input  text-black  py-2 px-3' type='number' value={newRate} required onChange={(e) => setNewRate(e.target.value)} />
                        </label>
                        <label className='flex flex-col' htmlFor="img">
                            <input
                                type='file'
                                name='file'
                                accept='image/*'
                                onChange={(e) => setSelectImg(e.target.files[0])}
                            />
                        </label>
                        <button className='create-btn py-2 rounded-2xl text-white' type='submit'>Upload Product</button>
                    </form>
                <div className=' create-img-box box-border rounded-xl'>
                    <SelectednewImg />
                </div>

            </div>
        </div>
    )
}
