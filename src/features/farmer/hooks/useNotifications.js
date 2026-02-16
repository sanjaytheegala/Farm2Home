import { useState, useEffect } from 'react';
import { db, collection, query, where, onSnapshot, updateDoc, deleteDoc, doc } from '../../../firebase';

/**
 * Custom hook for managing farmer notifications
 * Provides real-time listener for crop removal notifications
 */
export const useNotifications = (farmerId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!farmerId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Create a query for notifications for this farmer
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('farmerId', '==', farmerId),
      where('status', '==', 'unread')
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsList = [];
      snapshot.forEach((doc) => {
        notificationsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setNotifications(notificationsList);
      setUnreadCount(notificationsList.length);
    }, (error) => {
      console.error('Error listening to notifications:', error);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [farmerId]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        status: 'read',
        readAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error: error.message };
    }
  };

  // Clear all notifications (mark all as read)
  const clearAllNotifications = async () => {
    try {
      const promises = notifications.map(notification =>
        markAsRead(notification.id)
      );
      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    clearAllNotifications
  };
};
