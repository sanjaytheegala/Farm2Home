import { useState, useEffect } from 'react';

/**
 * Custom hook to manage favorite products
 * Handles favorites list and localStorage persistence
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = (productId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter(id => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };

  // Check if product is favorite
  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };
};
