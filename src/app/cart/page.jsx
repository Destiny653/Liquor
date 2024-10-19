'use client';
import React, { useContext, useEffect, useState } from 'react';
import './cart.css';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegTrashAlt } from "react-icons/fa";
import { CartContext } from '../../../context/CartContext';

export default function Page() {

    const { cartItems, handleAddToCart, emptyCart } = useContext(CartContext)

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const [returns, setRetruns] = useState(null)
    let totalPrice = 0;

    // const [ignored, forceUpdate] = useReducer(x => x + 1, 0 )

    // for (let i = 0; i < cartItems?.length; i++) {
    //     const cart = cartItems[i]?.price;
    //     console.log(cart);

    // }

    let newCart = null
    useEffect(() => {

        const getData = async () => {
            const apis = [
                '/api/posts',
                '/api/baltons',
                '/api/wellers',
                '/api/buffalos',
                '/api/pappies',
                '/api/penelopes',
                '/api/yamazakis',
            ];

            const fetchPromises = apis.map(api => fetch(api).then(res => res.json()));
            const results = await Promise.all(fetchPromises);
            // setNewCart(results.flat()); 
            newCart = results.flat()
            setRetruns(newCart)
            console.log(newCart);
            return;
        }
        getData();
    }, [returns])


    console.log(returns); 


    // is client to ensure smooth running

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        return;
    })


    return (
        <>
            {isClient && <div className='cart-parent flex w-full justify-center gap-7 m-10 ml-0 box-border px-1 relative nav-obscure-view'>
                <table className='w-3/4 cart-table table1 box-border pl-[10px] '>
                    <thead>
                        <tr>
                            <th className='text-left'>Image</th>
                            <th className='cart-title text-left'>Name</th>
                            <th className='text-left'>unit</th>
                            <th className='text-left'>Qty</th>
                            <th className='text-left'>Sum</th>
                            <th className='text-left'>Cut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!cartItems == [] ?
                            cartItems?.map((item, index) => {

                                let position = returns && returns?.findIndex((value) => value._id === item.product_id)
                                let itemInCart = returns && returns[position]
                                let qtyInCart = item.quantity
                                // console.log(item.price);
                                let price = itemInCart?.price
                                // console.log(price);

                                totalPrice += itemInCart?.price * qtyInCart


                                return (
                                    <tr key={index}>
                                        <td>
                                            <Image className=' size-24 rounded-full cart-img ' src={itemInCart?.img} alt='product' height={400} width={400} />
                                        </td>
                                        <td className='cart-title-name'>{itemInCart?.title.slice(0, 15)}</td>
                                        <td>{formatter.format(price)}</td>
                                        <td>
                                            <div className='border text-black w-fit  hover:bg-[#610f0f] hover:text-white box-border px-2 py-1'>
                                                <button className=' bg-inherit' onClick={() => { handleAddToCart(itemInCart, qtyInCart); }}>- </button>
                                                <span className='  px-3 py-1 rounded-full'>{qtyInCart}</span>
                                                <button className=' bg-inherit' onClick={() => { handleAddToCart(itemInCart); }} >+</button>
                                            </div>
                                        </td>
                                        <td>{(formatter.format(price * qtyInCart))}</td>
                                        <td>
                                            <button onClick={() => handleAddToCart(itemInCart, qtyInCart, index)} ><FaRegTrashAlt className='text-red-600' size={30} /></button>
                                        </td>
                                    </tr>
                                )
                            }
                            ) :

                            <h1 className=' m-auto text-2xl text-center align-middle'>Your Cart is empty</h1>
                        }
                    </tbody>
                    <Link href='/cart'>
                        <button className=' bg-[#b40f0f] rounded-xl px-4 py-2 mt-3 active:bg-[#610f0f] text-white' onClick={() => emptyCart()}>Reset Cart</button>
                    </Link>
                </table>


                <div className='w-1/5 cart-sum box-border mr-4'>
                    <table className='w-full h-96 border m-0 box-border p-5 px-[8px] sticky left-0 top-[10vh]'>
                        <thead>
                            <tr>
                                <th scope='col' colSpan={2}>CART TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Subtotal</td>
                                <td>{formatter.format(totalPrice)}</td>
                            </tr>
                            <tr>
                                <td>Shipping</td>
                                <td>Flat Rate</td>
                            </tr>
                            <tr>
                                <td>Tax</td>
                                <td>$70</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>{formatter.format(totalPrice + 70)}</td>
                            </tr>
                        </tbody>
                        <Link href='/checkout'>
                            <button className=' border mt-4 rounded-lg px-4 py-3  w-full self-center bg-[#610f0f] text-white'>
                                Checkout
                            </button>
                        </Link>
                    </table>
                </div>
            </div>}
        </>
    )
}
