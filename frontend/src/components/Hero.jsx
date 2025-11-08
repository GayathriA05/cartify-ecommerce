import React from 'react';
import './Hero.css';

const Hero = () => {
  const scrollToProducts = () => {
    const section = document.getElementById('products-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Elevate Your Workspace</h1>
        <p className="hero-subtitle">Premium desk accessories crafted to enhance comfort and productivity.</p>
        <button className="hero-btn" onClick={scrollToProducts}>Shop Now</button>
      </div>
    </section>
  );
};

export default Hero;
