import React, { useState } from 'react';
import './CheckoutModal.css';
import { checkout } from '../api';

const CheckoutModal = ({ isOpen, onClose, cart, onCheckoutSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      const result = await checkout(name.trim(), email.trim());
      setReceipt(result);
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (receipt && onCheckoutSuccess) {
      onCheckoutSuccess(receipt);
    }
    setName('');
    setEmail('');
    setReceipt(null);
    setError('');
    onClose();
  };

  return (
    <div className="checkout-modal__overlay" onClick={handleClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-modal__close" onClick={handleClose}>×</button>
        
        {!receipt ? (
          <>
            <h2 className="checkout-modal__title">Checkout</h2>
            <form className="checkout-modal__form" onSubmit={handleSubmit}>
              {error && <div className="checkout-modal__error">{error}</div>}
              
              <div className="checkout-modal__field">
                <label htmlFor="checkout-name">Name *</label>
                <input
                  type="text"
                  id="checkout-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="checkout-modal__field">
                <label htmlFor="checkout-email">Email *</label>
                <input
                  type="email"
                  id="checkout-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="checkout-modal__summary">
                <div className="checkout-modal__summary-row">
                  <span>Items:</span>
                  <span>{cart?.items?.length || 0}</span>
                </div>
                <div className="checkout-modal__summary-row checkout-modal__summary-row--total">
                  <span>Total:</span>
                  <span>{formatINR(cart?.total || 0)}</span>
                </div>
              </div>
              
              <div className="checkout-modal__actions">
                <button
                  type="button"
                  className="checkout-modal__btn checkout-modal__btn--secondary"
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="checkout-modal__btn checkout-modal__btn--primary"
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="checkout-modal__receipt">
            <div className="checkout-modal__success-message">
              <div className="checkout-modal__success-icon">✓</div>
              <h2 className="checkout-modal__title">Order Successful!</h2>
              <p className="checkout-modal__success-text">Thank you for your purchase. Your order has been confirmed.</p>
            </div>
            <div className="checkout-modal__receipt-content">
              <div className="checkout-modal__receipt-section">
                <div className="checkout-modal__receipt-row">
                  <span className="checkout-modal__receipt-label">Receipt ID:</span>
                  <span className="checkout-modal__receipt-value">{receipt.receiptId}</span>
                </div>
                <div className="checkout-modal__receipt-row">
                  <span className="checkout-modal__receipt-label">Name:</span>
                  <span className="checkout-modal__receipt-value">{receipt.name}</span>
                </div>
                <div className="checkout-modal__receipt-row">
                  <span className="checkout-modal__receipt-label">Email:</span>
                  <span className="checkout-modal__receipt-value">{receipt.email}</span>
                </div>
                <div className="checkout-modal__receipt-row">
                  <span className="checkout-modal__receipt-label">Date:</span>
                  <span className="checkout-modal__receipt-value">{formatDate(receipt.timestamp)}</span>
                </div>
              </div>
              
              <div className="checkout-modal__receipt-section">
                <h3 className="checkout-modal__receipt-heading">Items</h3>
                {receipt.items?.map((item, idx) => (
                  <div key={idx} className="checkout-modal__receipt-item">
                    <span>{item.name}</span>
                    <span>Qty: {item.qty} × {formatINR(item.price)}</span>
                  </div>
                ))}
              </div>
              
              <div className="checkout-modal__receipt-section checkout-modal__receipt-section--total">
                <div className="checkout-modal__receipt-row checkout-modal__receipt-row--total">
                  <span className="checkout-modal__receipt-label">Total:</span>
                  <span className="checkout-modal__receipt-value">{formatINR(receipt.total)}</span>
                </div>
              </div>
            </div>
            
            <button
              className="checkout-modal__btn checkout-modal__btn--primary"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
