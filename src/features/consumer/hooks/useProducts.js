import { useState, useEffect } from 'react';
import { getAllProducts, subscribeToProducts, getProductsByCategory, getProductsByState } from '../../../services/productsService';
import { getSmartCropImage } from '../../../utils/smartImageMapper';

/**
 * Custom hook for managing products from Firestore
 * Provides real-time product data and filtering capabilities
 * Now with smart image mapping for multi-language support
 */
export const useProducts = (options = {}) => {
  const { realtime = false, category = null, state = null } = options;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Process products with smart image mapping
   * Handles translation and fuzzy matching for crop names
   */
  const processProductsWithSmartImages = (productsData) => {
    return productsData.map(product => ({
      ...product,
      // Use smart image mapper if product doesn't have an image or needs translation
      image: product.image || getSmartCropImage(product.name || product.cropName, product.category),
      // Store original name for reference
      originalName: product.name || product.cropName
    }));
  };

  useEffect(() => {
    let unsubscribe;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let result;
        
        // Fetch based on filters
        if (category) {
          result = await getProductsByCategory(category);
        } else if (state) {
          result = await getProductsByState(state);
        } else {
          result = await getAllProducts();
        }

        if (result.success) {
          // Process products with smart image mapping
          const processedProducts = processProductsWithSmartImages(result.products);
          setProducts(processedProducts);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Real-time updates if enabled
    if (realtime && !category && !state) {
      unsubscribe = subscribeToProducts((productsData) => {
        // Process products with smart image mapping
        const processedProducts = processProductsWithSmartImages(productsData);
        setProducts(processedProducts);
        setLoading(false);
      });
    } else {
      fetchProducts();
    }

    // Cleanup subscription
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [realtime, category, state]);

  return { products, loading, error };
};
