'use client'
import React, { useContext, useEffect, useState } from 'react'
import "./shop.css" 
import Link from 'next/link';
import { SearchContext } from '../../../context/SearchContext';
import { useRouter } from 'next/navigation';
import { CartContext } from '../../../context/CartContext';
import { FaStar } from 'react-icons/fa';
import { SkeletonArr, SkeletonArr2 } from '../components/Skeleton/Skeleton';
import Qty from '../components/Quantity/quantity';

const PriceFilter = ({ onFilterChange }) => {
  const priceRanges = [
    { label: '$100 - $250', min: 100, max: 250, count: 400 },
    { label: '$250 - $300', min: 250, max: 300, count: 100 },
    { label: '$300 - $450', min: 300, max: 450, count: 100 },
    { label: '$450 - $550', min: 450, max: 550, count: 100 },
    { label: '$550 - $700', min: 550, max: 700, count: 200 },
    { label: '$700 - $950', min: 700, max: 950, count: 290 },
    { label: '$950 - $1000', min: 950, max: 1000, count: 300 },
    { label: '$1000 and above', min: 1000, max: 30000, count: 200 },
  ];

  const [selectedRange, setSelectedRange] = useState(null);

  const handleRangeChange = (min, max) => {
    if (selectedRange?.min === min && selectedRange?.max === max) {
      setSelectedRange(null);
      onFilterChange(0, 30000);
    } else {
      setSelectedRange({ min, max });
      onFilterChange(min, max);
    }
  };

  return (
    <section className="shop-filter">
      <h1 className="font-[500] text-[red] text-2xl">Filter</h1>
      {priceRanges.map((range, index) => (
        <label htmlFor={`check-${index}`} key={index} className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`check-${index}`}
            checked={selectedRange?.min === range.min && selectedRange?.max === range.max}
            onChange={() => handleRangeChange(range.min, range.max)}
          />
          <ul className="flex justify-between w-full">
            <li>{range.label}</li>
            <li>({range.count})</li>
          </ul>
        </label>
      ))}
    </section>
  );
};

