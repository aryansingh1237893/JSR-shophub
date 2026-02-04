import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [dealsOfDay, setDealsOfDay] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [best, deals, recomm] = await Promise.all([
          productService.getBestSellers(),
          productService.getDealsOfDay(),
          productService.getRecommended(),
        ]);
        setBestSellers(best.data);
        setDealsOfDay(deals.data);
        setRecommended(recomm.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to ShopHub</h1>
          <p>Discover millions of products at great prices</p>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section">
        <div className="container">
          <h2>Best Sellers</h2>
          <div className="products-grid">
            {bestSellers.slice(0, 8).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Deals of the Day */}
      <section className="section">
        <div className="container">
          <h2>Today's Deals</h2>
          <div className="products-grid">
            {dealsOfDay.slice(0, 8).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="section">
        <div className="container">
          <h2>Recommended For You</h2>
          <div className="products-grid">
            {recommended.slice(0, 8).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
