'use client';
import React, { useContext, useEffect, useState } from 'react';
import './check.css';
import { CartContext } from '../../../context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 
import { Notyf } from 'notyf';


export default function Checkout({ amount }) {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [useremail, setUseremail] = useState('')
    const [userRes, setUserRes] = useState('')
    const navigation = useRouter();
    const [loader, setLoader] = useState(false)

    // const {signIn} = useContext(SearchContext)
    // console.log(signIn);
    const { data: session } = useSession()
    console.log(session);

    const { cartItems } = useContext(CartContext)
    console.log(cartItems);

    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

    let totalPrice = 0;
    let totalPriceFix;
    // get email from local storage


    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('email')
        const notyf = new Notyf({
            duration: 3000,
            position: {
                x: 'right',
                y: 'top'
            }
        }); 

        try {

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, cartItems })
            })
            const data = await res.json();
            console.log(data)
            // in success:false
            if(res.status == 404){
                setLoader(false)
                notyf.error(data.message)
                navigation.push('/signup')
            }else if(data.success){
                setLoader(false)
                notyf.success(data.message) 
            }else{ 
                setLoader(false)
                notyf.error('Error placing order: '+res.statusText) 
            }
        } catch (error) {
            setLoader(false)
            notyf.error(`Error placing order: ${error.message}`);
            console.log(error);
        }
    }
    const Load = () => {
        return (
          <div className='loader-p h-[100%] w-full z-10 bg-[#c6c5ec65] fixed top-0'>
            <div className="loader-con">
              <section className='loader-i'></section>
            </div>
          </div>
        )
      }



    return (
        <>

            {/* checkout your card items */}

            <div className='section-con flex justify-center w-full gap-2 pt-6 box-border nav-obscure-view'>
                {
                    loader ? <Load/> : console.log('not loading')
                    
                }
                <form onSubmit={handleSubmit} className=' form-section w-2/4 box-border p-5 pt-0 flex gap-3 flex-col'>
                    <h1 className='roboto text-2xl  font-medium '>Billing details</h1>
                    <fieldset className='flex input-name gap-4'>
                        <label className='flex flex-col w-full gap-1' htmlFor="name">
                            <span>First name*</span>
                            <input className='px-7 py-2 border' type="text" name='text' value={firstname} onChange={e => setFirstname(e.target.value)} />
                        </label>
                        <label className='flex flex-col w-full gap-1' htmlFor="name">
                            <span>Last name*</span>
                            <input className='px-7 py-2 border' type="text" name='text' value={lastname} onChange={e => setLastname(e.target.value)} />
                        </label>
                    </fieldset>
                    <label className='flex flex-col gap-1' htmlFor="email">
                        <span>Email</span>
                        <input className='px-7 py-2 border' type="email" name='text' value={useremail} onChange={e => setUseremail(e.target.value)} />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>Country/Region*</span>
                        <input className='px-7 py-2 border' type="text" name='text' placeholder='USA' />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>Street address*</span>
                        <input className='px-7 py-2 border' type="text" name='text' placeholder='House number and street name' />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>Town/City*</span>
                        <input className='px-7 py-2 border' type="text" name='text' placeholder='City' />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>State*</span>
                        <input className='px-7 py-2 border' type="text" name='text' placeholder='State' />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>Zip/Postal code*</span>
                        <input className='px-7 py-2 border' type="text" name='text' placeholder='Zip code' />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>Phone number*</span>
                        <input className='px-7 py-2 border' type="text" name='text' placeholder='Phone number' />
                    </label>
                    <label className='flex flex-col gap-1' htmlFor="name">
                        <span>Email address*</span>
                        <input className='px-7 py-2 border' type="text" name='text' placeholder='Email address' />
                    </label>
                    <label className='flex gap-4 ' htmlFor="checkbox">
                        <input type="checkbox" name='checkbox' />
                        <span>Create an account</span>
                    </label>
                    <label className='flex gap-4' htmlFor="checkbox">
                        <input type="checkbox" name='checkbox' />
                        <span className='text-xl font-medium '>Ship to a different address?</span>
                    </label>
                    <label className='flex flex-col gap-2' htmlFor="textarea">
                        <span>Additional information</span>
                        <textarea className='border px-6' name="textarea" id="textarea" cols="4" rows="4" placeholder='Notes about your order, e.g. special notes for delivery'></textarea>
                    </label>
                    <button onClick={()=>{setLoader(true)}} className=' text-lg text-white font-medium  roboto py-2 rounded-xl bg-[#610f0f]' type='submit' >Place order</button>
                </form>
                <section className=' table-section w-2/4  box-border p-3 '>
                    <table className='border w-full box-border p-7 mb-3'>
                        <caption className='roboto text-2xl text-left  font-medium mb-3 '>Your order</caption>
                        <thead>
                            <tr>
                                <th className=' border-b text-left pb-4 ' scope='col'>Product name</th>
                                <th className=' border-b text-left pb-4 ' scope='col'>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartItems?.map(item => {

                                    let orderPrice = item.price * item.quantity
                                    totalPrice += item.price * item.quantity; // calculate total price 

                                    return (
                                        <tr key={item.id}>
                                            <td>{item.title}</td>
                                            <td>{formatter.format(orderPrice)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot className='text font-medium'>
                            <tr>
                                <td>Subtotal</td>
                                <td>{formatter.format(totalPrice)}</td>
                            </tr>
                            <tr>
                                <td>Shipping</td>
                                <td>Flat rate</td>
                            </tr>
                            <tr>
                                <td>Tax</td>
                                <td>$70</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>{formatter.format(totalPrice + 70)}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <div className='flex flex-col font-medium  gap-4'>
                        <label className='flex gap-3' htmlFor="radio">
                            <input type="radio" name='radio' />
                            <span>Cash on delivery</span>
                        </label>
                        <label className='flex gap-3' htmlFor="radio">
                            <input type="radio" name='radio' />
                            <span>Paypal</span>
                        </label>
                        <label className='flex gap-3' htmlFor="radio">
                            <input type="radio" name='radio' />
                            <span>Credit card</span>
                        </label>
                    </div> 
                </section>
            </div>
        </>
    )
}
