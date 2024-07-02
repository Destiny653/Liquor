'use client'
import React, { useState } from 'react';
import "./create.css";
import Image from 'next/image';

export default function Page() {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [price, setPrice] = useState('')
    const [img, setImg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTitle('')
        setContent('');
        setPrice('')
        setImg('');
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = async () => {
            const base64Image = reader.result;
            console.log(img);
            console.log('Base64 reprresentation:', base64Image);

            try {
                const res = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, content, price, img: base64Image })
                })
                if (res.ok) {
                    alert('Post created successfully!')
                } else {
                    throw new Error('Failed to create post')
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const SelectedImg = () => {
        if (img) {
            return (
                <div className='post-img-p box-border overflow-hidden w-full h-full rounded-xl'>
                    <Image className=' post-img m-auto h-full' src={URL.createObjectURL(img)} width={300} height={300} />
                </div>
            )
        } else {
            console.log('no image selected')
        }
    }


    return (
        <div className=' post-gen-p box-border flex items-center justify-center'>
            <div className='post-content-p flex p-8 rounded-3xl'>
                <form className=' flex flex-col gap-3 w-fit h-fit box-border px-4 py-4 ' onSubmit={handleSubmit}>
                    <label className='flex flex-col' htmlFor="title">
                        <span>
                            Title:
                        </span>
                        <input className='text-black  py-2 px-3' type="text" value={title} required onChange={(e) => setTitle(e.target.value)} />
                    </label>
                    <label className='flex flex-col' htmlFor="content">
                        <span>
                            Content:
                        </span>
                        <input className='text-black py-2 px-3' type="text" value={content} required onChange={(e) => setContent(e.target.value)} />
                    </label>
                    <label className='flex flex-col' htmlFor="price">
                        <span>
                            Price:
                        </span>
                        <input className=' text-black  py-2 px-3' type='number' value={price} required onChange={(e) => setPrice(e.target.value)} />
                    </label>
                    <label className='flex flex-col' htmlFor="img">
                        <span>
                            Image:
                        </span>
                        <input
                            type='file'
                            name='file'
                            accept='image/png, imapge/jpg, image/jpeg'
                            onChange={(e) => setImg(e.target.files[0])}
                            required
                        />
                    </label>
                    <button className=' bg-black py-2 rounded-2xl text-white' type='submit'>Upload Product</button>
                </form>
                <div className=' box-border rounded-xl'>
                    <SelectedImg />
                </div>

            </div>
        </div>
    )
}
