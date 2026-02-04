import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              ShopHub
            </Link>

            <form className="search-bar" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <FiSearch />
              </button>
            </form>

            <nav className="header-nav">
              <Link to="/wishlist" className="nav-link">
                <FiHeart /> Wishlist
              </Link>
              <Link to="/cart" className="nav-link cart-link">
                <FiShoppingCart />
                {items.length > 0 && <span className="cart-count">{items.length}</span>}
              </Link>
              {isLoggedIn ? (
                <div className="user-menu">
                  <FiUser /> {user?.firstName}
                  <div className="dropdown">
                    <Link to="/profile">Profile</Link>
                    <Link to="/orders">Orders</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="nav-link">
                  <FiUser /> Login
                </Link>
              )}
            </nav>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="categories-bar">
        <div className="container">
          <div className="categories-scroll">
            <Link to="/?category=electronics">Electronics</Link>
            <Link to="/?category=fashion">Fashion</Link>
            <Link to="/?category=home">Home</Link>
            <Link to="/?category=books">Books</Link>
            <Link to="/?category=sports">Sports</Link>
            <Link to="/deals">Deals</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
