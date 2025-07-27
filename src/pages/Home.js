import React, { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Honey Palace</h1>
          <p>Pure, Natural, and Delicious Honey Products</p>
          <a href="/shop" className="shop-btn">Shop Now</a>
        </div>
      </section>
      <section className="products-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            products.map(product => (
              <div className="product-card" key={product.id}>
                <img src={product.image} alt={product.name} className="product-img" />
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price}</span>
                  <button className="add-cart-btn">Add to Cart</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
