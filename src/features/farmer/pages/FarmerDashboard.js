import { useState } from 'react'
import Navbar from '../../../components/Navbar'
import { useTranslation } from 'react-i18next'
import CropRecommendation from '../../../components/CropRecommendation'
import { useCrops } from '../hooks/useCrops'
import { useCropForm } from '../hooks/useCropForm'
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
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('crops')
  
  // Custom hooks for crop management
  const { savedCrops, loading, analytics, addCrop, deleteCrop, updateCropStatus } = useCrops()
  const {
    rows,
    showAddForm,
    selectedState,
    selectedDistrict,
    setShowAddForm,
    setSelectedState,
    setSelectedDistrict,
    addRow,
    updateField,
    resetForm,
    validateRow,
    getRowData
  } = useCropForm()

  // Handle state change
  const handleStateChange = (e) => {
    setSelectedState(e.target.value)
    setSelectedDistrict('')
  }

  // Handle save crop
  const handleSave = async (index) => {
    const row = rows[index]
    const validation = validateRow(row)
    
    if (!validation.valid) {
      alert(validation.message)
      return
    }

    const cropData = getRowData(index)
    const result = await addCrop(cropData)
    
    if (result.success) {
      alert('✅ Crop saved successfully!')
      resetForm()
    } else {
      alert('❌ Failed to save crop: ' + result.error)
    }
  }

  // Handle delete crop
  const handleDelete = async (cropId) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      const result = await deleteCrop(cropId)
      if (result.success) {
        console.log('Crop deleted successfully!')
      } else {
        console.error('Failed to delete crop:', result.error)
      }
    }
  }

  // Handle edit (just show form)
  const handleEdit = () => {
    setShowAddForm(true)
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
          <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="farmer-location-select">
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
                    onChange={(e) => updateField(index, 'crop', e.target.value)}
                    className="farmer-form-input"
                  />
                  <input
                    type="text"
                    placeholder={t('quantity_kg') || 'Quantity (kg)'}
                    value={row.quantity}
                    onChange={(e) => updateField(index, 'quantity', e.target.value)}
                    className="farmer-form-input"
                  />
                  <input
                    type="number"
                    placeholder={t('price_inr') || 'Price (₹)'}
                    value={row.price}
                    onChange={(e) => updateField(index, 'price', e.target.value)}
                    className="farmer-form-input"
                  />
                  <input
                    type="date"
                    placeholder={t('harvest_date') || 'Harvest Date'}
                    value={row.harvestDate}
                    onChange={(e) => updateField(index, 'harvestDate', e.target.value)}
                    className="farmer-form-input"
                  />
                  <select
                    value={row.status}
                    onChange={(e) => updateField(index, 'status', e.target.value)}
                    className="farmer-form-input"
                  >
                    <option value="available">{t('available') || 'Available'}</option>
                    <option value="sold">{t('sold') || 'Sold'}</option>
                    <option value="reserved">{t('reserved') || 'Reserved'}</option>
                  </select>
                  <textarea
                    placeholder={t('notes') || 'Notes'}
                    value={row.notes}
                    onChange={(e) => updateField(index, 'notes', e.target.value)}
                    className="farmer-form-textarea"
                  />
                  <div className="farmer-form-actions">
                    <button onClick={() => handleSave(index)} className="farmer-submit-button" disabled={loading}>
                      {loading ? t('saving') || 'Saving...' : <><FaSave style={{ marginRight: '4px' }} />{t('save') || 'Save'}</>}
                    </button>
                    <button onClick={addRow} className="farmer-submit-button">
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
                    <button onClick={() => handleEdit()} className="farmer-edit-button">
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
