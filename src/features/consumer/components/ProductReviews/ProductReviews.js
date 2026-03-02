import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../../context/ToastContext';
// import { db, collection, addDoc, getDocs, query, where, orderBy, auth } from '../../../../firebase';
import { FaStar, FaThumbsUp, FaThumbsDown, FaFlag, FaCheckCircle } from 'react-icons/fa';
import './ProductReviews.css';

const ProductReviews = ({ productId, productName }) => {
  const { t } = useTranslation();
  const { success: toastSuccess, error: toastError, warning: toastWarning } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    quality: 5,
    freshness: 5,
    packaging: 5,
    delivery: 5
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      // TODO: Uncomment when Firebase is configured
      // const reviewsRef = collection(db, 'reviews');
      // const q = query(reviewsRef, where('productId', '==', productId), orderBy('createdAt', 'desc'));
      // const querySnapshot = await getDocs(q);
      // const reviewsList = [];
      // querySnapshot.forEach((doc) => { reviewsList.push({ id: doc.id, ...doc.data() }); });
      // setReviews(reviewsList);
      
      // Mock reviews for now
      setReviews([]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in using localStorage
    const currentUser = JSON.parse(localStorage.getItem('mockUserData') || '{}');
    if (!currentUser.uid) {
      toastWarning(t('please_login_to_review'));
      return;
    }

    setSubmitting(true);

    try {
      // Mock review submission (can be replaced with actual Firestore implementation)
      setNewReview({
        rating: 5,
        title: '',
        comment: '',
        quality: 5,
        freshness: 5,
        packaging: 5,
        delivery: 5
      });
      setShowReviewForm(false);
      
      // Refresh reviews
      fetchReviews();
      toastSuccess(t('review_submitted') || 'Review submitted successfully!');
    } catch (error) {
      toastError(t('review_error') || 'Error submitting review');
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating, size = '1.2rem') => {
    return (
      <div className="stars-container" style={{ fontSize: size }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? 'star filled' : 'star empty'}
          />
        ))}
      </div>
    );
  };

  const renderRatingInput = (label, key) => {
    return (
      <div className="rating-input-group">
        <label>{label}</label>
        <div className="rating-stars-input">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={star <= newReview[key] ? 'star filled clickable' : 'star empty clickable'}
              onClick={() => setNewReview({ ...newReview, [key]: star })}
            />
          ))}
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t('today');
    if (diffDays === 1) return t('yesterday');
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="product-reviews-container">
      {/* Reviews Header */}
      <div className="reviews-header">
        <div className="reviews-summary">
          <div className="average-rating-display">
            <div className="rating-number">{calculateAverageRating()}</div>
            {renderStars(calculateAverageRating(), '1.5rem')}
            <div className="reviews-count">
              {t('based_on_reviews', { count: reviews.length })}
            </div>
          </div>
        </div>
        
        <button 
          className="write-review-btn"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          {t('write_review')}
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <h3>{t('add_review')}</h3>
          
          {/* Overall Rating */}
          {renderRatingInput(t('your_rating'), 'rating')}

          {/* Detailed Ratings */}
          <div className="detailed-ratings">
            {renderRatingInput(t('quality'), 'quality')}
            {renderRatingInput(t('freshness'), 'freshness')}
            {renderRatingInput(t('packaging'), 'packaging')}
            {renderRatingInput(t('delivery'), 'delivery')}
          </div>

          {/* Review Title */}
          <div className="form-group">
            <label>{t('review_title')}</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              placeholder="Summarize your experience"
              required
            />
          </div>

          {/* Review Comment */}
          <div className="form-group">
            <label>{t('your_review')}</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share details about your experience with this product"
              rows="5"
              required
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => setShowReviewForm(false)}
            >
              {t('cancel')}
            </button>
            <button 
              type="submit" 
              className="submit-review-btn"
              disabled={submitting}
            >
              {submitting ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {loading ? (
          <div className="loading-message">{t('loading')}...</div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews-message">
            <p>{t('no_reviews_yet')}</p>
            <p>{t('be_first_to_review')}</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="reviewer-details">
                    <div className="reviewer-name">
                      {review.userName}
                      {review.verified && (
                        <span className="verified-badge">
                          <FaCheckCircle /> {t('verified_purchase')}
                        </span>
                      )}
                    </div>
                    <div className="review-date">{formatDate(review.createdAt)}</div>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              {review.title && (
                <h4 className="review-title">{review.title}</h4>
              )}

              <p className="review-comment">{review.comment}</p>

              {/* Detailed Ratings */}
              <div className="review-detailed-ratings">
                <div className="detail-rating">
                  <span>{t('quality')}:</span>
                  {renderStars(review.quality, '0.9rem')}
                </div>
                <div className="detail-rating">
                  <span>{t('freshness')}:</span>
                  {renderStars(review.freshness, '0.9rem')}
                </div>
                <div className="detail-rating">
                  <span>{t('packaging')}:</span>
                  {renderStars(review.packaging, '0.9rem')}
                </div>
                <div className="detail-rating">
                  <span>{t('delivery')}:</span>
                  {renderStars(review.delivery, '0.9rem')}
                </div>
              </div>

              {/* Review Actions */}
              <div className="review-actions">
                <button className="helpful-btn">
                  <FaThumbsUp /> {t('helpful')} ({review.helpful || 0})
                </button>
                <button className="not-helpful-btn">
                  <FaThumbsDown /> ({review.notHelpful || 0})
                </button>
                <button className="report-btn">
                  <FaFlag /> {t('report')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
