import React, { useState, useRef, useEffect } from 'react'
import { FaTimes, FaLeaf, FaRulerCombined, FaMapMarkerAlt, FaPaperPlane, FaStickyNote, FaSearch, FaChevronDown, FaCheckCircle } from 'react-icons/fa'
import { geoData } from '../../../../locale/geoData'
import './RequestCropModal.css'

const STATES    = geoData.en.states
const DISTRICTS = geoData.en.districts

const INITIAL = { cropName: '', quantityKg: '', location: '', notes: '' }

/* -- Searchable two-level location picker */
function LocationPicker({ onChange }) {
  const [stateKey,       setStateKey]       = useState('')
  const [districtKey,    setDistrictKey]    = useState('')
  const [stateSearch,    setStateSearch]    = useState('')
  const [districtSearch, setDistrictSearch] = useState('')
  const [showStateDrop,  setShowStateDrop]  = useState(false)
  const [showDistDrop,   setShowDistDrop]   = useState(false)

  const stateRef = useRef(null)
  const distRef  = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (stateRef.current && !stateRef.current.contains(e.target)) setShowStateDrop(false)
      if (distRef.current  && !distRef.current.contains(e.target))  setShowDistDrop(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectState = (sk) => {
    setStateKey(sk)
    setDistrictKey('')
    setStateSearch('')
    setShowStateDrop(false)
    onChange('')
    setTimeout(() => setShowDistDrop(true), 60)
  }

  const selectDistrict = (dk) => {
    setDistrictKey(dk)
    setDistrictSearch('')
    setShowDistDrop(false)
    const stateName    = STATES[stateKey] || ''
    const districtName = (DISTRICTS[stateKey] || {})[dk] || ''
    onChange(`${districtName}, ${stateName}`)
  }

  const filteredStates = Object.entries(STATES).filter(([, n]) =>
    n.toLowerCase().includes(stateSearch.toLowerCase())
  )
  const districtMap   = stateKey ? (DISTRICTS[stateKey] || {}) : {}
  const filteredDists = Object.entries(districtMap).filter(([, n]) =>
    n.toLowerCase().includes(districtSearch.toLowerCase())
  )

  return (
    <div className="rcm-loc-picker">

      {/* State selector */}
      <div className="rcm-loc-col" ref={stateRef}>
        <button
          type="button"
          className={`rcm-loc-trigger ${showStateDrop ? 'rcm-loc-trigger--open' : ''}`}
          onClick={() => { setShowStateDrop(s => !s); setShowDistDrop(false) }}
        >
          <FaMapMarkerAlt className="rcm-loc-pin" />
          <span className={stateKey ? 'rcm-loc-val' : 'rcm-loc-ph'}>
            {stateKey ? STATES[stateKey] : 'Select State'}
          </span>
          <FaChevronDown className={`rcm-loc-caret ${showStateDrop ? 'rcm-loc-caret--up' : ''}`} />
        </button>

        {showStateDrop && (
          <div className="rcm-loc-drop">
            <div className="rcm-loc-search">
              <FaSearch className="rcm-loc-s-icon" />
              <input
                autoFocus
                className="rcm-loc-s-input"
                placeholder="Search state..."
                value={stateSearch}
                onChange={e => setStateSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            </div>
            <ul className="rcm-loc-list">
              {filteredStates.length === 0
                ? <li className="rcm-loc-empty">No states found</li>
                : filteredStates.map(([sk, sName]) => (
                  <li
                    key={sk}
                    className={`rcm-loc-item ${stateKey === sk ? 'rcm-loc-item--active' : ''}`}
                    onClick={() => selectState(sk)}
                  >
                    {sName}
                    {stateKey === sk && <FaCheckCircle className="rcm-loc-tick" />}
                  </li>
                ))
              }
            </ul>
          </div>
        )}
      </div>

      {/* District selector */}
      <div className={`rcm-loc-col ${!stateKey ? 'rcm-loc-col--disabled' : ''}`} ref={distRef}>
        <button
          type="button"
          className={`rcm-loc-trigger ${showDistDrop ? 'rcm-loc-trigger--open' : ''} ${!stateKey ? 'rcm-loc-trigger--disabled' : ''}`}
          onClick={() => { if (stateKey) { setShowDistDrop(s => !s); setShowStateDrop(false) } }}
        >
          <FaMapMarkerAlt className="rcm-loc-pin" />
          <span className={districtKey ? 'rcm-loc-val' : 'rcm-loc-ph'}>
            {districtKey
              ? districtMap[districtKey]
              : stateKey ? 'Select District' : 'Select state first'}
          </span>
          <FaChevronDown className={`rcm-loc-caret ${showDistDrop ? 'rcm-loc-caret--up' : ''}`} />
        </button>

        {showDistDrop && stateKey && (
          <div className="rcm-loc-drop">
            <div className="rcm-loc-search">
              <FaSearch className="rcm-loc-s-icon" />
              <input
                autoFocus
                className="rcm-loc-s-input"
                placeholder="Search district..."
                value={districtSearch}
                onChange={e => setDistrictSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            </div>
            <ul className="rcm-loc-list">
              {filteredDists.length === 0
                ? <li className="rcm-loc-empty">No districts found</li>
                : filteredDists.map(([dk, dName]) => (
                  <li
                    key={dk}
                    className={`rcm-loc-item ${districtKey === dk ? 'rcm-loc-item--active' : ''}`}
                    onClick={() => selectDistrict(dk)}
                  >
                    {dName}
                    {districtKey === dk && <FaCheckCircle className="rcm-loc-tick" />}
                  </li>
                ))
              }
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

/* -- Modal */
const RequestCropModal = ({ onClose, onSubmit, initialData = null, editMode = false }) => {
  const [form, setForm]       = useState(initialData ? {
    cropName:   initialData.cropName   || '',
    quantityKg: initialData.quantityKg || '',
    location:   initialData.location   || '',
    notes:      initialData.notes      || '',
  } : INITIAL)
  const [submitting, setSub]  = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  const handle = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.cropName.trim())
      return setError('Please enter a crop name.')
    if (!form.quantityKg || isNaN(form.quantityKg) || +form.quantityKg <= 0)
      return setError('Enter a valid quantity (kg).')
    if (!form.location.trim())
      return setError('Please select your state and district.')

    setSub(true)
    const result = await onSubmit(form)
    setSub(false)
    if (result.success) {
      setSuccess(true)
      setTimeout(onClose, 1800)
    } else {
      setError(result.error || 'Failed to submit. Please try again.')
    }
  }

  return (
    <div className="rcm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rcm-modal">

        <div className="rcm-header">
          <div className="rcm-header-icon"><FaLeaf /></div>
          <div>
            <h2 className="rcm-title">{editMode ? 'Edit Request' : 'Request a Crop'}</h2>
            <p className="rcm-subtitle">{editMode ? 'Update your crop request details' : 'Tell farmers exactly what you need'}</p>
          </div>
          <button className="rcm-close" onClick={onClose}><FaTimes /></button>
        </div>

        {success ? (
          <div className="rcm-success">
            <div className="rcm-success-icon">&#10003;</div>
            <h3>Request Submitted!</h3>
            <p>{editMode ? 'Request updated successfully!' : 'Farmers near you will see your request. Our AI will suggest a fair price, and farmers will send you their offer!'}</p>
          </div>
        ) : (
          <form className="rcm-form" onSubmit={submit}>
            {error && <div className="rcm-error">{error}</div>}
            <div className="rcm-field">
              <label className="rcm-label"><FaLeaf className="rcm-ico" /> Crop Name</label>
              <input
                name="cropName" value={form.cropName} onChange={handle}
                className="rcm-input" placeholder="e.g. Tomato, Rice, Mango..."
                autoComplete="off" required
              />
            </div>

            <div className="rcm-field">
              <label className="rcm-label"><FaRulerCombined className="rcm-ico" /> Quantity (kg)</label>
              <input
                name="quantityKg" value={form.quantityKg} onChange={handle}
                className="rcm-input" type="number" min="1" placeholder="e.g. 50" required
              />
            </div>

            <div className="rcm-field">
              <label className="rcm-label"><FaMapMarkerAlt className="rcm-ico" /> Your Location</label>
              <LocationPicker
                onChange={(loc) => { setForm(f => ({ ...f, location: loc })); setError('') }}
              />
              {form.location && (
                <div className="rcm-loc-chosen">
                  <FaMapMarkerAlt className="rcm-loc-chosen-pin" /> {form.location}
                </div>
              )}
            </div>

            <div className="rcm-field">
              <label className="rcm-label"><FaStickyNote className="rcm-ico" /> Notes <span className="rcm-optional">(optional)</span></label>
              <textarea
                name="notes" value={form.notes} onChange={handle}
                className="rcm-input rcm-textarea"
                placeholder="Quality preferences, delivery window, etc." rows={3}
              />
            </div>

            <button type="submit" className="rcm-submit" disabled={submitting}>
              {submitting
                ? <span className="rcm-spinner" />
                : <>{editMode ? 'Save Changes' : 'Submit Request'}</>
              }
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default RequestCropModal
