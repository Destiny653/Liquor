'use client'
import React, { createContext, useEffect, useReducer, useState } from 'react'

export const SearchContext = createContext();
export default function SearchProvider({children}) {
    const [searchVal, setSearchVal] = useState('');
    const [searchInp, setSearchInp] = useState('');
    const [detailPro, setDetailPro] = useState([]);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0 )



    const handlePro = (product)=>{
      forceUpdate()
      console.log(product);
      setDetailPro(product);
        localStorage.removeItem('detailPro');
        localStorage.setItem('detailPro', JSON.stringify(product));
    }
    
    useEffect(()=>{
      // forceUpdate()
      setDetailPro(JSON.parse(localStorage.getItem('detailPro')))
      console.log(detailPro);
    },[searchInp, searchVal])

  return (
      <SearchContext.Provider value={{searchVal, detailPro, searchInp, handlePro, setSearchVal, setSearchInp, setDetailPro}}>
        {children}
      </SearchContext.Provider>
  )
}
