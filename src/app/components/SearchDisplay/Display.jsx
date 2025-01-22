'use client'
import React, { useContext, useEffect } from 'react'
import { SearchContext } from '../../../../context/SearchContext' 
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
        <div className='flex justify-center items-center bg-black w-[100%] h-[100%]'>
            <div className='z-20 displayP'>

                {/* <p>Results</p> */}
                {
                    !searchVal?.length == 0 ? searchVal?.map((item) => {
                        return (
                            <ul className='' key={item._id}>
                                <li key={item._id}>
                                    <img onClick={() => { handlePro(item); navigation.push(`/details?${item.title.toLowerCase()}`) }} className='align-bottom w-[100px] h-[80px] text-xs' src={item.img} alt={item.title} width={500} height={500} />
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
