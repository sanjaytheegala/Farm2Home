import { useState, useEffect, useCallback } from 'react';
import { db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from '../../../firebase';

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
      const docRef = await addDoc(collection(db, 'crops'), {
        ...cropData,
        createdAt: new Date(),
        farmerId: 'farmer_' + Date.now()
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
  const deleteCrop = async (cropId) => {
    try {
      await deleteDoc(doc(db, 'crops', cropId));
      setSavedCrops(savedCrops.filter(crop => crop.id !== cropId));
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
