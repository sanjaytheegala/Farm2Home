import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { auth, db, createUserWithEmailAndPassword, doc, setDoc } from '../firebase';

const SignupPage = () => {
  const [userType, setUserType] = useState('consumer'); // 'consumer' or 'farmer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create a user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: userType,
        createdAt: new Date()
      });

      // 3. Redirect to the correct dashboard
      navigate(userType === 'farmer' ? '/farmer' : '/consumer');

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
      console.error(err);
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
        
        <h2 style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>Create Account</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <button onClick={() => setUserType('consumer')} style={{ padding: '10px 20px', background: userType === 'consumer' ? '#28a745' : 'grey', border: 'none', borderRadius: '5px 0 0 5px', cursor: 'pointer', color: 'white' }}>Consumer</button>
          <button onClick={() => setUserType('farmer')} style={{ padding: '10px 20px', background: userType === 'farmer' ? '#28a745' : 'grey', border: 'none', borderRadius: '0 5px 5px 0', cursor: 'pointer', color: 'white' }}>Farmer</button>
        </div>

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '5px' }}
            />
          </div>
          
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
          
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#28a745', border: 'none', borderRadius: '5px', cursor: 'pointer', color: 'white', fontSize: '16px' }}>
            Sign Up as a {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <Link to="/login" style={{ color: '#28a745', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
