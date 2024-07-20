'use client'
import React, { useEffect, useState } from 'react'
import "./shop.css"
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {

    const [data, setData] = useState();

    useEffect(() => {
        const getData = async () => {
            const result = await fetch('/api/posts')
            if (!result.ok) {
                throw new Error('Faild to fetch data')
            }
            const posts = await result.json()
            setData(posts)
            console.log(posts)
        }

        getData()
        console.log('Component Mounted')
        return () => {
            console.log('Component Unmounted')
        }  // Clean up function to be called when component is unmounted.  If we don't have this, our fetch request will keep running in the background.  This is good for memory optimization.  However, in this case, we don't need to clean up.  We're only fetching data.  So, we can omit this line.  However, for more complex applications, it's a good practice to add a clean up function.  This way, we can ensure that our fetch request is properly cleaned up when the component is unmounted.  This helps prevent memory leaks.  The cleanup function is automatically called when the component is unmounted.  In our case, we don't need to do anything in the cleanup function, so we can omit it.  But, if we need to perform some cleanup operations, we can add it
    }, [data])


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
        const brand = 'posts'
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
    const [maxPrice, SetMaxPrice] = useState(40000)


    const filtedPrice = data?.filter((product) => product.price >= minPrice && product.price <= maxPrice)
    console.log(filtedPrice);


    return (
        <div className='shopParent'>
            <div className='shopChild1'>
                <h1 className=' font-bold text-2xl text-[#910808]'>Filter</h1>
                <h1>Price</h1>
                <label htmlFor="check">
                    <input type="checkbox" onChange={() => { setMinPrice(100); SetMaxPrice(150) }} />
                    <ul>
                        <li>
                            $100 - $150
                        </li>
                        <li>(400)</li>
                    </ul>
                </label>
                <label htmlFor="check">
                    <input type="checkbox" onChange={() => { setMinPrice(150); SetMaxPrice(200) }} />
                    <ul>
                        <li>
                            $150 - $200
                        </li>
                        <li>(100)</li>
                    </ul>
                </label>
                <label htmlFor="check">
                    <input type="checkbox" onChange={() => { setMinPrice(200); SetMaxPrice(250) }} />
                    <ul>
                        <li>
                            $200 - $250
                        </li>
                        <li>(200)</li>
                    </ul>
                </label>
                <label htmlFor="check">
                    <input type="checkbox" onChange={() => { setMinPrice(250); SetMaxPrice(300) }} />
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
                            $300 - $350
                        </li>
                        <li>(100)</li>
                    </ul>
                </label>
                <label htmlFor="check">
                    <input type="checkbox" onChange={() => { setMinPrice(350); SetMaxPrice(400) }} />
                    <ul>
                        <li>
                            $350 - $400
                        </li>
                        <li>(102)</li>
                    </ul>
                </label>
                <label htmlFor="check">
                    <input type="checkbox" onChange={() => { setMinPrice(400); SetMaxPrice(450) }} />
                    <ul>
                        <li>
                            $400 - $450
                        </li>
                        <li>(100)</li>
                    </ul>
                </label>
                <label htmlFor="check">
                    <input type="checkbox" onChange={() => { setMinPrice(450); SetMaxPrice(500) }} />
                    <ul>
                        <li>
                            $450 - $500
                        </li>
                        <li>(500)</li>
                    </ul>
                </label>
                <label htmlFor="check">
                    <input type="checkbox" onChange={() => { setMinPrice(500); SetMaxPrice(550) }} />
                    <ul>
                        <li>
                            $500 - $550
                        </li>
                        <li>(200)</li>
                    </ul>
                </label>
                <label htmlFor="check">
                    <input type="checkbox" onChange={() => { setMinPrice(550); SetMaxPrice(600) }} />
                    <ul>
                        <li>
                            $550 - $600
                        </li>
                        <li>(300)</li>
                    </ul>
                </label>
                <label htmlFor="check">
                    <input type="checkbox" onChange={() => { setMinPrice(600); SetMaxPrice(650) }} />
                    <ul>
                        <li>
                            $600 - $650
                        </li>
                        <li>(290)</li>
                    </ul>
                </label>
                <label htmlFor="check">
                    <input type="checkbox" onChange={() => { setMinPrice(650); SetMaxPrice(1000) }} />
                    <ul>
                        <li>
                            $650 - $1000
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
            </div>
            <section className='shopChild2'>
                <h1>BUY EXCLUSIVE AND PREMIUM WHISKEY ONLINE</h1>
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
