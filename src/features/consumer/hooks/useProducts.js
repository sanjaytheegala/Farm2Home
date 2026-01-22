import { useState, useEffect } from 'react';
import { getAllProducts, subscribeToProducts, getProductsByCategory, getProductsByState } from '../../../services/productsService';

/**
 * Custom hook for managing products from Firestore
 * Provides real-time product data and filtering capabilities
 */
export const useProducts = (options = {}) => {
  const { realtime = false, category = null, state = null } = options;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setProducts(result.products);
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
        setProducts(productsData);
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
