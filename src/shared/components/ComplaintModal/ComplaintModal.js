import React, { useState } from 'react'
import { FaTimes, FaExclamationTriangle, FaCheckCircle, FaChevronDown } from 'react-icons/fa'
import { db, auth } from '../../../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import './ComplaintModal.css'

const REASONS = [
  { value: 'inappropriate_behavior', label: 'Inappropriate Behavior', desc: 'Rude or abusive language during the call.' },
  { value: 'price_manipulation',     label: 'Price Manipulation',     desc: 'Asking for excessively high or unfairly low prices.' },
  { value: 'fake_request',           label: 'Fake Request / Supply',  desc: 'Posting a requirement or crop that doesn\'t exist.' },
  { value: 'other',                  label: 'Other',                  desc: 'Describe the issue in your own words.' },
]

/**
 * ComplaintModal
 * @param {object}   reportedUser   – { id, name, role: 'farmer'|'consumer' }
 * @param {string}   contextId      – demandId or orderId for reference
 * @param {function} onClose
 */
const ComplaintModal = ({ reportedUser, contextId, onClose }) => {
  const [reason,      setReason]      = useState('')
  const [description, setDescription] = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [success,     setSuccess]     = useState(false)
  const [error,       setError]       = useState('')

  const selectedReason = REASONS.find(r => r.value === reason)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reason) return setError('Please select a reason for your complaint.')
    if (reason === 'other' && !description.trim())
      return setError('Please describe the issue.')

    const user = auth.currentUser
    if (!user) return setError('You must be logged in to file a complaint.')

    setSubmitting(true)
    setError('')
    try {
      await addDoc(collection(db, 'complaints'), {
        reporterId:    user.uid,
        reporterName:  user.displayName || user.email || 'Unknown',
        reportedId:    reportedUser.id,
        reportedName:  reportedUser.name,
        reportedRole:  reportedUser.role,
        reason,
        reasonLabel:   selectedReason?.label || reason,
        description:   description.trim(),
        contextId:     contextId || null,
        status:        'open',            // open | reviewed | resolved
        createdAt:     serverTimestamp(),
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <div className="cmp-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cmp-modal">

        <div className="cmp-header">
          <div className="cmp-header-icon"><FaExclamationTriangle /></div>
          <div>
            <h2 className="cmp-title">Raise a Complaint</h2>
            <p className="cmp-subtitle">
              Report an issue with <strong>{reportedUser.name}</strong>
            </p>
          </div>
          <button className="cmp-close" onClick={onClose}><FaTimes /></button>
        </div>

        {success ? (
          <div className="cmp-success">
            <div className="cmp-success-icon"><FaCheckCircle /></div>
            <h3>Complaint Registered</h3>
            <p>Admin will review this shortly and take appropriate action.</p>
            <button className="cmp-done-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <form className="cmp-form" onSubmit={handleSubmit}>
            {error && <div className="cmp-error">{error}</div>}

            {/* Reason selector */}
            <div className="cmp-field">
              <label className="cmp-label">Select Reason</label>
              <div className="cmp-reason-list">
                {REASONS.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    className={`cmp-reason-btn ${reason === r.value ? 'cmp-reason-btn--active' : ''}`}
                    onClick={() => { setReason(r.value); setError('') }}
                  >
                    <div className="cmp-reason-label">{r.label}</div>
                    <div className="cmp-reason-desc">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description field — always shown, required only for "Other" */}
            <div className="cmp-field">
              <label className="cmp-label">
                Additional Details
                {reason !== 'other' && <span className="cmp-optional"> (optional)</span>}
              </label>
              <textarea
                className="cmp-textarea"
                placeholder={
                  reason === 'other'
                    ? 'Describe the issue in detail…'
                    : 'Any additional context you would like to share\u2026'
                }
                rows={4}
                value={description}
                onChange={e => { setDescription(e.target.value); setError('') }}
              />
            </div>

            <button
              type="submit"
              className="cmp-submit"
              disabled={submitting || !reason}
            >
              {submitting
                ? <span className="cmp-spinner" />
                : <><FaExclamationTriangle style={{ marginRight: 8 }} />Submit Complaint</>}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ComplaintModal
