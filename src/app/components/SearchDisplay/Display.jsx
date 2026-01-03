'use client'
import React, { useContext, useEffect } from 'react'
import { SearchContext } from '../../../../context/SearchContext'
import './display.css'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Display() {

    const { searchVal, searchInp, handlePro } = useContext(SearchContext)
    const navigation = useRouter()

    useEffect(() => {
        return;
    }, [searchVal])

    // Only show if there's something to search
    if (!searchVal || searchVal.length === 0) return null;

    return (
        <div className='search-results-dropdown'>
            <div className='search-results-grid'>
                {searchVal.map((item) => (
                    <div
                        key={item._id}
                        className='search-result-item'
                        onClick={() => {
                            handlePro(item);
                            navigation.push(`/details?title=${item.title.toLowerCase()}`)
                        }}
                    >
                        <img
                            src={item.img}
                            alt={item.title}
                            className='search-result-img'
                        />
                        <span className='search-result-title'>{item.title}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
