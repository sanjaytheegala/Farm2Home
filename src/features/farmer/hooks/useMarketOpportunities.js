import { useState, useEffect, useCallback } from 'react'
import { db, auth } from '../../../firebase'
import {
  collection, onSnapshot, query,
  where, orderBy, doc, updateDoc, getDoc, serverTimestamp,
  arrayUnion, arrayRemove
} from 'firebase/firestore'

/**
 * useMarketOpportunities — farmer side
 * Status flow: open → quoted → deal_closed → in_progress → completed
 */
export const useMarketOpportunities = () => {
  const [openDemands, setOpenDemands] = useState([])
  const [myQuotes,    setMyQuotes]    = useState([])
  const [loading,     setLoading]     = useState(true)

  /* ── All open requests (no farmer quoted yet) ── */
  useEffect(() => {
    const q = query(
      collection(db, 'market_demands'),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setOpenDemands(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  /* ── Deals where this farmer submitted a quote ── */
  useEffect(() => {
    const user = auth.currentUser
    if (!user) return
    const q = query(
      collection(db, 'market_demands'),
      where('committedFarmerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setMyQuotes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  /* ── Submit a price offer for a demand ── */
  const submitOffer = useCallback(async (demandId, offerPrice) => {
    const user = auth.currentUser
    if (!user) return { success: false, error: 'Not logged in' }
    const price = parseFloat(offerPrice)
    if (!price || price <= 0) return { success: false, error: 'Enter a valid price' }
    try {
      // Fetch farmer's phone from their profile
      const profileSnap = await getDoc(doc(db, 'users', user.uid))
      const farmerPhone = profileSnap.exists()
        ? (profileSnap.data().phone || profileSnap.data().phoneNumber || 'Not provided')
        : 'Not provided'

      await updateDoc(doc(db, 'market_demands', demandId), {
        status:              'quoted',
        committedFarmerId:   user.uid,
        committedFarmerName: user.displayName || user.email || 'Farmer',
        farmerOfferPrice:    price,
        farmerPhone,
        quotedAt:            serverTimestamp(),
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  /* ── Mark deal as in_progress (farmer dispatching / on the way) ── */
  const markInProgress = useCallback(async (demandId) => {
    try {
      await updateDoc(doc(db, 'market_demands', demandId), {
        status: 'in_progress',
        inProgressAt: serverTimestamp(),
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  /* ── Toggle 'I am fulfilling this' — adds/removes farmer uid from array ── */
  const toggleFulfilling = useCallback(async (demandId, isFulfilling) => {
    const user = auth.currentUser
    if (!user) return { success: false, error: 'Not logged in' }
    try {
      await updateDoc(doc(db, 'market_demands', demandId), {
        fulfillingFarmerIds: isFulfilling ? arrayRemove(user.uid) : arrayUnion(user.uid),
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  return { openDemands, myQuotes, loading, submitOffer, markInProgress, toggleFulfilling }
}
