import React from 'react';
import { FaHeart, FaStar, FaShoppingCart, FaLeaf, FaTruck, FaShieldAlt, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite,
  onViewDetails 
}) => {
  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(product.id);
  };

  return (
    <div 
      className="product-card"
      onClick={() => onViewDetails && onViewDetails(product)}
    >
      {/* Product Image */}
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="product-badges">
          {product.organic && (
            <span className="badge badge-organic">
              <FaLeaf /> Organic
            </span>
          )}
          {product.featured && (
            <span className="badge badge-featured">Featured</span>
          )}
          {product.trending && (
            <span className="badge badge-trending">Trending</span>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleToggleFavorite}
          aria-label="Add to favorites"
        >
          <FaHeart />
        </button>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="discount-badge">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {/* Rating */}
        <div className="product-rating">
          <FaStar className="star-icon" />
          <span>{product.rating}</span>
          <span className="sales-count">({product.totalSales} sales)</span>
        </div>

        {/* Location */}
        <div className="product-location">
          <FaMapMarkerAlt />
          <span>{product.village}, {product.district}</span>
        </div>

        {/* Price */}
        <div className="product-pricing">
          <div className="current-price">
            <FaRupeeSign />
            <span className="price">{product.pricePerKg}</span>
            <span className="unit">/{product.unit}</span>
          </div>
          {product.originalPrice > product.pricePerKg && (
            <div className="original-price">
              <FaRupeeSign />
              <span>{product.originalPrice}</span>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="product-features">
          {product.fastDelivery && (
            <span className="feature">
              <FaTruck /> Fast Delivery
            </span>
          )}
          {product.certifications && product.certifications.length > 0 && (
            <span className="feature">
              <FaShieldAlt /> Certified
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          <FaShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
