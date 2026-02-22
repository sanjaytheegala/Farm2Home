import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { auth, db, functions } from '../../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { doc, getDoc } from 'firebase/firestore';

const LoginPage = () => {
  const [isFarmer, setIsFarmer] = useState(true);
  const [loginMethod, setLoginMethod] = useState('email'); // 'phone' or 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleSendOTP = async () => {
    setError('');
    setLoading(true);
    
    if (!phone) {
      setError('Please enter a phone number.');
      setLoading(false);
      return;
    }

    // Mock OTP sending
    setTimeout(() => {
      setConfirmationResult(true);
      console.log('Mock OTP sent (use any 6 digits)');
      setLoading(false);
    }, 500);
  };

  const handleVerifyOTP = async () => {
    setError('');
    setLoading(true);
    
    if (!otp) {
      setError('Please enter the OTP.');
      setLoading(false);
      return;
    }

    // Mock OTP verification
    if (otp.length === 6) {
      const mockUser = {
        uid: 'user_' + Date.now(),
        phone: phone,
        role: isFarmer ? 'farmer' : 'consumer',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('mockUserData', JSON.stringify(mockUser));
      navigate(isFarmer ? '/farmer' : '/consumer');
    } else {
      setError('Invalid OTP. Please enter 6 digits.');
    }
    setLoading(false);
  };

  const handleEmailLogin = async () => {
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter your email (or phone number) and password.');
      setLoading(false);
      return;
    }

    try {
      let emailToUse = email.trim();

      // Detect phone number: only digits (with optional +, spaces, dashes)
      const isPhoneNumber = /^[\d\s\-+()]+$/.test(emailToUse);

      if (isPhoneNumber) {
        console.log('📱 Phone number detected, calling Cloud Function for email lookup...');

        // Call the Cloud Function (runs with Admin SDK — bypasses all Firestore rules)
        const getEmailByPhone = httpsCallable(functions, 'getEmailByPhone');
        const cleanPhone = emailToUse.replace(/\D/g, '');
        const result = await getEmailByPhone({ phoneNumber: cleanPhone });
        emailToUse = result.data.email;

        console.log('✅ Resolved email for phone number:', emailToUse);
      }

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
      const user = userCredential.user;

      // Fetch user profile from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error('User profile not found. Please contact support.');
      }

      const userData = { uid: user.uid, ...userDocSnap.data() };

      if (userData.status && userData.status !== 'active') {
        throw new Error('Your account is inactive. Please contact support.');
      }

      // Role validation — make sure they're logging in through the correct portal
      const selectedRole = isFarmer ? 'farmer' : 'consumer';
      if (userData.role && userData.role !== selectedRole) {
        throw new Error(
          `This account is registered as a ${userData.role}. Please select the correct login type.`
        );
      }

      localStorage.setItem('currentUser', JSON.stringify(userData));
      console.log('✅ User logged in successfully:', userData);

      navigate(userData.role === 'farmer' ? '/farmer-dashboard' : '/consumer');
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Failed to login. Please try again.';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginMethod === 'phone') {
      if (confirmationResult) {
        handleVerifyOTP();
      } else {
        handleSendOTP();
      }
    } else {
      handleEmailLogin();
    }
  };

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
          title="Back to Home"
        >
          <FaArrowLeft />
          Home
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '20px' }}>
          <button onClick={() => setIsFarmer(true)} style={{ padding: '10px 20px', background: isFarmer ? '#28a745' : 'grey', border: 'none', borderRadius: '5px 0 0 5px', cursor: 'pointer', color: 'white' }}>Farmer</button>
          <button onClick={() => setIsFarmer(false)} style={{ padding: '10px 20px', background: !isFarmer ? '#28a745' : 'grey', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer', color: 'white' }}>Consumer</button>
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{isFarmer ? 'Farmer' : 'Consumer'} Login</h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <button onClick={() => setLoginMethod('phone')} style={{ padding: '8px 15px', background: loginMethod === 'phone' ? '#444' : '#2a2a2a', border: '1px solid #555', cursor: 'pointer', color: 'white' }}>Phone</button>
          <button onClick={() => setLoginMethod('email')} style={{ padding: '8px 15px', background: loginMethod === 'email' ? '#444' : '#2a2a2a', border: '1px solid #555', cursor: 'pointer', color: 'white' }}>Email</button>
        </div>
        <form onSubmit={handleSubmit}>
          {loginMethod === 'phone' ? (
            <>
              {!confirmationResult ? (
                <div style={{ marginBottom: '15px' }}>
                  <input
                    placeholder="Enter Phone Number with country code"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '5px' }}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: '15px' }}>
                  <input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '5px' }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Email or Phone Number"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '5px' }}
                />
              </div>
            </>
          )}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
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
            {loading ? 'Loading...' : (loginMethod === 'phone' ? (confirmationResult ? 'Verify OTP' : 'Send OTP') : 'Login')}
          </button>
        </form>
        <div id="recaptcha-container" style={{ marginTop: '20px' }}></div>
      </div>
    </div>
  );
};

export default LoginPage;
