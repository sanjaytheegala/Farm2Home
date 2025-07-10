import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FarmerDashboard from './pages/FarmerDashboard'
import ConsumerDashboard from './pages/ConsumerDashboard'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/consumer" element={<ConsumerDashboard />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  )
}

export default App
