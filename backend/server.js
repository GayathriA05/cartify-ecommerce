import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory cart storage: Map<userId, { items: Array<{productId, qty, product}> }>
const carts = new Map();

// Load products from JSON file
const productsData = JSON.parse(
  readFileSync(join(__dirname, 'products.json'), 'utf-8')
);

// Helper function to get or create cart for a user
function getCart(userId) {
  if (!carts.has(userId)) {
    carts.set(userId, { items: [] });
  }
  return carts.get(userId);
}

// Helper function to calculate total
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

// API Routes

// 1. GET /api/products - Returns all products with full image URLs
app.get('/api/products', (req, res) => {
  try {
    const mapped = productsData.map(p => ({
      ...p,
      imageMain: p.images?.main ? `/products/${p.images.main}` : "",
      imageHover: p.images?.hover ? `/products/${p.images.hover}` : ""
    }));
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 2. GET /api/cart - Returns cart for the user
app.get('/api/cart', (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ error: 'x-user-id header is required' });
    }

    const cart = getCart(userId);
    const total = calculateTotal(cart.items);

    res.json({
      items: cart.items,
      total: total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// 3. POST /api/cart - Add or update item in cart
app.post('/api/cart', (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ error: 'x-user-id header is required' });
    }

    const { productId, qty } = req.body;

    if (!productId || qty === undefined) {
      return res.status(400).json({ error: 'productId and qty are required' });
    }

    // Find product
    const product = productsData.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const cart = getCart(userId);
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const newQty = cart.items[existingItemIndex].qty + qty;

      if (newQty <= 0) {
        // Remove item if qty becomes 0 or negative
        cart.items.splice(existingItemIndex, 1);
      } else {
        // Update qty
        cart.items[existingItemIndex].qty = newQty;
      }
    } else {
      // Add new item (only if qty > 0)
      if (qty > 0) {
        cart.items.push({
          productId,
          qty,
          product
        });
      } else {
        return res.status(400).json({ error: 'Cannot add item with qty <= 0' });
      }
    }

    const total = calculateTotal(cart.items);

    res.json({
      items: cart.items,
      total: total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// 4. DELETE /api/cart/:id - Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ error: 'x-user-id header is required' });
    }

    const productId = req.params.id; // ✅ treat as string
    const cart = getCart(userId);

    const itemIndex = cart.items.findIndex(
      item => item.productId === productId
    );

    if (itemIndex >= 0) {
      cart.items.splice(itemIndex, 1);
    }

    const total = calculateTotal(cart.items);

    res.json({
      items: cart.items,
      total: total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// 5. POST /api/checkout - Process checkout and clear cart
app.post('/api/checkout', (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ error: 'x-user-id header is required' });
    }

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }

    const cart = getCart(userId);

    if (cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Create a snapshot of cart items before clearing
    const cartItemsSnapshot = cart.items.map(item => ({
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      qty: item.qty
    }));

    const total = calculateTotal(cart.items);
    const receiptId = `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // Create receipt with snapshot data
    const receipt = {
      receiptId,
      total,
      timestamp,
      items: cartItemsSnapshot,
      name,
      email
    };

    // Clear cart AFTER creating receipt
    cart.items = [];

    // Send receipt response
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📦 Products loaded: ${productsData.length} items`);
});

