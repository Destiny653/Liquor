'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { TfiHome } from "react-icons/tfi";
import { IoCreateOutline } from "react-icons/io5";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { CiUser } from "react-icons/ci";
import { MdOutlineAddchart } from "react-icons/md";
import { IoIosLogIn } from "react-icons/io";
import { GoSignOut } from "react-icons/go";
import { Notyf } from 'notyf';
import './create.css'
import { Load } from '@/app/components/Skeleton/Skeleton';
import Menu from '@/app/components/menu/Menu';
export default function Page() {

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0);
    const [rate, setRate] = useState(0)
    const [content, setContent] = useState("");
    const [option, setOption] = useState("");
    const [imgSrc, setImgSrc] = useState("https://via.placeholder.com/200")
    const [loader, setLoader] = useState(false)


    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgSrc(reader.result)
            }
            reader.readAsDataURL(file);
        }
    }
    const handleImgChage = (e) => {
        setImgSrc(e.target.value)
    }

    const handleDrag = (e) => {
        e.preventDefault();
    }
    const handleDrop = (e) => {
        e.preventDefault();
        const url = e.dataTransfer.getData('text/plain')
        setImgSrc(url)
    }

    const handleSubmit = async (e) => {
        setImgSrc('https://via.placeholder.com/200')
        setLoader(true)

        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'right',
                y: 'top'
            }
        });
        // Add your code here to save the product to the database or API
        try {
            const response = await fetch(`/api/${option}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, price, content, rate, img: imgSrc })
            });
            if (!response.ok) {
                setLoader(false)
                notyf.error(response.message);
                return;
            }
            setLoader(false)
            notyf.success('Product added successfully');
        } catch (error) {
            setLoader(false)
            console.log(error);
            notyf.error(error.message);
        }
    }

    const SelectedImg = () => {
        if (imgSrc) {
            return <img src={imgSrc} alt="product img" width={600} height={600} className='rounded-[10px] w-[100%] h-[100%]' />
        }
    }

    const _option = () => {
        if (!option) {
            return (
                <div className='top-0 z-[5] fixed flex flex-col justify-center items-center optionParent'>
                    <div className='z-10 flex flex-col gap-2'>
                        <label className='font-[600] text-[#112892] text-2xl'>
                            Select your product type:
                        </label>
                        <select className='px-3 py-2 text-black create-input' value={option} required onChange={(e) => setOption(e.target.value)}>
                            <option value="">Select option</option>
                            <option value="baltons">Balton</option>
                            <option value="buffalos">Buffalo</option>
                            <option value="pappies">Pappy</option>
                            <option value="penelopes">Penelope</option>
                            <option value="wellers">Weller</option>
                            <option value="yamazakis">Yamazaki</option>
                        </select>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className='w-full dashboard-parent nav-obscure-view'>
            <div className='box-border flex justify-evenly bg-[#f7f7f7] py-[2%] w-full h-[80vh] text-[#000]'>

                {_option()}
                <section className='relative bg-[#ffffff] rounded-[15px] w-[16%]'>
                    {loader && <Load />}
                    <Menu />
                </section>
                <section className='flex justify-evenly items-center bg-[#ffffff] rounded-[15px] w-[80%] dashboard-display'>
                    <form className='flex flex-col w-[50%]' onSubmit={handleSubmit}>
                        <section className='flex gap-2 my-[1%]'>
                            <label htmlFor="rate" className='flex flex-col gap-[4px] w-[50%]'>
                                <button type='submit' onClick={() => (setOption(""))} className='bg-[#112892] px-[30px] py-[6px] rounded-[12px] w-fit text-[#fff]'>Option</button>
                            </label>
                            <label htmlFor="name" className='flex flex-col gap-[4px] w-[50%]'>
                                <p className='font-[600] text-[20px]'> Product Model: <span className='text-[#112892]'>{option}</span></p>
                            </label>
                        </section>
                        <section className='flex gap-2 my-[1%]'>
                            <label htmlFor="name" className='flex flex-col gap-[4px] w-[50%]'>
                                <span className=''>Product title</span>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} className='border-[#6d471648] border-[1px] px-[20px] py-[6px] rounded-[20px] w-[100%] outline-[0]' type="text" id="name" name="name" placeholder="Enter product name" required />
                            </label>
                            <label htmlFor="rate" className='flex flex-col gap-[4px] w-[50%]'>
                                <span className=''>Product rating</span>
                                <input value={rate} onChange={(e) => setRate(e.target.value)} className='border-[#6d471648] border-[1px] px-[20px] py-[6px] rounded-[20px] w-[100%] outline-[0]' type="number" id="rate" name="rate" placeholder="Enter product rating" min="1" max="5" required />
                            </label>
                        </section>
                        <section className='flex gap-2'>
                            <label htmlFor="price" className='flex flex-col gap-[4px] w-[50%]'>
                                <span className=''>Product price</span>
                                <input value={price} onChange={e => setPrice(e.target.value)} className='border-[#6d471648] border-[1px] px-[20px] py-[6px] w-[100%] outline-[0]' type="number" id="price" name="price" placeholder="Enter product price" required />
                            </label>
                            <label htmlFor="img" className='flex flex-col gap-[4px] w-[50%]'>
                                <span className=''>Product img</span>
                                <input onChange={handleFileChange} className='border-[#6d471648] bg-[#c4c1bb57] px-[20px] py-[3px] rounded-[3px] rounded[20px] w-[100%] outline-[0]' type="file" id="img" name="img" accept="img/*" placeholder='select image' />
                            </label>
                        </section>
                        <label htmlFor="content " className='flex flex-col my-[2%]'>
                            <span className=''>Product content</span>
                            <textarea value={content} onChange={e => setContent(e.target.value)} className='px-[20px] py-[1%] border outline-[0]' id="content" name="content" rows={5} placeholder="Enter product content" required></textarea>
                        </label>
                        <button type='submit' className='bg-[#000] px-[30px] py-[9px] rounded-[12px] w-fit text-[#fff]'>Submit</button>
                    </form>
                    <div className='flex flex-col gap-[10px] w-[40%] h-[80%]'>
                        <input
                            onChange={handleImgChage}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className='border-[#ac7e1c57] border-[1px] px-[20px] py-[6px] rounded-[20px] w-[100%] outline-[0]' type='url' id="url" name="url" placeholder="Enter img URL"
                        />
                        <section className='border-[#ac7e1c57] border-[1px] rounded-[10px] w-[100%] h-[80%]'>
                            {<SelectedImg />}
                        </section>
                    </div>
                </section>
            </div>
        </div>
    )
}
