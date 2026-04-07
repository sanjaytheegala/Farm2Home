import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { auth } from '../../../firebase';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { GMAIL_SUFFIX, isGmailComplete, keepCaretInLocalPart, moveCaretToLocalEnd, normalizeGmailInput } from '../../../utils/gmailInput';
import { COUNTRY_CODE_PREFIX, normalizePhoneForLookup, isPhoneComplete } from '../../../utils/phoneInput';

const EMAIL_LINK_EMAIL_KEY = 'farm2home_emailForSignIn';
const EMAIL_LINK_ROLE_KEY = 'farm2home_roleForSignIn';
const EMAIL_LINK_PHONE_KEY = 'farm2home_phoneForSignIn';

const SignupPage = () => {
  const [userType, setUserType] = useState('consumer'); // 'consumer' or 'farmer'
  const [email, setEmail] = useState(GMAIL_SUFFIX);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(COUNTRY_CODE_PREFIX);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const emailInputRef = useRef(null);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!isGmailComplete(email)) {
      setError(t('enter_email_error'));
      return;
    }

    if (!/^[^@\s]+@gmail\.com$/i.test(email.trim())) {
      setError(t('gmail_only_signup'));
      return;
    }

    const trimmedName = name.trim();
    const nameRegex = /^[a-zA-Z\s'\-]+$/;
    if (!trimmedName || trimmedName.length < 2) {
      setError(t('full_name_min_length'));
      return;
    }
    if (trimmedName.length > 60) {
      setError(t('full_name_max_length'));
      return;
    }
    if (!nameRegex.test(trimmedName)) {
      setError(t('name_characters_only'));
      return;
    }

    const cleanPhone = normalizePhoneForLookup(phone);
    if (!isPhoneComplete(phone)) {
      setError(t('valid_10_digit_phone'));
      return;
    }

    setLoading(true);

    try {
      // Link-first: do NOT create Firebase Auth user here.
      // Only send the sign-in link; account is created when link is clicked.

      try {
        localStorage.setItem(EMAIL_LINK_EMAIL_KEY, email.trim());
        localStorage.setItem(EMAIL_LINK_ROLE_KEY, userType);
        localStorage.setItem(EMAIL_LINK_PHONE_KEY, cleanPhone);
      } catch {}

      const actionCodeSettings = {
        url: (typeof window !== 'undefined' && window.location?.origin)
          ? `${window.location.origin}/verify-email`
          : 'http://localhost:3000/verify-email',
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email.trim(), actionCodeSettings);
      setVerificationSent(true);

    } catch (err) {
      if (err.code === 'auth/invalid-email') setError(t('invalid_email'));
      else if (err.code === 'auth/too-many-requests') setError(t('too_many_requests'));
      else setError(err.message || t('create_account_failed'));
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#181818', minHeight: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#2a2a2a', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', width: '420px', textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>📧</div>
          <h2 style={{ color: '#28a745', marginBottom: '16px' }}>Check Your Email</h2>
          <p style={{ color: '#ccc', marginBottom: '12px', lineHeight: '1.6' }}>
            A sign-in link has been sent to <strong style={{ color: '#28a745' }}>{email}</strong>.
          </p>
          <p style={{ color: '#999', marginBottom: '28px', fontSize: '0.9rem' }}>
            Please check your inbox and click the link to create your account and sign in.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{ width: '100%', padding: '12px', background: '#28a745', border: 'none', borderRadius: '5px', cursor: 'pointer', color: 'white', fontSize: '16px' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#181818', minHeight: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#2a2a2a', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', width: '400px', position: 'relative' }}>
        {/* Back to Home Button */}
        <button 
          onClick={handleBackToHome}
          style={{ 
            position: 'absolute', 
            top: '15px', 
            left: '15px', 
            background: 'transparent', 
            border: 'none', 
            color: '#28a745', 
            cursor: 'pointer', 
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            borderRadius: '5px',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          title={t('back_to_home')}
        >
          <FaArrowLeft />
          {t('home')}
        </button>
        
        <h2 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>{t('create_account')}</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <button onClick={() => setUserType('consumer')} style={{ padding: '10px 20px', background: userType === 'consumer' ? '#28a745' : 'grey', border: 'none', borderRadius: '5px 0 0 5px', cursor: 'pointer', color: 'white' }}>{t('consumer')}</button>
          <button onClick={() => setUserType('farmer')} style={{ padding: '10px 20px', background: userType === 'farmer' ? '#28a745' : 'grey', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer', color: 'white' }}>{t('farmer')}</button>
        </div>

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder={t('full_name')}
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => {
                const next = normalizeGmailInput(e.target.value);
                setEmail(next);
                requestAnimationFrame(() => keepCaretInLocalPart(emailInputRef.current));
              }}
              onFocus={() => requestAnimationFrame(() => moveCaretToLocalEnd(emailInputRef.current))}
              onClick={() => requestAnimationFrame(() => keepCaretInLocalPart(emailInputRef.current))}
              onKeyUp={() => requestAnimationFrame(() => keepCaretInLocalPart(emailInputRef.current))}
              onMouseUp={() => requestAnimationFrame(() => keepCaretInLocalPart(emailInputRef.current))}
              ref={emailInputRef}
              required
              style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="tel"
              placeholder={t('phone_number_10_digits')}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              maxLength={15}
              style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '5px' }}
            />
          </div>
          
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: loading ? '#666' : '#28a745', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              color: 'white', 
              fontSize: '16px' 
            }}
          >
            {loading ? t('sending_status') : 'Send sign-in link'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          {t('already_have_account')} <Link to="/" style={{ color: '#28a745', textDecoration: 'none' }}>{t('login')}</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
