function Cart({ cart, onUpdateQty, onRemove, onCheckout }) {
  // Format price in INR using Intl.NumberFormat
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty</p>
        <p className="cart-empty-hint">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="cart-item-info">
              <h4 className="cart-item-name">{item.product.name}</h4>
              <p className="cart-item-price">
                {formatPrice(item.product.price)} × {item.qty} = {formatPrice(item.product.price * item.qty)}
              </p>
            </div>
            <div className="cart-item-actions">
              <button
                className="btn btn-icon"
                onClick={() => onUpdateQty(item.productId, -1)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="cart-item-qty">{item.qty}</span>
              <button
                className="btn btn-icon"
                onClick={() => onUpdateQty(item.productId, 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
              <button
                className="btn btn-danger btn-small"
                onClick={() => onRemove(item.productId)}
                aria-label="Remove item"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          <strong>Total: {formatPrice(cart.total)}</strong>
        </div>
        <button className="btn btn-primary btn-large" onClick={onCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;

