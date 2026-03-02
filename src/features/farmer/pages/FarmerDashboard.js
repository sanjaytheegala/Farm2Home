import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

import {
  FaLeaf, FaChartLine, FaPlus, FaEdit, FaTrash, FaSave,
  FaTruck, FaMoneyBillWave, FaCalendarAlt, FaBell, FaShoppingBag,
  FaMapMarkerAlt, FaSeedling, FaTimes, FaCheckCircle, FaClock, FaTag, FaSearch, FaPhone,
  FaCoins, FaUsers, FaBullseye, FaFlag
} from 'react-icons/fa'
import { findCropByKeyword, CROP_DICTIONARY } from '../../../data/cropData'
import { geoData } from '../../../locale/geoData'
import ComplaintModal from '../../../shared/components/ComplaintModal/ComplaintModal'

// Avatar palette — deterministic color per farmer name first letter
const AVATAR_PALETTE = ['#FFBF00','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#BE6DB7','#F7A738','#2ECC71']
const getAvatarColor = (name) =>
  AVATAR_PALETTE[((name || 'F').charCodeAt(0) - 65 + 26) % 8]

// Time-based greeting
const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// Helper: title-case underscore keys
const fmt = (key) =>
  key ? key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '—'

// Get crop image from dictionary
const getCropImage = (cropName) => {
  if (!cropName) return null
  const match = CROP_DICTIONARY.find(c =>
    c.name.toLowerCase() === cropName.toLowerCase() ||
    c.keywords.some(k => k.toLowerCase() === cropName.toLowerCase())
  )
  return match ? match.image : null
}

// Status display config
const statusMeta = {
  available: { label: 'Available', bg: '#e8f5e9', color: '#2e7d32', icon: <FaCheckCircle /> },
  sold:      { label: 'Sold',      bg: '#ffebee', color: '#c62828', icon: <FaTimes /> },
  reserved:  { label: 'Reserved',  bg: '#fff8e1', color: '#f57f17', icon: <FaClock /> },
  pending:   { label: 'Pending',   bg: '#e3f2fd', color: '#1565c0', icon: <FaClock /> }
}

// State/districts for dropdowns
const stateDistricts = {
  telangana: ['adilabad','bhadradri_kothagudem','hyderabad','jagtial','jangaon','jayashankar_bhupalpally','jogulamba_gadwal','kamareddy','karimnagar','khammam','komaram_bheem_asifabad','mahabubabad','mahabubnagar','mancherial','medak','medchal_malkajgiri','mulugu','nagarkurnool','nalgonda','narayanpet','nirmal','nizamabad','peddapalli','rajanna_sircilla','rangareddy','sangareddy','siddipet','suryapet','vikarabad','wanaparthy','warangal_rural','warangal_urban','yadadri_bhuvanagiri'],
  andhra_pradesh: ['anantapur','chittoor','east_godavari','guntur','kadapa','krishna','kurnool','nellore','prakasam','srikakulam','visakhapatnam','vizianagaram','west_godavari'],
  tamil_nadu: ['ariyalur','chengalpattu','chennai','coimbatore','cuddalore','dharmapuri','dindigul','erode','kallakurichi','kanchipuram','kanniyakumari','karur','krishnagiri','madurai','mayiladuthurai','nagapattinam','namakkal','nilgiris','perambalur','pudukkottai','ramanathapuram','ranipet','salem','sivaganga','tenkasi','thanjavur','theni','thoothukudi','tiruchirappalli','tirunelveli','tirupathur','tiruppur','tiruvallur','tiruvannamalai','tiruvarur','vellore','viluppuram','virudhunagar'],
  kerala: ['thiruvananthapuram','kollam','pathanamthitta','alappuzha','kottayam','idukki','ernakulam','thrissur','palakkad','malappuram','kozhikode','wayanad','kannur','kasaragod'],
  goa: ['north_goa','south_goa'],
  karnataka: ['bagalkot','ballari','belagavi','bengaluru_rural','bengaluru_urban','bidar','chamarajanagar','chikkaballapur','chikkamagaluru','chitradurga','dakshina_kannada','davanagere','dharwad','gadag','hassan','haveri','kalaburagi','kodagu','kolar','koppal','mandya','mysuru','raichur','ramanagara','shivamogga','tumakuru','udupi','uttara_kannada','vijayapura','yadgir','vijayanagara']
}

