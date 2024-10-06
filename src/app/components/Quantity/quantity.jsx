import React from 'react'

export default function Qty({productId}) { 
    const localItems = JSON.parse(localStorage.getItem('cartItems')) 
    const items = localItems.find((item)=> item.product_id === productId) 
    return (
        <div className='cart-item-display flex items-center justify-center'>
            <span>{items? items.quantity : 0}</span>
        </div>
    )
}
