import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaStar, FaShoppingCart, FaLeaf, FaTruck, FaShieldAlt, FaMapMarkerAlt, FaRupeeSign, FaCalendarAlt } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({
  product, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite,
  onViewDetails,
  onRequestNow,
  isAlreadyRequested = false,
}) => {
  const { t, i18n } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const defaultImage = '/images/default_crop.jpg';

  const dateLocale = useMemo(() => {
    const lang = (i18n.language || 'en').split('-')[0];
    const localeMap = {
      en: 'en-IN',
      te: 'te-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
    };
    return localeMap[lang] || 'en-IN';
  }, [i18n.language]);
  
  const today = new Date().toISOString().split('T')[0];
  const isExpired = product.availableUntil && product.availableUntil < today;
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleRequestNow = (e) => {
    e.stopPropagation();
    if (!isAlreadyRequested && !isExpired) {
      onRequestNow && onRequestNow(product);
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(product.id);
  };
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className="product-card"
      onClick={() => onViewDetails && onViewDetails(product)}
    >
      {/* Product Image */}
      <div className="product-image-container">
        <img 
          src={imageError ? defaultImage : product.image} 
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={handleImageError}
        />
        
        {/* Badges */}
        <div className="product-badges">
          {product.organic && (
            <span className="badge badge-organic">
              {t('organic')}
            </span>
          )}
          {product.featured && (
            <span className="badge badge-featured">{t('featured')}</span>
          )}
          {product.trending && (
            <span className="badge badge-trending">{t('trending')}</span>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleToggleFavorite}
          aria-label={t('add_to_favorites')}
        >
          <FaHeart />
        </button>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="discount-badge">
            {t('percent_off', { percent: product.discount })}
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
          <span className="sales-count">({t('sales_count', { count: product.totalSales })})</span>
        </div>

        {/* Location */}
        <div className="product-location">
          <FaMapMarkerAlt />
          <span>{product.village}, {product.district}</span>
        </div>

        {/* Availability end date */}
        {product.availableUntil && (() => {
          const today = new Date().toISOString().split('T')[0];
          const isExpired = product.availableUntil < today;
          return (
            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color: isExpired ? '#dc2626' : '#059669', marginTop:4 }}>
              <FaCalendarAlt style={{ fontSize:10 }} />
              {isExpired ? t('expired') : t('available_till')}: {new Date(product.availableUntil + 'T00:00:00').toLocaleDateString(dateLocale, { day:'numeric', month:'short' })}
            </div>
          );
        })()}

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
              <FaTruck /> {t('fast_delivery')}
            </span>
          )}
          {product.certifications && product.certifications.length > 0 && (
            <span className="feature">
              <FaShieldAlt /> {t('certified')}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="product-action-btns">
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={isExpired}
          >
            <FaShoppingCart />
            {t('add_to_cart')}
          </button>
          <button
            className={`request-now-btn ${isExpired ? 'disabled-btn' : ''}`}
            onClick={handleRequestNow}
            disabled={isAlreadyRequested || isExpired}
            title={isExpired ? t('crop_out_of_stock_tooltip') : isAlreadyRequested ? t('already_requested_tooltip') : t('request_this_crop_tooltip')}
          >
            {isExpired ? t('out_of_stock') : isAlreadyRequested ? t('already_requested') : t('request_now')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
