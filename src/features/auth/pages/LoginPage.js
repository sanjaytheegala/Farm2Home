import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { auth, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword } from '../../../firebase';

const LoginPage = () => {
  const [isFarmer, setIsFarmer] = useState(true);
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("Recaptcha verified");
        }
      });
    }
  };

  const handleSendOTP = async () => {
    setError('');
    if (!phone) {
      setError('Please enter a phone number.');
      return;
    }
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, `+${phone}`, appVerifier);
      setConfirmationResult(result);
      console.log('OTP sent successfully!');
    } catch (err) {
      setError('Failed to send OTP. Please check the phone number or try again later.');
      console.error(err);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    try {
      const result = await confirmationResult.confirm(otp);
      // Store user role for mock authentication
      localStorage.setItem('mockUserRole', isFarmer ? 'farmer' : 'consumer');
      localStorage.setItem('mockUserData', JSON.stringify({
        uid: result.user.uid,
        phone: phone,
        role: isFarmer ? 'farmer' : 'consumer',
        loginMethod: 'phone'
      }));
      navigate(isFarmer ? '/farmer' : '/consumer');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error(err);
    }
  };

  const handleEmailLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Store user role for mock authentication
      localStorage.setItem('mockUserRole', isFarmer ? 'farmer' : 'consumer');
      localStorage.setItem('mockUserData', JSON.stringify({
        uid: result.user.uid,
        email: email,
        role: isFarmer ? 'farmer' : 'consumer',
        loginMethod: 'email'
      }));
      navigate(isFarmer ? '/farmer' : '/consumer');
    } catch (err) {
      setError('Failed to sign in. Please check your email and password.');
      console.error(err);
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
                  type="email"
                  placeholder="Email"
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
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#28a745', border: 'none', borderRadius: '5px', cursor: 'pointer', color: 'white', fontSize: '16px' }}>
            {loginMethod === 'phone' ? (confirmationResult ? 'Verify OTP' : 'Send OTP') : 'Login'}
          </button>
        </form>
        <div id="recaptcha-container" style={{ marginTop: '20px' }}></div>
      </div>
    </div>
  );
};

export default LoginPage;
