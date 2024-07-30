'use client'
import React, { useState } from 'react';
import "./create.css";
import Image from 'next/image';
import Menu from '@/app/components/menu/Menu';

export default function Page() {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [price, setPrice] = useState('')
    const [img, setImg] = useState(null);
    const [rate, setRate] = useState(null);
    const [option, setOption] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTitle('')
        setContent('');
        setPrice('')
        setImg(null);
        setRate('');
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = async () => {
            const base64Image = reader.result;
            console.log(img);
            console.log('Base64 reprresentation:', base64Image);

            try {
                const res = await fetch(`/api/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, content, rate, price, img: base64Image })
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

    const _option = () => {
        if (!option) {
            return (
                <div className='optionParent flex flex-col items-center justify-center fixed top-0 z-[5]'>
                    <div className='flex flex-col gap-2 z-10 '>
                        <label className='text-2xl text-[#7e6f1d]'>
                            Select your product type:
                        </label>
                        <select className='create-input text-black  py-2 px-3' value={option} required onChange={(e) => setOption(e.target.value)}>
                            <option value="">Select option</option>
                            <option value="balton">Balton</option>
                            <option value="buffalo">Buffalo</option>
                            <option value="pappy">Pappy</option>
                            <option value="penelope">Penelope</option>
                            <option value="weller">Weller</option>
                            <option value="yamazaki">Yamazaki</option>
                        </select>
                    </div>
                </div>
            )
        }
    }


    return (
        <div>
            {_option()}
            <div className='post-gen-p'>

                <Menu />
                <div className='post-content-p'>
                    <form className='create-form flex flex-col gap-2 box-border px-4 py-4 ' onSubmit={handleSubmit}>
                        <h1 className='text-2xl font-medium'>Uploading product for: {option}</h1>
                        <button onClick={() => setOption('')} className='px-[15px] py-[4px] text-white bg-[#831313] w-fit'>Change Option</button>
                        <label className='cre-title-p flex flex-col' htmlFor="title">
                            <span className="cre-title">
                                Title:
                            </span>
                            <input className=' create-input text-black  py-2 px-3' type="text" value={title} required onChange={(e) => setTitle(e.target.value)} />
                        </label>
                        <label className='flex flex-col' htmlFor="content">
                            <span>
                                Description:
                            </span>
                            <textarea className='create-input text-black py-2 px-3' type="text" rows="3" value={content} required onChange={(e) => setContent(e.target.value)} />
                        </label>
                        <label className='flex flex-col' htmlFor="price">
                            <span>
                                Price:
                            </span>
                            <input className='create-input  text-black  py-2 px-3' type='text' value={price} required onChange={(e) => setPrice(e.target.value)} />
                        </label>
                        <label className='flex flex-col' htmlFor="rate">
                            <span>
                                Rate:
                            </span>
                            <input className='create-input  text-black  py-2 px-3' type='number' value={rate} required onChange={(e) => setRate(e.target.value)} />
                        </label>
                        <label className='flex flex-col' htmlFor="img">
                            <input
                                type='file'
                                name='file'
                                accept='image/*'
                                onChange={(e) => setImg(e.target.files[0])}
                                required
                            />
                        </label>
                        <button className='create-btn py-2 rounded-2xl text-white' type='submit'>Upload Product</button>
                    </form>
                    <div className=' create-img-box box-border rounded-xl'>
                        <div>

                            <SelectedImg />
                        </div>

                    </div>

                </div>
            </div>

        </div>
    )
}
