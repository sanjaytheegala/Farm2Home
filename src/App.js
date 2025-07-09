import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import FarmerDashboard from './pages/FarmerDashboard'
import ConsumerDashboard from './pages/ConsumerDashboard'

function App() {
  const [language, setLanguage] = useState('EN')

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage language={language} setLanguage={setLanguage} />} />
        <Route path="/signup" element={<SignupPage language={language} setLanguage={setLanguage} />} />
        <Route path="/login" element={<LoginPage language={language} setLanguage={setLanguage} />} />
        <Route path="/farmer" element={<FarmerDashboard language={language} setLanguage={setLanguage} />} />
        <Route path="/consumer" element={<ConsumerDashboard language={language} setLanguage={setLanguage} />} />
      </Routes>
    </Router>
  )
}

export default App
