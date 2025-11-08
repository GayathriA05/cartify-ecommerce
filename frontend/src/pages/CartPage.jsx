import React, { useEffect, useState } from 'react';
import { getCart, addToCart, deleteFromCart, checkout } from '../api';
import CheckoutModal from '../components/CheckoutModal';
import './CartPage.css';

export default function CartPage({ cart, setCart }) {
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!cart || !Array.isArray(cart.items)) {
          const c = await getCart();
          setCart?.(c);
        }
      } catch (e) {
        console.error('Cart load failed:', e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const handleIncrease = async (productId) => {
    setLoading(true);
    try {
      const updated = await addToCart(productId, 1);
      setCart?.(updated);
    } catch (e) {
      console.error('Failed to update cart:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async (productId) => {
    setLoading(true);
    try {
      const updated = await addToCart(productId, -1);
      setCart?.(updated);
    } catch (e) {
      console.error('Failed to update cart:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    if (!window.confirm('Remove this item from cart?')) return;
    
    setLoading(true);
    try {
      const updated = await deleteFromCart(productId);
      setCart?.(updated);
    } catch (e) {
      console.error('Failed to remove item:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutSuccess = async (receipt) => {
    try {
      const updated = await getCart();
      setCart?.(updated);
      setShowCheckout(false);
    } catch (e) {
      console.error('Failed to refresh cart:', e);
    }
  };

  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;

  if (!items.length) {
    return (
      <div className="cart-page">
        <div className="cart-page__empty">
          <h2 className="cart-page__empty-title">Your cart is empty 🛒</h2>
          <p className="cart-page__empty-text">Add some products to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-page__title">Your Cart</h2>

      <div className="cart-page__items">
        {items.map((item) => (
          <div key={item.productId} className="cart-page__item">
            <div className="cart-page__item-image">
              <img
                src={item.product?.imageMain || '/products/placeholder.jpg'}
                alt={item.product?.name || 'Product'}
                className="cart-page__image"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#f4e9dd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter,Arial" font-size="16" fill="#7b5f46">Image unavailable</text></svg>`);
                }}
              />
            </div>
            <div className="cart-page__item-info">
              <h3 className="cart-page__item-name">{item.product?.name ?? item.productId}</h3>
              <p className="cart-page__item-price">{formatINR(item.product?.price || 0)} each</p>
            </div>

            <div className="cart-page__item-controls">
              <div className="cart-page__qty-controls">
                <button
                  className="cart-page__qty-btn"
                  onClick={() => handleDecrease(item.productId)}
                  disabled={loading}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="cart-page__qty-value">{item.qty}</span>
                <button
                  className="cart-page__qty-btn"
                  onClick={() => handleIncrease(item.productId)}
                  disabled={loading}
                  aria-label="Increase quantity"
                >
                  ＋
                </button>
              </div>

              <div className="cart-page__item-total">
                {formatINR(item.product?.price * item.qty || 0)}
              </div>

              <button
                className="cart-page__remove-btn"
                onClick={() => handleRemove(item.productId)}
                disabled={loading}
                aria-label="Remove item"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-page__footer">
        <div className="cart-page__total">
          <span className="cart-page__total-label">Total:</span>
          <span className="cart-page__total-value">{formatINR(total)}</span>
        </div>
        <button
          className="cart-page__checkout-btn"
          onClick={() => setShowCheckout(true)}
          disabled={loading}
        >
          Proceed to Checkout
        </button>
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        onCheckoutSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}
