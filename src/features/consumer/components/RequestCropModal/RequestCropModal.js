import React, { useState, useRef, useEffect } from 'react'
import { FaTimes, FaLeaf, FaRulerCombined, FaMapMarkerAlt, FaPaperPlane, FaStickyNote, FaSearch, FaChevronDown, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { geoData } from '../../../../locale/geoData'
import { resolveCanonicalCropName } from '../../../../utils/cropValidation'
import { findCropByKeyword } from '../../../../data/cropData'
import './RequestCropModal.css'

const STATES    = geoData.en.states
const DISTRICTS = geoData.en.districts
const ALLOWED_STATE_KEYS = ['andhra_pradesh', 'telangana', 'tamil_nadu', 'karnataka', 'kerala', 'goa']

const QUANTITY_UNIT_OPTIONS = ['kg', 'piece', 'dozen', 'bunch', 'packet', 'box', 'litre']

const INITIAL = { cropName: '', quantityKg: '', quantityUnit: 'kg', location: '', notes: '' }

/* -- Searchable two-level location picker */
function LocationPicker({ onChange }) {
  const { t } = useTranslation()
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

  const filteredStates = Object.entries(STATES)
    .filter(([key]) => ALLOWED_STATE_KEYS.includes(key))
    .filter(([, n]) => n.toLowerCase().includes(stateSearch.toLowerCase()))
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
            {stateKey ? STATES[stateKey] : t('rcm_select_state')}
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
                placeholder={t('rcm_search_state_placeholder')}
                value={stateSearch}
                onChange={e => setStateSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            </div>
            <ul className="rcm-loc-list">
              {filteredStates.length === 0
                ? <li className="rcm-loc-empty">{t('rcm_no_states_found')}</li>
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
              : stateKey ? t('rcm_select_district') : t('rcm_select_state_first')}
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
                placeholder={t('rcm_search_district_placeholder')}
                value={districtSearch}
                onChange={e => setDistrictSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
              />
            </div>
            <ul className="rcm-loc-list">
              {filteredDists.length === 0
                ? <li className="rcm-loc-empty">{t('rcm_no_districts_found')}</li>
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
const RequestCropModal = ({ onClose, onSubmit, initialData = null, initialProduct = null, editMode = false }) => {
  const { t } = useTranslation()
  const isRequestNowMode = !!initialProduct
  const cropName = initialProduct?.name || initialProduct?.cropName || initialData?.cropName || ''
  const prefilledQuantityRaw = initialProduct?.quantity || initialProduct?.availableQuantity || initialProduct?.quantityKg || '1'
  const prefilledQuantity = String(Math.min(Math.max(parseFloat(prefilledQuantityRaw) || 1, 1), 50))
  const prefilledUnit = initialProduct?.unit || initialProduct?.quantityUnit || 'kg'
  
  // Look up crop image for preview
  const cropInfo = findCropByKeyword(cropName)
  const cropImg = initialProduct?.image || cropInfo?.image || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=200'

  const [form, setForm]       = useState(initialData ? {
    cropName:   initialData.cropName   || '',
    quantityKg: initialData.quantityKg || '',
    quantityUnit: initialData.quantityUnit || 'kg',
    location:   initialData.location   || '',
    notes:      initialData.notes      || '',
  } : {
    cropName:   cropName,
    quantityKg: String(prefilledQuantity),
    quantityUnit: prefilledUnit,
    location:   '',
    notes:      '',
  })
  const [submitting, setSub]  = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState(false)

  const handle = (e) => {
    const { name, value } = e.target

    if (name === 'quantityKg') {
      if (value === '') {
        setForm(f => ({ ...f, quantityKg: '' }))
        setError('')
        return
      }

      const parsed = parseFloat(value)
      const clamped = Math.min(Math.max(Number.isFinite(parsed) ? parsed : 0, 1), 50)
      setForm(f => ({ ...f, quantityKg: String(clamped) }))
      setError('')
      return
    }

    setForm(f => ({ ...f, [name]: value }))
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    let submissionForm = form
    
    if (!isRequestNowMode) {
      const canonicalCropName = resolveCanonicalCropName(form.cropName)
      if (!canonicalCropName) {
        return setError(t('rcm_error_invalid_crop_name'))
      }
      submissionForm = { ...form, cropName: canonicalCropName }
    }
    
    if (!form.quantityKg || isNaN(form.quantityKg) || +form.quantityKg <= 0)
      return setError(t('rcm_error_invalid_quantity'))
    if (+form.quantityKg > 50)
      return setError(t('rcm_error_quantity_max_50'))
    if (!form.quantityUnit)
      return setError(t('rcm_error_select_unit'))
    if (!form.location.trim())
      return setError(t('rcm_error_select_location'))

    setSub(true)
    const result = await onSubmit(submissionForm)
    setSub(false)
    if (result.success) {
      setSuccess(true)
      setTimeout(onClose, 1800)
    } else {
      setError(result.error || t('rcm_error_submit_failed'))
    }
  }

  return (
    <div className="rcm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rcm-modal">

        <div className="rcm-header">
          <div className="rcm-header-icon"><FaLeaf /></div>
          <div>
            <h2 className="rcm-title">
              {editMode
                ? t('rcm_title_edit_request')
                : isRequestNowMode
                  ? t('rcm_title_request_this_crop')
                  : t('rcm_title_new_crop_request')}
            </h2>
            <p className="rcm-subtitle">
              {editMode
                ? t('rcm_subtitle_edit_request')
                : isRequestNowMode
                  ? t('rcm_subtitle_request_now')
                  : t('rcm_subtitle_new_request')}
            </p>
          </div>
          <button className="rcm-close" onClick={onClose} aria-label={t('rcm_close_modal_aria')}><FaTimes /></button>
        </div>

        {success ? (
          <div className="rcm-success">
            <div className="rcm-success-icon"><FaCheckCircle /></div>
            <h3>{t('rcm_success_title')}</h3>
            <p>{editMode ? t('rcm_success_updated') : t('rcm_success_sent')}</p>
          </div>
        ) : (
          <form className="rcm-form" onSubmit={submit}>
            {error && (
              <div className="rcm-error">
                <FaExclamationCircle /> {error}
              </div>
            )}
            
            {isRequestNowMode ? (
              <div className="rcm-field">
                <label className="rcm-label"><FaLeaf className="rcm-ico" /> {t('rcm_label_selection')}</label>
                <div className="rcm-preview-card">
                  <img src={cropImg} alt={cropName} className="rcm-preview-img" />
                  <div className="rcm-preview-info">
                    <div className="rcm-preview-name">{cropName}</div>
                    <div className={`rcm-preview-tag ${initialProduct?.organic ? 'rcm-preview-tag--organic' : 'rcm-preview-tag--regular'}`}>
                      {initialProduct?.organic ? t('organic') : t('standard')}
                    </div>
                  </div>
                </div>
              </div>
            ) : !editMode ? (
              <div className="rcm-field">
                <label className="rcm-label"><FaLeaf className="rcm-ico" /> {t('rcm_label_crop_name')}</label>
                <input
                  name="cropName" value={form.cropName} onChange={handle}
                  className="rcm-input" placeholder={t('rcm_crop_name_placeholder')}
                  autoComplete="off" required
                />
              </div>
            ) : null}

            <div className="rcm-field">
              <label className="rcm-label"><FaRulerCombined className="rcm-ico" /> {t('rcm_label_quantity_need')}</label>
              <div className="rcm-row">
                <input
                  name="quantityKg" value={form.quantityKg} onChange={handle}
                  className="rcm-input" type="number" min="1" max="50" placeholder={t('rcm_quantity_placeholder')} required
                  readOnly={isRequestNowMode}
                />
                <select
                  name="quantityUnit"
                  value={form.quantityUnit}
                  onChange={handle}
                  className="rcm-input"
                  required
                  disabled={isRequestNowMode}
                >
                  {QUANTITY_UNIT_OPTIONS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rcm-field">
              <label className="rcm-label"><FaMapMarkerAlt className="rcm-ico" /> {t('rcm_label_target_location')}</label>
              <LocationPicker
                onChange={(loc) => { setForm(f => ({ ...f, location: loc })); setError('') }}
              />
              {form.location && (
                <div className="rcm-loc-chosen">
                  <FaCheckCircle /> {form.location}
                </div>
              )}
            </div>

            {!isRequestNowMode && !editMode && (
              <div className="rcm-field">
                <label className="rcm-label"><FaStickyNote className="rcm-ico" /> {t('rcm_label_additional_notes')} <span className="rcm-optional">({t('rcm_optional')})</span></label>
                <textarea
                  name="notes" value={form.notes} onChange={handle}
                  className="rcm-input rcm-textarea"
                  placeholder={t('rcm_notes_placeholder')} rows={3}
                />
              </div>
            )}

            <button type="submit" className="rcm-submit" disabled={submitting}>
              {submitting
                ? <span className="rcm-spinner" />
                : <>{editMode ? t('rcm_btn_save_changes') : isRequestNowMode ? t('rcm_btn_send_request') : t('rcm_btn_submit_request')}</>
              }
              {!submitting && <FaPaperPlane style={{ fontSize: 14 }} />}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default RequestCropModal
