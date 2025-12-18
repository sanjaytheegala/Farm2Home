import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from '../firebase'
import Navbar from '../components/Navbar'
import { useTranslation } from 'react-i18next';
import CropRecommendation from '../components/CropRecommendation';
import './FarmerDashboard.css'

import { FaLeaf, FaChartLine, FaPlus, FaEdit, FaTrash, FaSave, FaEye, FaTruck, FaMoneyBillWave, FaCalendarAlt, FaMapMarkerAlt, FaHome, FaSeedling, FaUserCircle, FaBox } from 'react-icons/fa'

// State/districts for dropdowns
const stateDistricts = {
  telangana: [
    'adilabad', 'bhadradri_kothagudem', 'hyderabad', 'jagtial', 'jangaon', 'jayashankar_bhupalpally', 'jogulamba_gadwal', 'kamareddy', 'karimnagar', 'khammam', 'komaram_bheem_asifabad', 'mahabubabad', 'mahabubnagar', 'mancherial', 'medak', 'medchal_malkajgiri', 'mulugu', 'nagarkurnool', 'nalgonda', 'narayanpet', 'nirmal', 'nizamabad', 'peddapalli', 'rajanna_sircilla', 'rangareddy', 'sangareddy', 'siddipet', 'suryapet', 'vikarabad', 'wanaparthy', 'warangal_rural', 'warangal_urban', 'yadadri_bhuvanagiri'
  ],
  andhra_pradesh: [
    'anantapur', 'chittoor', 'east_godavari', 'guntur', 'kadapa', 'krishna', 'kurnool', 'nellore', 'prakasam', 'srikakulam', 'visakhapatnam', 'vizianagaram', 'west_godavari'
  ],
  tamil_nadu: [
    'ariyalur', 'chengalpattu', 'chennai', 'coimbatore', 'cuddalore', 'dharmapuri', 'dindigul', 'erode', 'kallakurichi', 'kanchipuram', 'kanniyakumari', 'karur', 'krishnagiri', 'madurai', 'mayiladuthurai', 'nagapattinam', 'namakkal', 'nilgiris', 'perambalur', 'pudukkottai', 'ramanathapuram', 'ranipet', 'salem', 'sivaganga', 'tenkasi', 'thanjavur', 'theni', 'thoothukudi', 'tiruchirappalli', 'tirunelveli', 'tirupathur', 'tiruppur', 'tiruvallur', 'tiruvannamalai', 'tiruvarur', 'vellore', 'viluppuram', 'virudhunagar'
  ],
  kerala: [
    'thiruvananthapuram', 'kollam', 'pathanamthitta', 'alappuzha', 'kottayam', 'idukki', 'ernakulam', 'thrissur', 'palakkad', 'malappuram', 'kozhikode', 'wayanad', 'kannur', 'kasaragod'
  ],
  goa: [
    'north_goa', 'south_goa'
  ],
  karnataka: [
    'bagalkot', 'ballari', 'belagavi', 'bengaluru_rural', 'bengaluru_urban', 'bidar', 'chamarajanagar', 'chikkaballapur', 'chikkamagaluru', 'chitradurga', 'dakshina_kannada', 'davanagere', 'dharwad', 'gadag', 'hassan', 'haveri', 'kalaburagi', 'kodagu', 'kolar', 'koppal', 'mandya', 'mysuru', 'raichur', 'ramanagara', 'shivamogga', 'tumakuru', 'udupi', 'uttara_kannada', 'vijayapura', 'yadgir', 'vijayanagara'
  ],
  maharashtra: [
    'mumbai', 'pune', 'nagpur', 'nashik', 'thane', 'aurangabad', 'solapur', 'kolhapur', 'sangli', 'jalgaon', 'satara', 'amravati', 'nanded', 'akola', 'latur', 'dhule', 'ahmednagar', 'chandrapur', 'parbhani', 'yavatmal', 'beed', 'osmanabad', 'bhandara', 'buldhana', 'gondia', 'hingoli', 'palghar', 'raigad', 'ratnagiri', 'sindhudurg', 'wardha', 'washim'
  ]
};

