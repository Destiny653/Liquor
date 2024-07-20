'use client';
import React, { useEffect, useState } from 'react';
import './cart.css';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegTrashAlt } from "react-icons/fa";

export default function Page() {

    // const { cartItems, handleAddToCart, emptyCart } = useContext(CartContext)
    const [newCart, setNewCart] = useState([])
    let totalPrice = 0

    // const [ignored, forceUpdate] = useReducer(x => x + 1, 0 )

    // for (let i = 0; i < cartItems?.length; i++) {
    //     const cart = cartItems[i]?.price;
    //     console.log(cart);

    // }


    useEffect(() => {
        async function getData() {

            const res = await fetch('api/posts');
            if (!res.ok) {
                throw new Error('failed to fetch data')
            }
            setNewCart(await res.json());
        }

        getData();

    }, [])




    // is client to ensure smooth running

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        // forceUpdate()
    })


    return (
        <>
            {isClient && <div className='cart-parent flex w-full justify-center gap-7 m-10 ml-0 box-border px-1 '>
                <table className='w-3/4 cart-table table1 '>
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

                                let position = newCart.findIndex((value) => value._id === item.product_id);
                                let info = newCart[position]
                                let Add = item.quantity

                                totalPrice += item.price * item.quantity

                                console.log(totalPrice);
                                return (
                                    <tr key={index}>
                                        <td>
                                            <Image className=' size-24 rounded-full cart-img ' src={info?.img} alt='product' height={400} width={400} />
                                        </td>
                                        <td className='cart-title-name'>{info?.title.slice(0, 15)}</td>
                                        <td>{info?.price}</td>
                                        <td>
                                            <div className='border bg-lime-600 w-fit  hover:bg-orange-500 box-border px-2 py-1 text-white'>
                                                <button className=' bg-inherit'>- </button>
                                                <span className='  px-3 py-1 rounded-full'>{Add}</span>
                                                <button className=' bg-inherit' >+</button>
                                            </div>
                                        </td>
                                        <td>{info?.price * Add}</td>
                                        <td>
                                            <button ><FaRegTrashAlt className='text-red-600' size={30} /></button>
                                        </td>
                                    </tr>
                                )
                            }) :

                            <h1 className=' m-auto text-2xl'>Your Cart is empty</h1>
                        }
                    </tbody>
                    <Link href='/cart'>
                        <button className=' bg-orange-400 rounded-xl px-4 py-2 mt-3 active:bg-lime-500 text-white'>Empty Cart</button>
                    </Link>
                </table>


                <div className='w-1/5 cart-sum box-border mr-4 '>
                    <table className='w-full h-96 border m-0 box-border p-5 '>
                        <thead>
                            <tr>
                                <th scope='col' colSpan={2}>CART TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Subtotal</td>
                                <td>${totalPrice}</td>
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
                                <td>${totalPrice + 70}</td>
                            </tr>
                        </tbody>
                        <Link href='/checkout'>
                            <button className=' border mt-4 rounded-lg px-4 py-3  w-full self-center bg-lime-600 text-white'>
                                Checkout
                            </button>
                        </Link>
                    </table>
                </div>
            </div>}
        </>
    )
}
