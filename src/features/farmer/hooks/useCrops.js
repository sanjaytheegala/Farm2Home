import { useState, useEffect, useCallback } from 'react';
import { db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, serverTimestamp } from '../../../firebase';

/**
 * Custom hook for managing crop operations
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

  // Load all crops from Firestore
  const loadCrops = async () => {
    try {
      const cropsSnapshot = await getDocs(collection(db, 'crops'));
      const cropsData = [];
      cropsSnapshot.forEach((docSnapshot) => {
        cropsData.push({
          id: docSnapshot.id,
          ...docSnapshot.data()
        });
      });
      setSavedCrops(cropsData);
    } catch (error) {
      console.error('Error loading crops:', error);
      throw error;
    }
  };

  // Add new crop to Firestore
  const addCrop = async (cropData) => {
    setLoading(true);
    try {
      // Get farmer info from localStorage
      const storedUserData = localStorage.getItem('mockUserData');
      let farmerId = 'farmer_' + Date.now();
      let farmerEmail = '';
      
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          farmerId = userData.uid || userData.email || farmerId;
          farmerEmail = userData.email || '';
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      const docRef = await addDoc(collection(db, 'crops'), {
        ...cropData,
        createdAt: serverTimestamp(),
        farmerId: farmerId,
        farmerEmail: farmerEmail
      });
      
      const newCrop = {
        id: docRef.id,
        ...cropData
      };
      
      setSavedCrops([...savedCrops, newCrop]);
      return { success: true, crop: newCrop };
    } catch (error) {
      console.error('Failed to add crop:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete crop from Firestore
  const deleteCrop = async (cropId, isAdminDelete = false, reason = '') => {
    try {
      // Get the crop data before deleting for notification
      const cropToDelete = savedCrops.find(crop => crop.id === cropId);
      
      await deleteDoc(doc(db, 'crops', cropId));
      setSavedCrops(savedCrops.filter(crop => crop.id !== cropId));
      
      // If admin delete, create a notification for the farmer
      if (isAdminDelete && cropToDelete && cropToDelete.farmerId) {
        try {
          await addDoc(collection(db, 'notifications'), {
            farmerId: cropToDelete.farmerId,
            type: 'crop_removal',
            status: 'unread',
            title: 'Crop Removed by Admin',
            message: 'Your crop was removed by the Admin.',
            cropName: cropToDelete.cropName || cropToDelete.crop,
            quantity: cropToDelete.quantity,
            reason: reason || 'No reason provided',
            createdAt: serverTimestamp()
          });
        } catch (notificationError) {
          console.error('Failed to create notification:', notificationError);
          // Don't fail the delete if notification creation fails
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete crop:', error);
      return { success: false, error: error.message };
    }
  };

  // Update crop status
  const updateCropStatus = async (cropId, newStatus) => {
    try {
      await updateDoc(doc(db, 'crops', cropId), {
        status: newStatus
      });
      setSavedCrops(savedCrops.map(crop => 
        crop.id === cropId ? { ...crop, status: newStatus } : crop
      ));
      return { success: true };
    } catch (error) {
      console.error('Failed to update status:', error);
      return { success: false, error: error.message };
    }
  };

  // Update entire crop
  const updateCrop = async (cropId, cropData) => {
    try {
      await updateDoc(doc(db, 'crops', cropId), cropData);
      setSavedCrops(savedCrops.map(crop => 
        crop.id === cropId ? { ...crop, ...cropData } : crop
      ));
      return { success: true };
    } catch (error) {
      console.error('Failed to update crop:', error);
      return { success: false, error: error.message };
    }
  };

  // Load crops on mount
  useEffect(() => {
    loadCrops();
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
