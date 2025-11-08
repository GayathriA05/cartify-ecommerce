import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import "./ProductsGrid.css";
import { getProducts } from "../api";

const ProductsGrid = ({ onAddToCart, cartItems = [] }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load products", e);
        setItems([]);
      }
    })();
  }, []);

  return (
    <div id="products-section" className="products-grid-container">
      <h2 className="section-title">Our Products</h2>
      <div className="products-grid">
        {items.length === 0 ? (
          <p className="empty-state">No products available</p>
        ) : (
          items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              cartItems={cartItems}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsGrid;
