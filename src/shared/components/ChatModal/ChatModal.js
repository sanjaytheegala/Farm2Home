import { useState, useEffect, useRef, useCallback } from 'react'
import { db, auth } from '../../../firebase'
import {
  collection, addDoc, onSnapshot, serverTimestamp, Timestamp
} from 'firebase/firestore'
import { FaTimes, FaLeaf, FaUser } from 'react-icons/fa'
import './ChatModal.css'

/**
 * ChatModal — free-text chat (users type their own messages).
 * Subcollection: market_demands/{demandId}/messages
 */

/* ── Component ── */
const ChatModal = ({ demand, currentRole, onClose }) => {
  const [messages, setMessages] = useState([])
  const [sending, setSending]   = useState(false)
  const [draft, setDraft] = useState('')
  const bottomRef    = useRef(null)
  const inputRef     = useRef(null)
  const user = auth.currentUser

  const otherName =
    currentRole === 'farmer'
      ? demand.consumerName || 'Consumer'
      : demand.committedFarmerName || 'Farmer'

  /* ── Real-time messages listener ── */
  useEffect(() => {
    if (!demand?.id) return
    const colRef = collection(db, 'market_demands', demand.id, 'messages')
    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const next = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        next.sort((a, b) => {
          const aMs = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAtClient || 0)
          const bMs = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAtClient || 0)
          return aMs - bMs
        })
        setMessages(next)
      },
      (err) => console.error('Chat listener:', err.code, err.message)
    )
    return () => { try { unsub() } catch (_) {} }
  }, [demand?.id])

  /* ── Auto-scroll ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /* ── Notify navbar / dispatch event ── */
  useEffect(() => {
    document.dispatchEvent(new CustomEvent('chat:open'))
  }, [])

  /* ── Close on Escape ── */
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  /* ── Send message ── */
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || '').trim()
    if (!trimmed || !user || sending) return

    setSending(true)
    setDraft('')
    try {
      const expiresAt = Timestamp.fromMillis(Date.now() + 10 * 24 * 60 * 60 * 1000)
      await addDoc(collection(db, 'market_demands', demand.id, 'messages'), {
        senderId:        user.uid,
        senderName:      user.displayName || user.email || (currentRole === 'farmer' ? 'Farmer' : 'Consumer'),
        senderRole:      currentRole,
        text:            trimmed,
        createdAt:       serverTimestamp(),
        createdAtClient: Date.now(),
        expiresAt,
      })
    } catch (err) {
      console.error('Send failed:', err)
    } finally {
      setSending(false)
    }
  }, [user, sending, demand?.id, currentRole])

  /* ── Format timestamp ── */
  const formatTime = (ts) => {
    if (!ts?.seconds) return ''
    return new Date(ts.seconds * 1000).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    })
  }

  /* ── Date separator label ── */
  const getDateLabel = (ts) => {
    if (!ts?.seconds) return null
    const d = new Date(ts.seconds * 1000)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return 'Today'
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className="chat-modal" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-header-icon">
              {currentRole === 'farmer' ? <FaUser /> : <FaLeaf />}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div className="chat-header-name">{otherName}</div>
              <div className="chat-header-sub">
                <span className="chat-online-dot" />
                {demand.cropName} · {demand.quantityKg} kg
              </div>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose} aria-label="Close chat">
            <FaTimes />
          </button>
        </div>

        {/* ── Deal banner ── */}
        <div className="chat-deal-banner">
          <span className="chat-deal-banner-icon">🌾</span>
          <div className="chat-deal-banner-text">
            Discussing: <span>{demand.cropName}</span>
            {demand.quantityKg ? ` · ${demand.quantityKg} kg` : ''}
            {demand.location ? ` · ${demand.location}` : ''}
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <span className="chat-empty-icon">💬</span>
              <div>No messages yet.</div>
              <div style={{ marginTop: 4, fontSize: 12 }}>Start by typing a message below.</div>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isMine     = msg.senderId === user?.uid
            const thisDate   = getDateLabel(msg.createdAt)
            const prevDate   = idx > 0 ? getDateLabel(messages[idx - 1].createdAt) : null
            const showDateSep = thisDate && thisDate !== prevDate

            return (
              <div key={msg.id}>
                {showDateSep && <div className="chat-date-sep">{thisDate}</div>}
                <div className={`chat-bubble-row ${isMine ? 'chat-bubble-row--mine' : ''}`}>
                  {!isMine && (
                    <div className="chat-bubble-avatar">
                      {(msg.senderName || '?')[0].toUpperCase()}
                    </div>
                  )}
                  <div className={`chat-bubble ${isMine ? 'chat-bubble--mine' : 'chat-bubble--theirs'}`}>
                    {!isMine && <div className="chat-bubble-sender">{msg.senderName}</div>}
                    <div className="chat-bubble-text">{msg.text}</div>
                    <div className="chat-bubble-footer">
                      <span className="chat-bubble-time">{formatTime(msg.createdAt)}</span>
                      {isMine && <span className="chat-bubble-tick">✓✓</span>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          <div ref={bottomRef} />
        </div>

        {/* ── Input Panel ── */}
        <div className="chat-input-panel">
          <div className="chat-input-row">
            <input
              ref={inputRef}
              className="chat-input"
              type="text"
              placeholder="Type a message…"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') sendMessage(draft)
              }}
              disabled={sending}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage(draft)}
              disabled={!draft.trim() || sending}
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ChatModal
