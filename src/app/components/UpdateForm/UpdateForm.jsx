'use client'
import React, { useState } from 'react'; 
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
            return <img src={imgSrc} alt="product img" width={600} height={600} className='rounded-[10px] w-[100%] h-[100%]' />
        }
    }

    return (
        <div className='box-border flex justify-evenly bg-[#f7f7f7] py-[2%] w-full h-[80vh] text-[#000]'>
            {loader && <Load />}
            <section className='relative bg-[#ffffff] rounded-[15px] w-[16%]'>
                <Menu/>
            </section>
            <section className='flex justify-evenly items-center bg-[#ffffff] rounded-[15px] w-[80%]'>
                <form className='flex flex-col w-[50%]' onSubmit={handleSubmit}>
                    <section className='flex gap-2 my-[1%]'>
                        <label htmlFor="name" className='flex flex-col gap-[4px] w-[50%]'>
                            <span className=''>Product Model</span>
                            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className='border-[#6d471648] border-[1px] px-[20px] py-[6px] rounded-[20px] w-[100%] outline-[0]' type="text" id="name" name="name" placeholder="Enter product name" required />
                        </label>
                        <label htmlFor="rate" className='flex flex-col gap-[4px] w-[50%]'>
                            <span className=''>Product rating</span>
                            <input value={newRate} onChange={(e) => setNewRate(e.target.value)} className='border-[#6d471648] border-[1px] px-[20px] py-[6px] rounded-[20px] w-[100%] outline-[0]' type="number" id="rate" name="rate" placeholder="Enter product rating" min="1" max="5" required />
                        </label>
                    </section>
                    <section className='flex gap-2'>
                        <label htmlFor="price" className='flex flex-col gap-[4px] w-[50%]'>
                            <span className=''>Product price</span>
                            <input value={newPrice} onChange={e => setNewPrice(e.target.value)} className='border-[#6d471648] border-[1px] px-[20px] py-[6px] w-[100%] outline-[0]' type="number" id="price" name="price" placeholder="Enter product price" required />
                        </label>
                        <label htmlFor="img" className='flex flex-col gap-[4px] w-[50%]'>
                            <span className=''>Product img</span>
                            <input onChange={handleFileChange} className='border-[#6d471648] border-[1px] bg-[#ac7e1c57] px-[20px] py-[3px] rounded[20px] w-[100%] outline-[0]' type="file" id="img" name="img" accept="img/*" />
                        </label>
                    </section>
                    <label htmlFor="content " className='flex flex-col my-[2%]'>
                        <span className=''>Product content</span>
                        <textarea value={newContent} onChange={e => setNewContent(e.target.value)} className='px-[20px] py-[1%] border outline-[0]' id="content" name="content" rows={5} placeholder="Enter product content" required></textarea>
                    </label>
                    <button type='submit' className='bg-[#000] px-[30px] py-[9px] rounded-[12px] w-fit text-[#fff]'>Submit</button>
                </form>
                <div className='flex flex-col gap-[10px] w-[40%] h-[80%]'>
                    <input
                        onChange={handleInputChange}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className='border-[#ac7e1c57] border-[1px] px-[20px] py-[6px] rounded-[20px] w-[100%] outline-[0]' type='url' id="url" name="url" placeholder="Enter img URL"
                    />
                    <section className='border-[#ac7e1c57] border-[1px] rounded-[10px] w-[100%] h-[80%]'>
                        {<SelectedImg />}
                    </section>
                </div>
            </section>
        </div>
    )
}
