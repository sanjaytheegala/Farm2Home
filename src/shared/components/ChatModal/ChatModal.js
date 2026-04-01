import { useState, useEffect, useRef, useCallback } from 'react'
import { db, auth } from '../../../firebase'
import {
  collection, addDoc, onSnapshot, serverTimestamp, Timestamp
} from 'firebase/firestore'
import { FaTimes, FaLeaf, FaUser, FaChevronLeft } from 'react-icons/fa'
import './ChatModal.css'

/**
 * ChatModal — structured menu-driven chat (no free text).
 * Subcollection: market_demands/{demandId}/messages
 */

/* ── Menu tree definitions ── */
const buildMenuTree = (role, cropName, qty) => {
  const crop = cropName || 'crop'
  const qtyLabel = qty ? `${qty} kg` : ''

  if (role === 'consumer') {
    return [
      {
        id: 'price', icon: '💰', label: 'Price Enquiry',
        subs: [
          { id: 'p1', text: `${crop} per kg rate entha?` },
          { id: 'p2', text: `Rate negotiate avutunda?` },
          { id: 'p3', text: `Payment method — cash or UPI?` },
        ],
      },
      {
        id: 'qty', icon: '📦', label: 'Quantity',
        subs: [
          { id: 'q1', text: `Minimum order quantity entha?` },
          { id: 'q2', text: `${qtyLabel ? qtyLabel + ' supply cheyyagalara?' : 'Required quantity supply cheyyagalara?'}` },
        ],
      },
      {
        id: 'quality', icon: '🌿', label: 'Quality',
        subs: [
          { id: 'ql1', text: `${crop} chemical free / organic na?` },
          { id: 'ql2', text: `Eppudu harvest chesaru?` },
          { id: 'ql3', text: `Variety / grade edhana?` },
        ],
      },
      {
        id: 'pickup', icon: '🚚', label: 'Pickup & Delivery',
        subs: [
          { id: 'pk1', text: `Mee exact farm location cheppandi.` },
          { id: 'pk2', text: `Delivery possible na?` },
          { id: 'pk3', text: `Delivery charge entha avutundi?` },
        ],
      },
      {
        id: 'timeline', icon: '📅', label: 'Timeline',
        subs: [
          { id: 't1', text: `${crop} eppatiki ready ga untundi?` },
          { id: 't2', text: `Stock entha varaku untundi?` },
        ],
      },
      {
        id: 'deal', icon: '🤝', label: 'Finalize Deal',
        subs: [
          { id: 'd1', text: `Mee price ki agree ayanu — deal confirm cheyyali.` },
          { id: 'd2', text: `Deal confirm — pickup ki ready ga unna.` },
        ],
      },
    ]
  }

  // Farmer menu
  return [
    {
      id: 'stock', icon: '📦', label: 'Stock Info',
      subs: [
        { id: 's1', text: `Total ${qtyLabel || '__'} kg stock available undi.` },
        { id: 's2', text: `Stock ippudu ready ga undi — fresh harvest.` },
        { id: 's3', text: `Stock limited ga undi — early confirm cheyyandi.` },
      ],
    },
    {
      id: 'price', icon: '💰', label: 'Price',
      subs: [
        { id: 'p1', text: `Naa rate: ₹__ per kg. Confirm cheyyandi.` },
        { id: 'p2', text: `Bulk order ki better rate ivvagalanu.` },
        { id: 'p3', text: `Rate fix — negotiate cheyyanu.` },
      ],
    },
    {
      id: 'quality', icon: '🌿', label: 'Quality Info',
      subs: [
        { id: 'ql1', text: `Organic / natural ga penchamu — chemicals levu.` },
        { id: 'ql2', text: `Grade A quality — fresh gaa undi.` },
        { id: 'ql3', text: `Ippudu harvest chesamu — very fresh.` },
      ],
    },
    {
      id: 'pickup', icon: '🚚', label: 'Pickup / Delivery',
      subs: [
        { id: 'pk1', text: `Farm address pampistanu — self pickup cheyyandi.` },
        { id: 'pk2', text: `Mee address pampandi — deliver chestanu.` },
        { id: 'pk3', text: `Pickup time: Morning 7am – 12pm.` },
      ],
    },
    {
      id: 'payment', icon: '💳', label: 'Payment',
      subs: [
        { id: 'py1', text: `Cash only accept chestanu.` },
        { id: 'py2', text: `UPI / online payment accepted.` },
        { id: 'py3', text: `50% advance ippudu — balance on delivery.` },
      ],
    },
    {
      id: 'deal', icon: '🤝', label: 'Close Deal',
      subs: [
        { id: 'd1', text: `Deal confirm — pickup date confirm cheyyandi.` },
        { id: 'd2', text: `Address confirm chesaka dispatch chestanu.` },
      ],
    },
  ]
}

