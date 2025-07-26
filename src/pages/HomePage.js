import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { auth } from '../firebase'
// import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import Navbar from '../components/Navbar'

const HomePage = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  const handleRoleSelect = (r) => {
    setRole(r)
    // ✅ Direct navigation (temporarily skipping OTP auth)
    if (r === 'farmer') navigate('/farmer')
    else if (r === 'consumer') navigate('/consumer')
  }

  // const sendOTP = async () => {
  //   if (!phone || !role) {
  //     alert('Select role and enter phone number')
  //     return
  //   }

  //   try {
  //     if (!window.recaptchaVerifier) {
  //       window.recaptchaVerifier = new RecaptchaVerifier(
  //         'recaptcha-container',
  //         { size: 'invisible' },
  //         auth
  //       )
  //       await window.recaptchaVerifier.render()
  //     }

  //     const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
  //     setConfirmation(result)
  //     alert('OTP sent to your phone')
  //   } catch (error) {
  //     alert('Failed to send OTP')
  //     console.error(error)
  //   }
  // }

  // const verifyOTP = async () => {
  //   try {
  //     await confirmation.confirm(otp)
  //     if (role === 'farmer') navigate('/farmer')
  //     else if (role === 'consumer') navigate('/consumer')
  //     else if (role === 'government') navigate('/government')
  //   } catch {
  //     alert('Invalid OTP')
  //   }
  // }

  return (
    <div style={container}>
      <Navbar />
      <div style={titleStyle}>FARM 2 HOME</div>
      <h2 style={h2}>Select User Type</h2>

      <div style={buttonGroup}>
        <button onClick={() => handleRoleSelect('farmer')} style={role === 'farmer' ? activeBtn : btn}>Farmer</button>
        <button onClick={() => handleRoleSelect('consumer')} style={role === 'consumer' ? activeBtn : btn}>Consumer</button>
      </div>

      <div style={authBox}>
        <input
          placeholder="Phone Number (+91...)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />
        <button /* onClick={sendOTP} */ style={signInBtn}>Send OTP</button>

        {confirmation && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={inputStyle}
            />
            <button /* onClick={verifyOTP} */ style={signInBtn}>Verify OTP</button>
          </>
        )}
        <p style={disabledNote}>* Authentication temporarily disabled. You will be redirected on selection.</p>
      </div>

      <div id="recaptcha-container"></div>

      <p style={desc}>
        Farm 2 Home empowers local farmers to connect directly with consumers. Fresh produce, fair prices.
      </p>
    </div>
  )
}

// ✅ Styles
const container = {
  backgroundColor: '#181818',
  minHeight: '100vh',
  paddingTop: '120px',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center'
}

const titleStyle = {
  fontSize: '64px',
  fontWeight: 'bold',
  marginBottom: '20px',
  backgroundColor: 'rgba(0,0,0,0.4)',
  padding: '20px 40px',
  borderRadius: '16px',
  border: '1px solid #333'
}

const h2 = {
  fontSize: '24px',
  marginBottom: '30px'
}

const buttonGroup = {
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginBottom: '30px'
}

const btn = {
  backgroundColor: 'rgba(0,0,0,0.3)',
  color: 'white',
  border: '1px solid #444',
  padding: '12px 24px',
  borderRadius: '10px',
  cursor: 'pointer',
  minWidth: '150px',
  fontSize: '16px'
}

const activeBtn = {
  ...btn,
  backgroundColor: '#28a745',
  border: '1px solid #28a745'
}

const authBox = {
  backgroundColor: '#222',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #444',
  marginBottom: '20px'
}

const inputStyle = {
  margin: '10px',
  padding: '12px',
  fontSize: '16px',
  width: '250px',
  borderRadius: '8px',
  border: '1px solid #555',
  backgroundColor: '#2a2a2a',
  color: 'white'
}

const signInBtn = {
  marginTop: '5px',
  padding: '10px 24px',
  fontSize: '16px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer'
}

const disabledNote = {
  fontSize: '12px',
  color: '#999',
  marginTop: '10px'
}

const desc = {
  maxWidth: '600px',
  fontSize: '15px',
  color: '#ccc',
  padding: '0 20px'
}

export default HomePage
