import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignupPage = () => {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const navigate = useNavigate()

  const handleSendOTP = () => {
    if (phone) {
      setConfirmation(true)
      alert('OTP sent successfully!')
    } else {
      alert('Please enter a phone number')
    }
  }

  const handleVerify = () => {
    if (otp) {
      navigate('/farmer')
    } else {
      alert('Please enter OTP')
    }
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#181818', minHeight: '100vh', color: 'white' }}>
      <h2>Sign Up with Phone</h2>
      <div>
        <input 
          placeholder="Phone Number" 
          value={phone} 
          onChange={e => setPhone(e.target.value)}
          style={{ margin: '10px', padding: '10px' }}
        />
        <button onClick={handleSendOTP} style={{ margin: '10px', padding: '10px' }}>
          Send OTP
        </button>
      </div>
      {confirmation && (
        <div>
          <input 
            placeholder="Enter OTP" 
            value={otp} 
            onChange={e => setOtp(e.target.value)}
            style={{ margin: '10px', padding: '10px' }}
          />
          <button onClick={handleVerify} style={{ margin: '10px', padding: '10px' }}>
            Verify OTP
          </button>
        </div>
      )}
    </div>
  )
}

export default SignupPage
