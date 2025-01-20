import React from 'react'
import './menu.css'
import Link from 'next/link';
import { TfiHome } from "react-icons/tfi";
import { IoCreateOutline } from "react-icons/io5";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { CiUser } from "react-icons/ci";
import { MdOutlineAddchart } from "react-icons/md";
import { IoIosLogIn } from "react-icons/io";
import { GoSignOut } from "react-icons/go";

export default function Menu() {
  return (
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
  )
}
