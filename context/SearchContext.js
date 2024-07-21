'use client'
import React, { createContext, useEffect, useState } from 'react'

export const SearchContext = createContext();
export default function SearchProvider({children}) {
    const [searchVal, setSearchVal] = useState('');
    const [searchInp, setSearchInp] = useState('');
    const [message, setMessage] = useState('')

    useEffect(()=>{

    },[searchInp, searchVal])

  return (
      <SearchContext.Provider value={{searchVal, message, searchInp, setSearchVal, setSearchInp, setMessage}}>
        {children}
      </SearchContext.Provider>
  )
}
