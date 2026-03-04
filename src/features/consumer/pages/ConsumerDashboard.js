import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase';
import { findCropByKeyword } from '../../../data/cropData';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import {
  FaShoppingCart, FaLeaf, FaHandshake, FaRupeeSign, FaTruck,
  FaShieldAlt, FaHeart, FaBox,
  FaUsers, FaCheckCircle, FaSearch, FaThLarge,
  FaSlidersH, FaPlusCircle, FaMapMarkerAlt, FaCoins,
  FaStar, FaPhone, FaRobot, FaBell, FaChevronRight,
  FaRegClock, FaLock, FaFlag, FaEdit, FaTrash, FaSave, FaTimes as FaX, FaComments,
} from 'react-icons/fa';
import ChatModal from '../../../shared/components/ChatModal/ChatModal';
import ProductCard from '../components/ProductCard/ProductCard';
import SearchBar from '../components/Filters/SearchBar';
import FilterSection from '../components/Filters/FilterSection';
import ShippingAddressModal from '../components/ShippingAddressModal/ShippingAddressModal';
import RequestCropModal from '../components/RequestCropModal/RequestCropModal';
import ComplaintModal from '../../../shared/components/ComplaintModal/ComplaintModal';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { useFilters } from '../hooks/useFilters';
import { useProducts } from '../hooks/useProducts';
import { useMarketDemands } from '../hooks/useMarketDemands';
import { useToast } from '../../../context/ToastContext';
import './ConsumerDashboard.css';

