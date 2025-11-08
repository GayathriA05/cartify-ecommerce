import React from 'react';
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ cartCount = 0 }) => {
  const location = useLocation();

  const handleProductsClick = (e) => {
    e.preventDefault();

    if (location.pathname !== "/") {
      // First navigate home, then scroll
      window.location.href = "/#products-section";
    } else {
      // Already on page → just scroll
      const section = document.getElementById("products-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">Cartify</Link>
      </div>

      <div className="nav-right">
        <a href="/#products-section" onClick={handleProductsClick} className="nav-link">
          Products
        </a>

        <Link to="/cart" className="cart-btn" aria-label="Open cart">
          <span className="cart-icon">🛒</span>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
