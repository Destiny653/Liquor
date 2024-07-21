'use client'
import React, { useContext, useEffect, useState } from 'react'
import "./shop.css"
import Image from 'next/image';
import Link from 'next/link';
import { SearchContext } from '../../../context/SearchContext';

export default function Page() {

    const { searchVal, searchInp } = useContext(SearchContext)
    console.log(searchInp);
    console.log(searchVal);
    const [data, setData] = useState();
    const [options, setOptions] = useState('All Brands')
    const [brand, setBrand] = useState([])
    let choice = ['balton', 'weller', 'buffalo', 'pappy', 'penelope', 'yamazaki', 'posts']
  
    useEffect(() => {
    
    const getData = async (title) => {
        switch (options) {
            case 'balton':
                setBrand('/api/balton');
                break;
            case 'weller':
                setBrand('/apo/weller');
                break;
            case 'buffalo':
                setBrand('/api/buffalo');
                break;
            case 'pappy':
                setBrand('/api/pappy');
                break;
            case 'penelope':
                setBrand('/api/penelope');
                break;
            case 'yamazaki':
                setBrand('/api/yamazaki');
                break;
            default:
                setBrand([
                    '/api/posts',
                    '/api/balton',
                    '/api/weller',
                    '/api/buffalo',
                    '/api/pappy',
                    '/api/penelope',
                    '/api/yamazaki',
                ]);
            }
        
            
            const fetchPromises = brand.map(api => fetch(api).then(res => res.json()));
        const results = await Promise.all(fetchPromises);
        console.log(results);
        const filteredResults = results.flat().filter(product =>
            product.title?.toLowerCase().includes(title?.toLowerCase())
        );
        console.log(filteredResults);
        return filteredResults;
    }
    
    
        getData(searchInp).then(results => setData(()=>results));
    }, [data, searchInp, searchVal])


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
            return "Invalid page number"
        }
        return getItemsForPage(currentPage)?.map((post) => (
            <div key={post.id} className='border shopItem'>
                <Link href={`/${brand}/${post._id}`}>
                    <Image src={post.img} alt={post.title} width={300} height={300} />
                </Link>
                <h1 className='shopItemTitle font-semibold'>{post.title}</h1>
                <p className='shopItemContent'>{post.content}</p>
                <h2 className=' font-medium'>${post.price}</h2>
                <button className='shopBtn'>Add to Cart</button>
            </div>
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






    const filtedPrice = data?.filter((product) => product.price >= minPrice && product.price <= maxPrice)
    console.log(filtedPrice);


    return (
        <div className='shopParent relative'>
            <div className='shopChild1 sticky left-0 top-[6%]'>
                <section className='brand'>
                    <h1 className=' font-[500] text-2xl text-[red]'>Brand</h1>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'balton'} onChange={() => setOptions(choice[0])} />
                        <span>Balton</span>
                    </label>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'weller'} onChange={() => setOptions(choice[1])} />
                        <span>Weller</span>
                    </label>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'buffalo'} onChange={() => setOptions(choice[2])} />
                        <span>Buffalo</span>
                    </label>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'pappy'} onChange={() => setOptions(choice[3])} />
                        <span>Pappy</span>
                    </label>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'penelope'} onChange={() => setOptions(choice[4])} />
                        <span>Penelope</span>
                    </label>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'yamazaki'} onChange={() => setOptions(choice[5])} />
                        <span>Yamazaki</span>
                    </label>
                    <label htmlFor="radio">
                        <input type="radio" name="brand" value={'regular'} onChange={() => setOptions(choice[6])} />
                        <span>regular</span>
                    </label>
                </section>
                <section className='shopFilter'>
                    <h1 className=' font-[500] text-2xl text-[red]'>Filter</h1>
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
            <section className='shopChild2'>
                <div className='shopBanner '>
                    <Image className='w-full' src={'/images/shopbanner.jpg'} alt='shop banner image' height={500} width={500} />
                    <h1 className=' text-[red] text-[30px] w-fit shopBrand z-10'>{options}</h1>
                </div>
                <h1 className='text-[25px] py-[20px]'>BUY EXCLUSIVE AND PREMIUM WHISKEY ONLINE</h1>
                <div>
                    <section className='border text-[18px] font-[300] p-2'>
                        showing page: {currentPage} / {getTotalPages()} of: {data?.length} products
                    </section>
                    <section>
                    </section>
                </div>
                <div className='shopItemP'>
                    {displayItems()}
                </div>
                <div className='pagination flex items-center justify-center gap-9'>
                    <button className='border px-8 py-1' onClick={prevPage} disabled={currentPage === 1}>Prev</button>
                    <span>{currentPage} of {getTotalPages()}</span>
                    <button className='border px-8 py-1' onClick={nextPage} disabled={currentPage === getTotalPages()}>Next</button>
                </div>
            </section>
        </div>
    )
}
