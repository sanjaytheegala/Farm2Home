import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '../../../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';

/**
 * Fetches all orders placed for this farmer's crops in real-time.
 * Also exposes `updateOrderStatus(orderId, newStatus)` so the farmer
 * can advance an order through: pending → confirmed → shipped → delivered.
 */
export const useOrders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('farmerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // Real-time listener — order status changes appear instantly
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAtMs: d.data().createdAt?.toMillis?.() || Date.now(),
        }));
        setOrders(fetched);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = useCallback(async (orderId, newStatus, farmerId) => {
    try {
      const user = auth.currentUser;
      if (!user) return { success: false, error: 'Not authenticated' };
      // Safety: ensure the order belongs to the signed-in farmer
      if (farmerId && farmerId !== user.uid) {
        return { success: false, error: 'Unauthorized: this order does not belong to you.' };
      }
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date(),
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  return { orders, loading, error, updateOrderStatus };
};
