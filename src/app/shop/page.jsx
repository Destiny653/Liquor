'use client';
import React, { useContext, useEffect, useState, useCallback, useMemo, useRef, Suspense } from 'react';
import "./shop.css";
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchContext } from '../../../context/SearchContext';
import { CartContext } from '../../../context/CartContext';
import { FaStar } from 'react-icons/fa';
import { FiX, FiFilter } from 'react-icons/fi';
import { SkeletonArr, SkeletonArr2 } from '../components/Skeleton/Skeleton';
import Qty from '../components/Quantity/quantity';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

const PriceFilter = ({ onFilterChange }) => {
  const priceRanges = useMemo(() => [
    { label: '$100 - $250', min: 100, max: 250, count: 400 },
    { label: '$250 - $300', min: 250, max: 300, count: 100 },
    { label: '$300 - $450', min: 300, max: 450, count: 100 },
    { label: '$450 - $550', min: 450, max: 550, count: 100 },
    { label: '$550 - $700', min: 550, max: 700, count: 200 },
    { label: '$700 - $950', min: 700, max: 950, count: 290 },
    { label: '$950 - $1000', min: 950, max: 1000, count: 300 },
    { label: '$1000 and above', min: 1000, max: 30000, count: 200 },
  ], []);

  const [selectedRange, setSelectedRange] = useState(null);

  const handleRangeChange = useCallback((min, max) => {
    if (selectedRange?.min === min && selectedRange?.max === max) {
      setSelectedRange(null);
      onFilterChange(0, 30000);
    } else {
      setSelectedRange({ min, max });
      onFilterChange(min, max);
    }
  }, [selectedRange, onFilterChange]);

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

const ProductCard = React.memo(function ProductCard({ item, formatter, handlePro, navigation, handleAddToCart }) {
  return (
    <li className='box-border bg-[#c0c0c00c] shop-arr-i py-[19px] border-[#c0c0c065] border-[1px]'>
      <img
        className='shop-arr-img cursor-pointer'
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
      <h1 className='flex'>
        {[...Array(4)].map((_, i) => (
          <FaStar key={i} color='gold' className='text-[15px]' />
        ))}
      </h1>
      <h1 className='font-[600] text-[#f1ce07] text-[15px]'>{formatter.format(item.price)}</h1>
      <button
        className='hover:bg-[#9b1d1d] qty-p-i shop-btn-arr px-9 py-2 border rounded-[3px] font-[500] text-[11px] hover:text-[#fff] nunitoextralight_italic'
        onClick={() => handleAddToCart(item)}
      >
        <Qty productId={item._id} />
        ADD TO CART
      </button>
    </li>
  );
});

// Shop loading skeleton
function ShopSkeleton() {
  return (
    <div className='relative shop-parent nav-obscure-view'>
      <div className='top-[10vh] left-0 sticky shop-child1'>
        <section className='brand'>
          <h1 className='font-[500] text-[red] text-2xl'>Brand</h1>
        </section>
      </div>
      <section className='shop-child2'>
        <div className='shop-banner'>
          <img
            className='w-full h-full'
            src='/images/shopbanner.jpg'
            alt='shop banner'
            height={500}
            width={500}
          />
        </div>
        <div className='shop-arr w-full'>
          <SkeletonArr2 />
        </div>
      </section>
    </div>
  );
}

// Main shop content component that uses useSearchParams
function ShopContent() {
  const { searchVal, searchInp, handlePro } = useContext(SearchContext);
  const { handleAddToCart } = useContext(CartContext);
  const navigation = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [options, setOptions] = useState('All Brands');
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;
  const choice = useMemo(() => ['blantons', 'wellers', 'buffalos', 'pappies', 'penelopes', 'yamazakis', 'gifts', 'All Brands'], []);
  const formatter = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }), []);

  // Read brand from URL params on mount and when URL changes
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam && choice.includes(brandParam)) {
      setOptions(brandParam);
      setCurrentPage(1);
    }
  }, [searchParams, choice]);

  const endpoints = useMemo(() => ({
    'blantons': ['/api/blantons'],
    'wellers': ['/api/wellers'],
    'buffalos': ['/api/buffalos'],
    'pappies': ['/api/pappies'],
    'penelopes': ['/api/penelopes'],
    'yamazakis': ['/api/yamazakis'],
    'gifts': ['/api/gifts'],
    'All Brands': [
      '/api/posts',
      '/api/blantons',
      '/api/wellers',
      '/api/buffalos',
      '/api/pappies',
      '/api/penelopes',
      '/api/yamazakis',
      '/api/gifts',
    ],
  }), []);

  const getApiEndpoints = useCallback((selectedOption) => {
    return endpoints[selectedOption] || endpoints['All Brands'];
  }, [endpoints]);

  const handleFilterChange = useCallback((min, max) => {
    if (!data || data.length === 0) return;

    const filtered = data.filter((product) =>
      product.price >= min && product.price <= max
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data]);

  const debouncedSearch = useCallback((searchTerm, currentData) => {
    if (!searchTerm) return currentData;
    return currentData.filter(product =>
      product.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, []);

  // Main data fetching effect
  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      setLoader(true);
      try {
        const currentEndpoints = getApiEndpoints(options);
        const fetchPromises = currentEndpoints.map(api =>
          fetch(api)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              return res.json();
            })
        );

        const results = await Promise.all(fetchPromises);
        const flattenedResults = results.flat();

        if (isSubscribed) {
          const searchFiltered = debouncedSearch(searchInp, flattenedResults);
          setData(searchFiltered);
          setFilteredData(null);
        }
      } catch (error) {
        if (isSubscribed) {
          setData([]);
          setFilteredData(null);
        }
      } finally {
        if (isSubscribed) {
          setLoader(false);
        }
      }
    };

    // Execute fetchData immediately for initial load
    fetchData();

    // Set up debounced updates for subsequent changes
    const timeoutId = setTimeout(fetchData, 300);

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
    };
  }, [searchInp, options, getApiEndpoints, debouncedSearch]);

  const getTotalPages = useMemo(() => {
    const itemsToDisplay = filteredData || data;
    return Math.ceil((itemsToDisplay?.length || 0) / itemsPerPage);
  }, [filteredData, data, itemsPerPage]);

  const displayItems = useMemo(() => {
    const itemsToDisplay = filteredData || data;

    if (currentPage < 1 || currentPage > getTotalPages || loader || !itemsToDisplay?.length) {
      return <SkeletonArr2 />;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;

    return itemsToDisplay?.slice(startIndex, endIndex)?.map((item, index) => (
      <ProductCard
        key={item._id || index}
        item={item}
        formatter={formatter}
        handlePro={handlePro}
        navigation={navigation}
        handleAddToCart={handleAddToCart}
      />
    ));
  }, [filteredData, data, currentPage, getTotalPages, loader, formatter, handlePro, navigation, handleAddToCart]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= getTotalPages) {
      setCurrentPage(newPage);
    }
  }, [getTotalPages]);

  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className='relative shop-parent nav-obscure-view'>
      {/* Mobile Filter Toggle */}
      <div className='mobile-filter-toggle'>
        <button onClick={() => setFilterOpen(true)} className="flex items-center justify-center gap-2">
          <FiFilter /> Filter Products
        </button>
      </div>

      <div className={`shop-child1 ${filterOpen ? 'open' : ''}`}>
        <div className="mobile-filter-header">
          <div className="flex flex-col">
            <h3>Filters</h3>
            <button
              className="text-[12px] text-red-500 w-fit"
              onClick={() => {
                setOptions('All Brands');
                handleFilterChange(0, 30000);
                setFilterOpen(false);
              }}
            >
              Clear All
            </button>
          </div>
          <button className="close-filter" onClick={() => setFilterOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <section className='brand'>
          <h1 className='font-[500] text-[red] text-2xl'>Brand</h1>
          {choice.map((brandName, index) => (
            <label key={index} htmlFor={`radio-${index}`}>
              <input
                type="radio"
                id={`radio-${index}`}
                name="brand"
                value={brandName.toLowerCase()}
                onChange={() => {
                  setOptions(brandName);
                  setFilterOpen(false);
                }}
                checked={options === brandName}
              />
              <span>{brandName === 'All Brands' ? 'All' : brandName.charAt(0).toUpperCase() + brandName.slice(1, -1)}</span>
            </label>
          ))}
        </section>

        <PriceFilter onFilterChange={(min, max) => {
          handleFilterChange(min, max);
          setFilterOpen(false);
        }} />
      </div>

      <section className='shop-child2'>
        <div className='shop-banner'>
          <img
            className='w-full h-full'
            src='/images/shopbanner.jpg'
            alt='shop banner'
            height={500}
            width={500}
          />
          <h1 className='shop-brand w-fit text-[30px] text-[red]'>{options}</h1>
        </div>

        <h1 className='shop-child2-head py-[20px] text-[25px]'>
          BUY EXCLUSIVE AND PREMIUM WHISKEY ONLINE
        </h1>

        <div>
          <section className='p-2 shop-info border font-[300] text-[18px]'>
            showing page: {currentPage} / {getTotalPages} of: {(filteredData || data)?.length} products
          </section>
        </div>

        <div className='shop-arr w-full'>
          {displayItems}
        </div>

        <div className='flex justify-center items-center gap-9 pagination'>
          <button
            className='hover:bg-[#811212] disabled:opacity-50 px-8 py-1 border rounded-[7px] hover:text-[#fff] disabled:cursor-not-allowed'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>{currentPage} of {getTotalPages}</span>
          <button
            className='hover:bg-[#811212] disabled:opacity-50 px-8 py-1 border rounded-[7px] hover:text-[#fff] disabled:cursor-not-allowed'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === getTotalPages}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}

// Main page component with Suspense boundary
export default function Page() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopContent />
      </Suspense>
    </ErrorBoundary>
  );
}