const FarmerDashboard = () => {
  const navigate = useNavigate()
  const [rows, setRows] = useState([{ crop: '', quantity: '', price: '', status: 'available', harvestDate: '', notes: '' }])
  const [savedCrops, setSavedCrops] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingIndex, setEditingIndex] = useState(null)
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState('telangana');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [activeTab, setActiveTab] = useState('crops'); // 'crops', 'recommendations', 'analytics'
  const [showAddForm, setShowAddForm] = useState(false)
  const [analytics, setAnalytics] = useState({
    totalCrops: 0,
    totalValue: 0,
    availableCrops: 0,
    soldCrops: 0
  })

  const calculateAnalytics = useCallback(() => {
    const totalCrops = savedCrops.length
    const totalValue = savedCrops.reduce((sum, crop) => sum + (parseFloat(crop.price) || 0), 0)
    const availableCrops = savedCrops.filter(crop => crop.status === 'available').length
    const soldCrops = savedCrops.filter(crop => crop.status === 'sold').length

    setAnalytics({
      totalCrops,
      totalValue,
      availableCrops,
      soldCrops
    })
  }, [savedCrops])

  useEffect(() => {
    loadSavedCrops()
    calculateAnalytics()
  }, [calculateAnalytics])

  const loadSavedCrops = async () => {
    try {
      const cropsSnapshot = await getDocs(collection(db, 'crops'))
      const cropsData = []
      cropsSnapshot.forEach((docSnapshot) => {
        cropsData.push({
          id: docSnapshot.id,
          ...docSnapshot.data()
        })
      })
      setSavedCrops(cropsData)
    } catch (error) {
      console.error('Error loading crops:', error)
    }
  }

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedDistrict('');
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleAddRow = () => {
    setRows([...rows, { crop: '', quantity: '', price: '', status: 'available', harvestDate: '', notes: '' }])
  }

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows]
    updatedRows[index][field] = value
    setRows(updatedRows)
  }

  const handleDelete = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await deleteDoc(doc(db, 'crops', cropId))
        setSavedCrops(savedCrops.filter(crop => crop.id !== cropId))
        console.log('Crop deleted successfully!')
      } catch (error) {
        console.error('Failed to delete crop:', error)
      }
    }
  }

  const handleEdit = (index) => {
    setEditingIndex(index)
    setShowAddForm(true)
  }

  const handleSave = async (index) => {
    const row = rows[index]
    if (!row.crop || !row.quantity || !row.price) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const cropData = {
        cropName: row.crop,  // Changed from 'crop' to 'cropName' for Firestore consistency
        quantity: row.quantity,
        price: parseFloat(row.price),
        status: row.status,
        harvestDate: row.harvestDate,
        notes: row.notes,
        state: selectedState,
        district: selectedDistrict,
        createdAt: new Date(),
        farmerId: 'farmer_' + Date.now()  // Generate unique farmer ID
      }
      
      const docRef = await addDoc(collection(db, 'crops'), cropData)
      
      // Add to saved crops
      const savedCrop = {
        id: docRef.id,
        ...cropData
      }
      setSavedCrops([...savedCrops, savedCrop])
      
      alert('✅ Crop saved successfully!')  // User-friendly alert
      console.log('Crop saved successfully!')
      setError('')
      setRows([{ crop: '', quantity: '', price: '', status: 'available', harvestDate: '', notes: '' }])
      setShowAddForm(false)
      
      // Reload crops to show new data
      loadSavedCrops()
    } catch (error) {
      setError('Failed to save crop')
      alert('❌ Failed to save crop: ' + error.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updateCropStatus = async (cropId, newStatus) => {
    try {
      await updateDoc(doc(db, 'crops', cropId), {
        status: newStatus
      })
      setSavedCrops(savedCrops.map(crop => 
        crop.id === cropId ? { ...crop, status: newStatus } : crop
      ))
      console.log('Status updated successfully!')
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className="farmer-dashboard-container">
      <Navbar />
      
      {/* Enhanced Tab Navigation with Location Selector */}
      <div className="farmer-tab-container">
        <div className="farmer-tab-buttons">
          <button 
            className={`farmer-tab ${activeTab === 'crops' ? 'active' : ''}`}
            onClick={() => setActiveTab('crops')}
          >
            <FaLeaf />
            {t('manage_crops') || 'Manage Crops'}
          </button>
          <button 
            className={`farmer-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FaChartLine />
            Analytics
          </button>
        </div>
        
        {/* Location Selector */}
        <div className="farmer-location-selectors">
          <select value={selectedState} onChange={handleStateChange} className="farmer-location-select">
            {Object.keys(stateDistricts).map((stateKey) => (
              <option key={stateKey} value={stateKey}>{t(`states.${stateKey}`)}</option>
            ))}
          </select>
          <select value={selectedDistrict} onChange={handleDistrictChange} className="farmer-location-select">
            <option value="">{t('select_district') || "Select District"}</option>
            {stateDistricts[selectedState]?.map((districtKey) => (
              <option key={districtKey} value={districtKey}>{t(`districts.${selectedState}.${districtKey}`)}</option>
            ))}
          </select>
        </div>
      </div>

      {activeTab === 'crops' ? (
        <div className="farmer-content-container">

          {/* Add New Crop Button */}
          <div className="farmer-add-crop-section">
            <button 
              onClick={() => setShowAddForm(!showAddForm)} 
              className="farmer-add-crop-button"
            >
              <FaPlus style={{ marginRight: '8px' }} />
              Add New Crop
            </button>
          </div>

          {/* Add Crop Form */}
          {showAddForm && (
            <div className="farmer-add-form-container">
              <h3 className="farmer-section-title">Add New Crop</h3>
              {rows.map((row, index) => (
                <div key={index} className="farmer-form-row">
                  <input
                    type="text"
                    placeholder="Crop Name"
                    value={row.crop}
                    onChange={(e) => handleChange(index, 'crop', e.target.value)}
                    className="farmer-form-input"
                  />
                  <input
                    type="text"
                    placeholder="Quantity (kg)"
                    value={row.quantity}
                    onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                    className="farmer-form-input"
                  />
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={row.price}
                    onChange={(e) => handleChange(index, 'price', e.target.value)}
                    className="farmer-form-input"
                  />
                  <input
                    type="date"
                    placeholder="Harvest Date"
                    value={row.harvestDate}
                    onChange={(e) => handleChange(index, 'harvestDate', e.target.value)}
                    className="farmer-form-input"
                  />
                  <select
                    value={row.status}
                    onChange={(e) => handleChange(index, 'status', e.target.value)}
                    className="farmer-form-input"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="reserved">Reserved</option>
                  </select>
                  <textarea
                    placeholder="Notes"
                    value={row.notes}
                    onChange={(e) => handleChange(index, 'notes', e.target.value)}
                    className="farmer-form-textarea"
                  />
                  <div className="farmer-form-actions">
                    <button onClick={() => handleSave(index)} className="farmer-submit-button" disabled={loading}>
                      {loading ? 'Saving...' : <><FaSave style={{ marginRight: '4px' }} />Save</>}
                    </button>
                    <button onClick={() => handleAddRow()} className="farmer-submit-button">
                      <FaPlus style={{ marginRight: '4px' }} />Add Row
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Saved Crops Display */}
          <div>
            <h3 className="farmer-section-title">Your Crops</h3>
            <div className="farmer-crops-grid">
              {savedCrops.map((crop, index) => (
                <div key={crop.id} className="farmer-crop-card">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                    <h4 style={{margin: 0, fontSize: '20px', color: '#28a745'}}>{crop.crop}</h4>
                    <div style={{padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: crop.status === 'available' ? '#d4edda' : crop.status === 'sold' ? '#f8d7da' : '#fff3cd', color: crop.status === 'available' ? '#155724' : crop.status === 'sold' ? '#721c24' : '#856404'}}>{crop.status}</div>
                  </div>
                  <div style={{marginBottom: '15px'}}>
                    <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Quantity:</strong> {crop.quantity} kg</p>
                    <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Price:</strong> ₹{crop.price}</p>
                    {crop.harvestDate && <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Harvest Date:</strong> {crop.harvestDate}</p>}
                    {crop.notes && <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Notes:</strong> {crop.notes}</p>}
                    <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Location:</strong> {crop.district}, {crop.state}</p>
                  </div>
                  <div className="farmer-crop-actions">
                    <button onClick={() => handleEdit(index)} className="farmer-edit-button">
                      <FaEdit style={{ marginRight: '4px' }} />Edit
                    </button>
                    <button onClick={() => handleDelete(crop.id)} className="farmer-delete-button">
                      <FaTrash style={{ marginRight: '4px' }} />Delete
                    </button>
                    <select 
                      value={crop.status} 
                      onChange={(e) => updateCropStatus(crop.id, e.target.value)}
                      className="farmer-form-input"
                      style={{maxWidth: '150px'}}
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'analytics' ? (
        <div style={analyticsContainer}>
          <h2 style={sectionTitle}>Farm Analytics</h2>
          <div style={analyticsGrid}>
            <div style={analyticsCard}>
              <FaLeaf style={analyticsIcon} />
              <h3>Total Crops</h3>
              <p style={analyticsValue}>{analytics.totalCrops}</p>
            </div>
            <div style={analyticsCard}>
              <FaMoneyBillWave style={analyticsIcon} />
              <h3>Total Value</h3>
              <p style={analyticsValue}>₹{analytics.totalValue.toLocaleString()}</p>
            </div>
            <div style={analyticsCard}>
              <FaTruck style={analyticsIcon} />
              <h3>Available</h3>
              <p style={analyticsValue}>{analytics.availableCrops}</p>
            </div>
            <div style={analyticsCard}>
              <FaCalendarAlt style={analyticsIcon} />
              <h3>Sold</h3>
              <p style={analyticsValue}>{analytics.soldCrops}</p>
            </div>
          </div>
        </div>
             ) : (
        <CropRecommendation />
      )}
    </div>
  )
}

// Enhanced Styles
const container = {
  paddingTop: '100px',
  backgroundColor: '#f8f9fa',
  minHeight: '100vh'
}

const tabContainer = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '20px',
  padding: '20px',
  flexWrap: 'wrap'
}

const tabStyle = {
  padding: '12px 24px',
  border: '2px solid #28a745',
  backgroundColor: 'transparent',
  color: '#28a745',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  transition: 'all 0.3s',
  display: 'flex',
  alignItems: 'center'
}

const activeTabStyle = {
  ...tabStyle,
  backgroundColor: '#28a745',
  color: '#fff'
}

const contentContainer = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px'
}

const locationSelector = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  marginBottom: '20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
}

const sectionTitle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#333'
}

const locationForm = {
  display: 'flex',
  gap: '15px',
  flexWrap: 'wrap'
}

const locationSelect = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '16px',
  minWidth: '200px'
}

const addCropSection = {
  marginBottom: '20px'
}

const addCropButton = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s'
}

const addFormContainer = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  marginBottom: '20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
}

const formRow = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '15px',
  marginBottom: '20px'
}

const formInput = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '16px'
}

const formTextarea = {
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '16px',
  resize: 'vertical',
  minHeight: '80px'
}

const formActions = {
  display: 'flex',
  gap: '10px',
  gridColumn: '1 / -1'
}

const saveButton = {
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
}

const addRowButton = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center'
}

const savedCropsSection = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
}

const cropsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px'
}

const cropCard = {
  border: '1px solid #e0e0e0',
  borderRadius: '12px',
  padding: '20px',
  backgroundColor: 'white',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s'
}

const cropHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
}

const cropName = {
  margin: 0,
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333'
}

const statusBadge = (status) => ({
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '600',
  backgroundColor: status === 'available' ? '#d4edda' : status === 'sold' ? '#f8d7da' : '#fff3cd',
  color: status === 'available' ? '#155724' : status === 'sold' ? '#721c24' : '#856404'
})

const cropDetails = {
  marginBottom: '15px'
}

const cropDetailsParagraph = {
  margin: '5px 0',
  fontSize: '14px'
}

const cropActions = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap'
}

const editButton = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px'
}

const deleteButton = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px'
}

const statusSelect = {
  padding: '8px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '14px'
}

const analyticsContainer = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px'
}

const analyticsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px'
}

const analyticsCard = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  textAlign: 'center',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s'
}

const analyticsIcon = {
  fontSize: '3rem',
  color: '#28a745',
  marginBottom: '15px'
}

const analyticsValue = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#333',
  margin: '10px 0'
}



export default FarmerDashboard
