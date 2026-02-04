import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productService, reviewService } from '../services/api';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductById(id);
        setProduct(res.data);

        const reviewsRes = await reviewService.getProductReviews(id);
        setReviews(reviewsRes.data.reviews || []);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product._id,
        title: product.title,
        price: product.discountPrice || product.price,
        image: product.images?.[0]?.url,
        quantity,
      },
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-page">
      <div className="container">
        <div className="product-section">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.images?.[activeImage]?.url || '/placeholder.png'}
                alt={product.title}
              />
            </div>
            <div className="thumbnail-images">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`${product.title}-${idx}`}
                  className={activeImage === idx ? 'active' : ''}
                  onClick={() => setActiveImage(idx)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <h1>{product.title}</h1>

            {/* Rating */}
            <div className="rating-section">
              <div className="stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    className={i < Math.floor(product.rating) ? 'filled' : ''}
                  />
                ))}
              </div>
              <span className="rating-text">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="price-section">
              <h2 className="current-price">
                ₹{product.discountPrice || product.price}
              </h2>
              {product.discountPrice && (
                <div>
                  <span className="original-price">₹{product.price}</span>
                  <span className="discount-percent">{product.discount}% OFF</span>
                </div>
              )}
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="specifications">
                <h3>Specifications</h3>
                <table>
                  <tbody>
                    {product.specifications.map((spec, idx) => (
                      <tr key={idx}>
                        <td className="spec-key">{spec.key}</td>
                        <td className="spec-value">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="cart-section">
              <div className="quantity">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <button className="buy-now-btn">Buy Now</button>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="wishlist-btn">
                <FiHeart /> Save for Later
              </button>
            </div>

            {/* Stock Info */}
            <div className="stock-info">
              {product.stock > 0 ? (
                <p className="in-stock">In Stock</p>
              ) : (
                <p className="out-of-stock">Out of Stock</p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="reviews-section">
          <h2>Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <strong>{review.user?.firstName} {review.user?.lastName}</strong>
                      <span className="review-rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar
                            key={i}
                            className={i < review.rating ? 'filled' : ''}
                          />
                        ))}
                      </span>
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4>{review.title}</h4>
                  <p>{review.comment}</p>
                  {review.images?.length > 0 && (
                    <div className="review-images">
                      {review.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`Review ${idx}`} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductPage;
