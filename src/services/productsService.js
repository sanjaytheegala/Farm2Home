/**
 * Products Service - Handle all localStorage operations for products
 */

// Get all products
export const getAllProducts = async () => {
  try {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    // Sort by createdAt (newest first)
    allCrops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, products: allCrops };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, error: error.message };
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const products = allCrops
      .filter(crop => crop.category === category)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, products };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return { success: false, error: error.message };
  }
};

// Get products by state
export const getProductsByState = async (state) => {
  try {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const products = allCrops
      .filter(crop => crop.state === state)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, products };
  } catch (error) {
    console.error('Error fetching products by state:', error);
    return { success: false, error: error.message };
  }
};

// Add new product
export const addProduct = async (productData) => {
  try {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const newProduct = {
      ...productData,
      id: 'crop_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    allCrops.push(newProduct);
    localStorage.setItem('crops', JSON.stringify(allCrops));
    return { success: true, productId: newProduct.id };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message };
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const updatedCrops = allCrops.map(crop => 
      crop.id === productId ? { ...crop, ...productData, updatedAt: new Date().toISOString() } : crop
    );
    localStorage.setItem('crops', JSON.stringify(updatedCrops));
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const updatedCrops = allCrops.filter(crop => crop.id !== productId);
    localStorage.setItem('crops', JSON.stringify(updatedCrops));
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
};

// Real-time listener for products (simulated with polling)
export const subscribeToProducts = (callback) => {
  try {
    // Initial load
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    allCrops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback(allCrops);
    
    // Poll for changes every 5 seconds
    const interval = setInterval(() => {
      const updatedCrops = JSON.parse(localStorage.getItem('crops') || '[]');
      updatedCrops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(updatedCrops);
    }, 5000);
    
    // Return unsubscribe function
    return () => clearInterval(interval);
  } catch (error) {
    console.error('Error subscribing to products:', error);
    return () => {};
  }
};

// Search products
export const searchProducts = async (searchTerm) => {
  try {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    
    const products = allCrops.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name?.toLowerCase().includes(searchLower) ||
        product.cropName?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower)
      );
    });
    
    return { success: true, products };
  } catch (error) {
    console.error('Error searching products:', error);
    return { success: false, error: error.message };
  }
};

// Get featured products
export const getFeaturedProducts = async () => {
  try {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const products = allCrops
      .filter(crop => crop.featured === true)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, products };
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return { success: false, error: error.message };
  }
};

// Get trending products
export const getTrendingProducts = async () => {
  try {
    const allCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    const products = allCrops
      .filter(crop => crop.trending === true)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, products };
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return { success: false, error: error.message };
  }
};
