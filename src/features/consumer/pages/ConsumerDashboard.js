import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase';
import { findCropByKeyword } from '../../../data/cropData';
import { geoData } from '../../../locale/geoData';
import { doc, onSnapshot, updateDoc, collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import {
  FaLeaf, FaHandshake, FaRupeeSign, FaTruck,
  FaShieldAlt, FaHeart, FaBox,
  FaUsers, FaCheckCircle, FaThLarge,
  FaSlidersH, FaPlusCircle, FaMapMarkerAlt, FaCoins,
  FaStar, FaPhone, FaRobot, FaBell, FaChevronRight,
  FaRegClock, FaLock, FaFlag, FaEdit, FaTrash, FaSave, FaTimes as FaX, FaComments, FaCalendarAlt,
} from 'react-icons/fa';
import ChatModal from '../../../shared/components/ChatModal/ChatModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import ProductCard from '../components/ProductCard/ProductCard';
import SearchBar from '../components/Filters/SearchBar';
import FilterSection from '../components/Filters/FilterSection';
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

const getDemandUnit = (demand) => demand?.quantityUnit || 'kg';

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const normalizeGeoLabel = (value) => String(value || '').replace(/\s+/g, ' ').trim();

  const geoIndexes = React.useMemo(() => {
    const langs = ['en', 'te', 'hi', 'ta', 'ml', 'kn'];
    const stateLabelToKey = new Map();
    const districtLabelToKeyByState = new Map();

    langs.forEach((lng) => {
      const states = geoData?.[lng]?.states || {};
      Object.entries(states).forEach(([stateKey, label]) => {
        const normalized = normalizeGeoLabel(label);
        if (normalized) stateLabelToKey.set(normalized, stateKey);
      });
    });

    const stateKeys = Object.keys(geoData?.en?.districts || {});
    stateKeys.forEach((stateKey) => {
      const districtMap = new Map();
      langs.forEach((lng) => {
        const dists = geoData?.[lng]?.districts?.[stateKey] || {};
        Object.entries(dists).forEach(([districtKey, label]) => {
          const normalized = normalizeGeoLabel(label);
          if (normalized) districtMap.set(normalized, districtKey);
        });
      });
      districtLabelToKeyByState.set(stateKey, districtMap);
    });

    return { stateLabelToKey, districtLabelToKeyByState };
  }, []);

  const getDisplayLocation = (demand) => {
    const stateKey = demand?.locationStateKey;
    const districtKey = demand?.locationDistrictKey;

    if (stateKey && districtKey) {
      const districtFallback = geoData?.en?.districts?.[stateKey]?.[districtKey] || '';
      const stateFallback = geoData?.en?.states?.[stateKey] || '';
      const districtLabel = t(`dist_${districtKey}`, { defaultValue: districtFallback });
      const stateLabel = t(`state_${stateKey}`, { defaultValue: stateFallback });
      if (districtLabel && stateLabel) return `${districtLabel}, ${stateLabel}`;
    }

    const raw = normalizeGeoLabel(demand?.location);
    if (!raw) return '';

    const parts = raw.split(',').map(p => normalizeGeoLabel(p)).filter(Boolean);
    if (parts.length < 2) return raw;

    const districtRaw = parts[0];
    const stateRaw = parts.slice(1).join(', ');
    const inferredStateKey = geoIndexes.stateLabelToKey.get(stateRaw);
    if (!inferredStateKey) return raw;

    const inferredDistrictKey = geoIndexes.districtLabelToKeyByState
      .get(inferredStateKey)
      ?.get(districtRaw);

    const stateLabel = t(`state_${inferredStateKey}`, { defaultValue: geoData?.en?.states?.[inferredStateKey] || stateRaw });
    if (inferredDistrictKey) {
      const districtLabel = t(`dist_${inferredDistrictKey}`, {
        defaultValue: geoData?.en?.districts?.[inferredStateKey]?.[inferredDistrictKey] || districtRaw,
      });
      return `${districtLabel}, ${stateLabel}`;
    }

    // If the saved district is a mandal/village (not in our district list), keep it as-is,
    // but at least translate the state so it won't be stuck in one language.
    return `${districtRaw}, ${stateLabel}`;
  };

  const getDisplayCropName = (cropName) => {
    const raw = (cropName || '').toString();
    if (!raw) return '';
    const cropEntry = findCropByKeyword(raw.toLowerCase().trim());
    if (!cropEntry?.id) return raw;
    return t(`crop_${cropEntry.id}`, { defaultValue: raw || cropEntry.name });
  };

  const getLocaleForDate = () => {
    const lng = (i18n.language || 'en').toLowerCase();
    if (lng.startsWith('te')) return 'te-IN';
    if (lng.startsWith('hi')) return 'hi-IN';
    if (lng.startsWith('ta')) return 'ta-IN';
    if (lng.startsWith('ml')) return 'ml-IN';
    if (lng.startsWith('kn')) return 'kn-IN';
    return 'en-IN';
  };

  const getGreetingText = () => {
    const h = new Date().getHours();
    if (h < 12) return t('cd_greeting_morning');
    if (h < 17) return t('cd_greeting_afternoon');
    return t('cd_greeting_evening');
  };

  const formatRelTime = (ts) => {
    if (!ts) return null;
    const date = ts?.toDate ? ts.toDate() : ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return t('cd_time_just_now');
    if (diff < 3600) return t('cd_time_minutes_ago', { count: Math.floor(diff / 60) });
    if (diff < 86400) return t('cd_time_hours_ago', { count: Math.floor(diff / 3600) });
    if (diff < 604800) return t('cd_time_days_ago', { count: Math.floor(diff / 86400) });
    return date.toLocaleDateString(getLocaleForDate(), { day: 'numeric', month: 'short' });
  };
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
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedProductForRequest, setSelectedProductForRequest] = useState(null);
  const [editingDemand, setEditingDemand] = useState(null);
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'requested'
  const { myDemands, submitDemand, rejectOffer, acceptOffer, preponePickupDate, markReceived, submitReview, deleteDemand, updateDemand, cancelDeal } = useMarketDemands();
  const { success: toastSuccess, error: toastError } = useToast();
  const [complaintTarget, setComplaintTarget] = useState(null);
  const [reportedDemandIds, setReportedDemandIds] = useState(new Set());
  const [reviewData, setReviewData] = useState({}); // { [demandId]: { rating, comment, submitting, error } }
  const [activeChatDemand, setActiveChatDemand] = useState(null);
  // Accept date modal
  const [acceptDateModal, setAcceptDateModal] = useState(null); // demandId or null
  const [pickupDateInput, setPickupDateInput] = useState('');
  // Prepone date modal
  const [preponeDealId, setPreponeDealId] = useState(null);
  const [preponeDate, setPreponeDate] = useState('');
  const categorySectionRef = useRef(null);
  const prevDemandsRef = useRef({});
  const [farmerCount, setFarmerCount] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Fetch total farmer count for hero stats
  useEffect(() => {
    getCountFromServer(query(collection(db, 'users'), where('role', '==', 'farmer')))
      .then(snap => setFarmerCount(snap.data().count))
      .catch(() => setFarmerCount(null));
  }, []);

  // Fetch already-reported demand IDs for this user
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    getDocs(query(collection(db, 'complaints'), where('reporterId', '==', user.uid)))
      .then(snap => {
        const ids = new Set();
        snap.forEach(d => { if (d.data().contextId) ids.add(d.data().contextId); });
        setReportedDemandIds(ids);
      })
      .catch(() => {});
  }, []);

  // Notify consumer when farmer submits an offer
  useEffect(() => {
    myDemands.forEach(d => {
      const prev = prevDemandsRef.current[d.id];
      if (prev && prev.status === 'open' && d.status === 'quoted') {
        toastSuccess(t('cd_toast_offer_submitted', { cropName: d.cropName }));
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
          setUserProfile({ name: d.name||user.displayName||user.email?.split('@')[0]||'', photoURL: d.photoURL||user.photoURL||'', email: user.email||'', phone: d.phoneNumber||d.phone||'' });
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
    { name: t('cd_category_all'),             image:'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400', id:'all' },
    { name: t('cd_category_fruits'),          image:'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', id:'fruits' },
    { name: t('cd_category_grains_pulses'),   image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', id:'grains-pulses' },
    { name: t('cd_category_leafy_greens'),    image:'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400', id:'leafy-greens' },
    { name: t('cd_category_spices'),          image:'https://images.unsplash.com/photo-1596040033229-a0b83fd2f6dd?w=400', id:'spices' },
    { name: t('cd_category_vegetables'),      image:'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400', id:'vegetables' },
  ];

  const handleOpenEditProfile = () => {
    setEditProfileData({ name: userProfile.name, phone: userProfile.phone });
    setShowEditProfile(true);
  };

  const handleSaveEditProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const cleanPhone = editProfileData.phone.replace(/\D/g, '');
    if (!editProfileData.name.trim()) { toastError(t('cd_err_name_empty')); return; }
    if (!cleanPhone || cleanPhone.length !== 10) { toastError(t('cd_err_phone_invalid_10')); return; }
    setEditProfileSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: editProfileData.name.trim(),
        phoneNumber: cleanPhone,
        phone: cleanPhone,
        updatedAt: new Date().toISOString(),
      });
      toastSuccess(t('cd_profile_updated_success'));
      setShowEditProfile(false);
    } catch (err) {
      toastError(t('cd_failed_to_save_profile', { message: err.message }));
    } finally {
      setEditProfileSaving(false);
    }
  };

  const cartCount    = getTotalItems();
  const favCount     = favorites.length;
  const organicCount = productsToUse.filter(p => p.organic).length;
  const firstName    = (userProfile.name||'').split(' ')[0] || t('cd_user_fallback_name');
  const activeDemandsCount = myDemands.filter(d => d.status === 'open' || d.status === 'quoted' || d.status === 'in_progress').length;

  const handleBrowseCrops = () => {
    setActiveTab('available');
    // Let React paint the tab switch before scrolling.
    setTimeout(() => {
      document.querySelector('.cd-tabs-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const STATUS_CONFIG = {
    open:        { label: t('cd_status_waiting_for_offer'),    bg:'#eff6ff', color:'#1d4ed8', dot:'#3b82f6', icon:'', step:1 },
    quoted:      { label: t('cd_status_offer_received'),       bg:'#fef3c7', color:'#b45309', dot:'#f59e0b', icon:'', step:2 },
    deal_closed: { label: t('cd_status_deal_accepted'),        bg:'#d1fae5', color:'#065f46', dot:'#10b981', icon:'', step:3 },
    in_progress: { label: t('cd_status_on_the_way'),           bg:'#ede9fe', color:'#6d28d9', dot:'#7c3aed', icon:'', step:4 },
    completed:   { label: t('cd_status_received_completed'),   bg:'#dcfce7', color:'#15803d', dot:'#16a34a', icon:'', step:5 },
  };

  return (
    <>
      <div className="cd-root">
      {showRequestModal && <RequestCropModal onClose={() => { setShowRequestModal(false); setSelectedProductForRequest(null); }} onSubmit={submitDemand} initialProduct={selectedProductForRequest} />}
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
          onSuccess={(demandId) => setReportedDemandIds(prev => new Set([...prev, demandId]))}
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
              <h3 style={{ margin:0, fontSize:20, fontWeight:700, color:'#1f2937' }}>{t('cd_edit_profile_title')}</h3>
              <button onClick={() => setShowEditProfile(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#6b7280', fontSize:18 }}><FaX /></button>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:5, color:'#374151' }}>{t('cd_email_read_only_label')}</label>
              <input type="email" value={userProfile.email} readOnly style={{ width:'100%', padding:'9px 12px', border:'1px solid #e5e7eb', borderRadius:8, fontSize:14, background:'#f9fafb', color:'#6b7280', boxSizing:'border-box' }} />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:5, color:'#374151' }}>{t('cd_full_name_label')}</label>
              <input
                type="text"
                value={editProfileData.name}
                onChange={e => setEditProfileData(p => ({ ...p, name: e.target.value }))}
                style={{ width:'100%', padding:'9px 12px', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, boxSizing:'border-box' }}
                placeholder={t('cd_full_name_placeholder')}
              />
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:5, color:'#374151' }}>{t('cd_phone_number_label')} <span style={{color:'#dc2626'}}>*</span></label>
              <input
                type="tel"
                value={editProfileData.phone}
                onChange={e => setEditProfileData(p => ({ ...p, phone: e.target.value }))}
                style={{ width:'100%', padding:'9px 12px', border:'1px solid #d1d5db', borderRadius:8, fontSize:14, boxSizing:'border-box' }}
                placeholder={t('cd_phone_number_placeholder')}
                maxLength={15}
              />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button
                onClick={handleSaveEditProfile}
                disabled={editProfileSaving}
                style={{ flex:1, padding:'10px', background: editProfileSaving ? '#9ca3af' : '#16a34a', color:'white', border:'none', borderRadius:8, fontWeight:600, cursor: editProfileSaving ? 'not-allowed' : 'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}
              >
                <FaSave style={{ fontSize:13 }} /> {editProfileSaving ? t('cd_saving') : t('cd_save_changes')}
              </button>
              <button onClick={() => setShowEditProfile(false)} style={{ padding:'10px 16px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:14 }}>{t('cd_cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {/* STICKY NAVBAR */}
      {/* HERO */}
      <section className="cd-hero">
        <div className="cd-hero-bg"></div>
        <div
          className="cd-hero-overlay"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/crops/wheat.jpg)` }}
        ></div>
        <div className="cd-hero-content">
          <h1 className="cd-hero-title">
            {t('cd_hero_title_line1')}<br />
            <span className="cd-hero-highlight">{t('cd_hero_title_line2')}</span>
          </h1>
          <p className="cd-hero-sub">
            {getGreetingText()}, <strong>{firstName}</strong>! {t('cd_hero_sub_tail')}
          </p>
          <div className="cd-hero-actions">
            <button type="button" className="cd-hero-cta" onClick={handleBrowseCrops}>
              <FaBox /> {t('cd_browse_available_crops')}
            </button>
          </div>
        </div>
        <div className="cd-hero-stats">
          <div className="cd-hs-stat"><span className="cd-hs-num">{productsToUse.length}+</span><span className="cd-hs-lbl">{t('cd_stat_products')}</span></div>
          <div className="cd-hs-divider"></div>
          <div className="cd-hs-stat"><span className="cd-hs-num">{organicCount}</span><span className="cd-hs-lbl">{t('cd_stat_organic')}</span></div>
          <div className="cd-hs-divider"></div>
          <div className="cd-hs-stat"><span className="cd-hs-num">{farmerCount !== null ? `${farmerCount}+` : '150+'}</span><span className="cd-hs-lbl">{t('cd_stat_farmers')}</span></div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="cd-trust">
        {[
          {icon:<FaShieldAlt/>, label: t('cd_trust_safe_hygienic'),    color:'#16a34a'},
          {icon:<FaLeaf/>,      label: t('cd_trust_farm_fresh_daily'), color:'#16a34a'},
          {icon:<FaHandshake/>, label: t('cd_trust_support_farmers'),  color:'#7c3aed'},
          {icon:<FaStar/>,      label: t('cd_trust_quality_assured'),  color:'#d97706'},
        ].map((item,i) => (
          <div key={i} className="cd-trust-item">
            <span className="cd-trust-icon" style={{color:item.color}}>{item.icon}</span>
            <span className="cd-trust-label">{item.label}</span>
          </div>
        ))}
      </div>

      {/* DASHBOARD PARTITION / TABS */}
      <div className="cd-tabs-wrapper">
        <div className="cd-tabs-container">
          <button 
            className={`cd-tab-btn ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            <FaBox /> <span>{t('cd_tab_available_crops')}</span>
            {filteredProducts.length > 0 && <span className="cd-tab-count">{filteredProducts.length}</span>}
          </button>
          <button 
            className={`cd-tab-btn ${activeTab === 'requested' ? 'active' : ''}`}
            onClick={() => setActiveTab('requested')}
          >
            <FaHandshake /> <span>{t('cd_tab_my_requests')}</span>
            {activeDemandsCount > 0 && <span className="cd-tab-count">{activeDemandsCount}</span>}
          </button>
        </div>
      </div>

      <div className="cd-container">

        {/* CROP REQUEST SECTION */}
        {activeTab === 'requested' && (
          <section className="cd-request-section">
            <div className="cd-section-header">
            <div className="cd-section-title-wrap">
              <div>
                <h2 className="cd-section-title">{t('cd_request_crop_title')}</h2>
                <p className="cd-section-sub">{t('cd_request_crop_sub')}</p>
              </div>
            </div>
            <button className="cd-request-btn" onClick={() => setShowRequestModal(true)}>
              <FaPlusCircle /> {t('cd_new_request')}
            </button>
          </div>

          {myDemands.length === 0 ? (
            <div className="cd-empty-requests">
              <h3>{t('cd_no_requests_yet_title')}</h3>
              <p>{t('cd_no_requests_yet_sub')}</p>
              <button className="cd-request-btn cd-request-btn--lg" onClick={() => setShowRequestModal(true)}>
                <FaPlusCircle /> {t('cd_request_crop_now')}
              </button>
            </div>
          ) : (
            (() => {
              const PRIORITY = {3:0, 2:1, 1:2, 4:3, 5:4};
              const GROUP_LABELS = {
                3: { label: t('cd_group_deal_accepted'), color:'#065f46', bg:'#d1fae5', border:'#6ee7b7' },
                2: { label: t('cd_group_offer_received'), color:'#b45309', bg:'#fef3c7', border:'#fde68a' },
                1: { label: t('cd_group_waiting_for_offer'), color:'#1d4ed8', bg:'#eff6ff', border:'#bfdbfe' },
                4: { label: t('cd_group_in_progress_completed'), color:'#6d28d9', bg:'#ede9fe', border:'#c4b5fd' },
              };
              const getStep = d => (STATUS_CONFIG[d.status] || {step:0}).step;
              const getGroup = d => { const s = getStep(d); return s >= 4 ? 4 : s; };
              const sorted = [...myDemands].sort((a,b) => {
                const pa = PRIORITY[getGroup(a)] ?? 99;
                const pb = PRIORITY[getGroup(b)] ?? 99;
                return pa - pb;
              });
              const groups = [3,2,1,4].map(g => ({
                key: g,
                meta: GROUP_LABELS[g],
                items: sorted.filter(d => getGroup(d) === g),
              })).filter(g => g.items.length > 0);
              return groups.map((group, gi) => (
                <div key={group.key}>
                  <div style={{display:'flex', alignItems:'center', gap:10, margin: gi===0 ? '0 0 10px 0' : '18px 0 10px 0'}}>
                    <div style={{flex:1, height:1.5, background: group.meta.border, borderRadius:2}}></div>
                    <span style={{fontSize:11, fontWeight:700, color: group.meta.color, background: group.meta.bg, border:`1px solid ${group.meta.border}`, borderRadius:20, padding:'3px 12px', whiteSpace:'nowrap'}}>
                      {group.meta.label} ({group.items.length})
                    </span>
                    <div style={{flex:1, height:1.5, background: group.meta.border, borderRadius:2}}></div>
                  </div>
                  <div className="cd-demand-cards">
                    {group.items.map(demand => {
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
                    {demand.status !== 'quoted' && <div className="cd-demand-head">
                      {demand.status === 'open' ? (
                        /* Open card: full-width structured layout */
                        <div style={{width:'100%'}}>
                          {/* Row 1: crop image + name | status chip */}
                          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:6}}>
                            <div style={{display:'flex', alignItems:'center', gap:10}}>
                              <div className="cd-demand-icon">
                                {(() => {
                                  const cropEntry = findCropByKeyword(demand.cropName?.toLowerCase?.() || '');
                                  const imgSrc = cropEntry?.image;
                                  return imgSrc
                                    ? <img src={imgSrc} alt={getDisplayCropName(demand.cropName)} style={{width:44,height:44,borderRadius:10,objectFit:'cover',display:'block'}} />
                                    : <FaLeaf style={{color:'#16a34a',fontSize:22}} />;
                                })()}
                              </div>
                              <div className="cd-demand-name">{getDisplayCropName(demand.cropName)}</div>
                            </div>
                            <div className="cd-demand-chip" style={{background:sc.bg, color:sc.color}}>
                              <span>{sc.icon}</span> {sc.label}
                            </div>
                          </div>
                          {/* Row 2: qty left | location right */}
                          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:11, color:'#6b7280', marginBottom:8, paddingLeft:54}}>
                            <span style={{display:'flex',alignItems:'center',gap:3}}><FaBox style={{fontSize:9}}/>{demand.quantityKg} {getDemandUnit(demand)}</span>
                            {demand.location && <span style={{display:'flex',alignItems:'center',gap:3}}><FaMapMarkerAlt style={{fontSize:9, color:'#ef4444'}}/>{getDisplayLocation(demand)}</span>}
                          </div>
                          {/* Row 3: edit + delete */}
                          <div style={{display:'flex', alignItems:'center', gap:6, paddingLeft:54}}>
                            <button
                              title={t('cd_edit_request')}
                              onClick={() => setEditingDemand(demand)}
                              style={{display:'flex',alignItems:'center',gap:3,background:'#eff6ff',border:'1px solid #bfdbfe',color:'#2563eb',borderRadius:6,padding:'4px 10px',fontSize:11,fontWeight:600,cursor:'pointer'}}
                            >
                              <FaEdit style={{fontSize:10}}/> {t('cd_edit')}
                            </button>
                            <button
                              title={t('cd_delete_request')}
                              onClick={async () => {
                                setConfirmDialog({
                                  message: t('cd_delete_request_confirm'),
                                  confirmLabel: t('cd_delete'),
                                  danger: true,
                                  onConfirm: async () => {
                                    const res = await deleteDemand(demand.id);
                                    if (!res.success) toastError(res.error || t('cd_failed_to_delete'));
                                  },
                                });
                              }}
                              style={{display:'flex',alignItems:'center',gap:3,background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',borderRadius:6,padding:'4px 10px',fontSize:11,fontWeight:600,cursor:'pointer'}}
                            >
                              <FaTrash style={{fontSize:10}}/> {t('cd_delete')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Other statuses: original layout */
                        <>
                          <div className="cd-demand-crop-info">
                            <div className="cd-demand-icon">
                              {(() => {
                                const cropEntry = findCropByKeyword(demand.cropName?.toLowerCase?.() || '');
                                const imgSrc = cropEntry?.image;
                                return imgSrc
                                  ? <img src={imgSrc} alt={getDisplayCropName(demand.cropName)} style={{width:44,height:44,borderRadius:10,objectFit:'cover',display:'block'}} />
                                  : <FaLeaf style={{color:'#16a34a',fontSize:22}} />;
                              })()}
                            </div>
                            <div>
                              <div className="cd-demand-name">{getDisplayCropName(demand.cropName)}</div>
                              <div style={{fontSize:11, color:'#6b7280', marginTop:2, display:'flex', alignItems:'center', gap:6}}>
                                <span><FaBox style={{fontSize:9, marginRight:3}}/>{demand.quantityKg} {getDemandUnit(demand)}</span>
                                {demand.location && <span><FaMapMarkerAlt style={{fontSize:9, marginRight:2, color:'#ef4444'}}/>{getDisplayLocation(demand)}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="cd-demand-chip" style={{background:sc.bg, color:sc.color}}>
                            <span>{sc.icon}</span> {sc.label}
                          </div>
                        </>
                      )}
                    </div>}

                    {/* AI price */}
                    {demand.suggestedPriceMin && demand.suggestedPriceMax && (
                      <div className="cd-ai-badge">
                        <FaRobot className="cd-ai-icon" />
                        <span>{t('cd_ai_fair_price_label')}: <strong>Rs.{demand.suggestedPriceMin}--Rs.{demand.suggestedPriceMax}/{getDemandUnit(demand)}</strong></span>
                        {demand.suggestedPriceNote && <span className="cd-ai-note"> · {demand.suggestedPriceNote}</span>}
                      </div>
                    )}

                    {/* Farmer offer box */}
                    {demand.status === 'quoted' && demand.farmerOfferPrice && (
                      <div style={{ marginTop:12, background:'#fffbeb', border:'1.5px solid #fde68a', borderRadius:12, padding:'12px' }}>

                        {/* Row 0: crop image + name (left) | location (right) */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ width:44, height:44, borderRadius:10, overflow:'hidden', background:'#f0fdf4', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                              {(() => {
                                const cropEntry = findCropByKeyword(demand.cropName?.toLowerCase?.() || '');
                                return cropEntry?.image
                                  ? <img src={cropEntry.image} alt={getDisplayCropName(demand.cropName)} style={{width:44,height:44,objectFit:'cover',display:'block'}} />
                                  : <FaLeaf style={{color:'#16a34a',fontSize:20}} />;
                              })()}
                            </div>
                            <span style={{ fontSize:15, fontWeight:700, color:'#111827', textTransform:'capitalize' }}>{getDisplayCropName(demand.cropName)}</span>
                          </div>
                          <span style={{ fontSize:12, color:'#6b7280', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                            <FaMapMarkerAlt style={{ color:'#ef4444', fontSize:11 }} />{getDisplayLocation(demand)}
                          </span>
                        </div>

                        {/* Row 2: farmer name (left) | phone (right) */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <span style={{ fontSize:14, fontWeight:700, color:'#0ea5e9' }}>{demand.committedFarmerName || t('cd_a_farmer')}</span>
                            {(demand.farmerTotalDeals || 0) >= 5 && (
                              <span className="cd-verified-badge">✓ {t('cd_verified')}</span>
                            )}
                          </div>
                          <span style={{ fontSize:11, fontWeight:600, color:'#9ca3af', display:'flex', alignItems:'center', gap:4, background:'#f3f4f6', padding:'3px 8px', borderRadius:6, border:'1px dashed #d1d5db' }}>
                            🔒 {t('cd_accept_to_reveal_contact')}
                          </span>
                        </div>
                        {/* Row 3: QTY | RATE | TOTAL */}
                        {demand.farmerAvailableUntil && (
                          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:'#7c3aed', background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:7, padding:'5px 9px', marginBottom:8 }}>
                            <FaCalendarAlt style={{ fontSize:10 }} />
                            {t('cd_farmer_has_crop_until')}: <strong>{new Date(demand.farmerAvailableUntil + 'T00:00:00').toLocaleDateString(getLocaleForDate(), { day:'numeric', month:'short', year:'numeric' })}</strong>
                          </div>
                        )}
                        <div style={{ display:'flex', gap:6, marginBottom:10 }}>
                          <div style={{ flex:1, background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:8, padding:'6px 8px', textAlign:'center' }}>
                            <div style={{ fontSize:10, color:'#1e40af', fontWeight:600, marginBottom:2 }}>{t('cd_qty')}</div>
                            <div style={{ fontSize:13, fontWeight:700, color:'#1d4ed8' }}>{demand.quantityKg}<span style={{ fontSize:10 }}> {getDemandUnit(demand)}</span></div>
                          </div>
                          <div style={{ flex:1, background:'#fefce8', border:'1px solid #fde68a', borderRadius:8, padding:'6px 8px', textAlign:'center' }}>
                            <div style={{ fontSize:10, color:'#92400e', fontWeight:600, marginBottom:2 }}>{t('cd_rate')}</div>
                            <div style={{ fontSize:13, fontWeight:700, color:'#b45309' }}>₹{demand.farmerOfferDisplay || demand.farmerOfferPrice}<span style={{ fontSize:10 }}>/{demand.farmerOfferUnit || getDemandUnit(demand)}</span></div>
                          </div>
                          <div style={{ flex:1, background:'#f0fdf4', border:'1px solid #86efac', borderRadius:8, padding:'6px 8px', textAlign:'center' }}>
                            <div style={{ fontSize:10, color:'#166534', fontWeight:600, marginBottom:2 }}>{t('cd_total')}</div>
                            <div style={{ fontSize:13, fontWeight:700, color:'#15803d' }}>₹{(demand.quantityKg * demand.farmerOfferPrice).toLocaleString()}</div>
                          </div>
                        </div>
                        {/* Row 4: Accept | Chat */}
                        <div style={{ display:'flex', gap:6 }}>
                          <button
                            onClick={() => {
                              setAcceptDateModal(demand.id);
                              setPickupDateInput('');
                            }}
                            style={{ flex:1, padding:'8px 4px', background:'#f0fdf4', color:'#15803d', border:'1.5px solid #86efac', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}
                          >
                            <FaCheckCircle style={{fontSize:11}}/> {t('cd_accept')}
                          </button>
                          <button
                            className="chat-trigger-btn"
                            style={{ flex:1, justifyContent:'center', padding:'8px 4px', fontSize:12 }}
                            onClick={() => setActiveChatDemand(demand)}
                          >
                            <FaComments style={{ fontSize:11, marginRight:3 }} /> {t('cd_chat')}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Contact reveal — shown once deal is accepted */}
                    {['deal_closed','in_progress','completed'].includes(demand.status) && (
                      <div className="cd-contact-panel">
                        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:8}}>
                          <div style={{display:'flex', alignItems:'center', gap:6}}>
                            <div className="cd-contact-farmer" style={{margin:0, color:'#0ea5e9', fontWeight:700, fontSize:14}}>{demand.committedFarmerName}</div>
                            {(demand.farmerTotalDeals || 0) >= 5 && (
                              <span className="cd-verified-badge">✓ {t('cd_verified')}</span>
                            )}
                          </div>
                          <a className="cd-contact-phone" href={`tel:${demand.farmerPhone}`} style={{margin:0, color:'#b45309', fontWeight:600, fontSize:12}}>
                            <FaPhone style={{marginRight:6}}/>{demand.farmerPhone || t('cd_not_provided')}
                          </a>
                        </div>
                        {/* Agreed price partitions */}
                        <div style={{display:'flex', gap:6, marginBottom:8}}>
                          <div style={{flex:1, background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:8, padding:'6px 10px', textAlign:'center'}}>
                            <div style={{fontSize:10, color:'#1e40af', fontWeight:600, marginBottom:2}}>{t('cd_qty')}</div>
                            <div style={{fontSize:14, fontWeight:700, color:'#1d4ed8'}}>{demand.quantityKg}<span style={{fontSize:10, fontWeight:500}}> {getDemandUnit(demand)}</span></div>
                          </div>
                          <div style={{flex:1, background:'#fefce8', border:'1px solid #fde68a', borderRadius:8, padding:'6px 10px', textAlign:'center'}}>
                            <div style={{fontSize:10, color:'#92400e', fontWeight:600, marginBottom:2}}>{t('cd_rate')}</div>
                            <div style={{fontSize:14, fontWeight:700, color:'#b45309'}}>₹{demand.farmerOfferDisplay || demand.farmerOfferPrice}<span style={{fontSize:10, fontWeight:500, color:'#78350f'}}>/{demand.farmerOfferUnit || getDemandUnit(demand)}</span></div>
                          </div>
                          <div style={{flex:1, background:'#f0fdf4', border:'1px solid #86efac', borderRadius:8, padding:'6px 10px', textAlign:'center'}}>
                            <div style={{fontSize:10, color:'#166534', fontWeight:600, marginBottom:2}}>{t('cd_total')}</div>
                            <div style={{fontSize:14, fontWeight:700, color:'#15803d'}}>₹{((demand.quantityKg||0)*(demand.farmerOfferPrice||0)).toLocaleString()}</div>
                          </div>
                        </div>
                        {/* Pickup Date + Prepone */}
                        {['deal_closed','in_progress'].includes(demand.status) && (
                          <div style={{background:'#f0fdf4', border:'1.5px solid #86efac', borderRadius:9, padding:'9px 12px', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap'}}>
                            <div style={{display:'flex', alignItems:'center', gap:6}}>
                              <FaCalendarAlt style={{color:'#15803d', fontSize:12}}/>
                              <span style={{fontSize:12, fontWeight:600, color:'#166534'}}>{t('cd_pickup_date_label')}:</span>
                              <span style={{fontSize:13, fontWeight:700, color:'#15803d'}}>
                                {demand.pickupDate
                                  ? new Date(demand.pickupDate + 'T00:00:00').toLocaleDateString(getLocaleForDate(), { day:'numeric', month:'short', year:'numeric' })
                                  : t('cd_not_set')}
                              </span>
                            </div>
                            {demand.status === 'deal_closed' && (
                              <button
                                onClick={() => { setPreponeDealId(demand.id); setPreponeDate(''); }}
                                style={{fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:7, border:'1.5px solid #0369a1', background:'#e0f2fe', color:'#0369a1', cursor:'pointer'}}
                              >
                                ⏰ {t('cd_prepone')}
                              </button>
                            )}
                          </div>
                        )}
                        {/* Action buttons — deal_closed: Received + Cancel + Chat | in_progress: Received + Chat */}
                        {(demand.status === 'deal_closed' || demand.status === 'in_progress') && (
                        <div style={{display:'flex', gap:6, marginTop:8}}>
                          <button
                            onClick={async () => {
                              const res = await markReceived(demand.id);
                              if (res.success) toastSuccess(t('cd_order_marked_received_success'));
                              else toastError(res.error || t('cd_failed_generic'));
                            }}
                            style={{flex:1, padding:'8px 4px', background:'#f0fdf4', color:'#15803d', border:'1.5px solid #86efac', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4}}
                          >
                            <FaCheckCircle style={{fontSize:11}}/> {t('cd_mark_received')}
                          </button>
                          {demand.status === 'deal_closed' && (
                            <button
                              onClick={async () => {
                                const res = await cancelDeal(demand.id);
                                if (res.success) toastSuccess(t('cd_deal_cancelled_success'));
                                else toastError(res.error || t('cd_failed_to_cancel_deal'));
                              }}
                              style={{flex:1, padding:'8px 4px', background:'#fef2f2', color:'#dc2626', border:'1.5px solid #fca5a5', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4}}
                            >
                              <FaX style={{fontSize:11}}/> {t('cd_cancel_deal')}
                            </button>
                          )}
                          <button className="chat-trigger-btn" style={{flex:1, justifyContent:'center', padding:'8px 4px', fontSize:12}} onClick={() => setActiveChatDemand(demand)}>
                            <FaComments style={{fontSize:11, marginRight:3}}/> {t('cd_chat')}
                          </button>
                        </div>
                        )}
                      </div>
                    )}

                    {/* Review form — shown only after completed */}
                    {demand.status === 'completed' && !demand.reviewed && !reviewData[demand.id]?.submitted && (() => {
                      const rd = reviewData[demand.id] || {};
                      return (
                        <div className="cd-review-panel">
                          <div className="cd-review-title">{t('cd_rate_your_experience')}</div>
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
                            placeholder={t('cd_review_placeholder_optional')}
                            rows={3}
                            value={rd.comment || ''}
                            onChange={e => setReviewData(prev => ({ ...prev, [demand.id]: { ...prev[demand.id], comment: e.target.value } }))}
                          />
                          {rd.error && <div className="cd-review-error">{rd.error}</div>}
                          <button
                            className="cd-review-submit-btn"
                            disabled={rd.submitting}
                            onClick={async () => {
                              if (!rd.rating) return setReviewData(prev => ({ ...prev, [demand.id]: { ...prev[demand.id], error: t('cd_err_select_star_rating') } }));
                              setReviewData(prev => ({ ...prev, [demand.id]: { ...prev[demand.id], submitting: true, error: '' } }));
                              const res = await submitReview(
                                demand.id,
                                demand.committedFarmerId,
                                demand.committedFarmerName,
                                demand.cropName,
                                rd.rating,
                                rd.comment || ''
                              );
                              setReviewData(prev => ({
                                ...prev,
                                [demand.id]: {
                                  ...prev[demand.id],
                                  submitting: false,
                                  submitted: res.success ? true : (prev[demand.id]?.submitted || false),
                                  error: res.success ? '' : (res.error || t('cd_failed_generic')),
                                }
                              }));
                            }}
                          >
                            {rd.submitting ? <span className="cd-spinner"/> : <><FaStar style={{marginRight:6}}/> {t('cd_submit_review')}</>}
                          </button>
                        </div>
                      );
                    })()}

                    {/* Review submitted badge */}
                    {demand.status === 'completed' && (demand.reviewed || reviewData[demand.id]?.submitted) && (
                      <div className="cd-review-submitted">
                        <FaCheckCircle style={{marginRight:6, color:'#16a34a'}}/>
                        {t('cd_review_submitted')} — {'\u2605'.repeat(demand.reviewRating || reviewData[demand.id]?.rating || 0)}
                        {(demand.reviewComment || reviewData[demand.id]?.comment) && (
                          <div className="cd-review-submitted-comment">"{demand.reviewComment || reviewData[demand.id]?.comment}"</div>
                        )}
                      </div>
                    )}

                    {/* Footer meta */}
                    <div className="cd-demand-foot">
                      <FaRegClock style={{marginRight:5,fontSize:10}}/>
                      {demand.createdAt?.seconds ? new Date(demand.createdAt.seconds*1000).toLocaleDateString(getLocaleForDate(),{day:'numeric',month:'short'}) : t('cd_time_just_now')}
                      {formatRelTime(demand.updatedAt || demand.createdAt) && (
                        <span className="cd-last-updated">· {t('cd_updated')} {formatRelTime(demand.updatedAt || demand.createdAt)}</span>
                      )}
                      {demand.committedFarmerId && ['deal_closed', 'in_progress', 'completed'].includes(demand.status) && (
                        reportedDemandIds.has(demand.id)
                          ? <span style={{ marginLeft:'auto', fontSize:11, fontWeight:600, color:'#9ca3af', display:'flex', alignItems:'center', gap:4, padding:'3px 8px', background:'#f3f4f6', borderRadius:6, border:'1px solid #e5e7eb' }}>
                              <FaFlag style={{ fontSize:10 }} /> {t('cd_reported')}
                            </span>
                          : <button
                              className="report-trigger-btn"
                              style={{ marginLeft: 'auto' }}
                              title={t('cd_report_this_farmer')}
                              onClick={() => setComplaintTarget({
                                id: demand.committedFarmerId,
                                name: demand.committedFarmerName || t('cd_farmer'),
                                role: 'farmer',
                                demandId: demand.id,
                              })}
                            >
                              <FaFlag style={{ fontSize: 10 }} /> {t('cd_report_farmer')}
                            </button>
                      )}
                    </div>
                  </div>
                );
                    })}
                  </div>
                </div>
              ));
            })()
          )}
        </section>
        )}

        {/* PRODUCTS SECTION */}
        {activeTab === 'available' && (
          <section className="cd-products-section">
            <div className="cd-products-layout">
              {/* PREMIUM SIDEBAR FILTER */}
              <aside className="cd-sidebar">
                <div className="sidebar-card">
                  <div className="sidebar-title-row">
                    <h3><FaSlidersH /> {t('cd_filters')}</h3>
                    <button className="sidebar-reset" onClick={resetFilters}>{t('cd_reset')}</button>
                  </div>
                  
                  {/* Search Section */}
                  <div className="sidebar-section sidebar-search">
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                  </div>

                  {/* Filter Section */}
                  <div className="sidebar-section sidebar-filters">
                    <FilterSection 
                      selectedCategory={selectedCategory} 
                      onCategoryChange={setSelectedCategory}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      organicOnly={organicOnly}
                      onOrganicToggle={setOrganicOnly}
                      onResetFilters={resetFilters}
                      layout="sidebar"
                    />
                  </div>
                </div>
              </aside>

              {/* Main Products Content */}
              <div className="cd-products-main">
                <div className="cd-products-area">

            {loading ? (
              <div className="products-grid-modern">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="cd-skeleton-card" aria-hidden="true">
                    <div className="cd-sk-img" />
                    <div className="cd-sk-body">
                      <div className="cd-sk-line cd-sk-title" />
                      <div className="cd-sk-line cd-sk-sub" />
                      <div className="cd-sk-line cd-sk-price" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="products-grid-modern">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={p => addToCart(p,1)} onToggleFavorite={toggleFavorite} isFavorite={isFavorite(product.id)} onRequestNow={(prod) => { setSelectedProductForRequest(prod); setShowRequestModal(true); }} isAlreadyRequested={myDemands.some(d => d.cropName?.toLowerCase() === product.name?.toLowerCase() && d.status === 'open')} />
                ))}
              </div>
            ) : (
              <div className="cd-no-products">
                <div className="cd-no-products-art"><FaLeaf style={{fontSize:48,color:'#16a34a'}}/></div>
                {productsToUse.length === 0 ? (
                  <><h3>{t('cd_no_crops_listed_title')}</h3><p>{t('cd_no_crops_listed_sub')}</p></>
                ) : (
                  <><h3>{t('cd_no_products_found_title')}</h3><p>{t('cd_try_adjusting_filters_sub')}</p><button className="cd-reset-btn" onClick={resetFilters}>{t('cd_reset_filters')}</button></>
                )}
              </div>
            )}
                </div>
              </div>
            </div>
          </section>
        )}



      </div>{/* /cd-container */}

      {/* FOOTER */}
      <footer className="cd-footer">

        {/* Main columns */}
        <div className="cd-footer-inner">

          {/* Brand */}
          <div className="cd-footer-brand">
            <div className="cd-footer-logo"><FaLeaf /><span>Farm2Home</span></div>
            <p className="cd-footer-tagline">{t('cd_footer_tagline')}</p>

            <div className="cd-footer-contact">
              <div className="cd-fc-row"><FaPhone className="cd-fc-icon"/><span>+91 98765 43210</span></div>
              <div className="cd-fc-row"><FaMapMarkerAlt className="cd-fc-icon"/><span>{t('cd_footer_location')}</span></div>
            </div>

            <div className="cd-footer-badges">
              <div className="cd-fb-badge"><FaShieldAlt className="cd-fb-icon"/><span>{t('cd_footer_badge_secure')}</span></div>
              <div className="cd-fb-badge"><FaStar className="cd-fb-icon cd-fb-star"/><span>{t('cd_footer_badge_rating')}</span></div>
              <div className="cd-fb-badge"><FaUsers className="cd-fb-icon"/><span>{t('cd_footer_badge_users')}</span></div>
            </div>
          </div>

          {/* Shop */}
          <div className="cd-footer-col">
            <h4><FaLeaf className="cd-fcol-icon"/> {t('cd_footer_shop')}</h4>
            <ul>
              <li><a href="#vegetables"><FaChevronRight className="cd-flink-arr"/>{t('cd_category_vegetables')}</a></li>
              <li><a href="#fruits"><FaChevronRight className="cd-flink-arr"/>{t('cd_category_fruits')}</a></li>
              <li><a href="#grains"><FaChevronRight className="cd-flink-arr"/>{t('cd_category_grains_pulses')}</a></li>
              <li><a href="#spices"><FaChevronRight className="cd-flink-arr"/>{t('cd_category_spices')}</a></li>
              <li><a href="#organic"><FaChevronRight className="cd-flink-arr"/>{t('cd_stat_organic')}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="cd-footer-col">
            <h4><FaHandshake className="cd-fcol-icon"/> {t('cd_footer_company')}</h4>
            <ul>
              <li><a href="#about"><FaChevronRight className="cd-flink-arr"/>{t('cd_footer_about_us')}</a></li>
              <li><a href="#farmers"><FaChevronRight className="cd-flink-arr"/>{t('cd_footer_our_farmers')}</a></li>
              <li><a href="#careers"><FaChevronRight className="cd-flink-arr"/>{t('cd_footer_careers')}</a></li>
              <li><a href="#blog"><FaChevronRight className="cd-flink-arr"/>{t('cd_footer_blog')}</a></li>
              <li><a href="#contact"><FaChevronRight className="cd-flink-arr"/>{t('cd_footer_contact')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="cd-footer-col">
            <h4><FaShieldAlt className="cd-fcol-icon"/> {t('cd_footer_support')}</h4>
            <ul>
              <li><a href="#faq"><FaChevronRight className="cd-flink-arr"/>{t('cd_footer_faq')}</a></li>
              <li><a href="#shipping"><FaChevronRight className="cd-flink-arr"/>{t('cd_footer_shipping_policy')}</a></li>
              <li><a href="#returns"><FaChevronRight className="cd-flink-arr"/>{t('cd_footer_returns')}</a></li>
              <li><a href="#privacy"><FaChevronRight className="cd-flink-arr"/>{t('cd_footer_privacy_policy')}</a></li>
              <li><a href="#terms"><FaChevronRight className="cd-flink-arr"/>{t('cd_footer_terms_of_service')}</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="cd-footer-bottom">
          <p className="cd-fb-copy">{t('cd_footer_copy')}</p>
          <div className="cd-fb-links">
            <a href="#privacy">{t('cd_footer_privacy')}</a>
            <span className="cd-fb-dot"></span>
            <a href="#terms">{t('cd_footer_terms')}</a>
            <span className="cd-fb-dot"></span>
            <a href="#sitemap">{t('cd_footer_sitemap')}</a>
          </div>
        </div>

      </footer>

      {/* ── Accept Offer Date Modal ── */}
      {acceptDateModal && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.55)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ background:'#fff', borderRadius:18, padding:24, width:340, maxWidth:'96vw', boxShadow:'0 10px 40px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize:22, marginBottom:6 }}>📅</div>
            <h3 style={{ fontSize:17, fontWeight:800, color:'#15803d', marginBottom:4 }}>{t('cd_select_pickup_date')}</h3>
            <p style={{ fontSize:13, color:'#6b7280', marginBottom:16, lineHeight:1.5 }}>
              {t('cd_select_pickup_date_sub')}
            </p>
            <input
              type="date"
              value={pickupDateInput}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setPickupDateInput(e.target.value)}
              style={{ width:'100%', padding:'11px 13px', borderRadius:9, border:'2px solid #86efac', fontSize:14, boxSizing:'border-box', marginBottom:18, outline:'none' }}
            />
            <div style={{ display:'flex', gap:10 }}>
              <button
                onClick={() => { setAcceptDateModal(null); setPickupDateInput(''); }}
                style={{ flex:1, padding:'10px', borderRadius:9, border:'1.5px solid #d1d5db', background:'#f9fafb', color:'#374151', fontWeight:600, cursor:'pointer', fontSize:13 }}
              >{t('cd_cancel')}</button>
              <button
                onClick={async () => {
                  if (!pickupDateInput) { toastError(t('cd_err_select_pickup_date')); return; }
                  const res = await acceptOffer(acceptDateModal, pickupDateInput);
                  if (res.success) {
                    toastSuccess(t('cd_offer_accepted_success'));
                    setAcceptDateModal(null);
                    setPickupDateInput('');
                  } else {
                    toastError(res.error || t('cd_failed_to_accept_offer'));
                  }
                }}
                style={{ flex:2, padding:'10px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:800, cursor:'pointer', fontSize:13 }}
              >✓ {t('cd_confirm_and_accept')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Prepone Date Modal ── */}
      {preponeDealId && (() => {
        const deal = myDemands.find(d => d.id === preponeDealId);
        return (
          <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.55)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
            <div style={{ background:'#fff', borderRadius:18, padding:24, width:340, maxWidth:'96vw', boxShadow:'0 10px 40px rgba(0,0,0,0.25)' }}>
              <div style={{ fontSize:22, marginBottom:6 }}>⏰</div>
              <h3 style={{ fontSize:17, fontWeight:800, color:'#0369a1', marginBottom:4 }}>{t('cd_prepone_pickup_date')}</h3>
              <p style={{ fontSize:13, color:'#6b7280', marginBottom:6, lineHeight:1.5 }}>
                {t('cd_prepone_pickup_date_sub_1')} <strong>{t('cd_prepone_pickup_date_sub_prepone')}</strong> {t('cd_prepone_pickup_date_sub_2')}
              </p>
              <div style={{ fontSize:12, color:'#0369a1', background:'#e0f2fe', borderRadius:8, padding:'6px 10px', marginBottom:14 }}>
                {t('cd_current_pickup_date')}: <strong>{deal?.pickupDate ? new Date(deal.pickupDate + 'T00:00:00').toLocaleDateString(getLocaleForDate(), { day:'numeric', month:'short', year:'numeric' }) : t('cd_not_set')}</strong>
              </div>
              <input
                type="date"
                value={preponeDate}
                min={new Date().toISOString().split('T')[0]}
                max={deal?.pickupDate ? (() => { const d = new Date(deal.pickupDate + 'T00:00:00'); d.setDate(d.getDate()-1); return d.toISOString().split('T')[0]; })() : undefined}
                onChange={e => setPreponeDate(e.target.value)}
                style={{ width:'100%', padding:'11px 13px', borderRadius:9, border:'2px solid #7dd3fc', fontSize:14, boxSizing:'border-box', marginBottom:18, outline:'none' }}
              />
              <div style={{ display:'flex', gap:10 }}>
                <button
                  onClick={() => { setPreponeDealId(null); setPreponeDate(''); }}
                  style={{ flex:1, padding:'10px', borderRadius:9, border:'1.5px solid #d1d5db', background:'#f9fafb', color:'#374151', fontWeight:600, cursor:'pointer', fontSize:13 }}
                >{t('cd_cancel')}</button>
                <button
                  onClick={async () => {
                    if (!preponeDate) { toastError(t('cd_err_select_date')); return; }
                    const res = await preponePickupDate(preponeDealId, deal?.pickupDate, preponeDate);
                    if (res.success) {
                      toastSuccess(t('cd_pickup_date_preponed_success'));
                      setPreponeDealId(null);
                      setPreponeDate('');
                    } else {
                      toastError(res.error || t('cd_failed_to_update_date'));
                    }
                  }}
                  style={{ flex:2, padding:'10px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#0284c7,#0369a1)', color:'#fff', fontWeight:800, cursor:'pointer', fontSize:13 }}
                >⏰ {t('cd_confirm_prepone')}</button>
              </div>
            </div>
          </div>
        );
      })()}
      </div>
      <ConfirmDialog config={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </>
  );
};

export default ConsumerDashboard;
