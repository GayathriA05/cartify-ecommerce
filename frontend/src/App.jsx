import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductsGrid from './components/ProductsGrid';
import CartPage from './pages/CartPage';

import { getCart, addToCart } from './api';

export default function App() {
  const [cart, setCart] = useState({ items: [], total: 0 });

  const currency = useMemo(
    () => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const crt = await getCart?.();
        if (crt) setCart(crt);
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    })();
  }, []);

  const onAddToCart = async (productId, qty = 1) => {
    try {
      const updated = await addToCart(productId, qty);
      setCart(updated);
    } catch (e) {
      console.error('Add to cart failed:', e);
    }
  };

  const totalQty = cart.items?.reduce((sum, item) => sum + item.qty, 0) || 0;

  return (
    <div className="app">
      <Navbar cartCount={totalQty} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <ProductsGrid onAddToCart={onAddToCart} cartItems={cart.items || []} />
            </>
          }
        />

        <Route
          path="/cart"
          element={<CartPage cart={cart} setCart={setCart} />}
        />
      </Routes>
    </div>
  );
}
