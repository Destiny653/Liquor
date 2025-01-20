'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import './updateform.css'
import { useRouter } from 'next/navigation'; 
import '../../dashboard/create/create.css'

import Link from 'next/link';
import { Notyf } from 'notyf';
import { Load } from '../Skeleton/Skeleton';
import Menu from '../menu/Menu';

export default function UpdateForm({ id, title, content, price, img, rate, option }) {

    const [newTitle, setNewTitle] = useState(title);
    const [newContent, setNewContent] = useState(content);
    const [newPrice, setNewPrice] = useState(price) 
    const [newRate, setNewRate] = useState(rate)
    const [loader, setLoader] = useState(false) 
    const [imgSrc, setImgSrc] = useState(img)
    const navigation = useRouter()
    console.log(option);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleInputChange = (e) => {
        setImgSrc(e.target.value)
    }

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = e.dataTransfer.getData('text/plain');
        setImgSrc(url)
    }
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }
    console.log(imgSrc);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNewTitle('')
        setNewContent('');
        setNewPrice('')
        setImgSrc('https://via.placeholder.com/200')
        setNewRate('');
        setLoader(true)
        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'right',
                y: 'top'
            },
        })

        try {

            const res = await fetch(`/api/${option}s/${id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle, content: newContent, price: newPrice, rate: newRate, img: imgSrc })
            })
            if (res.ok) { 
                setLoader(false)
                notyf.success('Post updated successfully')
                navigation.push('/dashboard/posts')
            } else {
                setLoader(false)
                notyf.error('Failed to create update post')
            }
        } catch (error) {
            notyf.error(error)
            setLoader(false)
            console.error(error);
        }
    } 
    const SelectedImg = () => {
        if (imgSrc) {
            return <Image src={imgSrc} alt="product img" width={600} height={600} className='w-[100%] h-[100%] rounded-[10px]' />
        }
    }

    return (
        <div className='w-full flex justify-evenly box-border py-[2%] bg-[#f7f7f7] h-[80vh] text-[#000]'>
            {loader && <Load />}
            <section className='w-[16%] relative bg-[#ffffff] rounded-[15px]'>
                <Menu/>
            </section>
            <section className='w-[80%] flex justify-evenly items-center bg-[#ffffff] rounded-[15px]'>
                <form className='flex flex-col w-[50%]' onSubmit={handleSubmit}>
                    <section className='flex gap-2 my-[1%]'>
                        <label htmlFor="name" className='flex flex-col gap-[4px] w-[50%] '>
                            <span className=''>Product Model</span>
                            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className=' outline-[0] border-[1px] border-[#6d471648] rounded-[20px] w-[100%] py-[6px] px-[20px]' type="text" id="name" name="name" placeholder="Enter product name" required />
                        </label>
                        <label htmlFor="rate" className='flex flex-col gap-[4px] w-[50%]'>
                            <span className=''>Product rating</span>
                            <input value={newRate} onChange={(e) => setNewRate(e.target.value)} className=' outline-[0] border-[1px] border-[#6d471648] rounded-[20px] w-[100%] py-[6px] px-[20px]' type="number" id="rate" name="rate" placeholder="Enter product rating" min="1" max="5" required />
                        </label>
                    </section>
                    <section className='flex gap-2'>
                        <label htmlFor="price" className='flex flex-col gap-[4px] w-[50%]'>
                            <span className=''>Product price</span>
                            <input value={newPrice} onChange={e => setNewPrice(e.target.value)} className=' outline-[0] border-[1px] border-[#6d471648] w-[100%] py-[6px] px-[20px]' type="number" id="price" name="price" placeholder="Enter product price" required />
                        </label>
                        <label htmlFor="img" className='flex flex-col gap-[4px] w-[50%]'>
                            <span className=''>Product img</span>
                            <input onChange={handleFileChange} className=' outline-[0] border-[1px] border-[#6d471648] rounded[20px] bg-[#ac7e1c57] w-[100%] py-[3px] px-[20px]' type="file" id="img" name="img" accept="img/*" />
                        </label>
                    </section>
                    <label htmlFor="content " className='flex flex-col my-[2%]'>
                        <span className=''>Product content</span>
                        <textarea value={newContent} onChange={e => setNewContent(e.target.value)} className=' outline-[0] border py-[1%] px-[20px] ' id="content" name="content" rows={5} placeholder="Enter product content" required></textarea>
                    </label>
                    <button type='submit' className='bg-[#000] py-[9px] px-[30px] text-[#fff] w-fit rounded-[12px]'>Submit</button>
                </form>
                <div className='w-[40%] h-[80%] flex flex-col gap-[10px]'>
                    <input
                        onChange={handleInputChange}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className=' outline-[0] border-[1px] border-[#ac7e1c57] w-[100%] py-[6px] px-[20px] rounded-[20px]' type='url' id="url" name="url" placeholder="Enter img URL"
                    />
                    <section className='w-[100%] h-[80%] border-[1px] border-[#ac7e1c57] rounded-[10px]'>
                        {<SelectedImg />}
                    </section>
                </div>
            </section>
        </div>
    )
}
