import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './HomePage.css'
// Optimized icon imports - import only what's needed
import { 
  FaLeaf, FaShoppingCart, FaChartLine, FaUsers, FaMapMarkerAlt, 
  FaArrowRight, FaSeedling, FaTruck, FaHandshake, FaStar, 
  FaQuoteLeft, FaTimes, FaPhone, FaEnvelope, FaEye, FaEyeSlash,
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaApple, FaGooglePlay, FaUserTie
} from 'react-icons/fa'
import { auth, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, setDoc, db } from '../../../firebase'
import { logger } from '../../../utils/logger'

const HomePage = () => {
  const { t } = useTranslation()
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
  
  // Typewriter animation states
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  
  // Testimonial carousel state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  
  // Messages to cycle through
  const typewriterMessages = [
    t('typewriter_message_1') || "Empowering local farmers to connect directly with consumers. Fresh produce, fair prices, sustainable agriculture.",
    t('typewriter_message_2') || "Supporting sustainable farming practices that benefit both farmers and the environment.",
    t('typewriter_message_3') || "Building stronger communities through direct farmer-consumer relationships and local food systems.",
    t('typewriter_message_4') || "Providing fresh, nutritious produce while ensuring fair compensation for hardworking farmers."
  ]

  // Expanded testimonials data for continuous scrolling
  const testimonials = [
    { name: 'Rajesh Kumar', role: 'Farmer', text: 'Farm 2 Home helped me connect directly with consumers. My income has increased by 40%!', rating: 5 },
    { name: 'Priya Sharma', role: 'Consumer', text: 'I love getting fresh vegetables directly from local farmers. The quality is amazing!', rating: 5 },
    { name: 'Amit Patel', role: 'Farmer', text: 'This platform has revolutionized how I sell my produce. Highly recommended!', rating: 5 },
    { name: 'Sita Devi', role: 'Farmer', text: 'Before Farm 2 Home, I struggled to sell my organic vegetables. Now I have regular customers!', rating: 5 },
    { name: 'Mohammed Ali', role: 'Consumer', text: 'The freshness and quality of produce is unmatched. Supporting local farmers feels great!', rating: 5 },
    { name: 'Lakshmi Reddy', role: 'Farmer', text: 'The direct connection with customers has transformed my farming business completely.', rating: 5 },
    { name: 'Ravi Krishnan', role: 'Consumer', text: 'Farm-fresh produce delivered to my doorstep. What more could I ask for?', rating: 5 },
    { name: 'Sunita Gupta', role: 'Farmer', text: 'Thanks to this platform, I can now focus on growing quality crops without worrying about sales.', rating: 5 },
    { name: 'Arjun Singh', role: 'Consumer', text: 'Supporting sustainable agriculture while getting the best produce. Win-win situation!', rating: 5 }
  ]

  // Authentication functions
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          logger.log("Recaptcha verified");
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
    
    // Ensure phone number is in E.164 format
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    try {
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      logger.log('OTP sent successfully!');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      logger.error(err);
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
      console.log('OTP verification success - storing user data:', userData);
      localStorage.setItem('mockUserData', JSON.stringify(userData));
      
      // Navigate to appropriate dashboard
      console.log('Navigating to dashboard for role:', selectedRole);
      console.log('Navigation path:', selectedRole === 'farmer' ? '/farmer' : '/consumer');
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

    // For testing - bypass Firebase auth temporarily
    if (email === 'test@consumer.com' && password === 'test123') {
      // Mock successful login
      const userData = {
        role: selectedRole,
        name: 'Test Consumer',
        email: email,
        uid: 'test-uid-' + Date.now()
      };
      console.log('Test login success - storing user data:', userData);
      localStorage.setItem('mockUserData', JSON.stringify(userData));
      
      // Navigate to appropriate dashboard
      console.log('Navigating to dashboard for role:', selectedRole);
      console.log('Navigation path:', selectedRole === 'farmer' ? '/farmer' : '/consumer');
      navigate(selectedRole === 'farmer' ? '/farmer' : '/consumer');
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
      console.log('Email login success - storing user data:', userData);
      localStorage.setItem('mockUserData', JSON.stringify(userData));
      
      // Navigate to appropriate dashboard
      console.log('Navigating to dashboard for role:', selectedRole);
      console.log('Navigation path:', selectedRole === 'farmer' ? '/farmer' : '/consumer');
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

  // Add CSS animation for cursor blinking
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Testimonials carousel animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 3000) // Change testimonial every 3 seconds
    
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Typewriter animation effect
  useEffect(() => {
    const currentMessage = typewriterMessages[textIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentIndex < currentMessage.length) {
          setCurrentText(currentMessage.substring(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        // Deleting
        if (currentIndex > 0) {
          setCurrentText(currentMessage.substring(0, currentIndex - 1))
          setCurrentIndex(currentIndex - 1)
        } else {
          // Finished deleting, move to next message
          setIsDeleting(false)
          setTextIndex((textIndex + 1) % typewriterMessages.length)
        }
      }
    }, isDeleting ? 50 : 100) // Faster deletion, slower typing
    
    return () => clearTimeout(timeout)
  }, [currentIndex, isDeleting, textIndex, typewriterMessages])

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
    <div style={container} className="responsive-homepage">
      {/* Hero Section */}
      <div style={heroSection} className="hero-section">
        <div style={heroBackground}></div>
        <div style={heroContent}>
          <div style={heroText}>
            <h1 style={heroTitle} className="hero-title">
              <>
                <span style={heroTitleHighlight}>FARM</span>
                <span style={heroTitleNumber}>2</span>
                <span style={heroTitleHighlight}>HOME</span>
              </>
            </h1>
            <p style={heroSubtitle} className="hero-subtitle">Connecting Farmers Directly to Consumers</p>
            <p style={heroDescription} className="hero-description">
              {currentText}
              <span style={cursorStyle}>|</span>
            </p>
            <div style={ctaButtons} className="cta-buttons">
              <button 
                onClick={() => navigate('/farmer')}
                style={secondaryBtn}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                title="Go to Farmer Dashboard"
              >
                <FaLeaf style={{ marginRight: '8px' }} />
                {t('join_as_farmer') || 'Join as Farmer'}
              </button>
              <button 
                onClick={() => navigate('/consumer')}
                style={secondaryBtn}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                title="Go to Consumer Dashboard"
              >
                <FaShoppingCart style={{ marginRight: '8px' }} />
                {t('shop_fresh_products') || 'Shop Fresh Products'}
              </button>
            </div>
          </div>
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
              {selectedRole === 'farmer' ? t('join_as_farmer') : t('shop_fresh_products')}
            </h2>
            <p style={loginCardSubtitle}>
              {selectedRole === 'farmer' 
                ? t('farmer_join_subtitle')
                : t('consumer_join_subtitle')
              }
            </p>

            {/* Form Type Toggle */}
            <div style={formToggleContainer}>
              <button 
                onClick={switchToLogin}
                style={{...formToggleButton, ...(formType === 'login' ? activeToggleButton : {})}}
              >
                {t('login')}
              </button>
              <button 
                onClick={switchToSignup}
                style={{...formToggleButton, ...(formType === 'signup' ? activeToggleButton : {})}}
              >
                {t('register')}
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
                    {t('phone')}
                  </button>
                  <button 
                    onClick={() => setLoginMethod('email')}
                    style={{...methodToggleButton, ...(loginMethod === 'email' ? activeMethodButton : {})}}
                  >
                    <FaEnvelope style={{ marginRight: '5px' }} />
                    {t('email')}
                  </button>
                </div>

                {loginMethod === 'phone' ? (
                  <div>
                    {!confirmationResult ? (
                      <div>
                        <div style={inputGroup}>
                          <input
                            type="tel"
                            placeholder={t('phone_placeholder')}
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
                          {loading ? t('sending') : t('send_otp')}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={inputGroup}>
                          <input
                            type="text"
                            placeholder={t('enter_otp')}
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
                          {loading ? t('verifying') : t('verify_otp')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleEmailLogin}>
                    <div style={inputGroup}>
                      <input
                        type="email"
                        placeholder={t('email_placeholder')}
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
                          placeholder={t('password_placeholder')}
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
                      {loading ? t('logging_in') : t('login')}
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
                    {t('phone')}
                  </button>
                  <button 
                    onClick={() => setLoginMethod('email')}
                    style={{...methodToggleButton, ...(loginMethod === 'email' ? activeMethodButton : {})}}
                  >
                    <FaEnvelope style={{ marginRight: '5px' }} />
                    {t('email')}
                  </button>
                </div>

                {loginMethod === 'phone' ? (
                  <div>
                    {!confirmationResult ? (
                      <div>
                        <div style={inputGroup}>
                          <input
                            type="tel"
                            placeholder={t('phone_placeholder')}
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
                          {loading ? t('sending') : t('send_otp')}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div style={inputGroup}>
                          <input
                            type="text"
                            placeholder={t('enter_otp')}
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
                          {loading ? t('verifying') : t('create_account')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSignup}>
                    <div style={inputGroup}>
                      <input
                        type="email"
                        placeholder={t('email_placeholder')}
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
                          placeholder={t('password_placeholder')}
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
                        placeholder={t('confirm_password_placeholder')}
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
                      {loading ? t('creating_account') : t('create_account')}
                    </button>
                  </form>
                )}
              </div>
            )}

            <div style={loginCardFeatures}>
              {selectedRole === 'consumer' && (
                <>
                  <div style={featureItem}>✓ {t('fresh_produce_farms')}</div>
                  <div style={featureItem}>✓ {t('direct_pricing')}</div>
                  <div style={featureItem}>✓ {t('support_agriculture')}</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      <div id="stats-section" style={statsSection}>
        <div style={statsGrid} className="stats-grid">
          <div style={statCard}>
            <FaUsers style={statIcon} />
            <h3 style={statNumber}>{Math.round(animatedStats.farmers).toLocaleString()}+</h3>
            <p style={statLabel}>{t('active_farmers')}</p>
          </div>
          <div style={statCard}>
            <FaShoppingCart style={statIcon} />
            <h3 style={statNumber}>{Math.round(animatedStats.consumers).toLocaleString()}+</h3>
            <p style={statLabel}>{t('happy_consumers')}</p>
          </div>
          <div style={statCard}>
            <FaLeaf style={statIcon} />
            <h3 style={statNumber}>{Math.round(animatedStats.products).toLocaleString()}+</h3>
            <p style={statLabel}>{t('fresh_products')}</p>
          </div>
          <div style={statCard}>
            <FaStar style={statIcon} />
            <h3 style={statNumber}>{Number(animatedStats.satisfaction).toFixed(2)}%</h3>
            <p style={statLabel}>{t('satisfaction_rate')}</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ ...featuresSection, ...homepageTextShadow }}>
        <h2 style={sectionTitle}>{t('why_choose_us')}</h2>
        <div style={featuresGrid} className="features-grid">
          {[
            { icon: FaLeaf, title: t('feature_fresh_title'), desc: t('feature_fresh_desc'), color: '#28a745' },
            { icon: FaChartLine, title: t('feature_pricing_title'), desc: t('feature_pricing_desc'), color: '#ff6b35' },
            { icon: FaUsers, title: t('feature_community_title'), desc: t('feature_community_desc'), color: '#4ecdc4' },
            { icon: FaMapMarkerAlt, title: t('feature_local_title'), desc: t('feature_local_desc'), color: '#45b7d1' }
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
        <h2 style={sectionTitle}>{t('how_it_works')}</h2>
        <div style={stepsContainer}>
          {[
            { number: '1', title: t('step_1_title'), desc: t('step_1_desc'), icon: FaUsers },
            { number: '2', title: t('step_2_title'), desc: t('step_2_desc'), icon: FaHandshake },
            { number: '3', title: t('step_3_title'), desc: t('step_3_desc'), icon: FaTruck }
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
        <h2 style={sectionTitle}>{t('what_users_say')}</h2>
        <div style={testimonialsCarousel}>
          <div style={testimonialsSlider}>
            {[0, 1, 2].map((offset) => {
              const testimonialIndex = (currentTestimonialIndex + offset) % testimonials.length;
              const testimonial = testimonials[testimonialIndex];
              return (
                <div 
                  key={`${currentTestimonialIndex}-${offset}`}
                  style={{
                    ...testimonialCard,
                    transform: `translateX(${offset * 103}%)`,
                  }}
                >
                  <div style={testimonialHeader}>
                    <FaQuoteLeft style={{ fontSize: '1.5rem', color: '#28a745', opacity: 0.3 }} />
                    <div style={ratingContainer}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} style={{ color: '#ffd700', fontSize: '0.9rem' }} />
                      ))}
                    </div>
                  </div>
                  <p style={testimonialText}>{testimonial.text}</p>
                  <div style={testimonialAuthor}>
                    <div style={authorAvatar}>
                      <FaUsers style={{ fontSize: '1.2rem', color: '#28a745' }} />
                    </div>
                    <div>
                      <h4 style={authorName}>{testimonial.name}</h4>
                      <p style={authorRole}>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer - Farm2Home Design */}
      <div className="footer-wrapper">
        {/* Curved Top SVG */}
        <div className="footer-curve">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{display: 'block', width: '100%', height: '120px', fill: '#157F3D'}}>
            <path d="M0,120 L0,80 Q600,0 1200,80 L1200,120 Z"></path>
          </svg>
        </div>

        {/* Main Footer Content */}
        <div className="footer-content">
          <div className="footer-columns">

            {/* Menu Column */}
            <div className="footer-col">
              <h3 className="footer-col-header">MENU</h3>
              <ul className="footer-links">
                <li className="footer-link-item" onClick={() => navigate('/')}>
                  <span className="footer-link">Home</span>
                </li>
                <li className="footer-link-item" onClick={() => navigate('/about')}>
                  <span className="footer-link">About Us</span>
                </li>
                <li className="footer-link-item">
                  <span className="footer-link">Contact Us</span>
                </li>
                <li className="footer-link-item">
                  <span className="footer-link">FAQs</span>
                </li>
                <li className="footer-link-item">
                  <span className="footer-link">Why Farm2Home?</span>
                </li>
              </ul>
            </div>

            {/* Contacts Column */}
            <div className="footer-col">
              <h3 className="footer-col-header">CONTACTS</h3>
              <p className="contact-paragraph"><strong>Farm2Home Corporate Office</strong></p>
              <p className="contact-paragraph">
                Agricultural Innovation Center,<br/>
                HITEC City, Hyderabad,<br/>
                Telangana - 500081
              </p>
              <p className="contact-paragraph">
                <a href="tel:+919876543210" className="highlight-phone">+91 9876543210</a>
              </p>
              <p className="contact-paragraph">
                <a href="mailto:info@farm2home.in" className="contact-email">info@farm2home.in</a>
              </p>
            </div>

            {/* Download App Column */}
            <div className="footer-col">
              <h3 className="footer-col-header">DOWNLOAD THE APP</h3>
              <button className="app-btn">
                <FaApple style={{fontSize: '24px'}} />
                <div>
                  <div style={{fontSize: '10px'}}>Download on the</div>
                  <div style={{fontSize: '14px', fontWeight: 'bold'}}>App Store</div>
                </div>
              </button>
              <button className="app-btn">
                <FaGooglePlay style={{fontSize: '24px'}} />
                <div>
                  <div style={{fontSize: '10px'}}>Get it on</div>
                  <div style={{fontSize: '14px', fontWeight: 'bold'}}>Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Social Media & Copyright */}
          <div className="social-row">
            <div className="social-icons-container">
              <a href="#" className="social-icon"><FaFacebookF /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaLinkedinIn /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
            </div>
            <div className="copyright-text">
              &copy; 2025, Farm2Home | Privacy Policy | Sitemap | Terms & Conditions
            </div>
          </div>
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
  background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.8) 0%, rgba(32, 201, 151, 0.8) 100%), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"), url("https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80")',
  backgroundSize: 'cover, cover, cover',
  backgroundPosition: 'center, center, center',
  backgroundBlendMode: 'overlay, normal, normal',
  color: 'white',
  minHeight: '100vh',
  textAlign: 'center',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: '0 20px',
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
  padding: '0 20px',
};

const heroText = {
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
};

const heroTitle = {
  fontSize: '3.5rem',
  fontWeight: 'bold',
  marginBottom: '20px',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
};

const heroTitleHighlight = {
  color: '#1e40af',
  fontFamily: '"Bell MT", serif',
};

const heroTitleNumber = {
  color: '#1e40af',
  fontWeight: 'bold',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  fontFamily: '"Bell MT", serif',
};

const heroSubtitle = {
  fontSize: '1.8rem',
  marginBottom: '20px',
  color: '#1e40af',
  opacity: 1,
  fontWeight: '500',
  textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
};

const heroDescription = {
  fontSize: '1.2rem',
  marginBottom: '40px',
  color: '#000000',
  opacity: 1,
  lineHeight: 1.6,
  height: '96px', // Fixed pixel height to prevent any movement
  width: '100%', // Full width to prevent horizontal movement
  overflow: 'hidden',
  textAlign: 'left',
  position: 'relative',
  display: 'block', // Changed from flex to block
  textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
};

const cursorStyle = {
  animation: 'blink 1s infinite',
  marginLeft: '2px',
  fontWeight: 'bold',
  display: 'inline',
  color: '#000000',
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

const testimonialsCarousel = {
  maxWidth: '1200px',
  margin: '0 auto',
  position: 'relative',
};

const testimonialsSlider = {
  position: 'relative',
  width: '100%',
  height: '280px',
  overflow: 'hidden',
  display: 'flex',
};

const testimonialCard = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '32%',
  height: '100%',
  background: '#f8f9fa',
  padding: '25px',
  borderRadius: '12px',
  border: '1px solid #e9ecef',
  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
  fontSize: '0.9rem',
  color: '#333',
  lineHeight: 1.5,
  marginBottom: '15px',
  fontStyle: 'italic',
};

const testimonialAuthor = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
};

const authorAvatar = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#28a745',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
};

const authorName = {
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 3px 0',
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
  
  /* Footer Link Hover Effects */
  .footer-link:hover {
    color: #ffffff !important;
  }
  
  /* Footer Responsive Styles */
  @media (max-width: 1024px) {
    footer > div {
      padding: 60px 40px 30px !important;
    }
  }
  
  @media (max-width: 768px) {
    footer > div > div:nth-child(2) {
      flex-direction: column !important;
      padding-left: 0 !important;
      gap: 30px !important;
    }
    
    footer > div > div:first-child {
      position: static !important;
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
    }
  }
  
  /* HomePage Responsive Styles */
  @media (max-width: 1200px) {
    .hero-section {
      padding: 60px 15px !important;
    }
    
    .hero-title {
      font-size: 2.8rem !important;
    }
    
    .hero-subtitle {
      font-size: 1.1rem !important;
    }
    
    .cta-buttons {
      flex-direction: row !important;
      gap: 15px !important;
    }
  }
  
  @media (max-width: 768px) {
    .hero-section {
      padding: 50px 10px !important;
      text-align: center !important;
    }
    
    .hero-title {
      font-size: 2.2rem !important;
      line-height: 1.2 !important;
      margin-bottom: 15px !important;
    }
    
    .hero-subtitle {
      font-size: 1rem !important;
      margin-bottom: 20px !important;
    }
    
    .hero-description {
      font-size: 1rem !important;
      height: auto !important;
      margin-bottom: 30px !important;
    }
    
    .cta-buttons {
      flex-direction: column !important;
      gap: 12px !important;
      align-items: center !important;
    }
    
    .cta-buttons button {
      width: 100% !important;
      max-width: 280px !important;
      padding: 12px 20px !important;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 20px !important;
    }
    
    .features-grid {
      grid-template-columns: 1fr !important;
      gap: 15px !important;
    }
    
    .testimonials-carousel {
      padding: 40px 10px !important;
    }
  }
  
  @media (max-width: 480px) {
    .hero-section {
      padding: 40px 8px !important;
    }
    
    .hero-title {
      font-size: 1.8rem !important;
      margin-bottom: 10px !important;
    }
    
    .hero-subtitle {
      font-size: 0.9rem !important;
      margin-bottom: 15px !important;
    }
    
    .hero-description {
      font-size: 0.9rem !important;
      margin-bottom: 25px !important;
    }
    
    .cta-buttons button {
      padding: 10px 16px !important;
      font-size: 0.9rem !important;
    }
    
    .stats-grid {
      grid-template-columns: 1fr !important;
      gap: 15px !important;
    }
    
    .stat-card {
      padding: 20px 15px !important;
    }
    
    .stat-number {
      font-size: 1.8rem !important;
    }
    
    .stat-label {
      font-size: 0.9rem !important;
    }
    
    .section-title {
      font-size: 1.8rem !important;
      margin-bottom: 30px !important;
    }
    
    .testimonials-carousel {
      padding: 30px 8px !important;
    }
    
    .testimonial-card {
      padding: 15px !important;
      margin: 0 5px !important;
    }
  }
  
  @media (max-width: 360px) {
    .hero-section {
      padding: 30px 5px !important;
    }
    
    .hero-title {
      font-size: 1.5rem !important;
    }
    
    .hero-subtitle {
      font-size: 0.8rem !important;
    }
    
    .hero-description {
      font-size: 0.8rem !important;
    }
    
    .cta-buttons button {
      padding: 8px 12px !important;
      font-size: 0.8rem !important;
    }
    
    .stat-number {
      font-size: 1.5rem !important;
    }
    
    .section-title {
      font-size: 1.5rem !important;
      margin-bottom: 20px !important;
    }
  }
`;
document.head.appendChild(style);

// New Footer Styles
const newFooter = {
  background: 'linear-gradient(135deg, #1e7e34 0%, #28a745 100%)',
  color: 'white',
  padding: '0',
  position: 'relative',
  marginTop: '-1px',
  overflow: 'visible',
};

const newFooterContent = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '50px 80px 30px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  position: 'relative',
  gap: '80px',
};

const footerLogo = {
  display: 'flex',
  alignItems: 'flex-start',
  marginTop: '-80px',
  marginLeft: '0',
  position: 'relative',
  zIndex: 10,
  flexShrink: 0,
};

const logoCircle = {
  width: '180px',
  height: '180px',
  borderRadius: '50%',
  border: '7px solid white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  padding: '30px',
  boxSizing: 'border-box',
  boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
};

const logoText = {
  fontSize: '22px',
  fontWeight: 'bold',
  margin: 0,
  textAlign: 'center',
  lineHeight: '1.1',
  color: 'white',
  textTransform: 'lowercase',
};

const footerMenuSection = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '20px',
  minWidth: '150px',
};

const footerMenuTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '22px',
  color: 'white',
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
};

const footerMenuList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const footerMenuItem = {
  fontSize: '16px',
  color: 'white',
  cursor: 'pointer',
  margin: 0,
  transition: 'all 0.3s ease',
  fontWeight: '400',
  padding: '2px 0',
};

const footerContactsSection = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '20px',
  minWidth: '250px',
};

const footerContactsTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '22px',
  color: 'white',
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
};

const footerContactInfo = {
  display: 'flex',
  flexDirection: 'column',
};

const footerContactText = {
  fontSize: '15px',
  color: 'rgba(255, 255, 255, 0.95)',
  margin: '4px 0',
  lineHeight: '1.6',
  fontWeight: '400',
};

const footerContactPhone = {
  fontSize: '16px',
  color: 'white',
  fontWeight: 'bold',
  margin: '8px 0 5px 0',
};

const footerContactEmail = {
  fontSize: '15px',
  color: 'white',
  margin: '2px 0',
};

const downloadSection = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '20px',
  alignItems: 'flex-start',
  minWidth: '340px',
};

const downloadTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '22px',
  color: 'white',
  letterSpacing: '1.2px',
  textTransform: 'uppercase',
};

const downloadButtons = {
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
  marginBottom: '25px',
  flexWrap: 'wrap',
};

const appButton = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'white',
  borderRadius: '10px',
  padding: '10px 16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: 'none',
  minWidth: '160px',
  boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
};

const appIcon = {
  fontSize: '32px',
  color: '#000',
  marginRight: '12px',
};

const appButtonText = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const downloadOn = {
  fontSize: '10px',
  color: '#666',
  lineHeight: '1',
  marginBottom: '3px',
};

const storeName = {
  fontSize: '15px',
  color: '#000',
  fontWeight: 'bold',
  lineHeight: '1.2',
};

const socialMediaIcons = {
  display: 'flex',
  gap: '20px',
  marginTop: '10px',
};

const socialIcon = {
  fontSize: '32px',
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  opacity: 0.95,
};

const newFooterBottom = {
  padding: '20px 80px',
  marginTop: '30px',
  textAlign: 'left',
};

const copyrightText = {
  fontSize: '13px',
  color: 'rgba(255, 255, 255, 0.95)',
  margin: 0,
  fontWeight: '300',
};

// Footer Styles - Based on provided HTML/CSS
const footerWrapper = {
  position: 'relative',
  marginTop: '100px',
  color: 'white',
  filter: 'drop-shadow(0 -5px 10px rgba(0,0,0,0.05))',
};

const footerLogoStyle = {
  width: '200px',
  height: '200px',
  background: 'white',
  borderRadius: '50%',
  position: 'absolute',
  top: '-150px',
  left: '10%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  zIndex: 10,
  overflow: 'hidden',
};

const footerCurve = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  overflow: 'hidden',
  lineHeight: 0,
  transform: 'translateY(-99%)',
};

const footerContentStyle = {
  backgroundColor: '#157F3D',
  padding: '20px 20px 10px',
  position: 'relative',
};

const footerColumnsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  maxWidth: '1200px',
  margin: '0 auto',
  paddingTop: '0',
};

const colStyle = {
  flex: 1,
  minWidth: '250px',
  marginBottom: '10px',
  padding: '0 15px',
};

const colHeaderStyle = {
  fontSize: '16px',
  fontWeight: '700',
  marginBottom: '15px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const footerLinksStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const footerLinkItemStyle = {
  marginBottom: '10px',
  color: '#e0e0e0',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontWeight: '400',
};

const contactInfoStyle = {};

const contactParagraphStyle = {
  fontSize: '14px',
  lineHeight: '1.6',
  marginBottom: '8px',
  color: '#e0e0e0',
};

const highlightPhoneStyle = {
  fontWeight: 'bold',
  color: 'white',
  fontSize: '15px',
  marginBottom: '8px',
};

const contactEmailStyle = {
  color: '#e0e0e0',
  fontSize: '14px',
  marginBottom: '8px',
};

const appBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  background: 'white',
  color: 'black',
  borderRadius: '8px',
  padding: '8px 12px',
  marginBottom: '10px',
  textDecoration: 'none',
  width: 'fit-content',
  border: '1px solid #ddd',
  transition: 'transform 0.2s',
  cursor: 'pointer',
};

const appTextStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const appTextSpanStyle = {
  display: 'block',
  fontSize: '10px',
  color: '#555',
};

const appTextStrongStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 'bold',
};

const socialRowStyle = {
  textAlign: 'center',
  marginTop: '15px',
  paddingTop: '12px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
};

const socialIconsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '25px',
  marginBottom: '10px',
};

const socialLinkIconStyle = {
  color: 'white',
  transition: 'opacity 0.3s',
  cursor: 'pointer',
  textDecoration: 'none',
};

const copyrightStyle = {
  textAlign: 'center',
  fontSize: '12px',
  color: '#bbb',
  marginTop: '8px',
  paddingBottom: '8px',
};

export default HomePage