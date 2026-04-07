import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { auth, db } from '../../../firebase'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { normalizePhoneForLookup } from '../../../utils/phoneInput'

const EMAIL_LINK_EMAIL_KEY = 'farm2home_emailForSignIn'
const EMAIL_LINK_ROLE_KEY = 'farm2home_roleForSignIn'
const EMAIL_LINK_PHONE_KEY = 'farm2home_phoneForSignIn'

const normalizeRole = (raw) => {
  const r = String(raw || '').trim().toLowerCase()
  return r === 'farmer' || r === 'consumer' ? r : ''
}

const VerifyEmailLinkPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const href = useMemo(() => (typeof window !== 'undefined' ? window.location.href : ''), [])

  const [status, setStatus] = useState('checking')
  const [message, setMessage] = useState('Checking link…')

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        if (!href) return

        if (!isSignInWithEmailLink(auth, href)) {
          setStatus('error')
          setMessage('Invalid or expired sign-in link.')
          return
        }

        let email = ''
        let role = ''
        let phoneNumber = ''

        try {
          email = String(localStorage.getItem(EMAIL_LINK_EMAIL_KEY) || '').trim()
          role = String(localStorage.getItem(EMAIL_LINK_ROLE_KEY) || '').trim()
          phoneNumber = String(localStorage.getItem(EMAIL_LINK_PHONE_KEY) || '').trim()
        } catch {
          // ignore
        }

        if (!email) {
          // Fallback: ask user (happens if they open the link on a different device)
          email = window.prompt(t('enter_email_error') || 'Please enter your email address.') || ''
          email = String(email).trim()
        }

        if (!email) {
          setStatus('error')
          setMessage(t('enter_email_error') || 'Please enter your email address.')
          return
        }

        role = normalizeRole(role) || 'consumer'
        const cleanPhone = normalizePhoneForLookup(phoneNumber)

        setStatus('verifying')
        setMessage('Signing you in…')

        const cred = await signInWithEmailLink(auth, email, href)
        const uid = cred.user?.uid
        if (!uid) throw new Error('Could not resolve user session.')

        // Create Firestore profile only at verification step
        const userRef = doc(db, 'users', uid)
        const snap = await getDoc(userRef)

        if (!snap.exists()) {
          await setDoc(userRef, {
            uid,
            email: cred.user.email || email,
            role,
            phoneNumber: cleanPhone,
            status: 'active',
            createdAt: serverTimestamp(),
          })
        }

        try {
          localStorage.removeItem(EMAIL_LINK_EMAIL_KEY)
          localStorage.removeItem(EMAIL_LINK_ROLE_KEY)
          localStorage.removeItem(EMAIL_LINK_PHONE_KEY)
        } catch {
          // ignore
        }

        if (cancelled) return

        setStatus('success')
        setMessage('Success! Redirecting…')

        const dest = role === 'farmer' ? '/farmer-dashboard' : '/consumer-dashboard'
        navigate(dest, { replace: true })
      } catch (e) {
        if (cancelled) return
        setStatus('error')
        setMessage(e?.message || 'Failed to complete sign-in.')
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [href, navigate, t])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0b1220',
      padding: 20,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 520,
        background: '#111827',
        border: '1px solid #1f2937',
        borderRadius: 14,
        padding: 24,
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
      }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Verify Email Link</h2>
        <p style={{ margin: '10px 0 0', color: '#cbd5e1', fontSize: 13 }}>
          {status === 'verifying' || status === 'checking'
            ? 'Please wait while we complete sign-in.'
            : status === 'success'
              ? 'You can close this tab if it doesn\'t redirect.'
              : 'Please try again.'}
        </p>

        <div style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 12,
          background: status === 'error' ? '#7f1d1d' : status === 'success' ? '#064e3b' : '#0f172a',
          border: '1px solid rgba(255,255,255,0.08)',
          fontSize: 13,
          lineHeight: 1.5,
        }}>
          {message}
        </div>

        {status === 'error' && (
          <button
            onClick={() => navigate('/', { replace: true })}
            style={{
              marginTop: 14,
              width: '100%',
              background: '#16a34a',
              border: 'none',
              borderRadius: 10,
              padding: '10px 12px',
              fontWeight: 800,
              cursor: 'pointer',
              color: 'white'
            }}
          >
            Back to Home
          </button>
        )}
      </div>
    </div>
  )
}

export default VerifyEmailLinkPage
