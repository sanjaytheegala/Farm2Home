import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// Removed unused Navbar import since it's not being used directly in this component
import { FaLeaf, FaShoppingCart, FaChartLine, FaUsers, FaMapMarkerAlt, FaArrowRight, FaSeedling, FaTruck, FaHandshake, FaStar, FaQuoteLeft, FaTimes, FaPhone, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa'
import { auth, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, setDoc, db } from '../firebase'

const HomePage = () => {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [showLoginCard, setShowLoginCard] = useState(false)
  const [selectedRole, setSelectedRole] = useState('consumer') // 'farmer' or 'consumer'
  
  // Auth form states
  const [formType, setFormType] = useState('login') // 'login' or 'signup'
  const [loginMethod, setLoginMethod] = useState('phone') // 'phone' or 'email'
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [animatedStats, setAnimatedStats] = useState({
    farmers: 0,
    consumers: 0,
    products: 0,
    satisfaction: 0
  })

  // Authentication functions
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          console.log("Recaptcha verified");
        }
      });
    }
  };

  const handleSendOTP = async () => {
    setError('');
    setLoading(true);
    if (!phone) {
      setError('Please enter a phone number.');
      setLoading(false);
      return;
    }
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, `+${phone}`, appVerifier);
      setConfirmationResult(result);
      alert('OTP sent successfully!');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setError('');
    setLoading(true);
    if (!otp || !confirmationResult) {
      setError('Please enter the OTP.');
      setLoading(false);
      return;
    }
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      // Store user data for mock authentication
      const userData = {
        role: selectedRole,
        name: 'Demo User',
        email: user.email || phone,
        uid: user.uid
      };
      localStorage.setItem('mockUserData', JSON.stringify(userData));
      
      // Navigate to appropriate dashboard
      console.log('Navigating to dashboard for role:', selectedRole);
      navigate(selectedRole === 'farmer' ? '/farmer' : '/consumer');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email || !password) {
      setError('Please fill all fields.');
      setLoading(false);
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Store user data for mock authentication
      const userData = {
        role: selectedRole,
        name: 'Demo User',
        email: user.email,
        uid: user.uid
      };
      localStorage.setItem('mockUserData', JSON.stringify(userData));
      
      // Navigate to appropriate dashboard
      console.log('Navigating to dashboard for role:', selectedRole);
      navigate(selectedRole === 'farmer' ? '/farmer' : '/consumer');
    } catch (err) {
      setError('Invalid email or password.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: selectedRole,
        createdAt: new Date()
      });

      // Store user data for mock authentication
      const userData = {
        role: selectedRole,
        name: 'Demo User',
        email: user.email,
        uid: user.uid
      };
      localStorage.setItem('mockUserData', JSON.stringify(userData));
      
      // Navigate to appropriate dashboard
      console.log('Navigating to dashboard for role:', selectedRole);
      navigate(selectedRole === 'farmer' ? '/farmer' : '/consumer');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    }
    setLoading(false);
  };

  const resetForm = () => {
    setPhone('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setError('');
    setConfirmationResult(null);
    setLoginMethod('phone');
    setLoading(false);
    setShowPassword(false);
  };

  const switchToLogin = () => {
    resetForm();
    setFormType('login');
  };

  const switchToSignup = () => {
    resetForm();
    setFormType('signup');
  };

  const closeLoginCard = () => {
    setShowLoginCard(false);
    resetForm();
    setFormType('login'); // Reset to login by default
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setShowLoginCard(true)
    // Scroll to login section (a bit above statistics)
    setTimeout(() => {
      const loginSection = document.getElementById('login-section')
      if (loginSection) {
        loginSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  // Animate statistics on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats()
        }
      })
    }, { threshold: 0.5 })

    const statsSection = document.getElementById('stats-section')
    if (statsSection) {
      observer.observe(statsSection)
    }

    return () => observer.disconnect()
  }, [])

  const animateStats = () => {
    const targets = { farmers: 5000, consumers: 15000, products: 1000, satisfaction: 98 }
    const duration = 2000
    const steps = 60
    const stepValue = {}
    
    Object.keys(targets).forEach(key => {
      stepValue[key] = targets[key] / steps
    })

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      setAnimatedStats(prev => {
        const nextFarmers = Math.min(prev.farmers + stepValue.farmers, targets.farmers)
        const nextConsumers = Math.min(prev.consumers + stepValue.consumers, targets.consumers)
        const nextProducts = Math.min(prev.products + stepValue.products, targets.products)
        const nextSatisfaction = Math.min(prev.satisfaction + stepValue.satisfaction, targets.satisfaction)

        return {
          farmers: Math.round(nextFarmers),
          consumers: Math.round(nextConsumers),
          products: Math.round(nextProducts),
          // Keep satisfaction animated with two decimal precision
          satisfaction: Number(nextSatisfaction.toFixed(2))
        }
      })

      if (currentStep >= steps) {
        clearInterval(interval)
      }
    }, duration / steps)
  }

  return (
    <div style={container}>
      {/* Hero Section */}
      <div style={heroSection}>
        <div style={heroBackground}></div>
        <div style={heroContent}>
          <div style={heroText}>
            <h1 style={heroTitle}>
              <>
                <span style={heroTitleHighlight}>FARM</span>
                <span style={heroTitleNumber}>2</span>
                <span style={heroTitleHighlight}>HOME</span>
              </>
            </h1>
            <p style={heroSubtitle}>Connecting Farmers Directly to Consumers</p>
            <p style={heroDescription}>
              Empowering local farmers to connect directly with consumers. 
              Fresh produce, fair prices, sustainable agriculture.
            </p>
            <div style={ctaButtons}>
              <button 
                onClick={() => handleRoleSelect('farmer')} 
                style={secondaryBtn}
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
                Shop Fresh Products
              </button>
            </div>
          </div>
          {/* Removed floating cards */}
        </div>
      </div>

      {/* Login Card Section */}
      {showLoginCard && (
        <div id="login-section" style={loginSectionStyle}>
          <div style={loginCardOverlay} onClick={closeLoginCard}></div>
          <div style={loginCardStyle}>
            <button 
              onClick={closeLoginCard}
              style={closeButtonStyle}
              title="Close"
            >
              <FaTimes />
            </button>
            
            <h2 style={loginCardTitle}>
              {selectedRole === 'farmer' ? 'Join as Farmer' : 'Shop Fresh Products'}
            </h2>
            <p style={loginCardSubtitle}>
              {selectedRole === 'farmer' 
                ? 'Start selling your fresh produce directly to consumers'
                : 'Get fresh produce directly from local farmers'
              }
            </p>

            {/* Form Type Toggle */}
            <div style={formToggleContainer}>
              <button 
                onClick={switchToLogin}
                style={{...formToggleButton, ...(formType === 'login' ? activeToggleButton : {})}}
              >
                Login
              </button>
              <button 
                onClick={switchToSignup}
                style={{...formToggleButton, ...(formType === 'signup' ? activeToggleButton : {})}}
              >
                Register
              </button>
            </div>

            {error && <div style={errorMessage}>{error}</div>}

            {formType === 'login' ? (
              <div style={formContainer}>
                {/* Login Method Toggle */}
                <div style={methodToggleContainer}>
                  <button 
                    onClick={() => setLoginMethod('phone')}
                    style={{...methodToggleButton, ...(loginMethod === 'phone' ? activeMethodButton : {})}}
                  >
                    <FaPhone style={{ marginRight: '5px' }} />
                    Phone
                  </button>
                  <button 
                    onClick={() => setLoginMethod('email')}
                    style={{...methodToggleButton, ...(loginMethod === 'email' ? activeMethodButton : {})}}
                  >
                    <FaEnvelope style={{ marginRight: '5px' }} />
                    Email
                  </button>
                </div>

                {loginMethod === 'phone' ? (
                  <div>
                    {!confirmationResult ? (
                      <div>
                        <div style={inputGroup}>
                          <input
                            type="tel"
                            placeholder="Enter phone number with country code (e.g., 911234567890)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={inputField}
                          />
                        </div>
                        <button 
                          onClick={handleSendOTP}
                          disabled={loading}
                          style={{...submitButton, opacity: loading ? 0.7 : 1}}
                        >
                          {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={inputGroup}>
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={inputField}
                          />
                        </div>
                        <button 
                          onClick={handleVerifyOTP}
                          disabled={loading}
                          style={{...submitButton, opacity: loading ? 0.7 : 1}}
                        >
                          {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleEmailLogin}>
                    <div style={inputGroup}>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputField}
                        required
                      />
                    </div>
                    <div style={inputGroup}>
                      <div style={passwordContainer}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={inputField}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={passwordToggle}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      style={{...submitButton, opacity: loading ? 0.7 : 1}}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div style={formContainer}>
                {/* Register Method Toggle */}
                <div style={methodToggleContainer}>
                  <button 
                    onClick={() => setLoginMethod('phone')}
                    style={{...methodToggleButton, ...(loginMethod === 'phone' ? activeMethodButton : {})}}
                  >
                    <FaPhone style={{ marginRight: '5px' }} />
                    Phone
                  </button>
                  <button 
                    onClick={() => setLoginMethod('email')}
                    style={{...methodToggleButton, ...(loginMethod === 'email' ? activeMethodButton : {})}}
                  >
                    <FaEnvelope style={{ marginRight: '5px' }} />
                    Email
                  </button>
                </div>

                {loginMethod === 'phone' ? (
                  <div>
                    {!confirmationResult ? (
                      <div>
                        <div style={inputGroup}>
                          <input
                            type="tel"
                            placeholder="Enter phone number with country code (e.g., 911234567890)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={inputField}
                          />
                        </div>
                        <button 
                          onClick={handleSendOTP}
                          disabled={loading}
                          style={{...submitButton, opacity: loading ? 0.7 : 1}}
                        >
                          {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={inputGroup}>
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={inputField}
                          />
                        </div>
                        <button 
                          onClick={handleVerifyOTP}
                          disabled={loading}
                          style={{...submitButton, opacity: loading ? 0.7 : 1}}
                        >
                          {loading ? 'Verifying...' : 'Create Account'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSignup}>
                    <div style={inputGroup}>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputField}
                        required
                      />
                    </div>
                    <div style={inputGroup}>
                      <div style={passwordContainer}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={inputField}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={passwordToggle}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div style={inputGroup}>
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={inputField}
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      style={{...submitButton, opacity: loading ? 0.7 : 1}}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </form>
                )}
              </div>
            )}

            <div style={loginCardFeatures}>
              {selectedRole === 'farmer' ? (
                <>
                  <div style={featureItem}>✓ Sell directly to consumers</div>
                  <div style={featureItem}>✓ Get better prices for your produce</div>
                  <div style={featureItem}>✓ Build your customer base</div>
                </>
              ) : (
                <>
                  <div style={featureItem}>✓ Fresh produce from local farms</div>
                  <div style={featureItem}>✓ Direct farmer-to-consumer pricing</div>
                  <div style={featureItem}>✓ Support local agriculture</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      <div id="stats-section" style={statsSection}>
        <div style={statsGrid}>
          <div style={statCard}>
            <FaUsers style={statIcon} />
            <h3 style={statNumber}>{Math.round(animatedStats.farmers).toLocaleString()}+</h3>
            <p style={statLabel}>Active Farmers</p>
          </div>
          <div style={statCard}>
            <FaShoppingCart style={statIcon} />
            <h3 style={statNumber}>{Math.round(animatedStats.consumers).toLocaleString()}+</h3>
            <p style={statLabel}>Happy Consumers</p>
          </div>
          <div style={statCard}>
            <FaLeaf style={statIcon} />
            <h3 style={statNumber}>{Math.round(animatedStats.products).toLocaleString()}+</h3>
            <p style={statLabel}>Fresh Products</p>
          </div>
          <div style={statCard}>
            <FaStar style={statIcon} />
            <h3 style={statNumber}>{Number(animatedStats.satisfaction).toFixed(2)}%</h3>
            <p style={statLabel}>Satisfaction Rate</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ ...featuresSection, ...homepageTextShadow }}>
        <h2 style={sectionTitle}>Why Choose Farm 2 Home?</h2>
        <div style={featuresGrid}>
          {[
            { icon: FaLeaf, title: 'Fresh from Farm', desc: 'Direct from local farms to your table, ensuring maximum freshness and quality.', color: '#28a745' },
            { icon: FaChartLine, title: 'Fair Pricing', desc: 'Eliminate middlemen. Farmers get better prices, consumers pay less.', color: '#ff6b35' },
            { icon: FaUsers, title: 'Community Driven', desc: 'Support local agriculture and build stronger farming communities.', color: '#4ecdc4' },
            { icon: FaMapMarkerAlt, title: 'Local Focus', desc: 'Connect with farmers in your region for sustainable, local food supply.', color: '#45b7d1' }
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
              <div style={{ ...featureIconContainer, backgroundColor: `${feature.color}15` }}>
                <feature.icon style={{ ...featureIcon, color: feature.color }} />
              </div>
              <h3 style={featureTitle}>{feature.title}</h3>
              <p style={featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
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
              <h3 style={stepTitle}>{step.title}</h3>
              <p style={stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div style={testimonialsSection}>
        <h2 style={sectionTitle}>What Our Users Say</h2>
        <div style={testimonialsGrid}>
          {[
            { name: 'Rajesh Kumar', role: 'Farmer', text: 'Farm 2 Home helped me connect directly with consumers. My income has increased by 40%!', rating: 5 },
            { name: 'Priya Sharma', role: 'Consumer', text: 'I love getting fresh vegetables directly from local farmers. The quality is amazing!', rating: 5 },
            { name: 'Amit Patel', role: 'Farmer', text: 'This platform has revolutionized how I sell my produce. Highly recommended!', rating: 5 }
          ].map((testimonial, index) => (
            <div key={index} style={testimonialCard}>
              <div style={testimonialHeader}>
                <FaQuoteLeft style={{ fontSize: '2rem', color: '#28a745', opacity: 0.3 }} />
                <div style={ratingContainer}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} style={{ color: '#ffd700', fontSize: '1rem' }} />
                  ))}
                </div>
              </div>
              <p style={testimonialText}>{testimonial.text}</p>
              <div style={testimonialAuthor}>
                <div style={authorAvatar}>
                  <FaUsers style={{ fontSize: '1.5rem', color: '#28a745' }} />
                </div>
                <div>
                  <h4 style={authorName}>{testimonial.name}</h4>
                  <p style={authorRole}>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Section */}
      <div style={quickAccessSection}>
        <h2 style={sectionTitle}>Quick Access</h2>
        <div style={quickAccessGrid}>
          {[
            // Removed ecommerce quick access item
            { icon: FaSeedling, title: 'Crop recommendation', desc: 'Get expert advice on what to grow', path: '/crop-recommendations' },
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
              <h3 style={quickAccessTitle}>{item.title}</h3>
              <p style={quickAccessDesc}>{item.desc}</p>
              <FaArrowRight style={{ color: '#28a745', marginTop: '10px' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={footer}>
        <div style={footerContent}>
          <div style={footerSection}>
            <h4 style={footerTitle}>Farm 2 Home</h4>
            <p style={footerDesc}>Empowering local agriculture through direct farmer-consumer connections.</p>
            <div style={socialLinks}>
            </div>
          </div>
          <div style={footerSection}>
            <h4 style={footerTitle}>Quick Links</h4>
            <p onClick={() => navigate('/about')} style={footerLink}>About Us</p>
            {/* Removed ecommerce footer link */}
            <p onClick={() => navigate('/crop-recommendations')} style={footerLink}>Crop Advice</p>
          </div>
          <div style={footerSection}>
            <h4 style={footerTitle}>Contact</h4>
            <p style={footerContact}>+91 86******72</p>
            <p style={footerContact}>sanjaytheegala05@gmail.com</p>
          </div>
        </div>
        <div style={footerBottom}>
          <p>&copy; 2024 Farm 2 Home. Empowering local agriculture.</p>
        </div>
      </div>

      {/* Recaptcha Container - Hidden */}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
    </div>
  )
}

// Enhanced Styles
const container = {
  minHeight: '100vh',
  color: '#333',
  position: 'relative',
};

const heroSection = {
  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
  color: 'white',
  padding: '120px 20px 80px',
  textAlign: 'center',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
};

const heroBackground = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  opacity: 0.3,
};

const heroContent = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '40px',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1,
};

const heroText = {
  textAlign: 'left',
};

const heroTitle = {
  fontSize: '4rem',
  fontWeight: 'bold',
  marginBottom: '20px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const heroTitleHighlight = {
  color: '#fff',
};

const heroTitleNumber = {
  color: '#ffd700',
  fontWeight: '900',
  textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
};

const heroSubtitle = {
  fontSize: '1.8rem',
  marginBottom: '20px',
  opacity: 0.9,
  fontWeight: '300',
};

const heroDescription = {
  fontSize: '1.2rem',
  marginBottom: '40px',
  opacity: 0.8,
  lineHeight: 1.6,
};

const ctaButtons = {
  display: 'flex',
  gap: '20px',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
};

// Removed unused primaryBtn style object

const secondaryBtn = {
  backgroundColor: 'transparent',
  color: '#ffffff',
  border: '2px solid rgba(255,255,255,0.6)',
  padding: '12px 26px',
  borderRadius: '22px',
  fontSize: '1.05rem',
  fontWeight: '700',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.2s ease',
};

// Statistics Section
const statsSection = {
  padding: '60px 20px',
  backgroundColor: '#f8f9fa',
  textAlign: 'center',
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '30px',
  maxWidth: '1000px',
  margin: '0 auto',
};

const statCard = {
  background: 'white',
  padding: '30px 20px',
  borderRadius: '15px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
};

const statIcon = {
  fontSize: '2.5rem',
  color: '#28a745',
  marginBottom: '15px',
};

const statNumber = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#28a745',
  marginBottom: '10px',
};

const statLabel = {
  fontSize: '1rem',
  color: '#666',
  fontWeight: '500',
};

// Features Section
const featuresSection = {
  padding: '80px 20px',
  backgroundColor: 'white',
};

const homepageTextShadow = {
  textShadow: '0 2px 8px rgba(0,0,0,0.18)',
};

const sectionTitle = {
  textAlign: 'center',
  fontSize: '2.5rem',
  marginBottom: '50px',
  color: '#333',
  fontWeight: 'bold',
};

const featuresGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const featureCard = {
  backgroundColor: '#f8f9fa',
  padding: '30px',
  borderRadius: '15px',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  border: '1px solid #e9ecef',
};

const featureIconContainer = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 20px',
  transition: 'all 0.3s ease',
};

const featureIcon = {
  fontSize: '2.5rem',
  transition: 'all 0.3s ease',
};

const featureTitle = {
  fontSize: '1.3rem',
  fontWeight: 'bold',
  marginBottom: '15px',
  color: '#333',
};

const featureDesc = {
  fontSize: '1rem',
  color: '#666',
  lineHeight: 1.6,
};

// How It Works Section
const howItWorksSection = {
  padding: '80px 20px',
  backgroundColor: '#f8f9fa',
};

const stepsContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '30px',
  maxWidth: '1000px',
  margin: '0 auto',
};

// Removed unused step style object

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
  margin: '0 auto 20px',
};

const stepTitle = {
  fontSize: '1.3rem',
  fontWeight: 'bold',
  marginBottom: '15px',
  color: '#333',
};

const stepDesc = {
  fontSize: '1rem',
  color: '#666',
  lineHeight: 1.6,
};

// Testimonials Section
const testimonialsSection = {
  padding: '80px 20px',
  backgroundColor: 'white',
};

const testimonialsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '30px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const testimonialCard = {
  background: '#f8f9fa',
  padding: '30px',
  borderRadius: '15px',
  border: '1px solid #e9ecef',
  transition: 'all 0.3s ease',
};

const testimonialHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '20px',
};

const ratingContainer = {
  display: 'flex',
  gap: '2px',
};

const testimonialText = {
  fontSize: '1rem',
  color: '#333',
  lineHeight: 1.6,
  marginBottom: '20px',
  fontStyle: 'italic',
};

const testimonialAuthor = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
};

const authorAvatar = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#28a745',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
};

const authorName = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 5px 0',
};

const authorRole = {
  fontSize: '0.9rem',
  color: '#666',
  margin: 0,
};

// Quick Access Section
const quickAccessSection = {
  padding: '80px 20px',
  backgroundColor: '#f8f9fa',
};

const quickAccessGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '30px',
  maxWidth: '1000px',
  margin: '0 auto',
};

const quickAccessCard = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '15px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '1px solid #e9ecef',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
};

