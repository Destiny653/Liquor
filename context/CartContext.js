'use client';
import { createContext, useEffect, useReducer, useState } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const saveCartToLocalStorage = (cart) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(cart));
    }
  };

  const handleAddToCart = (currentItem, qty, index) => {
    forceUpdate();
    let cart = cartItems ?? [];
    let position = cart.findIndex((item) => item.product_id === currentItem?._id);
    let quantity = qty ? cart[position]?.quantity - 1 : position < 0 ? 1 : cart[position]?.quantity + 1;
    let updatedCart = [...cart];

    if (index || index === 0) {
      updatedCart.splice(position, 1);
    } else {
      if (quantity <= 0) {
        updatedCart.splice(position, 1);
      } else if (position === -1) {
        updatedCart.push({
          product_id: currentItem?._id,
          price: currentItem?.price,
          title: currentItem?.title,
          description: currentItem?.content,
          img: currentItem?.img,
          productModel: currentItem?.productModel,
          quantity: 1,
        });
      } else {
        updatedCart[position].quantity = quantity;
      }
    }

    saveCartToLocalStorage(updatedCart);
    setCartItems(updatedCart);
  };

  const emptyCart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cartItems');
    }
    setCartItems([]);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      forceUpdate();
    }
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, handleAddToCart, emptyCart }}>
      {children}
    </CartContext.Provider>
  );
};