/* ── Component ── */
const ChatModal = ({ demand, currentRole, onClose }) => {
  const [messages, setMessages] = useState([])
  const [sending, setSending]   = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [pendingSub, setPendingSub]         = useState(null)  // sub with __ needing fill-in
  const [fillValue, setFillValue]           = useState('')    // user typed value
  const bottomRef    = useRef(null)
  const fillInputRef = useRef(null)
  const user = auth.currentUser

  const cropName = demand?.cropName || 'crop'
  const qty      = demand?.quantityKg || ''

  const menuTree = buildMenuTree(currentRole, cropName, qty)

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
    setActiveCategory(null)
    setPendingSub(null)
    setFillValue('')
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

  /* ── Handle sub-option click: if has __ show fill-in, else send directly ── */
  const handleSubClick = (sub) => {
    if (sub.text.includes('__')) {
      setPendingSub(sub)
      setFillValue('')
      setTimeout(() => fillInputRef.current?.focus(), 80)
    } else {
      sendMessage(sub.text)
    }
  }

  /* ── Send the fill-in message after substituting __ ── */
  const handleFillSend = () => {
    if (!pendingSub || !fillValue.trim()) return
    const finalText = pendingSub.text.replace(/__/g, fillValue.trim())
    sendMessage(finalText)
  }

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

  const activeCat = menuTree.find(c => c.id === activeCategory)

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
              <div style={{ marginTop: 4, fontSize: 12 }}>
                Use the topic menu below to start the conversation.
              </div>
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

        {/* ── Menu Panel ── */}
        <div className="chat-menu-panel">

          {/* Sub-options view */}
          {activeCat ? (
            <div className="chat-sub-panel">
              <button
                className="chat-back-btn"
                onClick={() => { setActiveCategory(null); setPendingSub(null); setFillValue('') }}
              >
                <FaChevronLeft style={{ fontSize: 11 }} />
                <span>{activeCat.icon} {activeCat.label}</span>
              </button>

              {/* Fill-in panel — shown when a __ option is selected */}
              {pendingSub ? (
                <div className="chat-fillin-panel">
                  <div className="chat-fillin-preview">
                    {pendingSub.text.replace(/__/g, `[${fillValue || '...'}]`)}
                  </div>
                  <div className="chat-fillin-row">
                    <input
                      ref={fillInputRef}
                      className="chat-fillin-input"
                      type="text"
                      placeholder="Type value here..."
                      value={fillValue}
                      onChange={e => setFillValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleFillSend() }}
                    />
                    <button
                      className="chat-fillin-send"
                      onClick={handleFillSend}
                      disabled={!fillValue.trim() || sending}
                    >
                      Send ✓
                    </button>
                  </div>
                  <button
                    className="chat-fillin-cancel"
                    onClick={() => { setPendingSub(null); setFillValue('') }}
                  >
                    ← Back to options
                  </button>
                </div>
              ) : (
                <div className="chat-sub-list">
                  {activeCat.subs.map(sub => (
                    <button
                      key={sub.id}
                      className={`chat-sub-btn${sub.text.includes('__') ? ' chat-sub-btn--fill' : ''}`}
                      onClick={() => handleSubClick(sub)}
                      disabled={sending}
                    >
                      {sub.text.includes('__')
                        ? sub.text.replace(/__/g, '✏️ __')
                        : sub.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Main category grid */
            <div className="chat-main-menu">
              <div className="chat-menu-title">Choose a topic to send</div>
              <div className="chat-cat-grid">
                {menuTree.map(cat => (
                  <button
                    key={cat.id}
                    className="chat-cat-btn"
                    onClick={() => setActiveCategory(cat.id)}
                    disabled={sending}
                  >
                    <span className="chat-cat-icon">{cat.icon}</span>
                    <span className="chat-cat-label">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default ChatModal
