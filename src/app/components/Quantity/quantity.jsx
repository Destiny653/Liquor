import Link from 'next/link'
import React from 'react'

export default function Qty({ productId }) {
    // if(typeof window !== 'undefined'){}
    const localItems = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('cartItems'))
    const items = localItems && localItems.find((item) => item.product_id === productId)
    if (!items) return null
    
    return (
        <div className='cart-item-display flex items-center justify-center'>
            <Link href={'/cart'}>
                <span>{items ? items.quantity : 0}</span>
            </Link>
        </div>
    )
}
