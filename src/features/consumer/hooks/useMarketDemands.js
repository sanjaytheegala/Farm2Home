import { useState, useEffect, useCallback, useRef } from 'react'
import { db, auth } from '../../../firebase'
import {
  collection, addDoc, onSnapshot, query,
  where, serverTimestamp, doc, updateDoc, deleteDoc, getDoc, writeBatch, setDoc
} from 'firebase/firestore'

/**
 * useMarketDemands — consumer side
 * Status flow: open → quoted → deal_closed → in_progress → completed
 */
export const useMarketDemands = () => {
  const [myDemands, setMyDemands]   = useState([])
  const [loading, setLoading]       = useState(true)
  const reviewCacheRef = useRef(new Map()) // demandId -> { exists: boolean, rating?: number, comment?: string }

  /* ── Real-time listener: consumer's own requests ── */
  useEffect(() => {
    let unsubSnap = null
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (unsubSnap) { unsubSnap(); unsubSnap = null }
      if (!user) { setLoading(false); return }

      const q = query(
        collection(db, 'market_demands'),
        where('consumerId', '==', user.uid)
      )
      unsubSnap = onSnapshot(q, (snap) => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        docs.sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() ?? 0
          const tb = b.createdAt?.toMillis?.() ?? 0
          return tb - ta
        })
        setMyDemands(docs)
        setLoading(false)

        // Some legacy demand docs may not be updateable to set `reviewed: true` under stricter rules.
        // To keep UI consistent across refresh, treat an existing review doc as "review submitted".
        const pending = docs.filter(d => d.status === 'completed' && !d.reviewed && !reviewCacheRef.current.has(d.id))
        if (pending.length) {
          Promise.all(
            pending.map(async (d) => {
              try {
                const reviewId = `${d.id}_${user.uid}`
                const reviewSnap = await getDoc(doc(db, 'reviews', reviewId))
                if (reviewSnap.exists()) {
                  const r = reviewSnap.data() || {}
                  return { demandId: d.id, exists: true, rating: r.rating, comment: r.comment }
                }
                return { demandId: d.id, exists: false }
              } catch (_) {
                return { demandId: d.id, exists: false }
              }
            })
          ).then((results) => {
            results.forEach((r) => reviewCacheRef.current.set(r.demandId, r))
            setMyDemands((prev) => prev.map((d) => {
              const cached = reviewCacheRef.current.get(d.id)
              if (!cached?.exists || d.reviewed) return d
              return {
                ...d,
                reviewed: true,
                reviewRating: d.reviewRating || cached.rating || 0,
                reviewComment: d.reviewComment || cached.comment || '',
              }
            }))
          })
        }
      }, (err) => {
        console.error('useMarketDemands snapshot error:', err)
        setLoading(false)
      })
    })
    return () => {
      if (unsubSnap) { try { unsubSnap() } catch (_) {} }
      try { unsubAuth() } catch (_) {}
    }
  }, [])

  /* ── Submit a new crop request ── */
  const submitDemand = useCallback(async (formData) => {
    const user = auth.currentUser
    if (!user) return { success: false, error: 'Not logged in' }
    try {
      const qty = parseFloat(formData.quantityKg)
      if (!Number.isFinite(qty) || qty <= 0) {
        return { success: false, error: 'Enter a valid quantity.' }
      }
      if (qty > 50) {
        return { success: false, error: 'Quantity must be 50 kg or less.' }
      }

      const profileSnap = await getDoc(doc(db, 'users', user.uid))
      const profileData = profileSnap.exists() ? profileSnap.data() : {}
      const localUser = (() => {
        try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} }
      })()

      const consumerPhone = (
        profileData.phoneNumber ||
        profileData.phone ||
        profileData.mobileNumber ||
        profileData.contactNumber ||
        localUser.phoneNumber ||
        localUser.phone ||
        user.phoneNumber ||
        ''
      )

      const locationDistrict = (formData.location || '').split(',')[0]?.trim() || ''
      const consumerDistrict = (
        profileData.district ||
        profileData.location?.district ||
        profileData.address?.district ||
        profileData.city ||
        localUser.district ||
        locationDistrict ||
        ''
      )

      if (!consumerPhone || consumerPhone.replace(/\D/g, '').length < 10) {
        return { success: false, error: 'Please add your phone number in your profile before placing crop requests.' }
      }
      if (!consumerDistrict) {
        return { success: false, error: 'Please add your location (district) in your profile before placing crop requests.' }
      }

      if (!profileData.district && locationDistrict) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            district: locationDistrict,
            updatedAt: serverTimestamp(),
          })
        } catch (_) {}
      }

      await addDoc(collection(db, 'market_demands'), {
        cropName:      formData.cropName.trim(),
        quantityKg:    qty,
        quantityUnit:  formData.quantityUnit || 'kg',
        location:      formData.location.trim(),
        locationStateKey: formData.locationStateKey || null,
        locationDistrictKey: formData.locationDistrictKey || null,
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
  /* ── Consumer rejects farmer’s offer → back to open ── */
  const rejectOffer = useCallback(async (demandId) => {
    try {
      await updateDoc(doc(db, 'market_demands', demandId), {
        status:              'open',
        committedFarmerId:   null,
        committedFarmerName: null,
        farmerOfferPrice:    null,
        farmerOfferDisplay:  null,
        farmerOfferUnit:     null,
        farmerPhone:         null,
        quotedAt:            null,
        rejectedAt:          serverTimestamp(),
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])
  /* ── Consumer accepts farmer's offer → deal_closed ── */
  const acceptOffer = useCallback(async (demandId, pickupDate) => {
    const user = auth.currentUser
    if (!user) return { success: false, error: 'Not logged in' }
    if (!pickupDate) return { success: false, error: 'Please select a pickup date' }
    try {
      const demandRef = doc(db, 'market_demands', demandId)
      const demandSnap = await getDoc(demandRef)

      if (!demandSnap.exists()) {
        return { success: false, error: 'Request not found' }
      }

      const demandData = demandSnap.data()
      if (!demandData.committedFarmerId) {
        return { success: false, error: 'No farmer has been assigned to this request yet.' }
      }

      const profileSnap = await getDoc(doc(db, 'users', user.uid))
      const profileData = profileSnap.exists() ? profileSnap.data() : {}
      const consumerPhone = profileData.phone || profileData.phoneNumber || ''

      if (!consumerPhone || consumerPhone.replace(/\D/g, '').length < 10) {
        return { success: false, error: 'Please add your phone number in your profile before accepting offers.' }
      }

      if (demandData.orderId) {
        await updateDoc(demandRef, {
          status:       'deal_closed',
          consumerPhone,
          pickupDate,
          dealClosedAt: serverTimestamp(),
        })
        return { success: true }
      }

      const quantity = parseFloat(demandData.quantityKg) || 0
      const pricePerKg = parseFloat(demandData.farmerOfferPrice) || 0
      const totalAmount = quantity * pricePerKg
      const orderRef = doc(collection(db, 'orders'))
      const shippingAddress = {
        fullName: profileData.name || user.displayName || user.email || 'Consumer',
        phone: consumerPhone,
        area: profileData.address?.area || profileData.location?.area || profileData.district || '',
        city: profileData.city || profileData.state || '',
        pincode: profileData.pincode || '',
      }

      const batch = writeBatch(db)
      batch.set(orderRef, {
        customerId: user.uid,
        customerEmail: user.email || '',
        farmerId: demandData.committedFarmerId,
        farmerName: demandData.committedFarmerName || '',
        marketDemandId: demandId,
        cropName: demandData.cropName || 'Product',
        quantity: quantity,
        unit: demandData.quantityUnit || 'kg',
        pricePerKg,
        totalPrice: totalAmount,
        totalAmount,
        shippingAddress,
        paymentMethod: 'direct',
        pickupDate,
        status: 'pending',
        createdAt: serverTimestamp(),
      })

      batch.update(demandRef, {
        status:        'deal_closed',
        consumerPhone,
        pickupDate,
        dealClosedAt:  serverTimestamp(),
        orderId:       orderRef.id,
      })

      await batch.commit()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  /* ── Consumer prepones pickup date (cannot extend) ── */
  const preponePickupDate = useCallback(async (demandId, currentPickupDate, newDate) => {
    if (!newDate) return { success: false, error: 'Please select a date' }
    if (currentPickupDate && newDate >= currentPickupDate) {
      return { success: false, error: 'You can only prepone (select an earlier date)' }
    }
    const today = new Date().toISOString().split('T')[0]
    if (newDate < today) return { success: false, error: 'Date cannot be in the past' }
    try {
      await updateDoc(doc(db, 'market_demands', demandId), {
        pickupDate: newDate,
        pickupDateUpdatedAt: serverTimestamp(),
        pickupDateUpdatedBy: 'consumer',
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
      if (!demandId || typeof demandId !== 'string') {
        return { success: false, error: 'Request not found' }
      }

      const demandRef = doc(db, 'market_demands', demandId)
      const demandSnap = await getDoc(demandRef)
      if (!demandSnap.exists()) {
        return { success: false, error: 'Request not found' }
      }

      const demand = demandSnap.data() || {}
      if (demand.consumerId && demand.consumerId !== user.uid) {
        return { success: false, error: 'Unauthorized: You can only review your own requests.' }
      }
      if (demand.reviewed === true) {
        return { success: false, error: 'Review already submitted.' }
      }

      // Use a deterministic review id to prevent duplicate submissions.
      // (Firestore rules disallow updates for reviews, so we must create once.)
      const reviewId = `${demandId}_${user.uid}`
      const reviewRef = doc(db, 'reviews', reviewId)
      const existingReview = await getDoc(reviewRef)
      if (existingReview.exists()) {
        return { success: false, error: 'Review already submitted.' }
      }

      await setDoc(reviewRef, {
        demandId,
        consumerId: user.uid,
        consumerName: user.displayName || user.email || 'Consumer',
        farmerId: farmerId || demand.committedFarmerId || null,
        farmerName: farmerName || demand.committedFarmerName || null,
        cropName: cropName || demand.cropName || null,
        rating,
        comment: (comment || '').trim(),
        createdAt: serverTimestamp(),
      })

      reviewCacheRef.current.set(demandId, { exists: true, rating, comment: (comment || '').trim() })

      // Best-effort: mark demand as reviewed so UI can hide the form.
      // If legacy data or rules prevent this update, still consider the review submitted.
      try {
        await updateDoc(demandRef, {
          reviewed: true,
          reviewRating: rating,
          reviewComment: (comment || '').trim(),
          reviewedAt: serverTimestamp(),
        })
      } catch (err) {
        console.warn('submitReview: demand review flag update failed:', err?.message || err)
      }

      // Optimistic local state update to immediately reflect submission.
      setMyDemands((prev) => prev.map((d) => (
        d.id === demandId
          ? { ...d, reviewed: true, reviewRating: rating, reviewComment: (comment || '').trim(), reviewedAt: { seconds: Math.floor(Date.now() / 1000) } }
          : d
      )))

      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  /* ── Consumer deletes an open request ── */
  const deleteDemand = useCallback(async (demandId) => {
    const user = auth.currentUser
    if (!user) return { success: false, error: 'Not logged in' }
    try {
      const demandRef = doc(db, 'market_demands', demandId)
      const demandSnap = await getDoc(demandRef)
      if (!demandSnap.exists()) return { success: false, error: 'Request not found' }
      // Ownership check — only the original consumer can delete
      if (demandSnap.data().consumerId !== user.uid) {
        return { success: false, error: 'Unauthorized: You can only delete your own requests.' }
      }
      await deleteDoc(demandRef)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  /* ── Consumer edits an open request ── */
  const updateDemand = useCallback(async (demandId, formData) => {
    const user = auth.currentUser
    if (!user) return { success: false, error: 'Not logged in' }
    try {
      // Only allow edits when demand is in open or quoted state
      const demandSnap = await getDoc(doc(db, 'market_demands', demandId))
      if (!demandSnap.exists()) return { success: false, error: 'Request not found' }
      const status = demandSnap.data().status
      if (!['open', 'quoted'].includes(status)) {
        return { success: false, error: 'Cannot edit a request that is already accepted or completed.' }
      }
      await updateDoc(doc(db, 'market_demands', demandId), {
        cropName:   formData.cropName.trim(),
        quantityKg: parseFloat(formData.quantityKg),
        quantityUnit: formData.quantityUnit || 'kg',
        location:   formData.location.trim(),
        locationStateKey: formData.locationStateKey || null,
        locationDistrictKey: formData.locationDistrictKey || null,
        notes:      (formData.notes || '').trim(),
        updatedAt:  serverTimestamp(),
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  /* ── Consumer cancels an accepted deal → back to open ── */
  const cancelDeal = useCallback(async (demandId) => {
    try {
      await updateDoc(doc(db, 'market_demands', demandId), {
        status:               'open',
        committedFarmerId:    null,
        committedFarmerName:  null,
        farmerPhone:          null,
        farmerOfferPrice:     null,
        farmerOfferDisplay:   null,
        farmerOfferUnit:      null,
        dealClosedAt:         null,
        consumerPhone:        null,
        orderId:              null,   // reset so next acceptOffer creates a fresh order
        cancelledAt:          serverTimestamp(),
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  return { myDemands, loading, submitDemand, rejectOffer, acceptOffer, preponePickupDate, markReceived, submitReview, deleteDemand, updateDemand, cancelDeal }
}
