import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import { useCrops } from '../hooks/useCrops'
import { useCropForm } from '../hooks/useCropForm'
import { useOrders } from '../hooks/useOrders'
import { useAuth } from '../../../context/AuthContext'
import './FarmerDashboard.css'

import {
  FaLeaf, FaChartLine, FaPlus, FaEdit, FaTrash, FaSave,
  FaTruck, FaMoneyBillWave, FaCalendarAlt, FaBell, FaShoppingBag,
  FaMapMarkerAlt, FaSeedling, FaTimes, FaCheckCircle, FaClock, FaTag, FaSearch, FaPhone
} from 'react-icons/fa'
import { findCropByKeyword, CROP_DICTIONARY } from '../../../data/cropData'

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

const FarmerDashboard = () => {
  const navigate = useNavigate()
  const { currentUser, userData } = useAuth()
  const [activeTab, setActiveTab] = useState('crops')
  const [farmerName, setFarmerName] = useState('')
  const [userLocation, setUserLocation] = useState({ state: '', district: '' })
  const [cropSearch, setCropSearch] = useState('')
  const [cropPickerStep, setCropPickerStep] = useState('pick') // 'pick' | 'details'

  useEffect(() => {
    if (!currentUser && !userData) { navigate('/'); return }
    let storedUserData = userData
    if (!storedUserData) {
      const localData = localStorage.getItem('currentUser')
      if (localData) { try { storedUserData = JSON.parse(localData) } catch (e) {} }
    }
    if (storedUserData) {
      setFarmerName(storedUserData.name || storedUserData.displayName || storedUserData.email || 'Farmer')
      if (storedUserData.state && storedUserData.district) {
        setUserLocation({ state: storedUserData.state, district: storedUserData.district })
      }
    }
  }, [currentUser, userData, navigate])

  const { savedCrops, loading, analytics, addCrop, deleteCrop, updateCropStatus } = useCrops()
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const {
    rows, showAddForm, selectedState, selectedDistrict,
    setShowAddForm, setSelectedState, setSelectedDistrict,
    addRow, updateField, resetForm, getRowData
  } = useCropForm(userLocation)

  const handleStateChange = (e) => { setSelectedState(e.target.value); setSelectedDistrict('') }

  const handleSave = async (index) => {
    const row = rows[index]
    if (!selectedDistrict) { alert('⚠️ Please select a district before adding a crop.'); return }
    if (!row.crop || !row.crop.trim()) { alert('⚠️ Please enter a crop name.'); return }
    const matchedCrop = findCropByKeyword(row.crop.trim())
    if (!matchedCrop) {
      alert(`⚠️ "${row.crop}" is not a recognized crop.\nExamples: Rice, Wheat, Tomato, Onion, Potato, Maize, Brinjal, Okra…`)
      return
    }
    if (!row.quantity || isNaN(row.quantity) || parseFloat(row.quantity) <= 0) {
      alert('⚠️ Quantity must be a valid number greater than 0.'); return
    }
    if (!row.price || isNaN(row.price) || parseFloat(row.price) <= 0) {
      alert('⚠️ Price must be a valid number greater than 0.'); return
    }
    const cropData = getRowData(index)
    cropData.cropName = matchedCrop.name
    cropData.crop = matchedCrop.name
    const result = await addCrop(cropData)
    if (result.success) { resetForm(); setActiveTab('crops') }
  }

  const handleDelete = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) await deleteCrop(cropId)
  }

  const availableCount = savedCrops.filter(c => c.status === 'available' || c.status === 'pending').length
  const soldRevenue = savedCrops.filter(c => c.status === 'sold').reduce((s, c) => s + (parseFloat(c.price) || 0), 0)

  return (
    <div className="fd-root">
      <Navbar isFarmerDashboard={true} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ─── Welcome Banner ─── */}
      <div className="fd-banner">
        <div className="fd-banner-inner">
          <div className="fd-banner-left">
            <div className="fd-avatar"><FaSeedling /></div>
            <div>
              <p className="fd-greeting">Welcome back,</p>
              <h1 className="fd-farmer-name">{farmerName}</h1>
              {(selectedDistrict || selectedState) && (
                <p className="fd-location">
                  <FaMapMarkerAlt style={{ marginRight: 5 }} />
                  {fmt(selectedDistrict)}{selectedDistrict && selectedState ? ', ' : ''}{fmt(selectedState)}
                </p>
              )}
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
            { key: 'notifications', icon: <FaBell />,        label: 'Notifications' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`fd-tab ${activeTab === tab.key ? 'fd-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="fd-tab-icon">{tab.icon}</span>
              <span className="fd-tab-label">{tab.label}</span>
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
              if (!showAddForm) { setCropPickerStep('pick'); setCropSearch('') }
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
                  Add Crop Details
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
                      {loading ? 'Saving…' : <><FaSave style={{ marginRight: 5 }} />Save Crop</>}
                    </button>
                    <button onClick={() => { resetForm(); setCropPickerStep('pick'); setCropSearch('') }} className="fd-cancel-btn">
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
                      <button onClick={() => setShowAddForm(true)} className="fd-edit-btn" title="Edit">
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
                              await updateOrderStatus(order.id, statusCfg.next)
                              setStatusUpdating(false)
                              setSelectedOrder(prev => prev ? { ...prev, status: statusCfg.next } : null)
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

      {/* ─── NOTIFICATIONS TAB ─── */}
      {activeTab === 'notifications' && (
        <div className="fd-content">
          <h2 className="fd-content-title">
            <FaBell style={{ color: '#e65100', marginRight: 8 }} />
            Notifications
          </h2>
          <div className="fd-empty">
            <div className="fd-empty-icon">🔔</div>
            <h3 className="fd-empty-title">All caught up!</h3>
            <p className="fd-empty-sub">You have no new notifications. We'll alert you when customers are interested in your crops.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FarmerDashboard
