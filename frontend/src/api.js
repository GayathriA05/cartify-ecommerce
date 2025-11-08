// API utility functions for communicating with backend

const API_BASE = 'http://localhost:3000/api';

// Generate a UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get or create userId from localStorage
function getUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    // Generate a UUID and store it
    userId = generateUUID();
    localStorage.setItem('userId', userId);
  }
  return userId;
}

// Get headers with userId
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-user-id': getUserId()
  };
}

// Fetch products from backend
export async function getProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Get cart from backend
export async function getCart() {
  try {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

// Add or update item in cart
export async function addToCart(productId, qty) {
  try {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId, qty })
    });
    if (!response.ok) {
      throw new Error('Failed to update cart');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

// Remove item from cart
export async function deleteFromCart(productId) {
  try {
    const response = await fetch(`${API_BASE}/cart/${productId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }
    return await response.json();
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
}

// Checkout
export async function checkout(name, email) {
  try {
    const response = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email })
    });
    if (!response.ok) {
      throw new Error('Failed to process checkout');
    }
    return await response.json();
  } catch (error) {
    console.error('Error processing checkout:', error);
    throw error;
  }
}