/* ─────────────────────────────────────────────────────────────
   DemandCard — one consumer request card in the market tab
───────────────────────────────────────────────────────────── */
const DemandCard = ({ demand, isPriority, currentUid, onToggleFulfilling, onToastError, onToastSuccess }) => {
  const [showComplaint, setShowComplaint] = useState(false)
  const isFulfilling = Array.isArray(demand.fulfillingFarmerIds) && demand.fulfillingFarmerIds.includes(currentUid)
  const hasPhone = demand.consumerPhone && demand.consumerPhone !== 'Not provided'

  const handleToggle = async () => {
    const res = await onToggleFulfilling(demand.id, isFulfilling)
    if (res.success) {
      onToastSuccess(isFulfilling ? 'Removed from fulfilling list.' : 'Marked as fulfilling! Admin notified.')
    } else {
      onToastError(res.error || 'Could not update status')
    }
  }

  return (
    <div className={`fd-demand-card${isPriority ? ' fd-demand-card--priority' : ''}`}>
      {isPriority && <div className="fd-priority-badge">📍 Near You</div>}
      <div className="fd-demand-header">
        <div className="fd-demand-crop-icon"><FaLeaf /></div>
        <div className="fd-demand-info">
          <span className="fd-demand-cropname">{demand.cropName}</span>
          <span className="fd-demand-consumer">
            <FaUsers style={{ marginRight: 4, fontSize: 11 }} />
            {demand.consumerName}
          </span>
        </div>
        <div className="fd-demand-new-badge">OPEN</div>
      </div>

      <div className="fd-demand-details">
        <div className="fd-demand-detail">
          <span className="fd-dd-label">Quantity</span>
          <span className="fd-dd-value">{demand.quantityKg} kg</span>
        </div>
        <div className="fd-demand-detail">
          <span className="fd-dd-label">Location</span>
          <span className="fd-dd-value">
            <FaMapMarkerAlt style={{ marginRight: 3, fontSize: 10 }} />{demand.location}
          </span>
        </div>
      </div>

      {demand.notes && <p className="fd-demand-notes">"{demand.notes}"</p>}

      {/* Direct contact — phone always visible */}
      <div className="fd-direct-contact">
        <div className="fd-direct-phone">
          <FaPhone style={{ marginRight: 6, color: '#16a34a' }} />
          <span>{hasPhone ? demand.consumerPhone : 'Phone not added'}</span>
        </div>
        {hasPhone && (
          <a href={`tel:${demand.consumerPhone}`} className="fd-call-btn">
            <FaPhone style={{ marginRight: 6 }} /> Call Consumer
          </a>
        )}
      </div>

      {/* Fulfilling toggle */}
      <button
        className={`fd-fulfilling-btn${isFulfilling ? ' fd-fulfilling-btn--active' : ''}`}
        onClick={handleToggle}
      >
        {isFulfilling
          ? <><FaCheckCircle style={{ marginRight: 6 }} /> I'm Handling This</>
          : <><FaSeedling style={{ marginRight: 6 }} /> I Am Fulfilling This</>}
      </button>

      {/* Report consumer */}
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop: 8 }}>
        <button className="report-trigger-btn" onClick={() => setShowComplaint(true)}>
          <FaFlag style={{ fontSize: 10 }} /> Report Consumer
        </button>
      </div>

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
  const { currentUser, userData } = useAuth()
  const [activeTab, setActiveTab] = useState('crops')
  const [farmerName, setFarmerName] = useState('')
  const [farmerPhoto, setFarmerPhoto] = useState(null)
  const [farmerPhone, setFarmerPhone] = useState('')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editProfileData, setEditProfileData] = useState({ name: '', phone: '', state: '', district: '' })
  const [editProfileSaving, setEditProfileSaving] = useState(false)
  const [userLocation, setUserLocation] = useState({ state: '', district: '' })
  const [cropSearch, setCropSearch] = useState('')
  const [cropPickerStep, setCropPickerStep] = useState('pick') // 'pick' | 'details'

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
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (snap) => {
      if (snap.exists()) {
        const d = snap.data()
        setFarmerName(d.name || d.displayName || d.email || currentUser.email || 'Farmer')
        setFarmerPhoto(d.photoURL || currentUser.photoURL || null)
        setFarmerPhone(d.phoneNumber || d.phone || '')
        if (d.state && d.district) setUserLocation({ state: d.state, district: d.district })
      }
    })
    return () => unsub()
  }, [currentUser, userData, navigate])

  const { savedCrops, loading, analytics, addCrop, deleteCrop, updateCropStatus, updateCrop } = useCrops()
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders()
  const { openDemands, myQuotes, submitOffer, markInProgress, toggleFulfilling } = useMarketOpportunities()
  const { success: toastSuccess, error: toastError } = useToast()

  // Farmer's display location for smart sorting
  const farmerStateDisplay    = userLocation?.state
    ? (geoData.en.states[userLocation.state] || '') : ''
  const farmerDistrictDisplay = userLocation?.state && userLocation?.district
    ? ((geoData.en.districts[userLocation.state] || {})[userLocation.district] || '') : ''

  const isLocationMatch = (loc = '') =>
    (farmerDistrictDisplay && loc.includes(farmerDistrictDisplay)) ||
    (farmerStateDisplay    && loc.includes(farmerStateDisplay))

  const priorityDemands = openDemands.filter(d => isLocationMatch(d.location))
  const otherDemands    = openDemands.filter(d => !isLocationMatch(d.location))
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

  // Pre-fill form with an existing crop for editing
  const handleEdit = (crop) => {
    setEditingCropId(crop.id)
    setRows([{
      crop: crop.crop || crop.cropName || '',
      quantity: String(crop.quantity || ''),
      price: String(crop.price || ''),
      status: crop.status || 'available',
      notes: crop.notes || ''
    }])
    setCropPickerStep('details')
    setShowAddForm(true)
  }

  const handleSave = async (index) => {
    const row = rows[index]
    if (!selectedDistrict) { toastError('Please select a district before saving.'); return }
    if (!row.crop || !row.crop.trim()) { toastError('Please select a crop name.'); return }
    const matchedCrop = findCropByKeyword(row.crop.trim())
    if (!matchedCrop) {
      toastError(`"${row.crop}" is not a recognized crop. Try: Rice, Wheat, Tomato, Onion, Potato…`)
      return
    }
    if (!row.quantity || isNaN(row.quantity) || parseFloat(row.quantity) <= 0) {
      toastError('Quantity must be a valid number greater than 0.'); return
    }
    if (!row.price || isNaN(row.price) || parseFloat(row.price) <= 0) {
      toastError('Price must be a valid number greater than 0.'); return
    }
    const cropData = getRowData(index)
    cropData.cropName = matchedCrop.name
    cropData.crop = matchedCrop.name
    cropData.image = matchedCrop.image || getCropImage(matchedCrop.name) || ''

    if (editingCropId) {
      // UPDATE existing crop
      const result = await updateCrop(editingCropId, {
        crop: cropData.crop,
        cropName: cropData.cropName,
        price: parseFloat(cropData.price),
        quantity: cropData.quantity,
        status: cropData.status,
        notes: cropData.notes,
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

  const availableCount = savedCrops.filter(c => c.status === 'available' || c.status === 'pending').length
  // Revenue = sum of totalPrice from all orders (confirmed/shipped/delivered)
  const soldRevenue = orders.reduce((s, o) => s + (parseFloat(o.totalPrice || o.totalAmount || 0)), 0)

  return (
    <div className="fd-root">

      {/* ─── Edit Profile Modal ─── */}
      {showEditProfile && (
        <div className="fd-bulk-overlay" onClick={() => setShowEditProfile(false)}>
          <div className="fd-bulk-modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="fd-bulk-modal-icon">👤</div>
            <h3 className="fd-bulk-modal-title">Edit Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }}>Full Name</label>
                <input
                  type="text"
                  value={editProfileData.name}
                  onChange={e => setEditProfileData(p => ({ ...p, name: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }}>Phone Number <span style={{color:'#dc2626'}}>*</span></label>
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
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }}>State</label>
                  <select
                    value={editProfileData.state}
                    onChange={e => setEditProfileData(p => ({ ...p, state: e.target.value, district: '' }))}
                    style={{ width: '100%', padding: '9px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                  >
                    <option value="">Select State</option>
                    {Object.keys(stateDistricts).map(k => <option key={k} value={k}>{fmt(k)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, color: '#374151' }}>District</label>
                  <select
                    value={editProfileData.district}
                    onChange={e => setEditProfileData(p => ({ ...p, district: e.target.value }))}
                    style={{ width: '100%', padding: '9px 10px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                  >
                    <option value="">Select District</option>
                    {(stateDistricts[editProfileData.state] || []).map(d => <option key={d} value={d}>{fmt(d)}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="fd-bulk-modal-actions">
              <button className="fd-bulk-ok-btn" onClick={handleSaveEditProfile} disabled={editProfileSaving}>
                {editProfileSaving ? 'Saving...' : <><FaSave style={{ marginRight: 8 }} /> Save Changes</>}
              </button>
              <button className="fd-bulk-close-btn" onClick={() => setShowEditProfile(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bulk Crop Alert Modal ─── */}
      {bulkAlert && (
        <div className="fd-bulk-overlay" onClick={() => setBulkAlert(null)}>
          <div className="fd-bulk-modal" onClick={e => e.stopPropagation()}>
            <div className="fd-bulk-modal-icon">📦</div>
            <h3 className="fd-bulk-modal-title">No Buyers Found for Bulk Quantity</h3>
            <p className="fd-bulk-modal-body">
              You listed <strong>{bulkAlert.quantity} kg</strong> of <strong>{bulkAlert.cropName}</strong> in <strong>{bulkAlert.location}</strong>.
              <br /><br />
              Currently, no consumers in your area are requesting this crop in bulk. Your listing is live and consumers can still browse and buy it — but you may also want to post a smaller batch (&lt;50 kg) for faster sale.
            </p>
            <div className="fd-bulk-modal-actions">
              <button className="fd-bulk-ok-btn" onClick={() => { setBulkAlert(null); setActiveTab('market') }}>
                <FaBullseye style={{ marginRight: 8 }} /> View Market Requests
              </button>
              <button className="fd-bulk-close-btn" onClick={() => setBulkAlert(null)}>Got it</button>
            </div>
          </div>
        </div>
      )}

      <Navbar isFarmerDashboard={true} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ─── Welcome Banner ─── */}
      <div className="fd-banner">
        <div className="fd-banner-inner">
          <div className="fd-banner-left">
            <div className="fd-avatar">
              {farmerPhoto
                ? <img src={farmerPhoto} alt={farmerName} className="fd-avatar-img" />
                : <div className="fd-avatar-letter" style={{ background: getAvatarColor(farmerName) }}>{(farmerName || 'F').charAt(0).toUpperCase()}</div>
              }
            </div>
            <div>
              <p className="fd-greeting">{getGreeting()},</p>
              <h1 className="fd-farmer-name">{farmerName}</h1>
              {(selectedDistrict || selectedState) && (
                <p className="fd-location">
                  <FaMapMarkerAlt style={{ marginRight: 5 }} />
                  {fmt(selectedDistrict)}{selectedDistrict && selectedState ? ', ' : ''}{fmt(selectedState)}
                </p>
              )}
              {farmerPhone && (
                <p className="fd-location" style={{ marginTop: 2 }}>
                  <FaPhone style={{ marginRight: 5, color: '#16a34a' }} />{farmerPhone}
                </p>
              )}
              <button
                onClick={handleOpenEditProfile}
                style={{ marginTop: 8, padding: '5px 14px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: 20, color: 'inherit', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}
              >
                <FaEdit style={{ fontSize: 11 }} /> Edit Profile
              </button>
            </div>
          </div>
          <div className="fd-banner-stats">
            <div className="fd-stat">
              <span className="fd-stat-num">{savedCrops.length}</span>
              <span className="fd-stat-label">Total Crops</span>
            </div>
            <div className="fd-stat-divider" />
            <div className="fd-stat">
              <span className="fd-stat-num">{availableCount}</span>
              <span className="fd-stat-label">Active</span>
            </div>
            <div className="fd-stat-divider" />
            <div className="fd-stat">
              <span className="fd-stat-num">₹{soldRevenue.toLocaleString()}</span>
              <span className="fd-stat-label">Revenue</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tab Bar + Location Selectors ─── */}
      <div className="fd-tabbar-wrap">
        <div className="fd-tabbar">
          {[
            { key: 'crops',         icon: <FaLeaf />,        label: 'Manage Crops' },
            { key: 'analytics',     icon: <FaChartLine />,   label: 'Analytics' },
            { key: 'orders',        icon: <FaShoppingBag />, label: 'Orders' },
            { key: 'market',        icon: <FaBullseye />,    label: 'Crop Requests', badge: openDemands.length },
            { key: 'notifications', icon: <FaBell />,        label: 'Notifications' },
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
              <option value="">Select District</option>
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
              Your Crops
              {savedCrops.length > 0 && <span className="fd-count-badge">{savedCrops.length}</span>}
            </h2>
            <button className="fd-add-btn" onClick={() => {
              if (!showAddForm) { setEditingCropId(null); setCropPickerStep('pick'); setCropSearch('') }
              setShowAddForm(!showAddForm)
            }}>
              {showAddForm
                ? <><FaTimes style={{ marginRight: 6 }} />Cancel</>
                : <><FaPlus style={{ marginRight: 6 }} />Add New Crop</>}
            </button>
          </div>

          {/* ── STEP 1: Crop Picker ── */}
          {showAddForm && cropPickerStep === 'pick' && (
            <div className="fd-form-card">
              <h3 className="fd-form-title">
                <FaSeedling style={{ marginRight: 8, color: '#2e7d32' }} />
                Choose a Crop
              </h3>
              <p className="fd-picker-hint">Tap any crop below, or type to search by name or local name</p>
              <div className="fd-picker-search-wrap">
                <FaSearch className="fd-picker-search-icon" />
                <input
                  type="text"
                  className="fd-picker-search"
                  placeholder="Search: Rice, Tamatar, Biyyam, Tomato…"
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
              <div className="fd-picker-grid">
                {CROP_DICTIONARY
                  .filter(c =>
                    !cropSearch ||
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
              <div style={{ marginTop: 18, textAlign: 'center' }}>
                <button onClick={() => { resetForm(); setCropPickerStep('pick'); setCropSearch('') }} className="fd-cancel-btn">
                  <FaTimes style={{ marginRight: 4 }} />Cancel
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
                  {editingCropId ? 'Edit Crop Details' : 'Add Crop Details'}
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
                    ✎ Change
                  </button>
                </div>
                <div className="fd-form-grid">
                  <div className="fd-field">
                    <label className="fd-label">Quantity (kg) *</label>
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
                    <label className="fd-label">Price per kg (₹) *</label>
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
                    <label className="fd-label">Status</label>
                    <select value={row.status} onChange={e => updateField(index, 'status', e.target.value)} className="fd-input">
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                  <div className="fd-field fd-field--full">
                    <label className="fd-label">Notes (optional)</label>
                    <textarea
                      placeholder="Any extra info about this crop…"
                      value={row.notes}
                      onChange={e => updateField(index, 'notes', e.target.value)}
                      className="fd-textarea"
                    />
                  </div>
                  <div className="fd-form-actions">
                    <button onClick={() => handleSave(index)} className="fd-save-btn" disabled={loading}>
                      {loading ? 'Saving…' : <><FaSave style={{ marginRight: 5 }} />{editingCropId ? 'Update Crop' : 'Save Crop'}</>}
                    </button>
                    <button onClick={() => { setEditingCropId(null); resetForm(); setCropPickerStep('pick'); setCropSearch('') }} className="fd-cancel-btn">
                      <FaTimes style={{ marginRight: 4 }} />Cancel
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Empty state */}
          {savedCrops.length === 0 && !showAddForm && (
            <div className="fd-empty">
              <div className="fd-empty-icon">🌾</div>
              <h3 className="fd-empty-title">No crops listed yet</h3>
              <p className="fd-empty-sub">Click "Add New Crop" to start listing your produce and reach buyers directly.</p>
            </div>
          )}

          {/* Crop Cards Grid */}
          {savedCrops.length > 0 && (
            <div className="fd-crops-grid">
              {savedCrops.map((crop) => {
                const img = getCropImage(crop.crop || crop.cropName)
                const sm = statusMeta[crop.status] || statusMeta.available
                const totalVal = (parseFloat(crop.price) || 0) * (parseFloat(crop.quantity) || 0)
                return (
                  <div key={crop.id} className="fd-crop-card">
                    <div className="fd-card-accent" />
                    <div className="fd-card-header">
                      <div className="fd-card-img-wrap">
                        {img
                          ? <img src={img} alt={crop.crop} className="fd-card-img" />
                          : <FaLeaf style={{ fontSize: 30, color: '#2e7d32' }} />
                        }
                      </div>
                      <div className="fd-card-titleblock">
                        <h4 className="fd-card-name">{crop.crop || crop.cropName}</h4>
                        <span className="fd-status-badge" style={{ background: sm.bg, color: sm.color }}>
                          <span style={{ marginRight: 4, fontSize: 11 }}>{sm.icon}</span>{sm.label}
                        </span>
                      </div>
                    </div>

                    <div className="fd-card-body">
                      <div className="fd-info-row">
                        <span className="fd-info-label">Quantity</span>
                        <span className="fd-info-val">{crop.quantity} kg</span>
                      </div>
                      <div className="fd-info-row">
                        <span className="fd-info-label">Price / kg</span>
                        <span className="fd-info-val fd-price-val">₹{parseFloat(crop.price).toLocaleString()}</span>
                      </div>
                      <div className="fd-info-row fd-info-row--highlight">
                        <span className="fd-info-label">Total Value</span>
                        <span className="fd-info-val fd-total-val">₹{totalVal.toLocaleString()}</span>
                      </div>
                      <div className="fd-info-row">
                        <span className="fd-info-label">
                          <FaMapMarkerAlt style={{ color: '#e53935', marginRight: 4 }} />Location
                        </span>
                        <span className="fd-info-val">{fmt(crop.district)}, {fmt(crop.state)}</span>
                      </div>
                      {crop.notes && (
                        <div className="fd-notes-row">
                          <FaTag style={{ color: '#888', marginRight: 6, fontSize: 11 }} />
                          <span className="fd-notes-text">{crop.notes}</span>
                        </div>
                      )}
                      {crop.createdAt && (
                        <div className="fd-date-row">
                          <FaCalendarAlt style={{ color: '#aaa', marginRight: 5, fontSize: 11 }} />
                          <span className="fd-date-text">
                            {crop.createdAt?.toDate
                              ? crop.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                              : new Date(crop.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="fd-card-footer">
                      <select
                        value={crop.status}
                        onChange={e => updateCropStatus(crop.id, e.target.value)}
                        className="fd-status-select"
                      >
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                        <option value="reserved">Reserved</option>
                      </select>
                      <button onClick={() => handleEdit(crop)} className="fd-edit-btn" title="Edit">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(crop.id)} className="fd-del-btn" title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── ANALYTICS TAB ─── */}
      {activeTab === 'analytics' && (
        <div className="fd-content">
          <h2 className="fd-content-title">
            <FaChartLine style={{ color: '#1565c0', marginRight: 8 }} />
            Farm Analytics
          </h2>
          <div className="fd-analytics-grid">
            {[
              { icon: <FaSeedling />, label: 'Total Crops',     val: analytics.totalCrops,               cls: 'green' },
              { icon: <FaMoneyBillWave />, label: 'Portfolio Value', val: `₹${analytics.totalValue.toLocaleString()}`, cls: 'blue' },
              { icon: <FaTruck />,    label: 'Available',       val: analytics.availableCrops,           cls: 'teal' },
              { icon: <FaCalendarAlt />, label: 'Sold',         val: analytics.soldCrops,                cls: 'orange' },
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
              <h3 className="fd-breakdown-title">Crop Breakdown</h3>
              <div className="fd-breakdown-list">
                {savedCrops.map(crop => {
                  const img = getCropImage(crop.crop || crop.cropName)
                  const sm = statusMeta[crop.status] || statusMeta.available
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
                        <span className="fd-breakdown-qty">{crop.quantity} kg</span>
                        <span className="fd-breakdown-price">₹{crop.price}/kg</span>
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
              <h3 className="fd-empty-title">No data yet</h3>
              <p className="fd-empty-sub">Add crops to see analytics here.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── ORDERS TAB ─── */}
      {activeTab === 'orders' && (
        <div className="fd-content">
          <h2 className="fd-content-title">
            <FaShoppingBag style={{ color: '#6a1b9a', marginRight: 8 }} />
            Incoming Orders
            {orders.length > 0 && (
              <span className="fd-orders-badge">{orders.length}</span>
            )}
          </h2>

          {ordersLoading ? (
            <div className="fd-empty">
              <div className="fd-empty-icon">⏳</div>
              <h3 className="fd-empty-title">Loading orders…</h3>
            </div>
          ) : orders.length === 0 ? (
            <div className="fd-empty">
              <div className="fd-empty-icon">📦</div>
              <h3 className="fd-empty-title">No orders yet</h3>
              <p className="fd-empty-sub">Orders from customers will appear here once they purchase your crops.</p>
            </div>
          ) : (
            <div className="fd-orders-list">
              {orders.map(order => {
                const statusCfg = {
                  pending:   { label: 'Pending',        color: '#f59e0b', bg: '#fef3c7', next: 'confirmed',  nextLabel: '✓ Confirm Order' },
                  confirmed: { label: 'Admin Confirmed',color: '#16a34a', bg: '#dcfce7', next: 'shipped',    nextLabel: '🚚 Mark Shipped' },
                  shipped:   { label: 'Shipped',         color: '#0891b2', bg: '#cffafe', next: 'delivered',  nextLabel: '✅ Mark Delivered' },
                  delivered: { label: 'Delivered',       color: '#16a34a', bg: '#dcfce7', next: null,         nextLabel: null },
                }[order.status] || { label: order.status, color: '#999', bg: '#f3f4f6', next: null, nextLabel: null }

                const addr = order.shippingAddress || {}
                const date = order.createdAtMs ? new Date(order.createdAtMs).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

                return (
                  <div key={order.id} className={`fd-order-card ${selectedOrder?.id === order.id ? 'fd-order-card--open' : ''}`} style={{ borderLeftColor: statusCfg.color }}>
                    {/* ── Card Header (always visible) ── */}
                    <div className="fd-order-header" onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
                      <div className="fd-order-meta">
                        <span className="fd-order-id">#{order.id.slice(0, 8).toUpperCase()}</span>
                        <span className="fd-order-date">{date}</span>
                      </div>
                      <div className="fd-order-summary">
                        <span className="fd-order-crop">{order.cropName || 'Crop'}</span>
                        <span className="fd-order-qty">{order.quantity} {order.unit || 'kg'}</span>
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
                            <h4 className="fd-order-section-title">👤 Customer</h4>
                            <p className="fd-order-info-line"><strong>{addr.fullName || '—'}</strong></p>
                            <p className="fd-order-info-line"><FaPhone style={{ marginRight: 6, color: '#6b7280' }} />{addr.phone || '—'}</p>
                          </div>

                          {/* Delivery address */}
                          <div className="fd-order-section">
                            <h4 className="fd-order-section-title"><FaMapMarkerAlt style={{ marginRight: 4 }} /> Delivery Address</h4>
                            <p className="fd-order-info-line">{addr.area || addr.street || '—'}</p>
                            <p className="fd-order-info-line">{addr.city}{addr.pincode ? ` – ${addr.pincode}` : ''}</p>
                          </div>

                          {/* Order details */}
                          <div className="fd-order-section">
                            <h4 className="fd-order-section-title">🌾 Crop Details</h4>
                            <p className="fd-order-info-line">{order.cropName} × {order.quantity} {order.unit || 'kg'}</p>
                            <p className="fd-order-info-line">₹{order.pricePerKg || order.price || '—'}/kg</p>
                            <p className="fd-order-info-line"><strong>Total: ₹{parseFloat(order.totalPrice || order.totalAmount || 0).toFixed(2)}</strong></p>
                            <p className="fd-order-info-line">Payment: <strong>COD</strong></p>
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
                            const labels = ['Pending', 'Confirmed', 'Shipped', 'Delivered']
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
                                toastSuccess(`Order marked as ${statusCfg.next}!`)
                                setSelectedOrder(prev => prev ? { ...prev, status: statusCfg.next } : null)
                              } else {
                                toastError(result.error || 'Failed to update order status')
                              }
                            }}
                          >
                            {statusUpdating ? 'Updating…' : statusCfg.nextLabel}
                          </button>
                        )}
                        {!statusCfg.next && (
                          <div className="fd-order-delivered-msg">🎉 This order has been delivered!</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── MARKET OPPORTUNITIES TAB ─── */}
      {activeTab === 'market' && (
        <div className="fd-content">
          <h2 className="fd-content-title">
            <FaBullseye style={{ color: '#7c3aed', marginRight: 8 }} />
            Crop Requests
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
              <h3 className="fd-empty-title">No open requests yet</h3>
              <p className="fd-empty-sub">When consumers request crops, they'll appear here.</p>
            </div>
          ) : (
            <>
              {/* Priority Leads */}
              {priorityDemands.length > 0 && (
                <>
                  <div className="fd-market-section-label fd-market-section-label--priority">
                    📍 Priority Leads — Near You ({priorityDemands.length})
                  </div>
                  <div className="fd-market-grid">
                    {priorityDemands.map(demand => (
                      <DemandCard
                        key={demand.id}
                        demand={demand}
                        isPriority
                        currentUid={currentUser?.uid}
                        onToggleFulfilling={toggleFulfilling}
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
                      📦 Other Requests ({otherDemands.length})
                    </div>
                  )}
                  <div className="fd-market-grid">
                    {otherDemands.map(demand => (
                      <DemandCard
                        key={demand.id}
                        demand={demand}
                        isPriority={false}
                        currentUid={currentUser?.uid}
                        onToggleFulfilling={toggleFulfilling}
                        onToastError={toastError}
                        onToastSuccess={toastSuccess}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* My Quotes & Active Deals */}
          {myQuotes.length > 0 && (
            <>
              <h3 className="fd-market-section-title" style={{ marginTop: 32 }}>
                <FaCoins style={{ color: '#f59e0b', marginRight: 8 }} />
                My Quotes & Active Deals ({myQuotes.length})
              </h3>
              <div className="fd-market-grid">
                {myQuotes.map(deal => {
                  const statusColors = {
                    quoted:      { bg: '#fef3c7', color: '#b45309' },
                    deal_closed: { bg: '#d1fae5', color: '#065f46' },
                    in_progress: { bg: '#ede9fe', color: '#6d28d9' },
                    completed:   { bg: '#dcfce7', color: '#15803d' },
                  }[deal.status] || { bg: '#f3f4f6', color: '#374151' }
                  const statusLabel = {
                    quoted:      'Offer Sent — Awaiting Consumer',
                    deal_closed: 'Deal Accepted — Ready to Dispatch',
                    in_progress: 'Dispatched — Awaiting Receipt',
                    completed:   'Completed',
                  }[deal.status] || deal.status

                  return (
                    <div key={deal.id} className="fd-demand-card fd-committed-card">
                      <div className="fd-demand-header">
                        <div className="fd-demand-crop-icon" style={{ background: '#fef3c7', color: '#b45309' }}><FaCoins /></div>
                        <div className="fd-demand-info">
                          <span className="fd-demand-cropname">{deal.cropName}</span>
                          <span className="fd-demand-consumer">{deal.consumerName}</span>
                        </div>
                        <div
                          className="fd-demand-new-badge"
                          style={{ background: statusColors.bg, color: statusColors.color, border: `1px solid ${statusColors.color}40` }}
                        >
                          {statusLabel}
                        </div>
                      </div>
                      <div className="fd-demand-details">
                        <div className="fd-demand-detail">
                          <span className="fd-dd-label">Quantity</span>
                          <span className="fd-dd-value">{deal.quantityKg} kg</span>
                        </div>
                        <div className="fd-demand-detail">
                          <span className="fd-dd-label">Your Offer</span>
                          <span className="fd-dd-value fd-dd-price">Rs.{deal.farmerOfferPrice}/kg</span>
                        </div>
                        <div className="fd-demand-detail">
                          <span className="fd-dd-label">Location</span>
                          <span className="fd-dd-value">{deal.location}</span>
                        </div>
                        <div className="fd-demand-detail">
                          <span className="fd-dd-label">Total Value</span>
                          <span className="fd-dd-value fd-dd-total">Rs.{((deal.quantityKg || 0) * (deal.farmerOfferPrice || 0)).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Consumer contact revealed after deal is accepted */}
                      {['deal_closed','in_progress','completed'].includes(deal.status) && (
                        <div className="fd-contact-reveal">
                          <div className="fd-contact-reveal-title">
                            <FaPhone style={{ marginRight: 6 }} /> Consumer Contact
                          </div>
                          <div className="fd-contact-reveal-number">{deal.consumerPhone || 'Not provided'}</div>
                          <div className="fd-contact-reveal-name">{deal.consumerName}</div>
                        </div>
                      )}

                      {/* Mark as Dispatched — farmer action */}
                      {deal.status === 'deal_closed' && (
                        <button
                          className="fd-commit-btn"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                          onClick={async () => {
                            const res = await markInProgress(deal.id)
                            if (res.success) toastSuccess('Marked as dispatched! Waiting for consumer to confirm receipt.')
                            else toastError(res.error)
                          }}
                        >
                          <FaTruck style={{ marginRight: 8 }} /> Mark as Dispatched
                        </button>
                      )}

                      {/* Waiting for consumer confirmation */}
                      {deal.status === 'in_progress' && (
                        <div className="fd-deal-waiting">
                          Dispatched — waiting for consumer to mark as received.
                        </div>
                      )}

                      {/* Deal success banner */}
                      {deal.status === 'completed' && (
                        <div className="fd-deal-success">
                          <FaCheckCircle style={{ marginRight: 8 }} /> Deal Complete! Consumer confirmed receipt.
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── NOTIFICATIONS TAB ─── */}
      {activeTab === 'notifications' && (
        <div className="fd-content">
          <h2 className="fd-content-title">
            <FaBell style={{ color: '#e65100', marginRight: 8 }} />
            Notifications
            {orders.length > 0 && (
              <span className="fd-notif-count">{orders.length}</span>
            )}
          </h2>
          {orders.length === 0 ? (
            <div className="fd-empty">
              <div className="fd-empty-icon">🔔</div>
              <h3 className="fd-empty-title">All caught up!</h3>
              <p className="fd-empty-sub">You have no new notifications. We'll alert you when customers are interested in your crops.</p>
            </div>
          ) : (
            <div className="fd-notif-list">
              {[...orders].sort((a, b) => {
                const ta = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
                const tb = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
                return tb - ta
              }).map(order => {
                const ts = order.createdAt?.toDate?.() || new Date(order.createdAt || 0)
                const timeAgo = (() => {
                  const diff = Math.floor((Date.now() - ts.getTime()) / 1000)
                  if (diff < 60) return `${diff}s ago`
                  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
                  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
                  return `${Math.floor(diff/86400)}d ago`
                })()
                const statusEmoji = { pending:'🛒', confirmed:'✅', shipped:'🚚', delivered:'🎉' }[order.status] || '📦'
                const statusColor = { pending:'#e65100', confirmed:'#1565c0', shipped:'#6a1b9a', delivered:'#2e7d32' }[order.status] || '#555'
                const itemNames = (order.items || [order]).map(i => i.cropName || i.crop || i.name || 'Item').join(', ')
                return (
                  <div key={order.id} className="fd-notif-item">
                    <div className="fd-notif-icon-wrap">
                      <span className="fd-notif-emoji">{statusEmoji}</span>
                    </div>
                    <div className="fd-notif-body">
                      <p className="fd-notif-title">
                        Order <strong>#{order.id.slice(-6).toUpperCase()}</strong> — {itemNames}
                      </p>
                      <p className="fd-notif-meta">
                        <span style={{ color: statusColor, fontWeight: 600, textTransform: 'capitalize' }}>{order.status}</span>
                        &nbsp;·&nbsp;₹{parseFloat(order.totalPrice || order.totalAmount || 0).toLocaleString()}
                        &nbsp;·&nbsp;{order.buyerName || order.userName || 'Customer'}
                      </p>
                      {order.shippingAddress && (
                        <p className="fd-notif-address">
                          <FaMapMarkerAlt style={{ marginRight: 4, fontSize: 11 }} />
                          {[order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.state].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="fd-notif-time">{timeAgo}</span>
                  </div>
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
