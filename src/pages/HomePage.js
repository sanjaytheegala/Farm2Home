import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { FaLeaf, FaShoppingCart, FaChartLine, FaUsers, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowRight, FaSeedling, FaTruck, FaHandshake } from 'react-icons/fa'

const HomePage = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

  const handleRoleSelect = (r) => {
    setRole(r)
    if (r === 'farmer') navigate('/farmer')
    else if (r === 'consumer') navigate('/consumer')
  }

  return (
    <div style={container}>
      <Navbar />
      
      {/* 1. Hero Section - Enhanced */}
      <div style={heroSection}>
        <div style={heroContent}>
          <h1 style={heroTitle}>FARM 2 HOME</h1>
          <p style={heroSubtitle}>Connecting Farmers Directly to Consumers</p>
          <p style={heroDescription}>
            Empowering local farmers to connect directly with consumers. 
            Fresh produce, fair prices, sustainable agriculture.
          </p>
          
          <div style={ctaButtons}>
            <button 
              onClick={() => handleRoleSelect('farmer')} 
              style={primaryBtn}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <FaLeaf style={{ marginRight: '8px' }} />
              Join as Farmer
            </button>
            <button 
              onClick={() => handleRoleSelect('consumer')} 
              style={secondaryBtn}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <FaShoppingCart style={{ marginRight: '8px' }} />
              Shop Fresh Produce
            </button>
          </div>
        </div>
      </div>

      {/* 2. Features Section - Enhanced with hover effects */}
      <div style={featuresSection}>
        <h2 style={sectionTitle}>Why Choose Farm 2 Home?</h2>
        <div style={featuresGrid}>
          {[
            { icon: FaLeaf, title: 'Fresh from Farm', desc: 'Direct from local farms to your table, ensuring maximum freshness and quality.' },
            { icon: FaChartLine, title: 'Fair Pricing', desc: 'Eliminate middlemen. Farmers get better prices, consumers pay less.' },
            { icon: FaUsers, title: 'Community Driven', desc: 'Support local agriculture and build stronger farming communities.' },
            { icon: FaMapMarkerAlt, title: 'Local Focus', desc: 'Connect with farmers in your region for sustainable, local food supply.' }
          ].map((feature, index) => (
            <div 
              key={index}
              style={{
                ...featureCard,
                transform: hoveredCard === index ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: hoveredCard === index ? '0 10px 25px rgba(0,0,0,0.15)' : '0 2px 10px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <feature.icon style={featureIcon} />
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. How It Works Section - Enhanced with better visuals */}
      <div style={howItWorksSection}>
        <h2 style={sectionTitle}>How It Works</h2>
        <div style={stepsContainer}>
          {[
            { number: '1', title: 'Choose Your Role', desc: 'Join as a farmer to sell your produce or as a consumer to buy fresh food.', icon: FaUsers },
            { number: '2', title: 'Connect & Trade', desc: 'Browse available products or list your harvest for direct transactions.', icon: FaHandshake },
            { number: '3', title: 'Fresh Delivery', desc: 'Get fresh produce delivered to your doorstep or arrange pickup.', icon: FaTruck }
          ].map((step, index) => (
            <div key={index} style={step}>
              <div style={stepNumber}>{step.number}</div>
              <step.icon style={{ fontSize: '2rem', color: '#28a745', marginBottom: '15px' }} />
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Access Section - Enhanced with better interaction */}
      <div style={quickAccessSection}>
        <h2 style={sectionTitle}>Quick Access</h2>
        <div style={quickAccessGrid}>
          {[
            { icon: FaShoppingCart, title: 'Browse Products', desc: 'Explore fresh produce from local farmers', path: '/ecommerce' },
            { icon: FaSeedling, title: 'Crop Recommendations', desc: 'Get expert advice on what to grow', path: '/crop-recommendations' },
            { icon: FaUsers, title: 'About Us', desc: 'Learn more about our mission and team', path: '/about' }
          ].map((item, index) => (
            <div 
              key={index}
              style={{
                ...quickAccessCard,
                transform: hoveredCard === `quick-${index}` ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: hoveredCard === `quick-${index}` ? '0 10px 25px rgba(0,0,0,0.15)' : '0 2px 10px rgba(0,0,0,0.1)'
              }}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredCard(`quick-${index}`)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <item.icon style={quickAccessIcon} />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <FaArrowRight style={{ color: '#28a745', marginTop: '10px' }} />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Contact Section - Enhanced with better layout */}
      <div style={contactSection}>
        <h2 style={sectionTitle}>Get in Touch</h2>
        <div style={contactInfo}>
          <div style={contactItem}>
            <FaPhone style={contactIcon} />
            <span>+91 86******72</span>
          </div>
          <div style={contactItem}>
            <FaEnvelope style={contactIcon} />
            <span>sanjaytheegala05@gmail.com</span>
          </div>
        </div>
        <div style={contactDescription}>
          <p>Have questions? We're here to help you connect with local farmers and get fresh produce!</p>
        </div>
      </div>

      {/* 6. Footer - Enhanced with more information */}
      <div style={footer}>
        <div style={footerContent}>
          <div style={footerSection}>
            <h4>Farm 2 Home</h4>
            <p>Empowering local agriculture through direct farmer-consumer connections.</p>
          </div>
          <div style={footerSection}>
            <h4>Quick Links</h4>
            <p onClick={() => navigate('/about')} style={footerLink}>About Us</p>
            <p onClick={() => navigate('/ecommerce')} style={footerLink}>Shop Products</p>
            <p onClick={() => navigate('/crop-recommendations')} style={footerLink}>Crop Advice</p>
          </div>
          <div style={footerSection}>
            <h4>Contact</h4>
            <p>+91 86******72</p>
            <p>sanjaytheegala05@gmail.com</p>
          </div>
        </div>
        <div style={footerBottom}>
          <p>&copy; 2024 Farm 2 Home. Empowering local agriculture.</p>
        </div>
      </div>
    </div>
  )
}

// Enhanced Styles
const container = {
  backgroundColor: '#f8f9fa',
  minHeight: '100vh',
  color: '#333'
}

const heroSection = {
  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
  color: 'white',
  padding: '120px 20px 80px',
  textAlign: 'center',
  position: 'relative'
}

const heroContent = {
  maxWidth: '800px',
  margin: '0 auto'
}

const heroTitle = {
  fontSize: '3.5rem',
  fontWeight: 'bold',
  marginBottom: '20px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
}

const heroSubtitle = {
  fontSize: '1.5rem',
  marginBottom: '20px',
  opacity: 0.9
}

const heroDescription = {
  fontSize: '1.1rem',
  marginBottom: '40px',
  opacity: 0.8,
  lineHeight: 1.6
}

const ctaButtons = {
  display: 'flex',
  gap: '20px',
  justifyContent: 'center',
  flexWrap: 'wrap'
}

const primaryBtn = {
  backgroundColor: 'white',
  color: '#28a745',
  border: 'none',
  padding: '15px 30px',
  borderRadius: '25px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
}

const secondaryBtn = {
  backgroundColor: 'transparent',
  color: 'white',
  border: '2px solid white',
  padding: '15px 30px',
  borderRadius: '25px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease'
}

const featuresSection = {
  padding: '80px 20px',
  backgroundColor: 'white'
}

const sectionTitle = {
  textAlign: 'center',
  fontSize: '2.5rem',
  marginBottom: '50px',
  color: '#333'
}

const featuresGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '30px',
  maxWidth: '1200px',
  margin: '0 auto'
}

const featureCard = {
  backgroundColor: '#f8f9fa',
  padding: '30px',
  borderRadius: '15px',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  border: '1px solid #e9ecef'
}

const featureIcon = {
  fontSize: '3rem',
  color: '#28a745',
  marginBottom: '20px'
}

const howItWorksSection = {
  padding: '80px 20px',
  backgroundColor: '#f8f9fa'
}

const stepsContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '30px',
  maxWidth: '1000px',
  margin: '0 auto'
}

const step = {
  textAlign: 'center',
  padding: '20px'
}

const stepNumber = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#28a745',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: '0 auto 20px'
}

const quickAccessSection = {
  padding: '80px 20px',
  backgroundColor: 'white'
}

const quickAccessGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '30px',
  maxWidth: '1000px',
  margin: '0 auto'
}

const quickAccessCard = {
  backgroundColor: '#f8f9fa',
  padding: '30px',
  borderRadius: '15px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '1px solid #e9ecef'
}

const quickAccessIcon = {
  fontSize: '2.5rem',
  color: '#28a745',
  marginBottom: '20px'
}

const contactSection = {
  padding: '80px 20px',
  backgroundColor: '#f8f9fa',
  textAlign: 'center'
}

const contactInfo = {
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
  flexWrap: 'wrap',
  marginBottom: '30px'
}

const contactItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '1.1rem'
}

const contactIcon = {
  color: '#28a745',
  fontSize: '1.2rem'
}

const contactDescription = {
  maxWidth: '600px',
  margin: '0 auto',
  fontSize: '1rem',
  color: '#666'
}

const footer = {
  backgroundColor: '#333',
  color: 'white',
  padding: '40px 20px 20px'
}

const footerContent = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '30px',
  maxWidth: '1200px',
  margin: '0 auto',
  marginBottom: '30px'
}

const footerSection = {
  textAlign: 'left'
}

const footerLink = {
  cursor: 'pointer',
  margin: '5px 0',
  transition: 'color 0.3s ease'
}

const footerBottom = {
  textAlign: 'center',
  borderTop: '1px solid #555',
  paddingTop: '20px',
  fontSize: '0.9rem'
}

export default HomePage