export default function Page() {
  const { searchVal, searchInp, handlePro } = useContext(SearchContext);
  const { handleAddToCart } = useContext(CartContext);
  const navigation = useRouter();
  
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState(null);
  const [options, setOptions] = useState('All Brands');
  const [brand, setBrand] = useState([]);
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 12;
  const choice = ['baltons', 'wellers', 'buffalos', 'pappies', 'penelopes', 'yamazakis', 'All Brands'];
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const handleFilterChange = (min, max) => {
    if (data) {
      const filtered = data.filter((product) => 
        product.price >= min && product.price <= max
      );
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to first page when filter changes
    }
  };

  useEffect(() => {
    const getData = async (title) => {
      switch (options) {
        case 'baltons':
          setBrand(['/api/baltons']);
          break;
        case 'wellers':
          setBrand(['/api/wellers']);
          break;
        case 'buffalos':
          setBrand(['/api/buffalos']);
          break;
        case 'pappies':
          setBrand(['/api/pappies']);
          break;
        case 'penelopes':
          setBrand(['/api/penelopes']);
          break;
        case 'yamazakis':
          setBrand(['/api/yamazakis']);
          break;
        default:
          setBrand([
            '/api/posts',
            '/api/baltons',
            '/api/wellers',
            '/api/buffalos',
            '/api/pappies',
            '/api/penelopes',
            '/api/yamazakis',
          ]);
      }

      const fetchPromises = brand.map(api => fetch(api).then(res => res.json()));
      const results = await Promise.all(fetchPromises);
      const filteredResults = results.flat().filter(product =>
        product.title?.toLowerCase().includes(title?.toLowerCase())
      );
      setLoader(false);
      return filteredResults;
    }

    getData(searchInp).then(results => {
      setData(results);
      setFilteredData(null); // Reset filtered data when new data is loaded
    });
  }, [searchInp, searchVal, options, brand]);

  const getTotalPages = () => {
    const itemsToDisplay = filteredData || data;
    return Math.ceil((itemsToDisplay?.length || 0) / itemsPerPage);
  };

  const displayItems = () => {
    const itemsToDisplay = filteredData || data;
    const totalPages = getTotalPages();
    
    if (currentPage < 1 || currentPage > totalPages) {
      return <SkeletonArr2 />;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    
    return itemsToDisplay?.slice(startIndex, endIndex)?.map((item, index) => (
      <li key={index} className='box-border border-[#c0c0c065] border-[1px] bg-[#c0c0c00c] py-[19px] shop-arr-i'>
        <img 
          className='shop-arr-img' 
          src={item?.img} 
          alt={item.title} 
          width={500} 
          height={500} 
          onClick={() => { 
            handlePro(item); 
            navigation.push(`/details?title=${item.title.toLowerCase()}`);
          }} 
        />
        <h1 className='shop-arr-title font-[600] text-[14.5px]'>{item.title}</h1>
        <h1>
          <FaStar color='gold' className='inline' />
          <FaStar color='gold' className='inline' />
          <FaStar color='gold' className='inline' />
          <FaStar color='gold' className='inline' />
        </h1>
        <h1 className='font-[600] text-[#f1ce07] text-[15px]'>{formatter.format(item.price)}</h1>
        <button 
          className='hover:bg-[#9b1d1d] px-9 py-2 qty-p-i shop-btn-arr border rounded-[3px] font-[500] text-[11px] hover:text-[#fff] nunitoextralight_italic' 
          onClick={() => { handleAddToCart(item); }}
        >
          <Qty productId={item._id} />
          ADD TO CART
        </button>
      </li>
    ));
  };

  const nextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className='relative shop-parent nav-obscure-view'>
      <div className='top-[10vh] left-0 sticky shop-child1'>
        <section className='brand'>
          <h1 className='font-[500] text-[red] text-2xl'>Brand</h1>
          {choice.map((brandName, index) => (
            <label key={index} htmlFor={`radio-${index}`}>
              <input 
                type="radio" 
                id={`radio-${index}`}
                name="brand" 
                value={brandName.toLowerCase()} 
                onChange={() => setOptions(brandName)}
                checked={options === brandName}
              />
              <span>{brandName === 'All Brands' ? 'All' : brandName.charAt(0).toUpperCase() + brandName.slice(1, -1)}</span>
            </label>
          ))}
        </section>
        
        <PriceFilter onFilterChange={handleFilterChange} />
      </div>

      <section className='shop-child2'>
        <div className='shop-banner'>
          <img 
            className='w-full h-full' 
            src='/images/shopbanner.jpg' 
            alt='shop banner image' 
            height={500} 
            width={500} 
          />
          <h1 className='shop-brand w-fit text-[30px] text-[red]'>{options}</h1>
        </div>
        
        <h1 className='py-[20px] shop-child2-head text-[25px]'>
          BUY EXCLUSIVE AND PREMIUM WHISKEY ONLINE
        </h1>
        
        <div>
          <section className='p-2 shop-info border font-[300] text-[18px]'>
            showing page: {currentPage} / {getTotalPages()} of: {(filteredData || data)?.length} products
          </section>
        </div>

        <div className='shop-arr w-full'>
          {loader ? <SkeletonArr2 /> : displayItems()}
        </div>

        <div className='flex justify-center items-center gap-9 pagination'>
          <button 
            className='hover:bg-[#811212] px-8 py-1 border rounded-[7px] hover:text-[#fff]' 
            onClick={prevPage} 
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>{currentPage} of {getTotalPages()}</span>
          <button 
            className='hover:bg-[#811212] px-8 py-1 border rounded-[7px] hover:text-[#fff]' 
            onClick={nextPage} 
            disabled={currentPage === getTotalPages()}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}