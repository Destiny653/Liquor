'use client';
import React, { createContext, useEffect, useReducer, useState } from 'react'
import { useQuery } from '@tanstack/react-query';

// Fetcher function
const fetchAllProducts = async () => {
  const res = await fetch('/api/products?limit=1000');
  if (!res.ok) throw new Error('Failed to fetch products');
  const result = await res.json();
  return result.products || result;
};

export const SearchContext = createContext();

export default function SearchProvider({ children }) {
  const [searchVal, setSearchVal] = useState('');
  const [searchInp, setSearchInp] = useState('');
  const [detailPro, setDetailPro] = useState([]);
  const [detailArr, setDetailArr] = useState([]);
  const [msgBtn, setMsgBtn] = useState(false);
  const [signIn, setSignIn] = useState('');
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0)


  // TanStack Query for all products
  const { data: api = [] } = useQuery({
    queryKey: ['allProducts'],
    queryFn: fetchAllProducts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });




  const handlePro = (product) => {
    if (typeof window !== "undefined") {
      // forceUpdate()  
      setDetailPro(product);
      localStorage.removeItem('detailPro');
      localStorage.setItem('detailPro', JSON.stringify(product));
    }
  }
  const handleArr = (product) => {
    if (typeof window !== "undefined") {
      // forceUpdate()  
      setDetailArr(product);
      localStorage.removeItem('detailArr');
      localStorage.setItem('detailArr', JSON.stringify(product));
    }
  }
  console.log(detailArr);
  const handleSearch = (value) => {
    // console.log(value);
    if (typeof window !== "undefined") {
      setSearchInp(value);
    }
  }


  useEffect(() => {
    // forceUpdate()
    if (typeof window !== "undefined") {
      setDetailPro(JSON.parse(localStorage.getItem('detailPro')))
      setDetailArr(JSON.parse(localStorage.getItem('detailArr')))
    }
    console.log(detailPro);
    console.log(detailArr);
  }, [searchInp])

  const contextValue = React.useMemo(() => ({
    searchVal,
    detailPro,
    searchInp,
    signIn,
    detailArr,
    api,
    msgBtn,
    setMsgBtn,
    handleSearch,
    handleArr,
    setSignIn,
    handlePro,
    setSearchVal,
    setSearchInp
  }), [searchVal, detailPro, searchInp, signIn, detailArr, api, msgBtn]);

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  )
}
