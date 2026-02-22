import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '../../../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Custom hook for managing crop operations with Firebase Firestore
 * Handles CRUD operations for crops and analytics calculation
 */
export const useCrops = () => {
  const [savedCrops, setSavedCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalCrops: 0,
    totalValue: 0,
    availableCrops: 0,
    soldCrops: 0
  });

  // Calculate analytics from saved crops
  const calculateAnalytics = useCallback(() => {
    const totalCrops = savedCrops.length;
    const totalValue = savedCrops.reduce((sum, crop) => sum + (parseFloat(crop.price) || 0), 0);
    const availableCrops = savedCrops.filter(crop => crop.status === 'available').length;
    const soldCrops = savedCrops.filter(crop => crop.status === 'sold').length;

    setAnalytics({
      totalCrops,
      totalValue,
      availableCrops,
      soldCrops
    });
  }, [savedCrops]);

  // Load all crops from Firebase Firestore
  const loadCrops = async () => {
    setLoading(true);
    try {
      // Wait for Firebase Auth to be ready and get current user
      const user = auth.currentUser;
      
      if (!user) {
        // Try to get from localStorage as fallback
        const localUser = localStorage.getItem('currentUser');
        if (localUser) {
          try {
            const parsedUser = JSON.parse(localUser);
            const userId = parsedUser.uid || parsedUser.id;
            
            if (userId) {
              await queryFirestoreForCrops(userId);
            } else {
              setSavedCrops([]);
            }
          } catch (err) {
            setSavedCrops([]);
          }
        } else {
          setSavedCrops([]);
        }
        setLoading(false);
        return;
      }

      // User is authenticated via Firebase Auth
      const userId = user.uid;

      await queryFirestoreForCrops(userId);
      
    } catch (error) {

      setSavedCrops([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to query Firestore
  const queryFirestoreForCrops = async (userId) => {
    try {
      // Simple single-field query — no composite index needed
      const cropsRef = collection(db, 'crops');
      const q = query(
        cropsRef,
        where('farmerId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const farmerCrops = [];

      querySnapshot.forEach((docSnap) => {
        farmerCrops.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Sort newest-first client-side so no composite index is required
      farmerCrops.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const tb = b.createdAt?.toMillis?.() ?? (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return tb - ta;
      });

      setSavedCrops(farmerCrops);
    } catch (error) {
      throw error;
    }
  };

  // Add new crop to Firebase Firestore
  const addCrop = async (cropData) => {
    setLoading(true);
    try {
      // Get current authenticated user directly from Firebase Auth
      const user = auth.currentUser;
      
      if (!user) {

        alert('⚠️ Please log in first to add crops.\n\nGo to Login page and sign in with your account.');
        return { success: false, error: 'User not authenticated' };
      }

      // Use uid directly from Firebase Auth user
      const userId = user.uid;
      const userEmail = user.email || '';


      // Validate required fields
      const cropNameField = cropData.cropName || cropData.crop;
      if (!cropNameField || !cropData.price || !cropData.quantity) {
        alert('⚠️ Please fill in all required fields: Crop Name, Price, and Quantity');
        return { success: false, error: 'Missing required fields' };
      }
      
      // Create new crop data with exact schema: farmerId (uid), status: 'pending'
      const newCropData = {
        cropName: cropNameField,
        crop: cropNameField, // For backwards compatibility
        price: parseFloat(cropData.price) || 0,
        quantity: cropData.quantity,
        notes: cropData.notes || '',
        status: 'pending',  // Exactly as required
        farmerId: userId,   // Use uid from Firebase Auth
        farmerEmail: userEmail,
        state: cropData.state || '',
        district: cropData.district || '',
        createdAt: serverTimestamp()
      };
      

      const cropsRef = collection(db, 'crops');
      const docRef = await addDoc(cropsRef, newCropData);
      
      // Add to local state with the new document ID
      const newCrop = {
        id: docRef.id,
        ...newCropData,
        createdAt: new Date().toISOString() // For immediate display
      };
      
      setSavedCrops([newCrop, ...savedCrops]);
      return { success: true, crop: newCrop };
    } catch (error) {
      let errorMessage = 'Failed to add crop: ';
      if (error.code === 'permission-denied') {
        errorMessage += 'Permission denied. Make sure you are properly authenticated.';
      } else if (error.code === 'unauthenticated') {
        errorMessage += 'User not authenticated. Please log in again.';
      } else {
        errorMessage += error.message || 'Unknown error';
      }
      alert('❌ ' + errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete crop from Firebase Firestore
  const deleteCrop = async (cropId, isAdminDelete = false, reason = '') => {
    try {
      const cropDocRef = doc(db, 'crops', cropId);
      await deleteDoc(cropDocRef);
      
      setSavedCrops(savedCrops.filter(crop => crop.id !== cropId));
      return { success: true };
    } catch (error) {
      alert('❌ Failed to delete crop: ' + (error.message || 'Unknown error'));
      return { success: false, error: error.message };
    }
  };

  // Update crop status in Firebase Firestore
  const updateCropStatus = async (cropId, newStatus) => {
    try {
      console.log('♻️ Attempting to update crop status:', cropId, newStatus);
      
      // Update in Firestore
      const cropDocRef = doc(db, 'crops', cropId);
      await updateDoc(cropDocRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      setSavedCrops(savedCrops.map(crop => 
        crop.id === cropId ? { ...crop, status: newStatus } : crop
      ));
      console.log('✅ Crop status updated successfully in Firestore');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to update status:', error);
      alert('❌ Failed to update status: ' + (error.message || 'Unknown error'));
      return { success: false, error: error.message };
    }
  };

  // Update entire crop in Firebase Firestore
  const updateCrop = async (cropId, cropData) => {
    try {
      console.log('🔄 Attempting to update crop:', cropId);
      
      // Update in Firestore
      const cropDocRef = doc(db, 'crops', cropId);
      await updateDoc(cropDocRef, {
        ...cropData,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      setSavedCrops(savedCrops.map(crop => 
        crop.id === cropId ? { ...crop, ...cropData } : crop
      ));
      console.log('✅ Crop updated successfully in Firestore');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to update crop:', error);
      alert('❌ Failed to update crop: ' + (error.message || 'Unknown error'));
      return { success: false, error: error.message };
    }
  };

  // Load crops on mount — wait for Firebase Auth to be ready first
  useEffect(() => {
    // onAuthStateChanged guarantees we have the real auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadCrops();
      } else {
        setSavedCrops([]);
      }
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recalculate analytics when crops change
  useEffect(() => {
    calculateAnalytics();
  }, [calculateAnalytics]);

  return {
    savedCrops,
    loading,
    analytics,
    addCrop,
    deleteCrop,
    updateCropStatus,
    updateCrop,
    loadCrops
  };
};
