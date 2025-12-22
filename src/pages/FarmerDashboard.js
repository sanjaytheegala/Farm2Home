import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from '../firebase'
import Navbar from '../components/Navbar'
import { useTranslation } from 'react-i18next';
import CropRecommendation from '../components/CropRecommendation';
import './FarmerDashboard.css'

import { FaLeaf, FaChartLine, FaPlus, FaEdit, FaTrash, FaSave, FaTruck, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa'

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
    setShowAddForm(true)
  }

  const handleSave = async (index) => {
    const row = rows[index]
    if (!row.crop || !row.quantity || !row.price) {
      alert('Please fill in all required fields')
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
      setRows([{ crop: '', quantity: '', price: '', status: 'available', harvestDate: '', notes: '' }])
      setShowAddForm(false)
      
      // Reload crops to show new data
      loadSavedCrops()
    } catch (error) {
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
            {t('analytics') || 'Analytics'}
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
              {t('add_new_crop') || 'Add New Crop'}
            </button>
          </div>

          {/* Add Crop Form */}
          {showAddForm && (
            <div className="farmer-add-form-container">
              <h3 className="farmer-section-title">{t('add_new_crop') || 'Add New Crop'}</h3>
              {rows.map((row, index) => (
                <div key={index} className="farmer-form-row">
                  <input
                    type="text"
                    placeholder={t('crop_name') || 'Crop Name'}
                    value={row.crop}
                    onChange={(e) => handleChange(index, 'crop', e.target.value)}
                    className="farmer-form-input"
                  />
                  <input
                    type="text"
                    placeholder={t('quantity_kg') || 'Quantity (kg)'}
                    value={row.quantity}
                    onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                    className="farmer-form-input"
                  />
                  <input
                    type="number"
                    placeholder={t('price_inr') || 'Price (₹)'}
                    value={row.price}
                    onChange={(e) => handleChange(index, 'price', e.target.value)}
                    className="farmer-form-input"
                  />
                  <input
                    type="date"
                    placeholder={t('harvest_date') || 'Harvest Date'}
                    value={row.harvestDate}
                    onChange={(e) => handleChange(index, 'harvestDate', e.target.value)}
                    className="farmer-form-input"
                  />
                  <select
                    value={row.status}
                    onChange={(e) => handleChange(index, 'status', e.target.value)}
                    className="farmer-form-input"
                  >
                    <option value="available">{t('available') || 'Available'}</option>
                    <option value="sold">{t('sold') || 'Sold'}</option>
                    <option value="reserved">{t('reserved') || 'Reserved'}</option>
                  </select>
                  <textarea
                    placeholder={t('notes') || 'Notes'}
                    value={row.notes}
                    onChange={(e) => handleChange(index, 'notes', e.target.value)}
                    className="farmer-form-textarea"
                  />
                  <div className="farmer-form-actions">
                    <button onClick={() => handleSave(index)} className="farmer-submit-button" disabled={loading}>
                      {loading ? t('saving') || 'Saving...' : <><FaSave style={{ marginRight: '4px' }} />{t('save') || 'Save'}</>}
                    </button>
                    <button onClick={() => handleAddRow()} className="farmer-submit-button">
                      <FaPlus style={{ marginRight: '4px' }} />{t('add_row') || 'Add Row'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Saved Crops Display */}
          <div>
            <h3 className="farmer-section-title">{t('your_crops') || 'Your Crops'}</h3>
            <div className="farmer-crops-grid">
              {savedCrops.map((crop, index) => (
                <div key={crop.id} className="farmer-crop-card">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                    <h4 style={{margin: 0, fontSize: '20px', color: '#28a745'}}>{crop.crop}</h4>
                    <div style={{padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: crop.status === 'available' ? '#d4edda' : crop.status === 'sold' ? '#f8d7da' : '#fff3cd', color: crop.status === 'available' ? '#155724' : crop.status === 'sold' ? '#721c24' : '#856404'}}>{t(crop.status) || crop.status}</div>
                  </div>
                  <div style={{marginBottom: '15px'}}>
                    <p style={{margin: '5px 0', fontSize: '14px'}}><strong>{t('quantity') || 'Quantity'}:</strong> {crop.quantity} kg</p>
                    <p style={{margin: '5px 0', fontSize: '14px'}}><strong>{t('price') || 'Price'}:</strong> ₹{crop.price}</p>
                    {crop.harvestDate && <p style={{margin: '5px 0', fontSize: '14px'}}><strong>{t('harvest_date') || 'Harvest Date'}:</strong> {crop.harvestDate}</p>}
                    {crop.notes && <p style={{margin: '5px 0', fontSize: '14px'}}><strong>{t('notes') || 'Notes'}:</strong> {crop.notes}</p>}
                    <p style={{margin: '5px 0', fontSize: '14px'}}><strong>{t('location') || 'Location'}:</strong> {crop.district}, {crop.state}</p>
                  </div>
                  <div className="farmer-crop-actions">
                    <button onClick={() => handleEdit(index)} className="farmer-edit-button">
                      <FaEdit style={{ marginRight: '4px' }} />{t('edit') || 'Edit'}
                    </button>
                    <button onClick={() => handleDelete(crop.id)} className="farmer-delete-button">
                      <FaTrash style={{ marginRight: '4px' }} />{t('delete') || 'Delete'}
                    </button>
                    <select 
                      value={crop.status} 
                      onChange={(e) => updateCropStatus(crop.id, e.target.value)}
                      className="farmer-form-input"
                      style={{maxWidth: '150px'}}
                    >
                      <option value="available">{t('available') || 'Available'}</option>
                      <option value="sold">{t('sold') || 'Sold'}</option>
                      <option value="reserved">{t('reserved') || 'Reserved'}</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'analytics' ? (
        <div className="analytics-container">
          <h2 className="section-title">{t('farm_analytics') || 'Farm Analytics'}</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <FaLeaf className="analytics-icon" />
              <h3>{t('total_crops') || 'Total Crops'}</h3>
              <p className="analytics-value">{analytics.totalCrops}</p>
            </div>
            <div className="analytics-card">
              <FaMoneyBillWave className="analytics-icon" />
              <h3>{t('total_value') || 'Total Value'}</h3>
              <p className="analytics-value">₹{analytics.totalValue.toLocaleString()}</p>
            </div>
            <div className="analytics-card">
              <FaTruck className="analytics-icon" />
              <h3>{t('available') || 'Available'}</h3>
              <p className="analytics-value">{analytics.availableCrops}</p>
            </div>
            <div className="analytics-card">
              <FaCalendarAlt className="analytics-icon" />
              <h3>{t('sold') || 'Sold'}</h3>
              <p className="analytics-value">{analytics.soldCrops}</p>
            </div>
          </div>
        </div>
             ) : (
        <CropRecommendation />
      )}
    </div>
  )
}

export default FarmerDashboard
