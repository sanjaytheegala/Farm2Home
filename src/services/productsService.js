import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Products Service - Handle all Firestore operations for products
 */

// Get all products
export const getAllProducts = async () => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = [];
    productsSnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return { success: true, products };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, error: error.message };
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const q = query(collection(db, 'products'), where('category', '==', category));
    const productsSnapshot = await getDocs(q);
    const products = [];
    productsSnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return { success: true, products };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return { success: false, error: error.message };
  }
};

// Get products by state
export const getProductsByState = async (state) => {
  try {
    const q = query(collection(db, 'products'), where('state', '==', state));
    const productsSnapshot = await getDocs(q);
    const products = [];
    productsSnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return { success: true, products };
  } catch (error) {
    console.error('Error fetching products by state:', error);
    return { success: false, error: error.message };
  }
};

// Add new product
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, productId: docRef.id };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message };
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    await updateDoc(doc(db, 'products', productId), {
      ...productData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
};

// Real-time listener for products
export const subscribeToProducts = (callback) => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(products);
  }, (error) => {
    console.error('Error in products subscription:', error);
    callback([]);
  });
};

// Search products
export const searchProducts = async (searchTerm) => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = [];
    productsSnapshot.forEach((doc) => {
      const data = doc.data();
      // Simple search - check if name or description contains search term
      if (
        data.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.category?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        products.push({
          id: doc.id,
          ...data
        });
      }
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
    const q = query(collection(db, 'products'), where('featured', '==', true));
    const productsSnapshot = await getDocs(q);
    const products = [];
    productsSnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return { success: true, products };
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return { success: false, error: error.message };
  }
};

// Get trending products
export const getTrendingProducts = async () => {
  try {
    const q = query(collection(db, 'products'), where('trending', '==', true));
    const productsSnapshot = await getDocs(q);
    const products = [];
    productsSnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return { success: true, products };
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return { success: false, error: error.message };
  }
};
