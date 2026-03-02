import { useState, useEffect, useCallback } from 'react'
import { db, auth } from '../../../firebase'
import {
  collection, addDoc, onSnapshot, query,
  where, serverTimestamp, orderBy, doc, updateDoc, getDoc
} from 'firebase/firestore'

/**
 * useMarketDemands — consumer side
 * Status flow: open → quoted → deal_closed → in_progress → completed
 */
export const useMarketDemands = () => {
  const [myDemands, setMyDemands]   = useState([])
  const [loading, setLoading]       = useState(true)

  /* ── Real-time listener: consumer's own requests ── */
  useEffect(() => {
    const user = auth.currentUser
    if (!user) { setLoading(false); return }

    const q = query(
      collection(db, 'market_demands'),
      where('consumerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setMyDemands(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  /* ── Submit a new crop request ── */
  const submitDemand = useCallback(async (formData) => {
    const user = auth.currentUser
    if (!user) return { success: false, error: 'Not logged in' }
    try {
      const profileSnap = await getDoc(doc(db, 'users', user.uid))
      const consumerPhone = profileSnap.exists()
        ? (profileSnap.data().phoneNumber || profileSnap.data().phone || 'Not provided')
        : 'Not provided'

      await addDoc(collection(db, 'market_demands'), {
        cropName:      formData.cropName.trim(),
        quantityKg:    parseFloat(formData.quantityKg),
        location:      formData.location.trim(),
        notes:         (formData.notes || '').trim(),
        consumerId:    user.uid,
        consumerName:  user.displayName || user.email || 'Consumer',
        consumerEmail: user.email || '',
        consumerPhone,
        status:        'open',
        suggestedPriceMin:   null,
        suggestedPriceMax:   null,
        suggestedPriceNote:  null,
        committedFarmerId:   null,
        committedFarmerName: null,
        farmerOfferPrice:    null,
        farmerPhone:         null,
        fulfillingFarmerIds: [],
        createdAt: serverTimestamp(),
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  /* ── Consumer accepts farmer's offer → deal_closed ── */
  const acceptOffer = useCallback(async (demandId) => {
    const user = auth.currentUser
    if (!user) return { success: false, error: 'Not logged in' }
    try {
      const profileSnap = await getDoc(doc(db, 'users', user.uid))
      const consumerPhone = profileSnap.exists()
        ? (profileSnap.data().phone || profileSnap.data().phoneNumber || 'Not provided')
        : 'Not provided'

      await updateDoc(doc(db, 'market_demands', demandId), {
        status:        'deal_closed',
        consumerPhone,
        dealClosedAt:  serverTimestamp(),
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  /* ── Consumer marks crop as received → completed ── */
  const markReceived = useCallback(async (demandId) => {
    try {
      await updateDoc(doc(db, 'market_demands', demandId), {
        status:      'completed',
        receivedAt:  serverTimestamp(),
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  /* ── Consumer submits a review after completion ── */
  const submitReview = useCallback(async (demandId, farmerId, farmerName, cropName, rating, comment) => {
    const user = auth.currentUser
    if (!user) return { success: false, error: 'Not logged in' }
    if (!rating || rating < 1 || rating > 5) return { success: false, error: 'Please select a rating 1-5.' }
    try {
      // Write to reviews collection
      await addDoc(collection(db, 'reviews'), {
        demandId,
        consumerId:   user.uid,
        consumerName: user.displayName || user.email || 'Consumer',
        farmerId,
        farmerName,
        cropName,
        rating,
        comment: (comment || '').trim(),
        createdAt: serverTimestamp(),
      })
      // Mark demand as reviewed so form disappears
      await updateDoc(doc(db, 'market_demands', demandId), {
        reviewed:   true,
        reviewRating: rating,
        reviewComment: (comment || '').trim(),
        reviewedAt: serverTimestamp(),
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  return { myDemands, loading, submitDemand, acceptOffer, markReceived, submitReview }
}
