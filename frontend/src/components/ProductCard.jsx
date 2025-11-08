import React, { useState, useEffect } from 'react';
import './ProductCard.css';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
    <rect width="100%" height="100%" fill="#f4e9dd"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="Inter,Arial" font-size="20" fill="#7b5f46">Image unavailable</text>
  </svg>`);

const ProductCard = ({ product, onAddToCart, cartItems = [] }) => {
  const { id, name, price, discountPercent, rating = 4.7, imageMain = "", imageHover = "" } = product;
  const [imgSrc, setImgSrc] = useState(imageMain || "");
  
  const cartItem = cartItems.find(item => item.productId === id || item.productId === String(id));
  const [qty, setQty] = useState(cartItem?.qty || 0);

  useEffect(() => {
    const item = cartItems.find(item => item.productId === id || item.productId === String(id));
    setQty(item?.qty || 0);
  }, [cartItems, id]);

  const discountedPrice = discountPercent
    ? Math.round(price - (price * discountPercent) / 100)
    : price;

  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const onEnter = () => { if (imageHover) setImgSrc(imageHover); };
  const onLeave = () => { if (imageMain) setImgSrc(imageMain); };

  const handleAdd = () => { setQty(1); onAddToCart?.(id, 1); };
  const increase  = () => { setQty(prev => prev + 1); onAddToCart?.(id, 1); };
  const decrease  = () => {
    if (qty === 1) { setQty(0); onAddToCart?.(id, -1); return; }
    setQty(prev => prev - 1); onAddToCart?.(id, -1);
  };

  return (
    <article className="product-card">
      <div
        className="image-container"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onEnter}
      >
        {discountPercent ? <span className="discount-badge">-{discountPercent}%</span> : null}
        <img
          src={imgSrc || PLACEHOLDER}
          alt={name}
          className="product-image"
          onError={() => setImgSrc(PLACEHOLDER)}
        />
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <div className="rating">★★★★★ {rating}</div>
        <div className="price-row">
          <span className="price">{formatINR(discountedPrice)}</span>
          {discountPercent ? <span className="price-strike">{formatINR(price)}</span> : null}
        </div>

        {qty === 0 ? (
          <button className="add-btn" onClick={handleAdd}>Add to Cart</button>
        ) : (
          <div className="qty-box">
            <button className="qty-btn" onClick={decrease}>−</button>
            <span className="qty-value">{qty}</span>
            <button className="qty-btn" onClick={increase}>+</button>
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
