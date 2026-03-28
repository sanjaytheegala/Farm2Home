import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import { useCrops } from '../hooks/useCrops'
import { useCropForm } from '../hooks/useCropForm'
import { useOrders } from '../hooks/useOrders'
import { useMarketOpportunities } from '../hooks/useMarketOpportunities'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../../context/ToastContext'
import { db } from '../../../firebase'
import { doc, onSnapshot, collection, query, where, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore'
import './FarmerDashboard.css'

import { FaLeaf, FaChartLine, FaPlus, FaEdit, FaTrash, FaSave,
  FaTruck, FaMoneyBillWave, FaCalendarAlt, FaBell, FaShoppingBag,
  FaMapMarkerAlt, FaSeedling, FaTimes, FaCheckCircle, FaClock, FaTag, FaSearch, FaPhone,
  FaCoins, FaUsers, FaBullseye, FaFlag, FaComments, FaWeightHanging
} from 'react-icons/fa'
import { findCropByKeyword, CROP_DICTIONARY } from '../../../data/cropData'
import ComplaintModal from '../../../shared/components/ComplaintModal/ComplaintModal'
import ChatModal from '../../../shared/components/ChatModal/ChatModal'
import { resolveCanonicalCropName } from '../../../utils/cropValidation'

// Avatar palette — deterministic color per farmer name first letter
const AVATAR_PALETTE = ['#FFBF00','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#BE6DB7','#F7A738','#2ECC71']
const getAvatarColor = (name) =>
  AVATAR_PALETTE[((name || 'F').charCodeAt(0) - 65 + 26) % 8]

// Time-based greeting (key returned, translated by caller)
const getGreetingKey = () => {
  const h = new Date().getHours()
  if (h < 12) return 'fd_good_morning'
  if (h < 17) return 'fd_good_afternoon'
  return 'fd_good_evening'
}

// Helper: title-case underscore keys
const districtLabelOverrides = {
  kanchipuram: 'Kancheepuram',
  sivaganga: 'Sivagangai',
  chamarajanagar: 'Chamarajanagara',
  chikkaballapur: 'Chikkaballapura',
  ballari: 'Ballari (Bellary)',
  belagavi: 'Belagavi (Belgaum)',
  kalaburagi: 'Kalaburagi (Gulbarga)',
  mysuru: 'Mysuru (Mysore)',
  shivamogga: 'Shivamogga (Shimoga)',
  tumakuru: 'Tumakuru (Tumkur)',
  uttara_kannada: 'Uttara Kannada (Karwar)',
  vijayapura: 'Vijayapura (Bijapur)',
  vijayanagara: 'Vijayanagara (Hospet)'
}

const fmt = (key) =>
  key
    ? (districtLabelOverrides[key] || key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
    : '—'

// Get crop image from dictionary with fallback
const getCropImage = (cropName) => {
  if (!cropName) return null
  
  const normalized = cropName.toLowerCase().trim()
  
  // Exact match first
  const exact = CROP_DICTIONARY.find(c =>
    c.name.toLowerCase() === normalized ||
    c.keywords.some(k => k.toLowerCase() === normalized)
  )
  if (exact?.image) {
    // Ensure image path is absolute
    return exact.image.startsWith('/') ? exact.image : '/' + exact.image
  }
  
  // Try partial match (first word)
  const firstWord = normalized.split(/\s+/)[0]
  const partial = CROP_DICTIONARY.find(c =>
    c.name.toLowerCase().startsWith(firstWord) ||
    c.keywords.some(k => k.toLowerCase().startsWith(firstWord))
  )
  if (partial?.image) {
    return partial.image.startsWith('/') ? partial.image : '/' + partial.image
  }
  
  // Fuzzy fallback via findCropByKeyword
  const fuzzy = findCropByKeyword(normalized)
  if (fuzzy?.image) {
    return fuzzy.image.startsWith('/') ? fuzzy.image : '/' + fuzzy.image
  }
  
  // Try to guess image category from crop name
  const vegImages = ['/images/vegetables/tomato.jpg', '/images/vegetables/onion.jpg', '/images/vegetables/potato.jpg']
  const fruitImages = ['/images/fruits/apple.jpg', '/images/fruits/banana.jpg', '/images/fruits/mango.jpg']
  const dryImages = ['/images/dryfruits/cashew.jpg', '/images/dryfruits/almond.jpg']
  
  if (normalized.includes('tomato') || normalized.includes('onion') || normalized.includes('potato')) {
    return vegImages[Math.floor(Math.random() * vegImages.length)]
  }
  
  return null
}

// Status display config — labels are i18n keys
const STATUS_KEY_MAP = {
  available: { labelKey: 'fd_available', bg: '#e8f5e9', color: '#2e7d32', icon: <FaCheckCircle /> },
  sold:      { labelKey: 'fd_sold',      bg: '#ffebee', color: '#c62828', icon: <FaTimes /> },
  reserved:  { labelKey: 'fd_reserved',  bg: '#fff8e1', color: '#f57f17', icon: <FaClock /> },
  pending:   { labelKey: 'fd_pending',   bg: '#e3f2fd', color: '#1565c0', icon: <FaClock /> }
}

// State/districts for dropdowns
const stateDistricts = {
  telangana: ['adilabad','bhadradri_kothagudem','hanumakonda','hyderabad','jagtial','jangaon','jayashankar_bhupalpally','jogulamba_gadwal','kamareddy','karimnagar','khammam','kumuram_bheem','mahabubabad','mahabubnagar','mancherial','medak','medchal_malkajgiri','mulugu','nagarkurnool','nalgonda','narayanpet','nirmal','nizamabad','peddapalli','rajanna_sircilla','rangareddy','sangareddy','siddipet','suryapet','vikarabad','wanaparthy','warangal','yadadri_bhuvanagiri'],
  andhra_pradesh: ['srikakulam','parvathipuram_manyam','vizianagaram','visakhapatnam','alluri_sitharama_raju','anakapalli','polavaram','kakinada','east_godavari','dr_br_ambedkar_konaseema','eluru','west_godavari','ntr','krishna','palnadu','guntur','bapatla','prakasam','markapuram','sri_potti_sriramulu_nellore','kurnool','nandyal','ananthapuramu','sri_sathya_sai','ysr_kadapa','annamayya','tirupati','chittoor'],
  tamil_nadu: ['ariyalur','chengalpattu','chennai','coimbatore','cuddalore','dharmapuri','dindigul','erode','kallakurichi','kanchipuram','kanniyakumari','karur','krishnagiri','madurai','mayiladuthurai','nagapattinam','namakkal','nilgiris','perambalur','pudukkottai','ramanathapuram','ranipet','salem','sivaganga','tenkasi','thanjavur','theni','thoothukudi','tiruchirappalli','tirunelveli','tirupathur','tiruppur','tiruvallur','tiruvannamalai','tiruvarur','vellore','viluppuram','virudhunagar'],
  kerala: ['thiruvananthapuram','kollam','pathanamthitta','alappuzha','kottayam','idukki','ernakulam','thrissur','palakkad','malappuram','kozhikode','wayanad','kannur','kasaragod'],
  goa: ['north_goa','south_goa','kushavati'],
  karnataka: ['bagalkot','ballari','belagavi','bengaluru_rural','bengaluru_urban','bidar','chamarajanagar','chikkaballapur','chikkamagaluru','chitradurga','dakshina_kannada','davanagere','dharwad','gadag','hassan','haveri','kalaburagi','kodagu','kolar','koppal','mandya','mysuru','raichur','ramanagara','shivamogga','tumakuru','udupi','uttara_kannada','vijayapura','yadgir','vijayanagara']
}

/* ── Relative time helper ── */
const formatRelTime = (ts) => {
  if (!ts) return null
  const date = ts?.toDate ? ts.toDate() : ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const getTimestampMs = (ts) => {
  if (!ts) return 0
  if (typeof ts?.toMillis === 'function') return ts.toMillis()
  if (typeof ts?.toDate === 'function') return ts.toDate().getTime()
  if (typeof ts?.seconds === 'number') return ts.seconds * 1000
  const parsed = new Date(ts).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

/* ── Skeleton shimmer card ── */
const SkeletonCard = () => (
  <div className="fd-skeleton-card" aria-hidden="true">
    <div className="fd-sk-row">
      <div className="fd-sk-circle" />
      <div style={{ flex: 1 }}>
        <div className="fd-sk-line fd-sk-title" />
        <div className="fd-sk-line fd-sk-body" />
      </div>
    </div>
    <div className="fd-sk-line fd-sk-short" />
    <div className="fd-sk-line fd-sk-mid" />
  </div>
)

/* ─────────────────────────────────────────────────────────────
   DemandCard — one consumer request card in the market tab
───────────────────────────────────────────────────────────── */
const WEIGHT_UNIT_OPTIONS = [
  { value: 'kg',      label: 'per kg' },
  { value: 'quintal', label: 'per Quintal (100 kg)' },
  { value: 'ton',     label: 'per Ton (1000 kg)' },
]

const DemandCard = ({ demand, isPriority, onSubmitOffer, onOpenChat, onToastError, onToastSuccess, isBlinking = false }) => {
  const { t } = useTranslation()
  const demandUnit = demand.quantityUnit || 'kg'
  const isWeightDemand = demandUnit === 'kg'
  const offerUnitOptions = isWeightDemand ? WEIGHT_UNIT_OPTIONS : [{ value: demandUnit, label: `per ${demandUnit}` }]
  const demandQty = parseFloat(demand.quantityKg || 0) || 0
  const [showComplaint, setShowComplaint] = useState(false)
  const [showOfferForm, setShowOfferForm] = useState(false)
  const [offerPrice, setOfferPrice]       = useState('')
  const [offerUnit,  setOfferUnit]        = useState(demandUnit)
  const [offerOrganic, setOfferOrganic]   = useState('non-organic')
  const [offerAvailDate, setOfferAvailDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 10); return d.toISOString().split('T')[0]; })
  const [submitting, setSubmitting]       = useState(false)
  const hasPhone = demand.consumerPhone && demand.consumerPhone !== 'Not provided'
  const cropImg  = getCropImage(demand.cropName)

  const handleSubmitOffer = async () => {
    if (!offerPrice || parseFloat(offerPrice) <= 0) { onToastError('Enter a valid price'); return }
    if (!offerAvailDate) { onToastError('Please set your crop availability date'); return }
    setSubmitting(true)
    const res = await onSubmitOffer(demand.id, offerPrice, offerUnit, offerAvailDate, offerOrganic === 'organic')
    setSubmitting(false)
    if (res.success) {
      onToastSuccess('Offer submitted! Consumer will be notified.')
      const def = new Date(); def.setDate(def.getDate() + 10);
      setShowOfferForm(false); setOfferPrice(''); setOfferUnit(demandUnit); setOfferOrganic('non-organic'); setOfferAvailDate(def.toISOString().split('T')[0])
    } else {
      onToastError(res.error || 'Could not submit offer')
    }
  }

  const unitMult = offerUnit === 'quintal' ? 100 : offerUnit === 'ton' ? 1000 : 1
  const totalEst = offerPrice
    ? (demandQty * parseFloat(offerPrice) / unitMult).toFixed(0)
    : null

  return (
    <div
      data-notif-id={demand.id}
      className={`fd-demand-card${isPriority ? ' fd-demand-card--priority' : ''}${isBlinking ? ' fd-card-blink' : ''}`}
    >

      {/* ── Top row: crop image (left) | Near You + Chat (right) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', background: '#f0fdf4', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {cropImg
            ? <img src={cropImg} alt={demand.cropName} style={{ width: 48, height: 48, objectFit: 'cover', display: 'block' }} />
            : <FaLeaf style={{ fontSize: 22, color: '#16a34a' }} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {isPriority && <div className="fd-priority-badge" style={{ margin: 0 }}>{t('fd_near_you_badge')}</div>}
          {(demand.consumerTotalDeals || 0) >= 5 && (
            <span className="fd-verified-badge">{t('fd_verified')}</span>
          )}
          <button
            className="chat-trigger-btn"
            onClick={() => onOpenChat(demand)}
            style={{ padding: '4px 10px', fontSize: 12 }}
          >
            <FaComments style={{ marginRight: 4 }} /> {t('fd_chat')}
          </button>
        </div>
      </div>

      {/* ── Crop name (left) | Consumer name (right) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="fd-demand-cropname">{demand.cropName}</span>
        <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
          <FaUsers style={{ fontSize: 10 }} />{demand.consumerName}
        </span>
      </div>

      {demand.notes && <p className="fd-demand-notes">"{demand.notes}"</p>}

      {/* ── Offer form (when open) ── */}
      {showOfferForm && (
        <div style={{ marginTop: 12, background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 12, padding: '14px 14px 12px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#15803d', marginBottom: 10 }}>
            {t('fd_your_price_offer')}
          </div>
          {/* Unit selector as pill tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {offerUnitOptions.map(u => (
              <button
                key={u.value}
                onClick={() => setOfferUnit(u.value)}
                style={{
                  flex: 1, padding: '6px 4px', fontSize: 11, fontWeight: 600, borderRadius: 8, cursor: 'pointer', border: '1.5px solid',
                  borderColor: offerUnit === u.value ? '#16a34a' : '#d1d5db',
                  background: offerUnit === u.value ? '#dcfce7' : '#fff',
                  color: offerUnit === u.value ? '#15803d' : '#6b7280',
                }}
              >{u.label}</button>
            ))}
          </div>
          {/* Price input with ₹ prefix */}
          <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #86efac', borderRadius: 8, overflow: 'hidden', background: '#fff', marginBottom: 8 }}>
            <span style={{ padding: '0 10px', fontSize: 16, fontWeight: 700, color: '#15803d', borderRight: '1px solid #86efac', height: '100%', display: 'flex', alignItems: 'center' }}>₹</span>
            <input
              type="number" min="1" step="0.01"
              placeholder={isWeightDemand ? `Amount ${offerUnit === 'kg' ? 'per kg' : offerUnit === 'quintal' ? 'per quintal' : 'per ton'}` : `Amount per ${offerUnit}`}
              value={offerPrice}
              onChange={e => setOfferPrice(e.target.value)}
              style={{ flex: 1, padding: '9px 10px', border: 'none', fontSize: 15, outline: 'none', background: 'transparent' }}
            />
          </div>
          {totalEst && (
            <div style={{ fontSize: 12, color: '#15803d', fontWeight: 600, marginBottom: 10, background: '#dcfce7', borderRadius: 6, padding: '5px 8px' }}>
              Total for {demandQty} {demandUnit} → ₹{parseInt(totalEst).toLocaleString()}
            </div>
          )}
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>{t('fd_crop_type')}</label>
            <select
              value={offerOrganic}
              onChange={e => setOfferOrganic(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #86efac', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none', background: '#fff' }}
            >
              <option value="non-organic">{t('fd_non_organic')}</option>
              <option value="organic">{t('fd_organic')}</option>
            </select>
          </div>
          {/* Availability date */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>{t('fd_crop_avail_until')}</label>
            <input
              type="date"
              value={offerAvailDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setOfferAvailDate(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #86efac', borderRadius: 8, fontSize: 13, boxSizing: 'border-box', outline: 'none' }}
            />
            <span style={{ fontSize: 10, color: '#6b7280', marginTop: 2, display: 'block' }}>{t('fd_consumer_see')}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleSubmitOffer} disabled={submitting}
              style={{ flex: 1, padding: '9px', background: submitting ? '#9ca3af' : 'linear-gradient(135deg,#16a34a,#15803d)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 13 }}
            >
              {submitting ? t('fd_submitting') : <><FaCheckCircle style={{ marginRight: 6 }} />{t('fd_send_offer')}</>}
            </button>
            <button
              onClick={() => { const def = new Date(); def.setDate(def.getDate()+10); setShowOfferForm(false); setOfferPrice(''); setOfferUnit(demandUnit); setOfferOrganic('non-organic'); setOfferAvailDate(def.toISOString().split('T')[0]) }}
              style={{ padding: '9px 14px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
            >
              {t('fd_cancel')}
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom: qty left, location right ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, padding: '8px 10px', background: '#f9fafb', borderRadius: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }}>
          <FaWeightHanging style={{ color: '#6b7280', fontSize: 11 }} /> {demandQty} {demandUnit}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }}>
          <FaMapMarkerAlt style={{ color: '#ef4444', fontSize: 11 }} /> {demand.location}
        </span>
      </div>

      {/* ── Action row: phone number + Send Price side by side ── */}
      {!showOfferForm && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'stretch' }}>
          {hasPhone ? (
            <a
              href={`tel:${demand.consumerPhone}`}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '9px 10px', background: '#f0fdf4', border: '1.5px solid #86efac',
                borderRadius: 8, color: '#15803d', fontWeight: 700, fontSize: 13, textDecoration: 'none'
              }}
            >
              <FaPhone style={{ fontSize: 12 }} /> {demand.consumerPhone}
            </a>
          ) : (
            <span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 10px', background: '#f3f4f6', borderRadius: 8, fontSize: 12, color: '#9ca3af' }}>
              {t('fd_no_phone')}
            </span>
          )}
          <button
            className="fd-fulfilling-btn"
            style={{ flex: 1, background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', border: 'none', marginTop: 0 }}
            onClick={() => setShowOfferForm(true)}
          >
            <FaCoins style={{ marginRight: 6 }} /> {t('fd_send_price')}
          </button>
        </div>
      )}

      {showComplaint && (
        <ComplaintModal
          reportedUser={{ id: demand.consumerId, name: demand.consumerName, role: 'consumer' }}
          contextId={demand.id}
          onClose={() => setShowComplaint(false)}
        />
      )}
    </div>
  )
}

const FarmerDashboard = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()
  const { currentUser, userData } = useAuth()
  const VALID_TABS = ['crops', 'analytics', 'market']
  const tabFromUrl = searchParams.get('tab')
  const [activeTab, setActiveTabState] = useState(VALID_TABS.includes(tabFromUrl) ? tabFromUrl : 'crops')
  const setActiveTab = (tab) => {
    setActiveTabState(tab)
    setSearchParams({ tab }, { replace: true })
  }
  const [farmerName, setFarmerName] = useState('')
  const [farmerPhoto, setFarmerPhoto] = useState(null)
  const [farmerPhone, setFarmerPhone] = useState('')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editProfileData, setEditProfileData] = useState({ name: '', phone: '', state: '', district: '' })
  const [editProfileSaving, setEditProfileSaving] = useState(false)
  const [userLocation, setUserLocation] = useState({ state: '', district: '' })
  const [activeChatDemand, setActiveChatDemand] = useState(null)
  const [editingDeal, setEditingDeal] = useState({}) // { [dealId]: { price, unit } }
  const [changingDateDeal, setChangingDateDeal] = useState(null) // dealId or null
  const [farmerNewDate, setFarmerNewDate] = useState('')
  const [cropSearch, setCropSearch] = useState('')
  const [cropPickerStep, setCropPickerStep] = useState('pick') // 'pick' | 'details'

  // Notification state
  const [rentalNotifs, setRentalNotifs] = useState([])
  const [blinkCardId, setBlinkCardId] = useState(null)
  const [seenNotifIds, setSeenNotifIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(`farmerNotifSeen_init`) || '[]')) } catch { return new Set() }
  })

  // Real-time Firestore listener for farmer profile
  useEffect(() => {
    if (!currentUser && !userData) { navigate('/'); return }
    // Seed name quickly from context / localStorage while Firestore loads
    const seed = userData || (() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}') } catch { return {} } })()
    if (seed?.name || seed?.displayName) {
      setFarmerName(seed.name || seed.displayName || seed.email || 'Farmer')
      if (seed.state && seed.district) setUserLocation({ state: seed.state, district: seed.district })
    }
    if (!currentUser?.uid) return
    const unsub = onSnapshot(
      doc(db, 'users', currentUser.uid),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data()
          setFarmerName(d.name || d.displayName || d.email || currentUser.email || 'Farmer')
          setFarmerPhoto(d.photoURL || currentUser.photoURL || null)
          setFarmerPhone(d.phoneNumber || d.phone || '')
          if (d.state && d.district) setUserLocation({ state: d.state, district: d.district })
        }
      },
      (err) => console.warn('FarmerDashboard profile snapshot error:', err.message)
    )
    return () => { try { unsub() } catch (_) {} }
  }, [currentUser, userData, navigate])

  // Real-time listener for rental requests (resource tool requests incoming to this farmer)
  useEffect(() => {
    if (!currentUser?.uid) return
    const q = query(collection(db, 'rental_requests'), where('toolOwnerId', '==', currentUser.uid))
    const unsub = onSnapshot(q,
      (snap) => setRentalNotifs(snap.docs.map(d => ({ ...d.data(), id: d.id })).filter(r => r.status === 'Requested')),
      (err) => console.warn('rental_requests notif error:', err.message)
    )
    return () => { try { unsub() } catch (_) {} }
  }, [currentUser?.uid])

  // Load seen IDs from localStorage once uid is known
  useEffect(() => {
    if (!currentUser?.uid) return
    try {
      const stored = JSON.parse(localStorage.getItem(`farmerNotifSeen_${currentUser.uid}`) || '[]')
      setSeenNotifIds(new Set(stored))
    } catch {}
  }, [currentUser?.uid])

  const { savedCrops, loading, analytics, addCrop, deleteCrop, updateCropStatus, updateCrop } = useCrops()
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders()
  const { openDemands, myQuotes, submitOffer, updateOffer, withdrawOffer, markInProgress, toggleFulfilling, farmerUpdatePickupDate } = useMarketOpportunities()
  const { success: toastSuccess, error: toastError } = useToast()

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [offerPrices, setOfferPrices] = useState({})      // { [demandId]: string }
  const [submittingOfferId, setSubmittingOfferId] = useState(null)
  const [bulkAlert, setBulkAlert] = useState(null) // { cropName, quantity, location }
  // edit state
  const [editingCropId, setEditingCropId] = useState(null)
  const {
    rows, setRows, showAddForm, selectedState, selectedDistrict,
    setShowAddForm, setSelectedState, setSelectedDistrict,
    addRow, updateField, resetForm, getRowData
  } = useCropForm(userLocation)

  const handleStateChange = (e) => { setSelectedState(e.target.value); setSelectedDistrict('') }

  // Use dropdown values for priority matching so changing district re-sorts immediately
  const filterDistrictDisplay = selectedDistrict ? fmt(selectedDistrict) : ''
  const filterStateDisplay    = selectedState    ? fmt(selectedState)    : ''

  const isDistrictMatch = (loc = '') => filterDistrictDisplay && loc.toLowerCase().includes(filterDistrictDisplay.toLowerCase())
  const isStateMatch    = (loc = '') => filterStateDisplay    && loc.toLowerCase().includes(filterStateDisplay.toLowerCase())
  const isLocationMatch = (loc = '') => isDistrictMatch(loc) || isStateMatch(loc)

  const priorityDemands = openDemands
    .filter(d => isLocationMatch(d.location))
    .sort((a, b) => {
      const aScore = isDistrictMatch(a.location) ? 2 : isStateMatch(a.location) ? 1 : 0
      const bScore = isDistrictMatch(b.location) ? 2 : isStateMatch(b.location) ? 1 : 0
      if (bScore !== aScore) return bScore - aScore
      // Same location tier → sort by quantity ascending (smallest first)
      return (parseFloat(a.quantityKg) || 0) - (parseFloat(b.quantityKg) || 0)
    })
  const otherDemands = openDemands
    .filter(d => !isLocationMatch(d.location))
    .sort((a, b) => (a.location || '').localeCompare(b.location || ''))

  // Pre-fill form with an existing crop for editing
  const handleEdit = (crop) => {
    setEditingCropId(crop.id)
    setRows([{
      crop: crop.crop || crop.cropName || '',
      quantity: String(crop.quantity || ''),
      price: String(crop.price || ''),
      organic: !!crop.organic,
      status: crop.status || 'available',
      notes: crop.notes || '',
      availableUntil: crop.availableUntil || ''
    }])
    setCropPickerStep('details')
    setShowAddForm(true)
  }

  const handleSave = async (index) => {
    const row = rows[index]
    if (!selectedDistrict) { toastError('Please select a district before saving.'); return }
    if (!row.crop || !row.crop.trim()) { toastError('Please select a crop name.'); return }
    const canonicalCropName = resolveCanonicalCropName(row.crop.trim())
    if (!canonicalCropName) {
      toastError('Not a valid crop name. Please enter the correct crop name.')
      return
    }
    const matchedCrop = findCropByKeyword(canonicalCropName)
    if (!row.quantity || isNaN(row.quantity) || parseFloat(row.quantity) <= 0) {
      toastError('Quantity must be a valid number greater than 0.'); return
    }
    if (!row.price || isNaN(row.price) || parseFloat(row.price) <= 0) {
      toastError('Price must be a valid number greater than 0.'); return
    }
    const cropData = getRowData(index)
    cropData.cropName = matchedCrop.name
    cropData.crop = matchedCrop.name
    cropData.category = matchedCrop.category || ''
    cropData.image = matchedCrop.image || getCropImage(matchedCrop.name) || ''

    if (editingCropId) {
      // UPDATE existing crop
      const result = await updateCrop(editingCropId, {
        crop: cropData.crop,
        cropName: cropData.cropName,
        category: cropData.category,
        price: parseFloat(cropData.price),
        quantity: cropData.quantity,
        organic: !!cropData.organic,
        status: cropData.status,
        notes: cropData.notes,
        availableUntil: cropData.availableUntil || '',
        state: cropData.state,
        district: cropData.district,
        image: cropData.image,
      })
      if (result.success) {
        toastSuccess('Crop updated successfully!')
        setEditingCropId(null)
        resetForm()
        setActiveTab('crops')
      } else {
        toastError(result.error || 'Failed to update crop')
      }
    } else {
      // ADD new crop
      const result = await addCrop(cropData)
      if (result.success) {
        resetForm()
        setActiveTab('crops')
        // Bulk alert: if quantity > 50kg, check if any consumers want this crop
        const qty = parseFloat(cropData.quantity)
        if (qty > 50) {
          const snap = await getDocs(
            query(
              collection(db, 'market_demands'),
              where('status', '==', 'open'),
              where('cropName', '==', matchedCrop.name)
            )
          )
          if (snap.empty) {
            setBulkAlert({
              cropName: matchedCrop.name,
              quantity: qty,
              location: `${fmt(selectedDistrict)}, ${fmt(selectedState)}`,
            })
          }
        }
      }
    }
  }

  const handleDelete = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) await deleteCrop(cropId)
  }

  const handleOpenEditProfile = () => {
    setEditProfileData({
      name: farmerName,
      phone: farmerPhone,
      state: userLocation.state || '',
      district: userLocation.district || '',
    })
    setShowEditProfile(true)
  }

  const handleSaveEditProfile = async () => {
    const cleanPhone = editProfileData.phone.replace(/\D/g, '')
    if (!editProfileData.name.trim()) { toastError('Name cannot be empty'); return }
    if (!cleanPhone || cleanPhone.length !== 10) { toastError('Enter a valid 10-digit phone number'); return }
    setEditProfileSaving(true)
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: editProfileData.name.trim(),
        phoneNumber: cleanPhone,
        phone: cleanPhone,
        state: editProfileData.state,
        district: editProfileData.district,
        updatedAt: new Date().toISOString(),
      })
      toastSuccess('Profile updated successfully!')
      setShowEditProfile(false)
    } catch (err) {
      toastError('Failed to save profile: ' + err.message)
    } finally {
      setEditProfileSaving(false)
    }
  }

  const handleSubmitOffer = useCallback(async (demandId, offerPrice, offerUnit = 'kg', offerAvailableDate = '', offerOrganic = false) => {
    if (!currentUser?.uid) return { success: false, error: 'Not logged in' }

    const profileDistrict = (userLocation?.district || '').trim()
    const profileState = (userLocation?.state || '').trim()
    const selectedDistrictValue = (selectedDistrict || '').trim()
    const selectedStateValue = (selectedState || '').trim()

    if (!profileDistrict && selectedDistrictValue) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), {
          district: selectedDistrictValue,
          state: selectedStateValue || profileState,
          updatedAt: new Date().toISOString(),
        })
        setUserLocation((prev) => ({
          state: selectedStateValue || prev.state || '',
          district: selectedDistrictValue,
        }))
      } catch (err) {
        console.warn('Failed to auto-save selected district before offer submit:', err?.message || err)
      }
    }

    return submitOffer(demandId, offerPrice, offerUnit, offerAvailableDate, offerOrganic)
  }, [currentUser?.uid, selectedDistrict, selectedState, submitOffer, userLocation?.district, userLocation?.state])

  const availableCount = savedCrops.filter(c => c.status === 'available' || c.status === 'pending').length
  // Revenue = sum of totalPrice from all orders (confirmed/shipped/delivered)
  const soldRevenue = orders.reduce((s, o) => s + (parseFloat(o.totalPrice || o.totalAmount || 0)), 0)

  // ── Notifications ──
  const farmerNotifications = [
    ...openDemands
      .slice()
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, 30)
      .map(d => ({
        id: d.id,
        type: 'demand',
        icon: '🌾',
        title: `Crop Request: ${d.cropName}`,
        subtitle: `${d.quantityKg} ${d.quantityUnit || 'kg'} needed · ${d.location}`,
        timeLabel: formatRelTime(d.createdAt),
        createdAtMs: getTimestampMs(d.createdAt),
        tabTarget: 'market',
      })),
    ...orders
      .filter(o => o.status === 'pending')
      .map(o => ({
        id: o.id,
        type: 'order',
        icon: '📦',
        title: `New Order: ${o.cropName || 'Crop'}`,
        subtitle: `${o.quantity} ${o.unit || 'kg'} · ₹${parseFloat(o.totalPrice || 0).toFixed(0)}`,
        timeLabel: formatRelTime(o.createdAt),
        createdAtMs: getTimestampMs(o.createdAt),
        tabTarget: 'market',
      })),
    ...rentalNotifs.map(r => ({
      id: r.id,
      type: 'resource',
      icon: '🚜',
      title: `Tool Request: ${r.toolName}`,
      subtitle: `${r.requesterName} · ${r.ownerDistrict || ''}`,
      timeLabel: formatRelTime(r.createdAt),
      createdAtMs: getTimestampMs(r.createdAt),
      tabTarget: null,
    })),
  ].sort((a, b) => b.createdAtMs - a.createdAtMs)

  const unseenCount = farmerNotifications.filter(n => !seenNotifIds.has(n.id)).length

  const handleNotifOpen = useCallback(() => {
    if (!currentUser?.uid) return
    const newSeen = new Set([...seenNotifIds, ...farmerNotifications.map(n => n.id)])
    setSeenNotifIds(newSeen)
    try { localStorage.setItem(`farmerNotifSeen_${currentUser.uid}`, JSON.stringify([...newSeen])) } catch {}
  }, [currentUser?.uid, seenNotifIds, farmerNotifications])

  const handleNotifItemClick = useCallback((notif) => {
    if (notif.type === 'resource') {
      navigate('/resource-share')
      return
    }
    setActiveTab(notif.tabTarget)
    setBlinkCardId(notif.id)
    setTimeout(() => setBlinkCardId(null), 2500)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  // Scroll to blinking card after tab switch renders
  useEffect(() => {
    if (!blinkCardId) return
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-notif-id="${blinkCardId}"]`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 250)
    return () => clearTimeout(timer)
  }, [blinkCardId])

  return (
    <div className="fd-root">

      {/* ─── Chat Modal ─── */}
      {activeChatDemand && (
        <ChatModal
          demand={activeChatDemand}
          currentRole="farmer"
          onClose={() => setActiveChatDemand(null)}
        />
      )}

      {/* ─── Edit Profile Modal ─── */}
      {showEditProfile && (
        <div className="fd-bulk-overlay" onClick={() => setShowEditProfile(false)}>
          <div className="fd-bulk-modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="fd-bulk-modal-icon">👤</div>
            <h3 className="fd-bulk-modal-title">{t('fd_edit_profile')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }}>{t('fd_full_name')}</label>
                <input
                  type="text"
                  value={editProfileData.name}
                  onChange={e => setEditProfileData(p => ({ ...p, name: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }}>{t('fd_phone_number')} <span style={{color:'#dc2626'}}>*</span></label>
                <input
                  type="tel"
                  value={editProfileData.phone}
                  onChange={e => setEditProfileData(p => ({ ...p, phone: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                  placeholder="10-digit mobile number"
                  maxLength={15}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }}>{t('fd_state')}</label>
                  <select
                    value={editProfileData.state}
                    onChange={e => setEditProfileData(p => ({ ...p, state: e.target.value, district: '' }))}
                    style={{ width: '100%', padding: '9px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                  >
                    <option value="">{t('fd_select_state')}</option>
                    {Object.keys(stateDistricts).map(k => <option key={k} value={k}>{fmt(k)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }}>{t('fd_district')}</label>
                  <select
                    value={editProfileData.district}
                    onChange={e => setEditProfileData(p => ({ ...p, district: e.target.value }))}
                    style={{ width: '100%', padding: '9px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                  >
                    <option value="">{t('fd_select_district')}</option>
                    {(stateDistricts[editProfileData.state] || []).map(d => <option key={d} value={d}>{fmt(d)}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="fd-bulk-modal-actions">
              <button className="fd-bulk-ok-btn" onClick={handleSaveEditProfile} disabled={editProfileSaving}>
                {editProfileSaving ? t('fd_saving') : <><FaSave style={{ marginRight: 8 }} /> {t('fd_save_changes')}</>}
              </button>
              <button className="fd-bulk-close-btn" onClick={() => setShowEditProfile(false)}>{t('fd_cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bulk Crop Alert Modal ─── */}
      {bulkAlert && (
        <div className="fd-bulk-overlay" onClick={() => setBulkAlert(null)}>
          <div className="fd-bulk-modal" onClick={e => e.stopPropagation()}>
            <div className="fd-bulk-modal-icon">📦</div>
            <h3 className="fd-bulk-modal-title">{t('fd_no_buyers_title')}</h3>
            <p className="fd-bulk-modal-body">
              {t('fd_listed_prefix')} <strong>{bulkAlert.quantity} kg</strong> {t('fd_of')} <strong>{bulkAlert.cropName}</strong> {t('fd_in')} <strong>{bulkAlert.location}</strong>.
              <br /><br />
              {t('fd_no_buyers_body')}
            </p>
            <div className="fd-bulk-modal-actions">
              <button className="fd-bulk-ok-btn" onClick={() => { setBulkAlert(null); setActiveTab('market') }}>
                <FaBullseye style={{ marginRight: 8 }} /> {t('fd_view_market')}
              </button>
              <button className="fd-bulk-close-btn" onClick={() => setBulkAlert(null)}>{t('fd_got_it')}</button>
            </div>
          </div>
        </div>
      )}

      <Navbar
        isFarmerDashboard={true}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        farmerNotifCount={unseenCount}
        farmerNotifications={farmerNotifications}
        onFarmerNotifOpen={handleNotifOpen}
        onFarmerNotifItemClick={handleNotifItemClick}
        onFarmerProfileClick={handleOpenEditProfile}
      />

      {/* ─── Tab Bar + Location Selectors ─── */}
      <div className="fd-tabbar-wrap">
        <div className="fd-tabbar">
          {[
            { key: 'crops',         icon: <FaLeaf />,        label: t('fd_manage_crops') },
            { key: 'market',        icon: <FaBullseye />,    label: t('fd_crop_requests'), badge: openDemands.length },
            { key: 'analytics',     icon: <FaChartLine />,   label: t('fd_analytics') },
            { key: 'orders',        icon: <FaShoppingBag />, label: t('fd_orders') },
            { key: 'notifications', icon: <FaBell />,        label: t('fd_notifications') },
          ].map(tab => (
            <button
              key={tab.key}
              className={`fd-tab ${activeTab === tab.key ? 'fd-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="fd-tab-icon">{tab.icon}</span>
              <span className="fd-tab-label">{tab.label}</span>
              {tab.badge > 0 && <span className="fd-tab-badge">{tab.badge}</span>}
            </button>
          ))}
        </div>
        <div className="fd-location-selectors">
          <div className="fd-location-wrap">
            <FaMapMarkerAlt className="fd-loc-icon" />
            <select value={selectedState} onChange={handleStateChange} className="fd-select">
              {Object.keys(stateDistricts).map(k => (
                <option key={k} value={k}>{fmt(k)}</option>
              ))}
            </select>
          </div>
          <div className="fd-location-wrap">
            <FaMapMarkerAlt className="fd-loc-icon" />
            <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} className="fd-select">
              <option value="">{t('fd_select_district')}</option>
              {stateDistricts[selectedState]?.map(d => (
                <option key={d} value={d}>{fmt(d)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── CROPS TAB ─── */}
      {activeTab === 'crops' && (
        <div className="fd-content">
          <div className="fd-content-header">
            <h2 className="fd-content-title">
              <FaLeaf style={{ color: '#2e7d32', marginRight: 8 }} />
              {t('fd_your_crops')}
              {savedCrops.length > 0 && <span className="fd-count-badge">{savedCrops.length}</span>}
            </h2>
            <button className="fd-add-btn" onClick={() => {
              if (!showAddForm) { setEditingCropId(null); setCropPickerStep('pick'); setCropSearch('') }
              setShowAddForm(!showAddForm)
            }}>
              {showAddForm
                ? <><FaTimes style={{ marginRight: 6 }} />{t('fd_cancel')}</>
                : <><FaPlus style={{ marginRight: 6 }} />{t('fd_add_new_crop')}</>}
            </button>
          </div>

          {/* ── STEP 1: Crop Picker ── */}
          {showAddForm && cropPickerStep === 'pick' && (
            <div className="fd-form-card">
              <h3 className="fd-form-title">
                <FaSeedling style={{ marginRight: 8, color: '#2e7d32' }} />
                {t('fd_choose_a_crop')}
              </h3>
              <p className="fd-picker-hint">{t('fd_tap_crop_hint')}</p>
              <div className="fd-picker-search-wrap">
                <FaSearch className="fd-picker-search-icon" />
                <input
                  type="text"
                  className="fd-picker-search"
                  placeholder={t('fd_search_hint')}
                  value={cropSearch}
                  onChange={e => setCropSearch(e.target.value)}
                  autoFocus
                />
                {cropSearch && (
                  <button className="fd-picker-search-clear" onClick={() => setCropSearch('')}>
                    <FaTimes />
                  </button>
                )}
              </div>
              {cropSearch ? (
                /* ── Search results as flat grid ── */
                <div className="fd-picker-grid">
                  {CROP_DICTIONARY
                    .filter(c =>
                      c.name.toLowerCase().includes(cropSearch.toLowerCase()) ||
                      c.keywords.some(k => k.toLowerCase().includes(cropSearch.toLowerCase()))
                    )
                    .map(c => (
                      <button
                        key={c.id}
                        className="fd-picker-card"
                        onClick={() => { updateField(0, 'crop', c.name); setCropPickerStep('details') }}
                      >
                        <img src={c.image} alt={c.name} className="fd-picker-img" />
                        <span className="fd-picker-name">{c.name}</span>
                      </button>
                    ))
                  }
                </div>
              ) : (
                /* ── Category sections with marquee ── */
                <div className="fd-category-sections">
                  {[
                    { key: 'fruits',        label: t('fd_fruits') },
                    { key: 'vegetables',    label: t('fd_vegetables') },
                    { key: 'grains-pulses', label: t('fd_grains_pulses') },
                    { key: 'spices',        label: t('fd_spices') },
                    { key: 'leafy-greens',  label: t('fd_leafy_greens') },
                    { key: 'dry-fruits',    label: t('fd_dry_fruits') },
                  ].map(({ key, label }) => {
                    const categoryCrops = CROP_DICTIONARY.filter(c => c.category === key).sort((a, b) => a.name.localeCompare(b.name));
                    if (!categoryCrops.length) return null;
                    // Duplicate only enough times to always fill > 2× the viewport for seamless looping
                    const minItems = 12;
                    const repeatCount = Math.ceil(minItems / categoryCrops.length) + 1;
                    const loopItems = Array.from({ length: repeatCount }, () => categoryCrops).flat();
                    return (
                      <div key={key} className="fd-category-section">
                        <h4 className="fd-category-title">{label}</h4>
                        <div className="fd-marquee-outer">
                          <div
                            className="fd-marquee-track"
                            style={{ '--item-count': categoryCrops.length, '--repeat-count': repeatCount }}
                          >
                            {loopItems.map((c, i) => (
                              <button
                                key={`${c.id}-${i}`}
                                className="fd-picker-card"
                                onClick={() => { updateField(0, 'crop', c.name); setCropPickerStep('details') }}
                              >
                                <img src={c.image} alt={c.name} className="fd-picker-img" onError={e => { e.target.style.display='none' }} />
                                <span className="fd-picker-name">{c.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ marginTop: 18, textAlign: 'center' }}>
                <button onClick={() => { resetForm(); setCropPickerStep('pick'); setCropSearch('') }} className="fd-cancel-btn">
                  <FaTimes style={{ marginRight: 4 }} />{t('fd_cancel')}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Crop Details ── */}
          {showAddForm && cropPickerStep === 'details' && rows.map((row, index) => {
            const pickedImg = getCropImage(row.crop)
            return (
              <div key={index} className="fd-form-card">
                <h3 className="fd-form-title">
                  <FaSeedling style={{ marginRight: 8, color: '#2e7d32' }} />
                  {editingCropId ? t('fd_edit_crop_details') : t('fd_add_crop_details')}
                </h3>
                <div className="fd-selected-crop-bar">
                  {pickedImg
                    ? <img src={pickedImg} alt={row.crop} className="fd-selected-crop-img" />
                    : <FaLeaf style={{ fontSize: 32, color: '#2e7d32' }} />
                  }
                  <span className="fd-selected-crop-name">{row.crop}</span>
                  <button
                    className="fd-change-crop-btn"
                    onClick={() => { updateField(index, 'crop', ''); setCropPickerStep('pick'); setCropSearch('') }}
                  >
                    ✎ {t('fd_change')}
                  </button>
                </div>
                <div className="fd-form-grid">
                  <div className="fd-field">
                    <label className="fd-label">{t('fd_quantity_kg')}</label>
                    <input
                      type="number" min="0" step="any"
                      placeholder="e.g. 100"
                      value={row.quantity}
                      onChange={e => updateField(index, 'quantity', e.target.value)}
                      onKeyDown={e => ['e','E','+','-'].includes(e.key) && e.preventDefault()}
                      className="fd-input"
                    />
                  </div>
                  <div className="fd-field">
                    <label className="fd-label">{t('fd_price_per_kg')}</label>
                    <input
                      type="number" min="0" step="any"
                      placeholder="e.g. 25"
                      value={row.price}
                      onChange={e => updateField(index, 'price', e.target.value)}
                      onKeyDown={e => ['e','E','+','-'].includes(e.key) && e.preventDefault()}
                      className="fd-input"
                    />
                  </div>
                  <div className="fd-field">
                    <label className="fd-label">{t('fd_status')}</label>
                    <select value={row.status} onChange={e => updateField(index, 'status', e.target.value)} className="fd-input">
                      <option value="available">{t('fd_available')}</option>
                      <option value="reserved">{t('fd_reserved')}</option>
                    </select>
                  </div>
                  <div className="fd-field">
                    <label className="fd-label">{t('fd_crop_type')}</label>
                    <select
                      value={row.organic ? 'organic' : 'non-organic'}
                      onChange={e => updateField(index, 'organic', e.target.value === 'organic')}
                      className="fd-input"
                    >
                      <option value="non-organic">{t('fd_non_organic')}</option>
                      <option value="organic">{t('fd_organic')}</option>
                    </select>
                  </div>
                  <div className="fd-field">
                    <label className="fd-label">{t('fd_available_until')}</label>
                    <input
                      type="date"
                      value={row.availableUntil}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => updateField(index, 'availableUntil', e.target.value)}
                      className="fd-input"
                      title={t('fd_available_until_title')}
                    />
                    {row.availableUntil && (
                      <span style={{ fontSize:11, color:'#6b7280', marginTop:3, display:'block' }}>
                        {t('fd_consumers_will_see')} {new Date(row.availableUntil + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      </span>
                    )}
                  </div>
                  <div className="fd-field fd-field--full">
                    <label className="fd-label">{t('fd_notes_optional')}</label>
                    <textarea
                      placeholder={t('fd_notes_placeholder')}
                      value={row.notes}
                      onChange={e => updateField(index, 'notes', e.target.value)}
                      className="fd-textarea"
                    />
                  </div>
                  <div className="fd-form-actions">
                    <button onClick={() => handleSave(index)} className="fd-save-btn" disabled={loading}>
                      {loading ? t('fd_saving') : <><FaSave style={{ marginRight: 5 }} />{editingCropId ? t('fd_update_crop') : t('fd_save_crop')}</>}
                    </button>
                    <button onClick={() => { setEditingCropId(null); resetForm(); setCropPickerStep('pick'); setCropSearch('') }} className="fd-cancel-btn">
                      <FaTimes style={{ marginRight: 4 }} />{t('fd_cancel')}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Skeleton while loading */}
          {loading && savedCrops.length === 0 && !showAddForm && (
            <div className="fd-saved-crops-list">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Saved crops list */}
          {savedCrops.length > 0 && !showAddForm && (
            <div className="fd-saved-crops-list">
              {savedCrops.map(crop => {
                const smCfg = STATUS_KEY_MAP[crop.status] || STATUS_KEY_MAP.available
                const sm = { ...smCfg, label: t(smCfg.labelKey) }
                // Use stored image first, then try to generate from crop name
                const img = crop.image || getCropImage(crop.crop || crop.cropName)
                const today = new Date().toISOString().split('T')[0]
                const isExpired = crop.availableUntil && crop.availableUntil < today
                return (
                  <div key={crop.id} className="fd-saved-crop-row">
                    {/* Image */}
                    <div style={{ width: '100%', height: 98, borderRadius: '0 8px 0 8px', overflow: 'hidden', background: '#f1f5f1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {img ? (
                        <img 
                          src={img} 
                          alt={crop.crop || crop.cropName}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }} 
                          onError={e => { 
                            e.currentTarget.style.display = 'none'
                            if (e.currentTarget.nextSibling) {
                              e.currentTarget.nextSibling.style.display = 'flex'
                            }
                          }} 
                        />
                      ) : null}
                      <div className="fd-crop-fallback" style={{ width: '100%', height: '100%', display: img ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8f5e9', position: 'absolute', top: 0, left: 0 }}><FaLeaf style={{ fontSize: 40, color: '#2e7d32', opacity: 0.6 }} /></div>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 13, color: '#1a2e1a', marginBottom: 3 }}>{crop.crop || crop.cropName}</div>
                      <div style={{ fontSize: 11, color: '#5b7d5b', fontWeight: 600, marginBottom: 3 }}>💰 ₹{crop.price}/{t('fd_kg')}</div>
                      <div style={{ fontSize: 11, color: '#6b7d6b', marginBottom: 5 }}>📦 {crop.quantity} {t('fd_kg')}</div>
                      
                      {crop.availableUntil && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: isExpired ? '#dc2626' : '#059669', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, padding: '3px 7px', background: isExpired ? '#fef2f2' : '#f0fdf4', borderRadius: 5 }}>
                          <FaCalendarAlt style={{ fontSize: 10 }} />
                          {isExpired ? t('fd_expired') : t('fd_till')} {new Date(crop.availableUntil + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      )}

                      {formatRelTime(crop.updatedAt || crop.createdAt) && (
                        <div className="fd-last-updated" style={{ fontSize: 9, color: '#94a3b8', marginBottom: 5 }}>
                          🕐 {formatRelTime(crop.updatedAt || crop.createdAt)}
                        </div>
                      )}

                      {crop.organic && (
                        <div style={{ fontSize: 9, fontWeight: 800, color: '#166534', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 12, padding: '2px 7px', display: 'inline-block', marginBottom: 5 }}>
                          {t('fd_organic')}
                        </div>
                      )}

                      <div style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 14, background: sm.bg, color: sm.color, border: `1.5px solid ${sm.color}`, display: 'inline-block', marginBottom: 6 }}>{sm.label}</div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 5, width: '100%' }}>
                      <button onClick={() => handleEdit(crop)} style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: '1.5px solid #3b82f6', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', color: '#1d4ed8', fontWeight: 700, fontSize: 10, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 3 }} onMouseEnter={(e)=>e.target.style.boxShadow='0 2px 6px rgba(29,78,216,0.3)'} onMouseLeave={(e)=>e.target.style.boxShadow='none'} title={t('fd_edit')}>✎ {t('fd_edit')}</button>
                      <button onClick={() => handleDelete(crop.id)} style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: '1.5px solid #fca5a5', background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)', color: '#dc2626', fontWeight: 700, fontSize: 10, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 3 }} onMouseEnter={(e)=>e.target.style.boxShadow='0 2px 6px rgba(220,38,38,0.3)'} onMouseLeave={(e)=>e.target.style.boxShadow='none'} title={t('fd_delete')}>🗑 {t('fd_delete')}</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Empty state */}
          {savedCrops.length === 0 && !showAddForm && (
            <div className="fd-empty">
              <div className="fd-empty-icon">🌾</div>
              <h3 className="fd-empty-title">{t('fd_no_crops_title')}</h3>
              <p className="fd-empty-sub">{t('fd_no_crops_sub')}</p>
            </div>
          )}


        </div>
      )}

      {/* ─── ANALYTICS TAB ─── */}
      {activeTab === 'analytics' && (
        <div className="fd-content">
          <h2 className="fd-content-title">
            <FaChartLine style={{ color: '#1565c0', marginRight: 8 }} />
            {t('fd_farm_analytics')}
          </h2>
          <div className="fd-analytics-grid">
            {[
              { icon: <FaSeedling />, label: t('fd_total_crops'),     val: analytics.totalCrops,               cls: 'green' },
              { icon: <FaMoneyBillWave />, label: t('fd_portfolio_value'), val: `₹${analytics.totalValue.toLocaleString()}`, cls: 'blue' },
              { icon: <FaTruck />,    label: t('fd_available_crops'), val: analytics.availableCrops,           cls: 'teal' },
              { icon: <FaCalendarAlt />, label: t('fd_sold_crops'),   val: analytics.soldCrops,                cls: 'orange' },
            ].map((card, i) => (
              <div key={i} className={`fd-analytic-card fd-analytic-card--${card.cls}`}>
                <div className="fd-analytic-icon">{card.icon}</div>
                <div>
                  <p className="fd-analytic-label">{card.label}</p>
                  <p className="fd-analytic-val">{card.val}</p>
                </div>
              </div>
            ))}
          </div>

          {savedCrops.length > 0 && (
            <div className="fd-breakdown-card">
              <h3 className="fd-breakdown-title">{t('fd_crop_breakdown')}</h3>
              <div className="fd-breakdown-list">
                {savedCrops.map(crop => {
                  const img = getCropImage(crop.crop || crop.cropName)
                  const smCfg2 = STATUS_KEY_MAP[crop.status] || STATUS_KEY_MAP.available
                  const sm = { ...smCfg2, label: t(smCfg2.labelKey) }
                  return (
                    <div key={crop.id} className="fd-breakdown-row">
                      <div className="fd-breakdown-left">
                        {img
                          ? <img src={img} alt={crop.crop} className="fd-breakdown-img" />
                          : <FaLeaf style={{ color: '#2e7d32', fontSize: 20 }} />
                        }
                        <div>
                          <p className="fd-breakdown-name">{crop.crop || crop.cropName}</p>
                          <p className="fd-breakdown-loc">{fmt(crop.district)}, {fmt(crop.state)}</p>
                        </div>
                      </div>
                      <div className="fd-breakdown-right">
                        <span className="fd-breakdown-qty">{crop.quantity} {t('fd_kg')}</span>
                        <span className="fd-breakdown-price">₹{crop.price}/{t('fd_kg')}</span>
                        <span className="fd-breakdown-status" style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {savedCrops.length === 0 && (
            <div className="fd-empty">
              <div className="fd-empty-icon">📊</div>
              <h3 className="fd-empty-title">{t('fd_no_data_title')}</h3>
              <p className="fd-empty-sub">{t('fd_no_data_sub')}</p>
            </div>
          )}
        </div>
      )}

      {/* ─── ORDERS TAB ─── */}
      {activeTab === 'orders' && (
        <div className="fd-content">
          <h2 className="fd-content-title">
            <FaShoppingBag style={{ color: '#6a1b9a', marginRight: 8 }} />
            {t('fd_incoming_orders')}
            {orders.length > 0 && (
              <span className="fd-orders-badge">{orders.length}</span>
            )}
          </h2>

          {ordersLoading ? (
            <div className="fd-orders-list">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="fd-empty">
              <div className="fd-empty-icon">📦</div>
              <h3 className="fd-empty-title">{t('fd_no_orders_title')}</h3>
              <p className="fd-empty-sub">{t('fd_no_orders_sub')}</p>
            </div>
          ) : (
            <div className="fd-orders-list">
              {orders.map(order => {
                const statusCfg = {
                  pending:   { label: t('fd_pending_label'),   color: '#f59e0b', bg: '#fef3c7', next: 'confirmed',  nextLabel: t('fd_confirm_order') },
                  confirmed: { label: t('fd_confirmed_label'), color: '#16a34a', bg: '#dcfce7', next: 'shipped',    nextLabel: t('fd_mark_shipped') },
                  shipped:   { label: t('fd_shipped_label'),   color: '#0891b2', bg: '#cffafe', next: 'delivered',  nextLabel: t('fd_mark_delivered') },
                  delivered: { label: t('fd_delivered_label'), color: '#16a34a', bg: '#dcfce7', next: null,         nextLabel: null },
                }[order.status] || { label: order.status, color: '#999', bg: '#f3f4f6', next: null, nextLabel: null }

                const addr = order.shippingAddress || {}
                const date = order.createdAtMs ? new Date(order.createdAtMs).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

                return (
                  <div key={order.id}
                    data-notif-id={order.id}
                    className={`fd-order-card ${selectedOrder?.id === order.id ? 'fd-order-card--open' : ''} ${blinkCardId === order.id ? 'fd-card-blink' : ''}`}
                    style={{ borderLeftColor: statusCfg.color }}>
                    {/* ── Card Header (always visible) ── */}
                    <div className="fd-order-header" onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
                      <div className="fd-order-meta">
                        <span className="fd-order-id">#{order.id.slice(0, 8).toUpperCase()}</span>
                        <span className="fd-order-date">{date}</span>
                      </div>
                      <div className="fd-order-summary">
                        <span className="fd-order-crop">{order.cropName || t('fd_crop')}</span>
                        <span className="fd-order-qty">{order.quantity} {order.unit || t('fd_kg')}</span>
                      </div>
                      <div className="fd-order-right">
                        <span className="fd-order-amount">₹{parseFloat(order.totalPrice || order.totalAmount || 0).toFixed(2)}</span>
                        <span className="fd-order-status-pill" style={{ color: statusCfg.color, background: statusCfg.bg }}>
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>

                    {/* ── Expanded Detail Panel ── */}
                    {selectedOrder?.id === order.id && (
                      <div className="fd-order-detail">
                        <div className="fd-order-detail-grid">
                          {/* Customer info */}
                          <div className="fd-order-section">
                            <h4 className="fd-order-section-title">👤 {t('fd_customer')}</h4>
                            <p className="fd-order-info-line"><strong>{addr.fullName || '—'}</strong></p>
                            <p className="fd-order-info-line"><FaPhone style={{ marginRight: 6, color: '#6b7280' }} />{addr.phone || '—'}</p>
                          </div>

                          {/* Delivery address */}
                          <div className="fd-order-section">
                            <h4 className="fd-order-section-title"><FaMapMarkerAlt style={{ marginRight: 4 }} /> {t('fd_delivery_address')}</h4>
                            <p className="fd-order-info-line">{addr.area || addr.street || '—'}</p>
                            <p className="fd-order-info-line">{addr.city}{addr.pincode ? ` – ${addr.pincode}` : ''}</p>
                          </div>

                          {/* Order details */}
                          <div className="fd-order-section">
                            <h4 className="fd-order-section-title">🌾 {t('fd_crop_details')}</h4>
                            <p className="fd-order-info-line">{order.cropName} × {order.quantity} {order.unit || t('fd_kg')}</p>
                            <p className="fd-order-info-line">₹{order.pricePerKg || order.price || '—'}/{t('fd_kg')}</p>
                            <p className="fd-order-info-line"><strong>{t('fd_total')}: ₹{parseFloat(order.totalPrice || order.totalAmount || 0).toFixed(2)}</strong></p>
                            <p className="fd-order-info-line">{t('fd_payment')}: <strong>{t('fd_cod')}</strong></p>
                          </div>
                        </div>

                        {/* ── Status progress bar ── */}
                        <div className="fd-order-progress">
                          {['pending', 'confirmed', 'shipped', 'delivered'].map((step, i) => {
                            const steps = ['pending', 'confirmed', 'shipped', 'delivered']
                            const currentIdx = steps.indexOf(order.status)
                            const stepIdx = i
                            const isDone = stepIdx <= currentIdx
                            const isCurrent = stepIdx === currentIdx
                            const labels = [t('fd_pending_label'), t('fd_confirmed_label'), t('fd_shipped_label'), t('fd_delivered_label')]
                            return (
                              <div key={step} className={`fd-progress-step ${isDone ? 'fd-progress-step--done' : ''} ${isCurrent ? 'fd-progress-step--current' : ''}`}>
                                <div className="fd-progress-dot" />
                                <span className="fd-progress-label">{labels[i]}</span>
                                {i < 3 && <div className={`fd-progress-line ${stepIdx < currentIdx ? 'fd-progress-line--done' : ''}`} />}
                              </div>
                            )
                          })}
                        </div>

                        {/* ── Action button ── */}
                        {statusCfg.next && (
                          <button
                            className="fd-order-action-btn"
                            disabled={statusUpdating}
                            onClick={async () => {
                              setStatusUpdating(true)
                              const result = await updateOrderStatus(order.id, statusCfg.next, order.farmerId)
                              setStatusUpdating(false)
                              if (result.success) {
                                toastSuccess(`${t('fd_order_marked_as')} ${statusCfg.next}!`)
                                setSelectedOrder(prev => prev ? { ...prev, status: statusCfg.next } : null)
                              } else {
                                toastError(result.error || t('fd_update_failed'))
                              }
                            }}
                          >
                            {statusUpdating ? t('fd_updating') : statusCfg.nextLabel}
                          </button>
                        )}
                        {!statusCfg.next && (
                          <div className="fd-order-delivered-msg">{t('fd_order_delivered')}</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ─── My Quotes & Active Deals ─── */}
          {myQuotes.filter(d => d.status !== 'completed').length > 0 && (
            <>
              <div style={{ borderTop: '2px solid #f3f4f6', margin: '32px 0 24px' }} />
              <h3 className="fd-market-section-title" style={{ marginTop: 0 }}>
                <FaCoins style={{ color: '#f59e0b', marginRight: 8 }} />
                {t('fd_my_quotes')} ({myQuotes.filter(d => d.status !== 'completed').length})
              </h3>
              <div className="fd-market-grid">
                {myQuotes.filter(d => d.status !== 'completed').map(deal => {
                  const statusColors = {
                    quoted:      { bg: '#fef3c7', color: '#b45309' },
                    deal_closed: { bg: '#d1fae5', color: '#065f46' },
                    in_progress: { bg: '#ede9fe', color: '#6d28d9' },
                    completed:   { bg: '#dcfce7', color: '#15803d' },
                  }[deal.status] || { bg: '#f3f4f6', color: '#374151' }
                  const statusLabel = {
                    quoted:      t('fd_offer_sent'),
                    deal_closed: t('fd_deal_accepted'),
                    in_progress: t('fd_dispatched'),
                    completed:   t('fd_completed'),
                  }[deal.status] || deal.status

                  return (
                    <div key={deal.id} data-notif-id={deal.id} className={`fd-demand-card fd-committed-card${blinkCardId === deal.id ? ' fd-card-blink' : ''}`}>

                      {/* Status badge */}
                      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:8 }}>
                        <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:statusColors.bg, color:statusColors.color, border:`1px solid ${statusColors.color}40` }}>
                          {statusLabel}
                        </span>
                      </div>

                      {/* Crop name + Consumer name */}
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                        <span className="fd-demand-cropname" style={{ fontSize:16 }}>{deal.cropName}</span>
                        <span style={{ fontSize:12, color:'#2563eb', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                          <FaUsers style={{ fontSize:10 }} />{deal.consumerName}
                        </span>
                      </div>

                      {/* QTY | OFFER | TOTAL partitions */}
                      <div style={{ display:'flex', gap:6, marginBottom:10 }}>
                        <div style={{ flex:1, background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:8, padding:'6px 8px', textAlign:'center' }}>
                          <div style={{ fontSize:10, color:'#1e40af', fontWeight:600, marginBottom:2 }}>{t('fd_qty')}</div>
                          <div style={{ fontSize:13, fontWeight:700, color:'#1d4ed8' }}>{deal.quantityKg}<span style={{ fontSize:10, fontWeight:500 }}> {t('fd_kg')}</span></div>
                        </div>
                        <div
                          style={{ flex:1, background:'#fefce8', border: deal.status==='quoted' ? '1.5px dashed #f59e0b' : '1px solid #fde68a', borderRadius:8, padding:'6px 8px', textAlign:'center', cursor: deal.status==='quoted' ? 'pointer' : 'default' }}
                          onClick={() => deal.status==='quoted' && setEditingDeal(prev =>
                            prev[deal.id]
                              ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== deal.id))
                              : { ...prev, [deal.id]: { price: deal.farmerOfferDisplay || '', unit: deal.farmerOfferUnit || 'kg' } }
                          )}
                          title={deal.status==='quoted' ? t('fd_click_to_edit') : ''}
                        >
                          <div style={{ fontSize:10, color:'#92400e', fontWeight:600, marginBottom:2 }}>{t('fd_rate')} {deal.status==='quoted' && <span style={{fontSize:9}}>✏️</span>}</div>
                          <div style={{ fontSize:13, fontWeight:700, color:'#b45309' }}>₹{deal.farmerOfferDisplay || deal.farmerOfferPrice}<span style={{ fontSize:10, fontWeight:500 }}>/{deal.farmerOfferUnit || 'kg'}</span></div>
                        </div>
                        <div style={{ flex:1, background:'#f0fdf4', border:'1px solid #86efac', borderRadius:8, padding:'6px 8px', textAlign:'center' }}>
                          <div style={{ fontSize:10, color:'#166534', fontWeight:600, marginBottom:2 }}>{t('fd_total')}</div>
                          <div style={{ fontSize:13, fontWeight:700, color:'#15803d' }}>₹{((deal.quantityKg || 0) * (deal.farmerOfferPrice || 0)).toLocaleString()}</div>
                        </div>
                      </div>

                      {/* Location */}
                      <div style={{ fontSize:12, color:'#6b7280', marginBottom:10, display:'flex', alignItems:'center', gap:5 }}>
                        <FaMapMarkerAlt style={{ color:'#ef4444', fontSize:11 }} />{deal.location}
                      </div>

                      {/* Consumer contact revealed after deal is accepted */}
                      {['deal_closed','in_progress','completed'].includes(deal.status) && (
                        <div className="fd-contact-reveal" style={{ marginBottom:10 }}>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                            <span style={{ fontSize:13, fontWeight:700, color:'#0ea5e9' }}>{deal.consumerName}</span>
                            <a href={`tel:${deal.consumerPhone}`} style={{ fontSize:12, fontWeight:600, color:'#b45309', display:'flex', alignItems:'center', gap:5, textDecoration:'none' }}>
                              <FaPhone style={{ fontSize:11 }} />{deal.consumerPhone || t('fd_not_provided')}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Pickup date panel */}
                      {['deal_closed','in_progress'].includes(deal.status) && (
                        <div style={{ background:'#f0fdf4', border:'1.5px solid #86efac', borderRadius:10, padding:'10px 12px', marginBottom:10 }}>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <FaCalendarAlt style={{ color:'#15803d', fontSize:13 }} />
                              <span style={{ fontSize:12, fontWeight:600, color:'#166534' }}>
                                {t('fd_pickup_date')}:
                              </span>
                              <span style={{ fontSize:13, fontWeight:700, color:'#15803d' }}>
                                {deal.pickupDate
                                  ? new Date(deal.pickupDate + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
                                  : t('fd_not_set')}
                              </span>
                            </div>
                            {deal.status === 'deal_closed' && (
                              <button
                                onClick={() => {
                                  setChangingDateDeal(changingDateDeal === deal.id ? null : deal.id)
                                  setFarmerNewDate(deal.pickupDate || '')
                                }}
                                style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:8, border:'1.5px solid #16a34a', background: changingDateDeal === deal.id ? '#dcfce7' : '#fff', color:'#15803d', cursor:'pointer' }}
                              >
                                <FaCalendarAlt style={{ marginRight:4, fontSize:10 }} />
                                {t('fd_change_date')}
                              </button>
                            )}
                          </div>

                          {/* Farmer date change panel */}
                          {changingDateDeal === deal.id && deal.status === 'deal_closed' && (
                            <div style={{ marginTop:10, paddingTop:10, borderTop:'1px solid #bbf7d0' }}>
                              <div style={{ fontSize:11, color:'#166534', fontWeight:600, marginBottom:6 }}>
                                {t('fd_select_new_date')}:
                              </div>
                              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                                <input
                                  type="date"
                                  value={farmerNewDate}
                                  min={new Date().toISOString().split('T')[0]}
                                  onChange={e => setFarmerNewDate(e.target.value)}
                                  style={{ flex:1, padding:'7px 10px', borderRadius:8, border:'1.5px solid #86efac', fontSize:13, outline:'none' }}
                                />
                                <button
                                  onClick={async () => {
                                    const res = await farmerUpdatePickupDate(deal.id, farmerNewDate)
                                    if (res.success) {
                                      toastSuccess(t('fd_date_updated'))
                                      setChangingDateDeal(null)
                                      setFarmerNewDate('')
                                    } else toastError(res.error || t('fd_update_failed'))
                                  }}
                                  style={{ padding:'7px 14px', borderRadius:8, border:'none', background:'#15803d', color:'#fff', fontWeight:700, fontSize:12, cursor:'pointer' }}
                                >
                                  {t('fd_save_date')}
                                </button>
                                <button
                                  onClick={() => { setChangingDateDeal(null); setFarmerNewDate('') }}
                                  style={{ padding:'7px 10px', borderRadius:8, border:'1px solid #d1d5db', background:'#f9fafb', color:'#374151', fontWeight:600, fontSize:12, cursor:'pointer' }}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Waiting message for in_progress */}
                      {deal.status === 'in_progress' && (
                        <div className="fd-deal-waiting" style={{ marginBottom:8 }}>
                          {t('fd_dispatched')}
                        </div>
                      )}

                      {/* Deal success banner */}
                      {deal.status === 'completed' && (
                        <div className="fd-deal-success">
                          <FaCheckCircle style={{ marginRight: 8 }} /> Deal Complete! Consumer confirmed receipt.
                        </div>
                      )}

                      {/* Inline edit form for quoted deals */}
                      {deal.status === 'quoted' && editingDeal[deal.id] && (
                        <div style={{ background:'#f0fdf4', border:'1.5px solid #86efac', borderRadius:10, padding:'12px', marginTop:8 }}>
                          <div style={{ fontSize:12, fontWeight:700, color:'#15803d', marginBottom:8 }}>✏️ Edit Your Offer</div>
                          <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                            {[{label:'per kg',value:'kg'},{label:'per Quintal',value:'quintal'},{label:'per Ton',value:'ton'}].map(u => (
                              <button key={u.value}
                                onClick={() => setEditingDeal(prev => ({ ...prev, [deal.id]: { ...prev[deal.id], unit: u.value } }))}
                                style={{ flex:1, padding:'5px 4px', fontSize:11, fontWeight:600, borderRadius:8, cursor:'pointer', border:'1.5px solid',
                                  borderColor: (editingDeal[deal.id]?.unit||'kg') === u.value ? '#16a34a' : '#d1d5db',
                                  background:  (editingDeal[deal.id]?.unit||'kg') === u.value ? '#dcfce7' : '#fff',
                                  color:       (editingDeal[deal.id]?.unit||'kg') === u.value ? '#15803d' : '#6b7280' }}
                              >{u.label}</button>
                            ))}
                          </div>
                          <div style={{ display:'flex', border:'1.5px solid #86efac', borderRadius:8, overflow:'hidden', marginBottom:8 }}>
                            <span style={{ padding:'0 10px', background:'#dcfce7', display:'flex', alignItems:'center', fontSize:14, fontWeight:700, color:'#15803d' }}>₹</span>
                            <input
                              type="number" min="0" placeholder="New amount..."
                              value={editingDeal[deal.id]?.price || ''}
                              onChange={e => setEditingDeal(prev => ({ ...prev, [deal.id]: { ...prev[deal.id], price: e.target.value } }))}
                              style={{ flex:1, border:'none', outline:'none', padding:'8px 10px', fontSize:14 }}
                            />
                          </div>
                          <div style={{ display:'flex', gap:8 }}>
                            <button
                              style={{ flex:1, padding:'8px', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer' }}
                              onClick={async () => {
                                const ed = editingDeal[deal.id] || {}
                                const res = await updateOffer(deal.id, ed.price, ed.unit || 'kg')
                                if (res.success) { toastSuccess('Offer updated!'); setEditingDeal(prev => { const n={...prev}; delete n[deal.id]; return n }) }
                                else toastError(res.error || 'Failed to update offer')
                              }}
                            ><FaCheckCircle style={{ marginRight:6 }} /> Save</button>
                            <button
                              style={{ flex:1, padding:'8px', background:'#f3f4f6', color:'#374151', border:'1px solid #d1d5db', borderRadius:8, fontWeight:600, fontSize:13, cursor:'pointer' }}
                              onClick={() => setEditingDeal(prev => { const n={...prev}; delete n[deal.id]; return n })}
                            >Cancel</button>
                          </div>
                        </div>
                      )}

                      {/* Action buttons — always side by side */}
                      <div style={{ display:'flex', gap:8, marginTop:8, alignItems:'stretch' }}>
                        {deal.status === 'quoted' && (
                          <button
                            className="fd-fulfilling-btn"
                            style={{ flex:1, background:'#fef2f2', color:'#dc2626', border:'1px solid #fca5a5', marginTop:0 }}
                            onClick={async () => {
                              const res = await withdrawOffer(deal.id)
                              if (res.success) toastSuccess('Offer withdrawn. Request is open again.')
                              else toastError(res.error || 'Failed to withdraw offer')
                            }}
                          >
                            <FaTimes style={{ marginRight: 6 }} /> {t('fd_withdraw_offer')}
                          </button>
                        )}
                        {deal.status === 'deal_closed' && (
                          <button
                            className="fd-commit-btn"
                            style={{ flex:1, background:'linear-gradient(135deg,#7c3aed,#6d28d9)', marginTop:0 }}
                            onClick={async () => {
                              const res = await markInProgress(deal.id)
                              if (res.success) toastSuccess('Marked as dispatched! Waiting for consumer to confirm receipt.')
                              else toastError(res.error)
                            }}
                          >
                            <FaTruck style={{ marginRight: 6 }} /> {t('fd_mark_in_progress')}
                          </button>
                        )}
                        <button
                          className="chat-trigger-btn"
                          style={{ flex:1 }}
                          onClick={() => setActiveChatDemand(deal)}
                        >
                          <FaComments style={{ marginRight: 6 }} /> {t('fd_chat')}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── MARKET OPPORTUNITIES TAB ─── */}
      {activeTab === 'market' && (
        <div className="fd-content">
          <h2 className="fd-content-title">
            <FaBullseye style={{ color: '#7c3aed', marginRight: 8 }} />
            {t('fd_crop_requests')}
            {openDemands.length > 0 && (
              <span className="fd-notif-count" style={{ background: '#7c3aed' }}>{openDemands.length}</span>
            )}
          </h2>
          <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 20px' }}>
            Consumers are requesting these crops -- submit your best price offer and win the deal!
          </p>

          {/* Open Demands — sorted by location match */}
          {openDemands.length === 0 ? (
            <div className="fd-empty">
              <div className="fd-empty-icon">🎯</div>
              <h3 className="fd-empty-title">{t('fd_no_demands')}</h3>
              <p className="fd-empty-sub">{t('fd_no_demands')}</p>
            </div>
          ) : (
            <>
              {/* Priority Leads */}
              {priorityDemands.length > 0 && (
                <>
                  <div className="fd-market-section-label fd-market-section-label--priority">
                    {t('fd_near_you')} ({priorityDemands.length})
                  </div>
                  <div className="fd-market-grid">
                    {priorityDemands.map(demand => (
                      <DemandCard
                        key={demand.id}
                        demand={demand}
                        isPriority
                        isBlinking={blinkCardId === demand.id}
                        onSubmitOffer={handleSubmitOffer}
                        onOpenChat={setActiveChatDemand}
                        onToastError={toastError}
                        onToastSuccess={toastSuccess}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Other Leads */}
              {otherDemands.length > 0 && (
                <>
                  {priorityDemands.length > 0 && (
                    <div className="fd-market-section-label" style={{ marginTop: 24 }}>
                      📦 {t('fd_other_requests')} ({otherDemands.length})
                    </div>
                  )}
                  <div className="fd-market-grid">
                    {otherDemands.map(demand => (
                      <DemandCard
                        key={demand.id}
                        demand={demand}
                        isPriority={false}
                        isBlinking={blinkCardId === demand.id}
                        onSubmitOffer={handleSubmitOffer}
                        onOpenChat={setActiveChatDemand}
                        onToastError={toastError}
                        onToastSuccess={toastSuccess}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

        </div>
      )}

      {/* ─── NOTIFICATIONS TAB ─── */}
      {activeTab === 'notifications' && (
        <div className="fd-content">
          <h2 className="fd-content-title">
            <FaBell style={{ color: '#e65100', marginRight: 8 }} />
            {t('fd_notifications')}
            {farmerNotifications.length > 0 && (
              <span className="fd-notif-count">{farmerNotifications.length}</span>
            )}
          </h2>
          {farmerNotifications.length === 0 ? (
            <div className="fd-empty">
              <div className="fd-empty-icon">🔔</div>
              <h3 className="fd-empty-title">{t('fd_no_notifs')}</h3>
              <p className="fd-empty-sub">{t('fd_no_notifs')}</p>
            </div>
          ) : (
            <div className="fd-notif-list">
              {farmerNotifications.map((notif) => {
                return (
                  <button
                    key={`${notif.type}_${notif.id}`}
                    className="fd-notif-item"
                    onClick={() => handleNotifItemClick(notif)}
                    style={{ width: '100%', textAlign: 'left', border: 'none', background: '#fff', cursor: 'pointer' }}
                  >
                    <div className="fd-notif-icon-wrap">
                      <span className="fd-notif-emoji">{notif.icon}</span>
                    </div>
                    <div className="fd-notif-body">
                      <p className="fd-notif-title">{notif.title}</p>
                      <p className="fd-notif-meta">{notif.subtitle}</p>
                    </div>
                    <span className="fd-notif-time">{notif.timeLabel || 'recently'}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FarmerDashboard