const quickAccessIcon = {
  fontSize: '2.5rem',
  color: '#28a745',
  marginBottom: '20px',
};

const quickAccessTitle = {
  fontSize: '1.3rem',
  fontWeight: 'bold',
  marginBottom: '15px',
  color: '#333',
};

const quickAccessDesc = {
  fontSize: '1rem',
  color: '#666',
  lineHeight: 1.6,
};

// Contact Section
// Removed unused contact-related style objects: contactSection, contactInfo, contactItem, contactIcon, contactDescription

// Footer
const footer = {
  backgroundColor: '#333',
  color: 'white',
  padding: '40px 20px 20px',
};

const footerContent = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '30px',
  maxWidth: '1200px',
  margin: '0 auto',
  marginBottom: '30px',
};

const footerSection = {
  textAlign: 'left',
};

const footerTitle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginBottom: '15px',
  color: '#fff',
};

const footerDesc = {
  fontSize: '0.9rem',
  color: '#ccc',
  lineHeight: 1.6,
  marginBottom: '15px',
};

const socialLinks = {
  display: 'flex',
  gap: '15px',
};

// Removed unused socialIcon style object

const footerLink = {
  cursor: 'pointer',
  margin: '8px 0',
  transition: 'color 0.3s ease',
  fontSize: '0.9rem',
  color: '#ccc',
};

