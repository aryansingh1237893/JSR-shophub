import React from 'react';
import { useSelector } from 'react-redux';
import './WishlistPage.css';

const WishlistPage = () => {
  const { items } = useSelector(state => state.cart); // TODO: Create separate wishlist state

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1>My Wishlist</h1>

        {items.length === 0 ? (
          <div className="empty-wishlist">
            <p>Your wishlist is empty</p>
          </div>
        ) : (
          <div className="wishlist-items">
            {/* Wishlist items will be displayed here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
