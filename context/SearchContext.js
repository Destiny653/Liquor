'use client'
import React, { createContext, useEffect, useReducer, useState } from 'react'

export const SearchContext = createContext();
export default function SearchProvider({children}) {
    const [searchVal, setSearchVal] = useState('');
    const [searchInp, setSearchInp] = useState('');
    const [detailPro, setDetailPro] = useState([]);
    const [detailArr, setDetailArr] = useState([]);
    const [signIn, setSignIn] = useState('');
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0 )



    const handlePro = (product)=>{
      // forceUpdate()  
      setDetailPro(product);
        localStorage.removeItem('detailPro');
        localStorage.setItem('detailPro', JSON.stringify(product));
    }
    const handleArr = (product)=>{
      // forceUpdate()  
      setDetailArr(product);
        localStorage.removeItem('detailArr');
        localStorage.setItem('detailArr', JSON.stringify(product));
    }
    console.log(detailArr);
    const handleSearch = (value)=>{
      // console.log(value);
      setSearchInp(value);
    }
    
    
    useEffect(()=>{
      // forceUpdate()
      setDetailPro(JSON.parse(localStorage.getItem('detailPro')))
      setDetailArr(JSON.parse(localStorage.getItem('detailArr')))
      console.log(detailPro);
      console.log(detailArr);
    },[searchInp])

  return (
      <SearchContext.Provider value={{searchVal, detailPro, searchInp, signIn, detailArr, handleSearch, handleArr, setSignIn, handlePro, setSearchVal, setSearchInp}}>
        {children}
      </SearchContext.Provider>
  )
}