const footerContact = {
  fontSize: '0.9rem',
  color: '#ccc',
  margin: '8px 0',
};

const footerBottom = {
  textAlign: 'center',
  borderTop: '1px solid #555',
  paddingTop: '20px',
  fontSize: '0.9rem',
  color: '#ccc',
};

// Login Card Styles
const loginSectionStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
};

const loginCardOverlay = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(4px)',
};

const loginCardStyle = {
  position: 'relative',
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '25px',
  maxWidth: '420px',
  width: '100%',
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
  textAlign: 'center',
  transform: 'scale(1)',
  animation: 'fadeInScale 0.3s ease-out',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'none',
  border: 'none',
  fontSize: '20px',
  color: '#666',
  cursor: 'pointer',
  padding: '5px',
  borderRadius: '50%',
  transition: 'all 0.3s ease',
};

const loginCardTitle = {
  fontSize: '1.6rem',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

const loginCardSubtitle = {
  fontSize: '0.9rem',
  color: '#666',
  marginBottom: '20px',
  lineHeight: 1.4,
};

const loginCardFeatures = {
  textAlign: 'left',
  backgroundColor: '#f8f9fa',
  padding: '12px',
  borderRadius: '6px',
  marginTop: '15px',
};

const featureItem = {
  padding: '4px 0',
  fontSize: '0.8rem',
  color: '#495057',
  fontWeight: '500',
};

// Form Styles
const formToggleContainer = {
  display: 'flex',
  marginBottom: '15px',
  borderRadius: '6px',
  overflow: 'hidden',
  border: '1px solid #ddd',
};

const formToggleButton = {
  flex: 1,
  padding: '8px',
  border: 'none',
  background: '#f8f9fa',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: '600',
  transition: 'all 0.3s ease',
};

const activeToggleButton = {
  background: 'linear-gradient(135deg, #28a745, #20c997)',
  color: 'white',
};

const methodToggleContainer = {
  display: 'flex',
  marginBottom: '12px',
  gap: '8px',
};

const methodToggleButton = {
  flex: 1,
  padding: '6px 10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  background: '#f8f9fa',
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
};

const activeMethodButton = {
  background: '#007bff',
  color: 'white',
  borderColor: '#007bff',
};

const formContainer = {
  marginBottom: '15px',
};

const inputGroup = {
  marginBottom: '12px',
};

const inputField = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '6px',
  fontSize: '0.9rem',
  transition: 'border-color 0.3s ease',
  boxSizing: 'border-box',
};

const passwordContainer = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const passwordToggle = {
  position: 'absolute',
  right: '10px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#666',
  fontSize: '0.9rem',
};

const submitButton = {
  width: '100%',
  padding: '10px',
  background: 'linear-gradient(135deg, #28a745, #20c997)',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const errorMessage = {
  color: '#dc3545',
  fontSize: '0.8rem',
  marginBottom: '12px',
  padding: '8px',
  background: '#f8d7da',
  border: '1px solid #f5c6cb',
  borderRadius: '5px',
  textAlign: 'center',
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes fadeInScale {
    0% { 
      opacity: 0; 
      transform: scale(0.8); 
    }
    100% { 
      opacity: 1; 
      transform: scale(1); 
    }
  }
`;
document.head.appendChild(style);

export default HomePage