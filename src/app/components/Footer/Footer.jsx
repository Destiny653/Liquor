import React from 'react';
import "./footer.css"; 
import { FaInstagram } from "react-icons/fa";
import { SiFacebook } from "react-icons/si";
import Link from 'next/link';

export default function Footer() {
  return (
      <div className='footIcon-p'>
                <ul className='footIconCon'>
                    <li>
                        <img className='footImg' src="/images/icon1.jpg" alt="icon" width={40} height={40} />
                        <h1>Family Owned</h1>
                    </li>
                    <li>
                        <img className='footImg' src="/images/icon2.jpg" alt="icon" width={40} height={40} />
                        <h1>Fast Shipping</h1>
                    </li>
                    <li>
                        <img className='footImg' src="/images/icon3.jpg" alt="icon" width={40} height={40} />
                        <h1>#1 Supplier Of Top Shelf <br/> Liquor</h1>
                    </li>
                    <li>
                        <img className='footImg' src="/images/icon4.jpg" alt="icon" width={40} height={40} />
                        <h1>Shipping Insurance To Arrive <br/> Safely</h1>
                    </li>
                    <li>
                        <img className='footImg' src="/images/icon5.jpg" alt="icon" width={40} height={40} />
                        <h1>Subscribe & Save</h1>
                    </li> 
                </ul>
                <section className='footDetail'>
                    <div>
                        <h3 className='font-semibold'>Customer Service</h3>
                        <h4>688388937</h4>
                        <h5>Contact</h5>
                    </div>
                    <div>
                        <ul>
                            <li>Loyalty Program</li>
                            <li>Bottled & Boxed Club</li>
                            <li>Gift Cards</li>
                            <li>Corporate orders</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='font-semibold'>Follow Us</h3>
                        <ul className='social-p'>
                        <FaInstagram className='social-icon' /> 
                        <SiFacebook className='social-icon' />
                        </ul>
                    </div>
                </section>
                <div className='footBase'>
                    <p>�� 2023 LiquorLuxx. All rights reserved.</p>
                    <p><Link href={'/policies/shipping-policy'}>Shipping Policy</Link> | <Link  href={'/policies/terms-and-condition-policy'}>Terms & Conditions</Link> |</p>
                    <p> <Link href={'/policies/privacy-policy'}>Privacy Policy</Link> | <Link href={'/policies/refund-policy'}>Refund Policy</Link></p>
                </div>
            </div>
  )
}
