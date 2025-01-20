'use client'
import React, { useContext, useEffect, useState } from 'react'
import "./shop.css"
import Image from 'next/image';
import Link from 'next/link';
import { SearchContext } from '../../../context/SearchContext';
import { useRouter } from 'next/navigation';
import { CartContext } from '../../../context/CartContext';
import { FaStar } from 'react-icons/fa';
import { SkeletonArr, SkeletonArr2 } from '../components/Skeleton/Skeleton';
import { SiTrueup } from 'react-icons/si';
import Qty from '../components/Quantity/quantity';

export default function Page() {

    const { searchVal, searchInp, handlePro } = useContext(SearchContext);
    const { handleAddToCart } = useContext(CartContext);

    const navigation = useRouter();
    console.log(searchInp);
    console.log(searchVal);
    const [data, setData] = useState();
    const [options, setOptions] = useState('All Brands');
    const [brand, setBrand] = useState([]);
    const [loader, setLoader] = useState(true)
    let choice = ['baltons', 'wellers', 'buffalos', 'pappies', 'penelopes', 'yamazakis', 'All Brands'];
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });


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
            console.log(results);
            const filteredResults = results.flat().filter(product =>
                product.title?.toLowerCase().includes(title?.toLowerCase())
            );
            console.log(filteredResults);
            setLoader(false)
            return filteredResults;
        }

        getData(searchInp).then(results => setData(() => results));
    }, [data, searchInp, searchVal, loader])


    //getting items per page and displaying the current page with the prev and next option

    const itemsPerPage = 12
    const [currentPage, setCurrentPage] = useState(1)

    const getTotalPages = () => {
        return Math.ceil(data?.length / itemsPerPage)
    };

    const getItemsForPage = (page) => {
        const startIndex = (page - 1) * itemsPerPage
        const endIndex = page * itemsPerPage
        return data?.slice(startIndex, endIndex)
    }

    const displayItems = () => {
        const totalPages = getTotalPages();
        if (currentPage < 1 || currentPage > totalPages) {
            return <SkeletonArr2 />
        }
        return getItemsForPage(currentPage)?.map((item, index) => (
            <li key={index} className='box-border border-[#c0c0c065] border-[1px] bg-[#c0c0c00c] py-[19px] shop-arr-i'>
                {/* {item?.img ? (
                    <Image
                        className='shop-arr-img'
                        src={item.img}
                        alt={item.title}
                        width={500}
                        height={500}
                        onClick={() => {
                            handlePro(item);
                            navigation.push(`/details?title=${item.title.toLowerCase()}`);
                        }}
                    />
                ) : null} */}
                <img className='shop-arr-img' src={item?.img} alt={item.title} width={500} height={500} onClick={() => { handlePro(item); navigation.push(`/details?title=${item.title.toLowerCase()}`) }} />
                <h1 className='shop-arr-title font-[600] text-[14.5px]'>{item.title}</h1>
                {/* <p className='shop-arr-content h-[52px] text-[13px] text-center'>{item.content.slice(0,201)}</p> */}
                <h1>
                    <FaStar color='gold' className='inline' />
                    <FaStar color='gold' className='inline' />
                    <FaStar color='gold' className='inline' />
                    <FaStar color='gold' className='inline' />
                </h1>
                <h1 className='font-[600] text-[#f1ce07] text-[15px]'>{formatter.format(item.price)}</h1>
                <button className='hover:bg-[#9b1d1d] px-9 py-2 qty-p-i shop-btn-arr border rounded-[3px] font-[500] text-[11px] hover:text-[#fff] nunitoextralight_italic' onClick={() => { handleAddToCart(item); }}>
                    <Qty productId={item._id} />
                    ADD TO CART</button>
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

    //price filter

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, SetMaxPrice] = useState(20000.99)






    const filterdPrice = data?.filter((product) => product.price >= minPrice && product.price <= maxPrice)
    console.log(filterdPrice);
    return (
        <div className='relative shop-parent nav-obscure-view'>
            <div className='top-[10vh] left-0 sticky shop-child1'>
                <section className='brand'>
                    <h1 className='font-[500] text-[red] text-2xl'>Brand</h1>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'regular'} onChange={() => setOptions(choice[6])} />
                        <span>All</span>
                    </label>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'baltons'} onChange={() => setOptions(choice[0])} />
                        <span>Balton</span>
                    </label>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'wellers'} onChange={() => setOptions(choice[1])} />
                        <span>Weller</span>
                    </label>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'buffalos'} onChange={() => setOptions(choice[2])} />
                        <span>Buffalo</span>
                    </label>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'pappies'} onChange={() => setOptions(choice[3])} />
                        <span>Pappy</span>
                    </label>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'penelopes'} onChange={() => setOptions(choice[4])} />
                        <span>Penelope</span>
                    </label>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'yamazakis'} onChange={() => setOptions(choice[5])} />
                        <span>Yamazaki</span>
                    </label>
                </section>
                <section className='shop-filter'>
                    <h1 className='font-[500] text-[red] text-2xl'>Filter</h1>
                    <label htmlFor="check">
                        <input type="checkbox" onChange={() => { setMinPrice(100); SetMaxPrice(150) }} />
                        <ul>
                            <li>
                                $100 - $250
                            </li>
                            <li>(400)</li>
                        </ul>
                    </label>
                    <label htmlFor="check">
                        <input type="checkbox" onChange={() => { setMinPrice(150); SetMaxPrice(200) }} />
                        <ul>
                            <li>
                                $250 - $300
                            </li>
                            <li>(100)</li>
                        </ul>
                    </label>
                    <label htmlFor="check">
                        <input type="checkbox" onChange={() => { setMinPrice(300); SetMaxPrice(350) }} />
                        <ul>
                            <li>
                                $300 - $450
                            </li>
                            <li>(100)</li>
                        </ul>
                    </label>
                    <label htmlFor="check">
                        <input type="checkbox" onChange={() => { setMinPrice(400); SetMaxPrice(450) }} />
                        <ul>
                            <li>
                                $450 - $550
                            </li>
                            <li>(100)</li>
                        </ul>
                    </label>
                    <label htmlFor="check">
                        <input type="checkbox" onChange={() => { setMinPrice(500); SetMaxPrice(550) }} />
                        <ul>
                            <li>
                                $550 - $700
                            </li>
                            <li>(200)</li>
                        </ul>
                    </label>
                    <label htmlFor="check">
                        <input type="checkbox" onChange={() => { setMinPrice(600); SetMaxPrice(650) }} />
                        <ul>
                            <li>
                                $700 - $950
                            </li>
                            <li>(290)</li>
                        </ul>
                    </label>
                    <label htmlFor="check">
                        <input type="checkbox" onChange={() => { setMinPrice(650); SetMaxPrice(1000) }} />
                        <ul>
                            <li>
                                $950 - $1000
                            </li>
                            <li>(300)</li>
                        </ul>
                    </label>
                    <label htmlFor="check">
                        <input type="checkbox" onChange={() => { setMinPrice(1000); SetMaxPrice(30000) }} />
                        <ul>
                            <li>
                                $1000 and above

                            </li>
                            <li>(200)</li>
                        </ul>
                    </label>
                </section>
            </div>
            <section className='shop-child2'>
                <div className='shop-banner'>
                    <Image className='w-full h-full' src={'/images/shopbanner.jpg'} alt='shop banner image' height={500} width={500} />
                    <h1 className='shop-brand w-fit text-[30px] text-[red]'>{options}</h1>
                </div>
                <h1 className='py-[20px] shop-child2-head text-[25px]'>BUY EXCLUSIVE AND PREMIUM WHISKEY ONLINE</h1>
                <div>
                    <section className='p-2 shop-info border font-[300] text-[18px]'>
                        showing page: {currentPage} / {getTotalPages()} of: {data?.length} products
                    </section>
                    <section>
                    </section>
                </div>
                <div className='shop-arr w-full'>
                    {loader ? <SkeletonArr2 /> : displayItems()}
                </div>
                <div className='flex justify-center items-center gap-9 pagination'>
                    <button className='hover:bg-[#811212] px-8 py-1 border rounded-[7px] hover:text-[#fff]' onClick={prevPage} disabled={currentPage === 1}>Prev</button>
                    <span>{currentPage} of {getTotalPages()}</span>
                    <button className='hover:bg-[#811212] px-8 py-1 border rounded-[7px] hover:text-[#fff]' onClick={nextPage} disabled={currentPage === getTotalPages()}>Next</button>
                </div>
            </section>
        </div>
    )
}
