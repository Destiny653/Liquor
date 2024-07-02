'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import './updateform.css'
import { useRouter } from 'next/navigation';

export default function UpdateForm({id, title, content, price, img}) {

    const [newTitle, setNewTitle] = useState(title);
    const [newContent, setNewContent] = useState(content);
    const [newPrice, setNewPrice] = useState(price)
    const [newImg, setNewImg] = useState(img);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNewTitle('')
        setNewContent('');
        setNewPrice('')
        setNewImg('');
        const navigation = useRouter()
        const reader = new FileReader();
        reader.readAsDataURL(newImg);
        reader.onload = async () => {
            const base64Image = reader.result;
            console.log(newImg);
            console.log('Base64 reprresentation:', base64Image);

            try {
                const res = await fetch(`/api/posts/${id}`, {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({ title:newTitle, content:newContent, price:newPrice, img:base64Image })
                })
                if (res.ok) {
                    alert('Post created successfully!')
                    navigation.push('/posts')

                } else {
                    throw new Error('Failed to create post')
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const SelectednewImg = () => {
        if (newImg) {
            return (
                <div className='update-newImg-p box-border overflow-hidden w-full h-full rounded-xl'>
                    <Image className=' update-newImg m-auto h-full' src={URL.createObjectURL(newImg)} width={300} height={300} />
                </div>
            )
        } else {
            console.log('no image selected')
        }
    }


    return (
        <div className=' update-gen-p box-border flex items-center justify-center'>
            <div className='update-newContent-p flex p-8 rounded-3xl'>
                <form className=' flex flex-col gap-3 w-fit h-fit box-border px-4 py-4 ' onSubmit={handleSubmit}>
                    <label className='flex flex-col' htmlFor="newTitle">
                        <span>
                            newTitle:
                        </span>
                        <input className='text-black  py-2 px-3' type="text" value={newTitle} required onChange={(e) => setNewTitle(e.target.value)} />
                    </label>
                    <label className='flex flex-col' htmlFor="newContent">
                        <span>
                            newContent:
                        </span>
                        <input className='text-black py-2 px-3' type="text" value={newContent} required onChange={(e) => setNewContent(e.target.value)} />
                    </label>
                    <label className='flex flex-col' htmlFor="newPrice">
                        <span>
                            newPrice:
                        </span>
                        <input className=' text-black  py-2 px-3' type='number' value={newPrice} required onChange={(e) => setNewPrice(e.target.value)} />
                    </label>
                    <label className='flex flex-col' htmlFor="newImg">
                        <span>
                            Image:
                        </span>
                        <input
                            type='file'
                            name='file'
                            accept='image/png, imapge/jpg, image/jpeg'
                            onChange={(e) => setNewImg(e.target.files[0])}
                            required
                        />
                    </label>
                    <button className=' bg-black py-2 rounded-2xl text-white' type='submit'>Update Product</button>
                </form>
                <div className=' box-border rounded-xl'>
                    <SelectednewImg />
                </div>

            </div>
        </div>
    )
}
