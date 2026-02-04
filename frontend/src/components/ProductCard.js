import React from 'react';
import { Link, useDispatch } from 'react-redux';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product._id,
        title: product.title,
        price: product.discountPrice || product.price,
        image: product.images?.[0]?.url,
      },
    });
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-image-link">
        <img
          src={product.images?.[0]?.url || '/placeholder.png'}
          alt={product.title}
          className="product-image"
        />
        {product.discount && (
          <div className="discount-badge">{product.discount}% OFF</div>
        )}
      </Link>

      <div className="product-info">
        <Link to={`/product/${product._id}`} className="product-title">
          {product.title}
        </Link>

        <div className="rating">
          <FiStar className="star-icon" />
          <span className="rating-value">
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>

        <div className="price">
          <span className="current-price">₹{product.discountPrice || product.price}</span>
          {product.discountPrice && (
            <span className="original-price">₹{product.price}</span>
          )}
        </div>

        <div className="product-actions">
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <FiShoppingCart /> Add to Cart
          </button>
          <button className="wishlist-btn">
            <FiHeart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
