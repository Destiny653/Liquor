'use client'
import React, { useContext } from 'react'
import { SearchContext } from '../../../../context/SearchContext'
import Image from 'next/image';
import './display.css'
import Link from 'next/link';

export default function Display() {

    const { searchVal, searchInp } = useContext(SearchContext)
    console.log(searchVal);

    if (!searchInp) return null;
    return (
        <div className='displayP z-20'>
            <p>Results</p>
            {
                !searchVal.length == 0 ? searchVal?.map((item) => {
                    return (
                        <ul className='' key={item._id}>
                            <li>
                                <Link href={`/shop`}>
                                    <Image className='w-full' src={item.img} alt={item.title} width={300} height={300} />
                                </Link>
                            </li>
                            <li className='displayT'>{item.title}</li>
                        </ul>
                    )
                }) :
                    <p>No results</p>
            }
        </div>
    )

}
