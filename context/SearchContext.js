'use client'
import React, { createContext, useEffect, useReducer, useState } from 'react'

export const SearchContext = createContext(); 

export default function SearchProvider({children}) {
    const [searchVal, setSearchVal] = useState('');
    const [searchInp, setSearchInp] = useState('');
    const [detailPro, setDetailPro] = useState([]);
    const [detailArr, setDetailArr] = useState([]);
    const [msgBtn, setMsgBtn] = useState(false);
    const [signIn, setSignIn] = useState('');
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0 )


    const [api, setApi] = useState(null);
    const apis = [
        '/api/posts',
        '/api/pappies',
        '/api/penelopes',
        '/api/wellers',
        '/api/yamazakis',
        '/api/baltons',
        '/api/buffalos'
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await Promise.all(apis.map(async api => {
                    const response = await fetch(api);
                    return response.json();
                }))
                setApi(data.flat());
                // console.log('Fetched data:', api);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
        return;
    }, [])
    console.log(api);
    



    const handlePro = (product)=>{
      if(typeof window !== "undefined"){
        // forceUpdate()  
        setDetailPro(product);
        localStorage.removeItem('detailPro');
        localStorage.setItem('detailPro', JSON.stringify(product));
      }
    }
    const handleArr = (product)=>{
      if(typeof window !== "undefined"){
        // forceUpdate()  
        setDetailArr(product);
        localStorage.removeItem('detailArr');
        localStorage.setItem('detailArr', JSON.stringify(product));
      }
    }
    console.log(detailArr);
    const handleSearch = (value)=>{
      // console.log(value);
      if(typeof window !== "undefined"){
        setSearchInp(value);
      }
    }
    
    
    useEffect(()=>{
      // forceUpdate()
      if(typeof window !== "undefined"){
        setDetailPro(JSON.parse(localStorage.getItem('detailPro')))
        setDetailArr(JSON.parse(localStorage.getItem('detailArr')))
      }
      console.log(detailPro);
      console.log(detailArr);
    },[searchInp])

  return (
      <SearchContext.Provider value={{searchVal, detailPro, searchInp, signIn, detailArr,api, msgBtn, setMsgBtn, handleSearch, handleArr, setSignIn, handlePro, setSearchVal, setSearchInp}}>
        {children}
      </SearchContext.Provider>
  )
}
