import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const navigate = useNavigate()

  const handleSendOTP = async () => {
    alert('OTP sending disabled during development.')
    setConfirmation(true)
  }

  const handleVerify = async () => {
    alert('OTP verification disabled during development.')
    navigate('/farmer') // simulate login
  }

  return (
    <div style={style}>
      <h2>Login with Phone</h2>
      <input placeholder="+91xxxxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} />
      <button onClick={handleSendOTP}>Send OTP</button>

      {confirmation && (
        <>
          <input placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
          <button onClick={handleVerify}>Verify OTP</button>
        </>
      )}
    </div>
  )
}

const style = {
  backgroundColor: '#181818', color: 'white', height: '100vh',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px'
}

export default LoginPage
