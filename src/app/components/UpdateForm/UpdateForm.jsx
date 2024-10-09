'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import './updateform.css'
import { useRouter } from 'next/navigation';
import Menu from '../menu/Menu';
import '../../dashboard/create/create.css'
import { TfiHome } from "react-icons/tfi";
import { IoCreateOutline } from "react-icons/io5";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { CiUser } from "react-icons/ci";
import { MdOutlineAddchart } from "react-icons/md";
import { IoIosLogIn } from "react-icons/io";
import { GoSignOut } from "react-icons/go";
import Link from 'next/link';

export default function UpdateForm({ id, title, content, price, img, rate }) {

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

            const reader = new FileReader();
            reader.readAsDataURL(selectImg)
            reader.onloadend = () => {
                console.log(reader.result);
                return;
            }
            const base64Image = reader.result;
            const imgResult = base64Image ? base64Image : newImg
            const res = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle, content: newContent, price: newPrice, rate: newRate, img: imgResult })
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


    const SelectedImg = () => {

        if (selectImg ) {
            return <Image src={URL.createObjectURL(selectImg)} alt="product img" width={600} height={600} className='w-[100%] h-[100%] rounded-[10px]' />
        }else {
            return <Image src={newImg} alt="product img" width={600} height={600} className='w-[100%] h-[100%] rounded-[10px]' />
        }
    }

return (
    <div className='w-full flex justify-evenly box-border py-[2%] bg-[#9e7f193b] h-[80vh] text-[#000]'>
        <section className='w-[16%] relative bg-[#ffffff] rounded-[15px]'>
            <ul className='flex flex-col box-border p-[6%]'>
                <Link className='flex gap-2 items-center my-[4%] text-[15px]' href={'/'}>
                    <TfiHome size={20} className='text-[#000000]' />
                    <li>Home</li>
                </Link>
                <Link className='flex gap-2 items-center my-[4%] text-[15px]' href={'/dashboard/create'}>
                    <IoCreateOutline size={20} className='text-[#000000]' />
                    <li>Create post</li>
                </Link>
                <Link className='flex gap-2 items-center my-[4%] text-[15px]' href={'#'}>
                    <VscGitPullRequestGoToChanges size={20} className='text-[#000000]' />
                    <li>Orders</li>
                </Link>
                <Link className='flex gap-2 items-center my-[4%] text-[15px]' href={'/dashboard/posts'}>
                    <MdOutlineAddchart size={20} className='text-[#000000]' />
                    <li>Posts</li>
                </Link>
                <Link className='flex gap-2 items-center my-[4%] text-[15px]' href={'#'}>
                    <CiUser size={22} className='text-[#000000]' />
                    <li>Clients</li>
                </Link>
                <Link className='flex gap-2 items-center my-[4%] text-[15px]' href={'/signup'}>
                    <IoIosLogIn size={22} className='text-[#000000]' />
                    <li>Login</li>
                </Link>
                <li className='absolute bottom-[5%] left-[4%] w-[50%] h-[7%]'>
                    <button className='flex items-center justify-center text-[15px] w-[100%] h-[100%] text-[#ffffff] rounded-[10px] bg-[#000000]'>
                        <GoSignOut size={20} className='text-[#ffffff]' />
                        Logout
                    </button>
                </li>
            </ul>
        </section>
        <section className='w-[80%] flex justify-evenly items-center bg-[#ffffff] rounded-[15px]'>
            <form className='flex flex-col w-[50%]' onSubmit={handleSubmit}>
                {/* <section className='flex gap-2 my-[1%]'>
                        <label htmlFor="rate" className='flex flex-col gap-[4px] w-[50%]'>
                            <button type='submit' onClick={() => (setOption(""))} className='bg-[#112892] py-[6px] px-[30px] text-[#fff] w-fit rounded-[12px]'>Option</button>
                        </label>
                        <label htmlFor="name" className='flex flex-col gap-[4px] w-[50%] '>
                            <p className='text-[20px] font-[600]'> Product title: <span className='text-[#112892]'>{option}</span></p>
                        </label>
                    </section> */}
                <section className='flex gap-2 my-[1%]'>
                    <label htmlFor="name" className='flex flex-col gap-[4px] w-[50%] '>
                        <span className=''>Product title</span>
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
                        <input onChange={e => setSelectImg(e.target.files[0])} className=' outline-[0] border-[1px] border-[#6d471648] rounded[20px] bg-[#ac7e1c57] w-[100%] py-[3px] px-[20px]' type="file" id="img" name="img" accept="img/*" required />
                    </label>
                </section>
                <label htmlFor="content " className='flex flex-col my-[2%]'>
                    <span className=''>Product content</span>
                    <textarea value={newContent} onChange={e => setNewContent(e.target.value)} className=' outline-[0] border py-[1%] px-[20px] ' id="content" name="content" rows={5} placeholder="Enter product content" required></textarea>
                </label>
                <button type='submit' className='bg-[#000] py-[9px] px-[30px] text-[#fff] w-fit rounded-[12px]'>Submit</button>
            </form>
            <div className='w-[40%] h-[80%] flex flex-col gap-[10px]'>
                <input className=' outline-[0] border-[1px] border-[#ac7e1c57] w-[100%] py-[6px] px-[20px] rounded-[20px]' type='url' id="url" name="url" placeholder="Enter img URL"

                />
                <section className='w-[100%] h-[80%] border-[1px] border-[#ac7e1c57] rounded-[10px]'>
                    {<SelectedImg />}
                </section>
            </div>
        </section>
    </div>
)
}
