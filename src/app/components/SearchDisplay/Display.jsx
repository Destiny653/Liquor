'use client'
import React, { useContext, useEffect } from 'react'
import { SearchContext } from '../../../../context/SearchContext'
import Image from 'next/image';
import './display.css'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Display() {

    const { searchVal, searchInp, handlePro } = useContext(SearchContext)
    const navigation = useRouter()
    useEffect(()=>{
        return;
    },[searchVal])
    console.log(searchVal);

    if (!searchInp) return null;
    return (
        <div className='flex items-center justify-center w-[100%] h-[100%] bg-black'>
            <div className='displayP z-20'>

                {/* <p>Results</p> */}
                {
                    !searchVal?.length == 0 ? searchVal?.map((item) => {
                        return (
                            <ul className='' key={item._id}>
                                <li key={item._id}>
                                    <Image onClick={() => { handlePro(item); navigation.push(`/details?${item.title.toLowerCase()}`) }} className='w-[100px] h-[80px] text-xs align-bottom' src={item.img} alt={item.title} width={500} height={500} />
                                </li>
                                <li className='displayT'>{item.title}</li>
                            </ul>
                        )
                    }) :
                        <p>No results</p>
                }
            </div>
        </div>
    )

}