const AVATAR_PALETTE = ['#FFBF00','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#BE6DB7','#F7A738','#2ECC71'];
const getAvatarColor = (name) => AVATAR_PALETTE[((name||'U').charCodeAt(0)-65+26)%AVATAR_PALETTE.length];
const getGreeting = () => { const h=new Date().getHours(); return h<12?'Good morning':h<17?'Good afternoon':'Good evening'; };

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const { products: firestoreProducts, loading } = useProducts({ realtime: true });
  const productsToUse = firestoreProducts;
  const { addToCart, getTotalItems } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, sortBy, setSortBy, organicOnly, setOrganicOnly, filteredProducts, resetFilters } = useFilters(productsToUse);
  const [userProfile, setUserProfile] = useState({ name:'', photoURL:'', email:'', phone:'' });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ name:'', phone:'' });
  const [editProfileSaving, setEditProfileSaving] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [editingDemand, setEditingDemand] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const { myDemands, submitDemand, acceptOffer, markReceived, submitReview, deleteDemand, updateDemand } = useMarketDemands();
  const { success: toastSuccess, error: toastError } = useToast();
  const [complaintTarget, setComplaintTarget] = useState(null);
  const [reviewData, setReviewData] = useState({}); // { [demandId]: { rating, comment, submitting, error } }
  const [activeChatDemand, setActiveChatDemand] = useState(null);
  const categorySectionRef = useRef(null);
  const prevDemandsRef = useRef({});

  // Notify consumer when farmer submits an offer
  useEffect(() => {
    myDemands.forEach(d => {
      const prev = prevDemandsRef.current[d.id];
      if (prev && prev.status === 'open' && d.status === 'quoted') {
        toastSuccess(`🎉 A farmer submitted an offer for your "${d.cropName}" request! Review it below.`);
      }
      prevDemandsRef.current[d.id] = { status: d.status };
    });
  }, [myDemands]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let unsubSnap = null;
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (unsubSnap) { try { unsubSnap(); } catch (_) {} unsubSnap = null; }
      if (!user) return;
      unsubSnap = onSnapshot(
        doc(db, 'users', user.uid),
        (snap) => {
          const d = snap.data() || {};
          setUserProfile({ name: d.name||user.displayName||user.email?.split('@')[0]||'there', photoURL: d.photoURL||user.photoURL||'', email: user.email||'', phone: d.phoneNumber||d.phone||'' });
        },
        (err) => console.warn('ConsumerDashboard profile snapshot error:', err.message)
      );
    });
    return () => {
      try { unsubAuth(); } catch (_) {}
      if (unsubSnap) { try { unsubSnap(); } catch (_) {} }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 20);
      if (!categorySectionRef.current) return;
      const catBottom = categorySectionRef.current.getBoundingClientRect().bottom;
      const footer = document.querySelector('.cd-footer');
      const footerVisible = footer ? footer.getBoundingClientRect().top <= window.innerHeight - 60 : false;
      setShowSidebar(catBottom <= 100 && !footerVisible);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name:'All',             image:'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400', id:'all' },
    { name:'Fruits',          image:'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', id:'fruits' },
    { name:'Grains & Pulses', image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', id:'grains-pulses' },
    { name:'Leafy Greens',    image:'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400', id:'leafy-greens' },
    { name:'Spices',          image:'https://images.unsplash.com/photo-1596040033229-a0b83fd2f6dd?w=400', id:'spices' },
    { name:'Vegetables',      image:'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400', id:'vegetables' },
  ];

  const handleOpenEditProfile = () => {
    setEditProfileData({ name: userProfile.name, phone: userProfile.phone });
    setShowEditProfile(true);
  };

  const handleSaveEditProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const cleanPhone = editProfileData.phone.replace(/\D/g, '');
    if (!editProfileData.name.trim()) { toastError('Name cannot be empty'); return; }
    if (!cleanPhone || cleanPhone.length !== 10) { toastError('Enter a valid 10-digit phone number'); return; }
    setEditProfileSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: editProfileData.name.trim(),
        phoneNumber: cleanPhone,
        phone: cleanPhone,
        updatedAt: new Date().toISOString(),
      });
      toastSuccess('Profile updated successfully!');
      setShowEditProfile(false);
    } catch (err) {
      toastError('Failed to save profile: ' + err.message);
    } finally {
      setEditProfileSaving(false);
    }
  };

  const cartCount    = getTotalItems();
  const favCount     = favorites.length;
  const organicCount = productsToUse.filter(p => p.organic).length;
  const firstName    = (userProfile.name||'').split(' ')[0] || 'there';
  const activeDemandsCount = myDemands.filter(d => d.status === 'open' || d.status === 'quoted' || d.status === 'in_progress').length;

  const STATUS_CONFIG = {
    open:        { label:'Waiting for Offer',     bg:'#eff6ff', color:'#1d4ed8', dot:'#3b82f6', icon:'', step:1 },
    quoted:      { label:'Offer Received',        bg:'#fef3c7', color:'#b45309', dot:'#f59e0b', icon:'', step:2 },
    deal_closed: { label:'Deal Accepted',         bg:'#d1fae5', color:'#065f46', dot:'#10b981', icon:'', step:3 },
    in_progress: { label:'On the Way',            bg:'#ede9fe', color:'#6d28d9', dot:'#7c3aed', icon:'', step:4 },
    completed:   { label:'Received & Completed',  bg:'#dcfce7', color:'#15803d', dot:'#16a34a', icon:'', step:5 },
  };

  return (
    <div className="cd-root">
      {buyNowProduct && <ShippingAddressModal product={buyNowProduct} onClose={() => setBuyNowProduct(null)} onSuccess={() => navigate('/orders')} />}
      {showRequestModal && <RequestCropModal onClose={() => setShowRequestModal(false)} onSubmit={submitDemand} />}
      {editingDemand && (
        <RequestCropModal
          editMode
          initialData={editingDemand}
          onClose={() => setEditingDemand(null)}
          onSubmit={async (formData) => {
            const res = await updateDemand(editingDemand.id, formData);
            if (res.success) setEditingDemand(null);
            return res;
          }}
        />
      )}
      {complaintTarget && (
        <ComplaintModal
          reportedUser={{ id: complaintTarget.id, name: complaintTarget.name, role: 'farmer' }}
          contextId={complaintTarget.demandId}
          onClose={() => setComplaintTarget(null)}
        />
      )}
      {activeChatDemand && (
        <ChatModal demand={activeChatDemand} currentRole="consumer" onClose={() => setActiveChatDemand(null)} />
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditProfile && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={() => setShowEditProfile(false)}>
          <div style={{ background:'white', borderRadius:16, padding:28, width:'100%', maxWidth:420, boxShadow:'0 20px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ margin:0, fontSize:20, fontWeight:700, color:'#1f2937' }}>Edit Profile</h3>
              <button onClick={() => setShowEditProfile(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#6b7280', fontSize:18 }}><FaX /></button>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:5, color:'#374151' }}>Email (read-only)</label>
              <input type="email" value={userProfile.email} readOnly style={{ width:'100%', padding:'9px 12px', border:'1px solid #e5e7eb', borderRadius:8, fontSize:14, background:'#f9fafb', color:'#6b7280', boxSizing:'border-box' }} />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:5, color:'#374151' }}>Full Name</label>
              <input
                type="text"
                value={editProfileData.name}
                onChange={e => setEditProfileData(p => ({ ...p, name: e.target.value }))}
                style={{ width:'100%', padding:'9px 12px', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, boxSizing:'border-box' }}
                placeholder="Your full name"
              />
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:5, color:'#374151' }}>Phone Number <span style={{color:'#dc2626'}}>*</span></label>
              <input
                type="tel"
                value={editProfileData.phone}
                onChange={e => setEditProfileData(p => ({ ...p, phone: e.target.value }))}
                style={{ width:'100%', padding:'9px 12px', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, boxSizing:'border-box' }}
                placeholder="10-digit mobile number"
                maxLength={15}
              />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button
                onClick={handleSaveEditProfile}
                disabled={editProfileSaving}
                style={{ flex:1, padding:'10px', background: editProfileSaving ? '#9ca3af' : '#16a34a', color:'white', border:'none', borderRadius:8, fontWeight:600, cursor: editProfileSaving ? 'not-allowed' : 'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}
              >
                <FaSave style={{ fontSize:13 }} /> {editProfileSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setShowEditProfile(false)} style={{ padding:'10px 16px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:14 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* STICKY NAVBAR */}}
      <nav className={`cd-navbar ${navScrolled ? 'cd-navbar--scrolled' : ''}`}>
        <div className="cd-navbar-inner">
          <div className="cd-navbar-brand" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
            <div className="cd-navbar-logo"><FaLeaf /></div>
            <span className="cd-navbar-brand-name">Farm2Home</span>
          </div>

          <div className="cd-navbar-actions">
            <button className="cd-na-avatar" onClick={handleOpenEditProfile} title="Edit Profile">
              {userProfile.photoURL
                ? <img src={userProfile.photoURL} alt="avatar" className="cd-na-avatar-img" />
                : <div className="cd-na-avatar-letter" style={{background: getAvatarColor(userProfile.name)}}>{(userProfile.name||'U')[0].toUpperCase()}</div>
              }
            </button>
            <button className="cd-na-btn" onClick={() => navigate('/cart')}>
              <FaShoppingCart />
              {cartCount > 0 && <span className="cd-na-badge">{cartCount}</span>}
              <span>Cart</span>
            </button>
            <button className="cd-na-btn cd-na-request" onClick={() => setShowRequestModal(true)}>
              <FaPlusCircle />
              {activeDemandsCount > 0 && <span className="cd-na-badge cd-na-badge--amber">{activeDemandsCount}</span>}
              <span>Request</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="cd-hero">
        <div className="cd-hero-bg"></div>
        <div className="cd-hero-overlay"></div>
        <div className="cd-hero-content">
          <h1 className="cd-hero-title">
            Fresh from the Farm,<br />
            <span className="cd-hero-highlight">Straight to Your Door</span>
          </h1>
          <p className="cd-hero-sub">
            {getGreeting()}, <strong>{firstName}</strong>! Discover locally-sourced produce from farmers near you -- no middlemen, pure freshness.
          </p>
          <div className="cd-hero-search">
            <FaSearch className="cd-hs-icon" />
            <input className="cd-hs-input" placeholder="Search rice, tomato, mango, wheat..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="cd-hero-pills">
            {['Tomato','Onion','Rice','Mango','Wheat'].map(q => (
              <button key={q} className="cd-hero-pill" onClick={() => setSearchTerm(q)}>{q}</button>
            ))}
          </div>
        </div>
        <div className="cd-hero-stats">
          <div className="cd-hs-stat"><span className="cd-hs-num">{productsToUse.length}+</span><span className="cd-hs-lbl">Products</span></div>
          <div className="cd-hs-divider"></div>
          <div className="cd-hs-stat"><span className="cd-hs-num">{organicCount}</span><span className="cd-hs-lbl">Organic</span></div>
          <div className="cd-hs-divider"></div>
          <div className="cd-hs-stat"><span className="cd-hs-num">150+</span><span className="cd-hs-lbl">Farmers</span></div>
          <div className="cd-hs-divider"></div>
          <div className="cd-hs-stat"><span className="cd-hs-num">Rs.500+</span><span className="cd-hs-lbl">Free Delivery</span></div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="cd-trust">
        {[
          {icon:<FaShieldAlt/>, label:'Safe & Hygienic',   color:'#16a34a'},
          {icon:<FaLeaf/>,      label:'Farm Fresh Daily',  color:'#16a34a'},
          {icon:<FaHandshake/>, label:'Support Farmers',   color:'#7c3aed'},
          {icon:<FaStar/>,      label:'Quality Assured',   color:'#d97706'},
        ].map((t,i) => (
          <div key={i} className="cd-trust-item">
            <span className="cd-trust-icon" style={{color:t.color}}>{t.icon}</span>
            <span className="cd-trust-label">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="cd-container">

        {/* CROP REQUEST SECTION */}
        <section className="cd-request-section">
          <div className="cd-section-header">
            <div className="cd-section-title-wrap">
              <div>
                <h2 className="cd-section-title">Request a Crop</h2>
                <p className="cd-section-sub">Can't find what you need? Ask farmers directly</p>
              </div>
            </div>
            <button className="cd-request-btn" onClick={() => setShowRequestModal(true)}>
              <FaPlusCircle /> New Request
            </button>
          </div>

          {myDemands.length === 0 ? (
            <div className="cd-empty-requests">
              <h3>No requests yet</h3>
              <p>Submit your first request -- farmers in your area will bid with their best price.</p>
              <button className="cd-request-btn cd-request-btn--lg" onClick={() => setShowRequestModal(true)}>
                <FaPlusCircle /> Request a Crop Now
              </button>
            </div>
          ) : (
            <div className="cd-demand-cards">
              {myDemands.map(demand => {
                const sc = STATUS_CONFIG[demand.status] || {label:demand.status, bg:'#f3f4f6', color:'#374151', dot:'#9ca3af', icon:'•', step:0};
                return (
                  <div key={demand.id} className={`cd-demand-card cd-demand-card--${demand.status}`}>

                    {/* Progress bar */}
                    <div className="cd-demand-progress">
                      {[1,2,3,4].map(s => (
                        <div key={s} className={`cd-dp-step ${sc.step >= s ? 'cd-dp-step--done' : ''}`}>
                          <div className="cd-dp-dot"></div>
                          {s < 4 && <div className={`cd-dp-line ${sc.step > s ? 'cd-dp-line--done' : ''}`}></div>}
                        </div>
                      ))}
                    </div>

                    {/* Header */}
                    <div className="cd-demand-head">
                      <div className="cd-demand-crop-info">
                        <div className="cd-demand-icon">
                          {(() => {
                            const cropEntry = findCropByKeyword(demand.cropName?.toLowerCase?.() || '');
                            const imgSrc = cropEntry?.image;
                            return imgSrc
                              ? <img src={imgSrc} alt={demand.cropName} style={{width:44,height:44,borderRadius:10,objectFit:'cover',display:'block'}} />
                              : <FaLeaf style={{color:'#16a34a',fontSize:22}} />;
                          })()}
                        </div>
                        <div>
                          <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                            <div className="cd-demand-name">{demand.cropName}</div>
                            {demand.status === 'open' && (
                              <>
                                <button
                                  title="Edit Request"
                                  onClick={() => setEditingDemand(demand)}
                                  style={{display:'flex',alignItems:'center',gap:3,background:'#eff6ff',border:'1px solid #bfdbfe',color:'#2563eb',borderRadius:6,padding:'3px 8px',fontSize:11,fontWeight:600,cursor:'pointer',lineHeight:1}}
                                >
                                  <FaEdit style={{fontSize:10}}/> Edit
                                </button>
                                <button
                                  title="Delete Request"
                                  onClick={async () => {
                                    if (!window.confirm('Delete this request?')) return;
                                    const res = await deleteDemand(demand.id);
                                    if (!res.success) toastError(res.error || 'Failed to delete');
                                  }}
                                  style={{display:'flex',alignItems:'center',gap:3,background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',borderRadius:6,padding:'3px 8px',fontSize:11,fontWeight:600,cursor:'pointer',lineHeight:1}}
                                >
                                  <FaTrash style={{fontSize:10}}/> Delete
                                </button>
                              </>
                            )}
                          </div>
                          <div className="cd-demand-meta">
                            <FaBox style={{marginRight:4,fontSize:10}}/>{demand.quantityKg} kg &nbsp;·&nbsp;
                            <FaMapMarkerAlt style={{marginRight:4,fontSize:10}}/>{demand.location}
                          </div>
                        </div>
                      </div>
                      <div className="cd-demand-chip" style={{background:sc.bg, color:sc.color}}>
                        <span>{sc.icon}</span> {sc.label}
                      </div>
                    </div>

                    {/* AI price */}
                    {demand.suggestedPriceMin && demand.suggestedPriceMax && (
                      <div className="cd-ai-badge">
                        <FaRobot className="cd-ai-icon" />
                        <span>AI Fair Price: <strong>Rs.{demand.suggestedPriceMin}--Rs.{demand.suggestedPriceMax}/kg</strong></span>
                        {demand.suggestedPriceNote && <span className="cd-ai-note"> · {demand.suggestedPriceNote}</span>}
                      </div>
                    )}

                    {/* Farmer offer box */}
                    {demand.status === 'quoted' && demand.farmerOfferPrice && (
                      <div className="cd-offer-panel">
                        <div className="cd-offer-panel-title"><FaCoins /> Farmer's Offer</div>
                        <div className="cd-offer-panel-body">
                          <div className="cd-offer-farmer">{demand.committedFarmerName || 'A farmer'}</div>
                          <div className="cd-offer-price-big">
                            ₹{demand.farmerOfferDisplay || demand.farmerOfferPrice}
                            <span>/{demand.farmerOfferUnit || 'kg'}</span>
                          </div>
                          <div className="cd-offer-total">Total: ₹{(demand.quantityKg * demand.farmerOfferPrice).toLocaleString()}</div>
                        </div>
                        <button className="cd-accept-btn" onClick={async () => {
                          const res = await acceptOffer(demand.id);
                          if (!res.success) toastError(res.error || 'Failed to accept offer');
                        }}>
                          <FaCheckCircle /> Accept Offer &mdash; Close Deal
                        </button>
                        <button className="chat-trigger-btn" style={{marginTop:8,width:'100%',justifyContent:'center'}} onClick={() => setActiveChatDemand(demand)}>
                          <FaComments /> Chat with Farmer
                        </button>
                      </div>
                    )}

                    {/* Contact reveal — shown once deal is accepted */}
                    {['deal_closed','in_progress','completed'].includes(demand.status) && (
                      <div className="cd-contact-panel">
                        <div className="cd-contact-panel-title"><FaLock style={{marginRight:6,color:'#16a34a'}}/> Farmer Contact Revealed</div>
                        <div className="cd-contact-farmer">{demand.committedFarmerName}</div>
                        <a className="cd-contact-phone" href={`tel:${demand.farmerPhone}`}>
                          <FaPhone style={{marginRight:8}}/>{demand.farmerPhone || 'Not provided'}
                        </a>
                        <div className="cd-contact-agreed">
                          Agreed: ₹{demand.farmerOfferDisplay || demand.farmerOfferPrice}/{demand.farmerOfferUnit || 'kg'} · Total ₹{((demand.quantityKg||0)*(demand.farmerOfferPrice||0)).toLocaleString()}
                        </div>
                        <button className="chat-trigger-btn" style={{marginTop:8,width:'100%',justifyContent:'center'}} onClick={() => setActiveChatDemand(demand)}>
                          <FaComments /> Chat with Farmer
                        </button>
                      </div>
                    )}

                    {/* Mark as Received — shown when farmer marks in_progress */}
                    {demand.status === 'in_progress' && (
                      <button
                        className="cd-received-btn"
                        onClick={async () => {
                          const res = await markReceived(demand.id);
                          if (res.success) toastSuccess('Order marked as received!');
                          else toastError(res.error || 'Failed to update status');
                        }}
                      >
                        <FaCheckCircle style={{marginRight:8}}/> Mark as Received
                      </button>
                    )}

                    {/* Review form — shown only after completed */}
                    {demand.status === 'completed' && !demand.reviewed && (() => {
                      const rd = reviewData[demand.id] || {};
                      return (
                        <div className="cd-review-panel">
                          <div className="cd-review-title">Rate Your Experience</div>
                          <div className="cd-review-stars">
                            {[1,2,3,4,5].map(star => (
                              <button
                                key={star}
                                className={`cd-star-btn ${(rd.rating || 0) >= star ? 'cd-star-btn--active' : ''}`}
                                onClick={() => setReviewData(prev => ({ ...prev, [demand.id]: { ...prev[demand.id], rating: star } }))}
                              >
                                <FaStar />
                              </button>
                            ))}
                          </div>
                          <textarea
                            className="cd-review-textarea"
                            placeholder="How was the crop quality and farmer's service? (optional)"
                            rows={3}
                            value={rd.comment || ''}
                            onChange={e => setReviewData(prev => ({ ...prev, [demand.id]: { ...prev[demand.id], comment: e.target.value } }))}
                          />
                          {rd.error && <div className="cd-review-error">{rd.error}</div>}
                          <button
                            className="cd-review-submit-btn"
                            disabled={rd.submitting}
                            onClick={async () => {
                              if (!rd.rating) return setReviewData(prev => ({ ...prev, [demand.id]: { ...prev[demand.id], error: 'Please select a star rating.' } }));
                              setReviewData(prev => ({ ...prev, [demand.id]: { ...prev[demand.id], submitting: true, error: '' } }));
                              const res = await submitReview(
                                demand.id,
                                demand.committedFarmerId,
                                demand.committedFarmerName,
                                demand.cropName,
                                rd.rating,
                                rd.comment || ''
                              );
                              setReviewData(prev => ({ ...prev, [demand.id]: { ...prev[demand.id], submitting: false, error: res.success ? '' : (res.error || 'Failed') } }));
                            }}
                          >
                            {rd.submitting ? <span className="cd-spinner"/> : <><FaStar style={{marginRight:6}}/> Submit Review</>}
                          </button>
                        </div>
                      );
                    })()}

                    {/* Review submitted badge */}
                    {demand.status === 'completed' && demand.reviewed && (
                      <div className="cd-review-submitted">
                        <FaCheckCircle style={{marginRight:6, color:'#16a34a'}}/>
                        Review submitted — {'\u2605'.repeat(demand.reviewRating)}
                        {demand.reviewComment && <div className="cd-review-submitted-comment">"{demand.reviewComment}"</div>}
                      </div>
                    )}

                    {/* Footer meta */}
                    <div className="cd-demand-foot">
                      <FaRegClock style={{marginRight:5,fontSize:10}}/>
                      {demand.createdAt?.seconds ? new Date(demand.createdAt.seconds*1000).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : 'Just now'}
                      {demand.committedFarmerId && ['deal_closed', 'in_progress', 'completed'].includes(demand.status) && (
                        <button
                          className="report-trigger-btn"
                          style={{ marginLeft: 'auto' }}
                          title="You can report only after the deal has progressed"
                          onClick={() => setComplaintTarget({
                            id: demand.committedFarmerId,
                            name: demand.committedFarmerName || 'Farmer',
                            role: 'farmer',
                            demandId: demand.id,
                          })}
                        >
                          <FaFlag style={{ fontSize: 10 }} /> Report Farmer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* CATEGORIES */}
        <section className="cd-cats-section" ref={categorySectionRef}>
          <div className="cd-section-header">
            <div className="cd-section-title-wrap">
              <div>
                <h2 className="cd-section-title">Shop by Category</h2>
                <p className="cd-section-sub">Browse our freshest produce</p>
              </div>
            </div>
          </div>
          <div className="cd-cat-grid">
            {categories.map(cat => (
              <button type="button" key={cat.id} className={`cd-cat-card ${selectedCategory===cat.id?'cd-cat-card--active':''}`} onClick={() => setSelectedCategory(cat.id)}>
                <div className="cd-cat-img-wrap">
                  <img src={cat.image} alt={cat.name} loading="lazy" />
                  <div className="cd-cat-overlay"></div>

                </div>
                <span className="cd-cat-name">{cat.name}</span>
                {selectedCategory === cat.id && <span className="cd-cat-check"><FaCheckCircle /></span>}
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCTS */}
        <section className={`cd-products-section${showSidebar ? ' sidebar-open' : ''}`}>
          <aside className={`filters-sidebar ${showSidebar ? 'visible' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
            </div>
            <FilterSection
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              organicOnly={organicOnly}
              onOrganicToggle={setOrganicOnly}
              onResetFilters={resetFilters}
              categories={categories.map(c => ({ id: c.id, label: c.id === 'all' ? 'All Products' : c.name }))}
            />
          </aside>

          <div className="cd-products-area">
            {/* Products toolbar */}
            <div className="cd-products-toolbar">
              <div className="cd-pt-left">
                <h3 className="cd-pt-title">
                  {selectedCategory==='all' ? 'All Products' : (categories.find(c=>c.id===selectedCategory)?.name ?? 'Products')}
                </h3>
                <span className="cd-pt-count">{filteredProducts.length} items</span>
                {organicOnly && <span className="cd-pt-tag cd-pt-tag--organic"><FaLeaf /> Organic Only</span>}
              </div>
              <div className="cd-pt-right">
                <div className="cd-pt-search">
                  <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Filter results..." />
                </div>
                <div className="cd-view-btns">
                  <button className="cd-view-btn active" title="Grid"><FaThLarge /></button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="cd-loading">
                <div className="cd-loading-spinner"></div>
                <p>Fetching fresh products from farmers...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="products-grid-modern">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={p => addToCart(p,1)} onToggleFavorite={toggleFavorite} isFavorite={isFavorite(product.id)} onBuyNow={p => setBuyNowProduct(p)} />
                ))}
              </div>
            ) : (
              <div className="cd-no-products">
                <div className="cd-no-products-art"><FaLeaf style={{fontSize:48,color:'#16a34a'}}/></div>
                {productsToUse.length === 0 ? (
                  <><h3>No Crops Listed Yet</h3><p>Farmers haven't added crops yet -- check back soon, or request one above!</p></>
                ) : (
                  <><h3>No Products Found</h3><p>Try adjusting your filters or search term.</p><button className="cd-reset-btn" onClick={resetFilters}>Reset Filters</button></>
                )}
              </div>
            )}
          </div>
        </section>



      </div>{/* /cd-container */}

      {/* FOOTER */}
      <footer className="cd-footer">

        {/* Main columns */}
        <div className="cd-footer-inner">

          {/* Brand */}
          <div className="cd-footer-brand">
            <div className="cd-footer-logo"><FaLeaf /><span>Farm2Home</span></div>
            <p className="cd-footer-tagline">Connecting farmers and consumers for a healthier, sustainable India -- no middlemen, pure freshness.</p>

            <div className="cd-footer-contact">
              <div className="cd-fc-row"><FaPhone className="cd-fc-icon"/><span>+91 98765 43210</span></div>
              <div className="cd-fc-row"><FaMapMarkerAlt className="cd-fc-icon"/><span>Hyderabad, Telangana, India</span></div>
            </div>

            <div className="cd-footer-badges">
              <div className="cd-fb-badge"><FaShieldAlt className="cd-fb-icon"/><span>100% Secure</span></div>
              <div className="cd-fb-badge"><FaStar className="cd-fb-icon cd-fb-star"/><span>Rated 4.8/5</span></div>
              <div className="cd-fb-badge"><FaUsers className="cd-fb-icon"/><span>10k+ Users</span></div>
            </div>
          </div>

          {/* Shop */}
          <div className="cd-footer-col">
            <h4><FaLeaf className="cd-fcol-icon"/> Shop</h4>
            <ul>
              <li><a href="#vegetables"><FaChevronRight className="cd-flink-arr"/>Vegetables</a></li>
              <li><a href="#fruits"><FaChevronRight className="cd-flink-arr"/>Fruits</a></li>
              <li><a href="#grains"><FaChevronRight className="cd-flink-arr"/>Grains &amp; Pulses</a></li>
              <li><a href="#spices"><FaChevronRight className="cd-flink-arr"/>Spices</a></li>
              <li><a href="#organic"><FaChevronRight className="cd-flink-arr"/>Organic</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="cd-footer-col">
            <h4><FaHandshake className="cd-fcol-icon"/> Company</h4>
            <ul>
              <li><a href="#about"><FaChevronRight className="cd-flink-arr"/>About Us</a></li>
              <li><a href="#farmers"><FaChevronRight className="cd-flink-arr"/>Our Farmers</a></li>
              <li><a href="#careers"><FaChevronRight className="cd-flink-arr"/>Careers</a></li>
              <li><a href="#blog"><FaChevronRight className="cd-flink-arr"/>Blog</a></li>
              <li><a href="#contact"><FaChevronRight className="cd-flink-arr"/>Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="cd-footer-col">
            <h4><FaShieldAlt className="cd-fcol-icon"/> Support</h4>
            <ul>
              <li><a href="#faq"><FaChevronRight className="cd-flink-arr"/>FAQ</a></li>
              <li><a href="#shipping"><FaChevronRight className="cd-flink-arr"/>Shipping Policy</a></li>
              <li><a href="#returns"><FaChevronRight className="cd-flink-arr"/>Returns</a></li>
              <li><a href="#privacy"><FaChevronRight className="cd-flink-arr"/>Privacy Policy</a></li>
              <li><a href="#terms"><FaChevronRight className="cd-flink-arr"/>Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="cd-footer-bottom">
          <p className="cd-fb-copy">&copy; 2026 Farm2Home. All rights reserved.</p>
          <div className="cd-fb-links">
            <a href="#privacy">Privacy</a>
            <span className="cd-fb-dot"></span>
            <a href="#terms">Terms</a>
            <span className="cd-fb-dot"></span>
            <a href="#sitemap">Sitemap</a>
          </div>
        </div>

      </footer>
    </div>
  );
};

export default ConsumerDashboard;
