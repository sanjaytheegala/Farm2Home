import { db } from '../firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, query, where, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore';

const cropsRef = collection(db, 'crops');

const isValidYmd = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);

const isExpiredByAvailableUntil = (item, todayYmd) => {
  const availableUntil = (item?.availableUntil || '').toString().trim();
  if (!availableUntil) return false;
  if (!isValidYmd(availableUntil)) return false;
  // Format YYYY-MM-DD is lexicographically sortable
  return availableUntil < todayYmd;
};

// Get all products
export const getAllProducts = async () => {
  try {
    const q = query(cropsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const today = new Date().toISOString().split('T')[0];
    const products = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => !isExpiredByAvailableUntil(p, today));
    return { success: true, products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const q = query(cropsRef, where('category', '==', category), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const today = new Date().toISOString().split('T')[0];
    const products = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => !isExpiredByAvailableUntil(p, today));
    return { success: true, products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get products by state
export const getProductsByState = async (state) => {
  try {
    const q = query(cropsRef, where('state', '==', state), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const today = new Date().toISOString().split('T')[0];
    const products = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => !isExpiredByAvailableUntil(p, today));
    return { success: true, products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add new product
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(cropsRef, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, productId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    await updateDoc(doc(db, 'crops', productId), {
      ...productData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'crops', productId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Real-time listener for products using Firestore onSnapshot
export const subscribeToProducts = (callback) => {
  const q = query(cropsRef, orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const today = new Date().toISOString().split('T')[0];
    const products = snapshot.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => !isExpiredByAvailableUntil(p, today));
    callback(products);
  });
  return unsubscribe;
};

// Search products (client-side filter after Firestore fetch)
export const searchProducts = async (searchTerm) => {
  try {
    const { products } = await getAllProducts();
    const lower = searchTerm.toLowerCase();
    const filtered = (products || []).filter(p =>
      p.name?.toLowerCase().includes(lower) ||
      p.cropName?.toLowerCase().includes(lower) ||
      p.description?.toLowerCase().includes(lower) ||
      p.category?.toLowerCase().includes(lower)
    );
    return { success: true, products: filtered };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Cleanup stale crops: client-side filtering for expired items.
// NOTE: Actual deletion is handled by a scheduled Cloud Function (Admin SDK),
// so pages stay clean even if the app isn't opened.
export const cleanupStaleProducts = async (products) => {
  if (!products || products.length === 0) return [];
  const today = new Date().toISOString().split('T')[0];
  return products.filter(p => !isExpiredByAvailableUntil(p, today));
};

// Get featured products
export const getFeaturedProducts = async () => {
  try {
    const q = query(cropsRef, where('featured', '==', true), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return { success: true, products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get trending products
export const getTrendingProducts = async () => {
  try {
    const q = query(cropsRef, where('trending', '==', true), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return { success: true, products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
