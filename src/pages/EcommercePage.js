// EcommercePage.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const categories = [
  'Seeds',
  'Crop Protection',
  'Crop Nutrition',
  'Equipments',
  'Animal Husbandry',
  'Organic',
  'Tapas',
  'Services',
  'Knowledge'
];

const tapasSubcategories = [
  'Crop Nutrition',
  'Crop Protection',
  'Farm Implements',
  'Traps & Lures',
  'Mulching Sheet',
  'Safety Kit',
  'Sprayers'
];

const organicMenu = [
  {
    title: 'BIO/ORGANIC PESTICIDES',
    items: [
      'Bio Insecticides',
      'Bio Fungicides',
      'Bio Viricides',
      'Bio Nematicides',
      'Bio Miticides/Acaricides'
    ]
  },
  {
    title: 'CROP NUTRITION',
    items: [
      'Bio/Organic Fertilizers',
      'Bio Stimulants/Activators'
    ]
  }
];

const animalHusbandryMenu = [
  {
    title: 'CATTLE',
    items: [
      'Cattle Feed',
      'Cattle Supplements',
      'Milking Machine',
      'Milking Machine Accessories',
      'Cattle Mat',
      'Calf Feeding Bottle'
    ]
  },
  {
    title: 'POULTRY',
    items: [
      'Poultry Feed',
      'Poultry Supplements',
      'Poultry Equipment'
    ]
  },
  {
    title: 'OTHERS',
    items: [
      'Forage Seeds',
      'Silage Culture'
    ]
  },
  {
    title: 'POPULAR BRANDS',
    items: [
      'Meenakshi Agro',
      'Ecowealth',
      'Godhan',
      'Prompt Equipments Private Limited',
      'Agrigators Enterprises Private Limited',
      'Shivam Pharma'
    ]
  }
];

const brandsData = {
  Seeds: ['SYNGENTA', 'NAMDARI', 'SEMINIS', 'EAST WEST', 'INDO AMERICAN HYBRID SEEDS', 'VNR', 'NUNHEMS', 'SARPAN', 'UPL', 'MAHYCO', 'KNOWN-YOU', 'URJA SEEDS', 'ASHOKA', 'ADVANTA', 'IRIS HYBRID'],
  'Crop Protection': ['BAYER', 'SYNGENTA', 'BASF', 'FMC', 'RALLIS', 'TAPAS', 'DHANUKA', 'CRYSTAL CROP PROTECTION', 'UPL', 'CORTEVA', 'INDOFIL', 'SUMITOMO', 'PI INDUSTRIES', 'ADAMA', 'BARRIX', 'IFFCO', 'AIMCO', 'BACF'],
  'Crop Nutrition': ['MULTIPLEX', 'HIFIELD', 'SEA6 ENERGY', 'HUMATE INDIA', 'MICROBI AGROTECH', 'GEOLIFE', 'TAPAS', 'OTLA', 'VEDGNA', 'AMRUTH ORGANIC', 'SHAMROCK', 'ANAND AGRO CARE', 'VANPROZ', 'AGRIPLEX', 'T STANES', 'RALLIS', 'BIOPRIME', 'INFINITE BIOTECH', 'BHUMI AGRO INDUSTRIES'],
  Implements: ['SNAP EXPORT PRIVATE LIMITED', 'NIYO FARMTECH PRIVATE LIMITED', 'TAPAS', 'MITVA', 'MIPATEX', 'SICKLE INNOVATIONS PVT LTD', 'TATA AGRICO', 'Modish Tractoraurkisan Pvt Ltd'],
  'Most Popular': ['SYNGENTA', 'BAYER', 'Janatha Agro Products', 'NAMDARI', 'GEOLIFE', 'BASF', 'TAPAS', 'VNR', 'VANPROZ', 'SARPAN', 'UAL', 'KAN BIOSYS', 'KATYAYANI ORGANICS']
};

const deals = ['Deal 1', 'Deal 2', 'Deal 3'];
const info = ['Quality Assured', 'Fast Delivery', 'Support'];
const sidebarCategories = ['Organic', 'Chemical', 'Liquid', 'Powder'];
const products = [
  { name: 'Neem Oil - 1L', price: 600, category: 'పంట రక్షణ', brand: 'SYNGENTA', rating: 4, available: true },
  { name: 'Bio Fertilizer - 2kg', price: 450, category: 'పంట పోషణ', brand: 'BAYER', rating: 5, available: true },
  { name: 'Seed Pack', price: 200, category: 'విత్తనాలు', brand: 'NAMDARI', rating: 3, available: false },
  { name: 'Pest Trap', price: 150, category: 'పంట రక్షణ', brand: 'BASF', rating: 4, available: true },
  { name: 'Tractor Tool', price: 3500, category: 'వ్యవసాయ యంత్రాలు', brand: 'TAPAS', rating: 5, available: true },
  { name: 'Animal Feed', price: 800, category: 'పశుపాలన', brand: 'ADVANTA', rating: 2, available: false }
];

const filterCategories = [
  'పశుపాలన', 'పంట పోషణ', 'పంట రక్షణ', 'మొక్కలు', 'వ్యవసాయ యంత్రాలు', 'విత్తనాలు'
];
const filterBrands = [
  '1000 ఫార్మ్స్ అగ్రిటెక్ ప్రైవేట్ లిమిటెడ్', 'ఆర్య వెంచర్స్', 'యాక్టోసోల్', 'అడామా', 'అడ్వాంటా'
];
const priceBuckets = [
  '₹0 - ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', '₹2000 - ₹5000', '₹5000+'
];
const ratings = [5, 4, 3, 2, 1];
const availability = ['In Stock', 'Out of Stock'];

const stateDistricts = {
  telangana: [
    'adilabad', 'bhadradri_kothagudem', 'hyderabad', 'jagtial', 'jangaon', 'jayashankar_bhupalpally', 'jogulamba_gadwal', 'kamareddy', 'karimnagar', 'khammam', 'komaram_bheem_asifabad', 'mahabubabad', 'mahabubnagar', 'mancherial', 'medak', 'medchal_malkajgiri', 'mulugu', 'nagarkurnool', 'nalgonda', 'narayanpet', 'nirmal', 'nizamabad', 'peddapalli', 'rajanna_sircilla', 'rangareddy', 'sangareddy', 'siddipet', 'suryapet', 'vikarabad', 'wanaparthy', 'warangal_rural', 'warangal_urban', 'yadadri_bhuvanagiri'
  ],
  andhra_pradesh: [
    'anantapur', 'chittoor', 'east_godavari', 'guntur', 'kadapa', 'krishna', 'kurnool', 'nellore', 'prakasam', 'srikakulam', 'visakhapatnam', 'vizianagaram', 'west_godavari'
  ],
  tamil_nadu: [
    'ariyalur', 'chengalpattu', 'chennai', 'coimbatore', 'cuddalore', 'dharmapuri', 'dindigul', 'erode', 'kallakurichi', 'kanchipuram', 'kanniyakumari', 'karur', 'krishnagiri', 'madurai', 'mayiladuthurai', 'nagapattinam', 'namakkal', 'nilgiris', 'perambalur', 'pudukkottai', 'ramanathapuram', 'ranipet', 'salem', 'sivaganga', 'tenkasi', 'thanjavur', 'theni', 'thoothukudi', 'tiruchirappalli', 'tirunelveli', 'tirupathur', 'tiruppur', 'tiruvallur', 'tiruvannamalai', 'tiruvarur', 'vellore', 'viluppuram', 'virudhunagar'
  ],
  kerala: [
    'thiruvananthapuram', 'kollam', 'pathanamthitta', 'alappuzha', 'kottayam', 'idukki', 'ernakulam', 'thrissur', 'palakkad', 'malappuram', 'kozhikode', 'wayanad', 'kannur', 'kasaragod'
  ],
  goa: [
    'north_goa', 'south_goa'
  ],
  karnataka: [
    'bagalkot', 'ballari', 'belagavi', 'bengaluru_rural', 'bengaluru_urban', 'bidar', 'chamarajanagar', 'chikkaballapur', 'chikkamagaluru', 'chitradurga', 'dakshina_kannada', 'davanagere', 'dharwad', 'gadag', 'hassan', 'haveri', 'kalaburagi', 'kodagu', 'kolar', 'koppal', 'mandya', 'mysuru', 'raichur', 'ramanagara', 'shivamogga', 'tumakuru', 'udupi', 'uttara_kannada', 'vijayapura', 'yadgir', 'vijayanagara'
  ],
  maharashtra: [
    'mumbai', 'pune', 'nagpur', 'nashik', 'thane', 'aurangabad', 'solapur', 'kolhapur', 'sangli', 'jalgaon', 'satara', 'amravati', 'nanded', 'akola', 'latur', 'dhule', 'ahmednagar', 'chandrapur', 'parbhani', 'yavatmal', 'beed', 'osmanabad', 'bhandara', 'buldhana', 'gondia', 'hingoli', 'palghar', 'raigad', 'ratnagiri', 'sindhudurg', 'wardha', 'washim'
  ]
};

const cropProtectionMenu = [
  {
    title: 'CHEMICAL PESTICIDES',
    items: ['Insecticides', 'Fungicides', 'Herbicides', 'Bactericides', 'Miticides/Acaricides']
  },
  {
    title: 'BIO/ORGANIC PESTICIDES',
    items: ['Bio Insecticides', 'Bio Fungicides', 'Bio Viricides', 'Bio Nematicides', 'Bio Miticides/Acaricides']
  },
  {
    title: 'TRAPS AND LURES',
    items: ['Sticky Traps', 'Pheromone Lures', 'Pheromone Traps', 'Solar Light Traps']
  },
  {
    title: 'OTHERS',
    items: ['Adjuvants', 'Surface Disinfectants', 'Decomposers', 'Animal Repellant', 'Safety Kit', 'Safety Shoes']
  }
];

const cropNutritionMenu = [
  {
    title: 'FERTILIZERS',
    items: ['Chemical Fertilizers', 'Bio/Organic Fertilizers', 'Micro Nutrients', 'Humic Acids', 'pH Balancers']
  },
  {
    title: 'GROWTH PROMOTERS',
    items: ['Plant Growth Promoters', 'Plant Enhancers', 'Bio Stimulants/Activators']
  },
  {
    title: 'PLANT GROWTH REGULATORS',
    items: ['Yield Boosters', 'Fruit Enhancers', 'Flower Boosters']
  },
  {
    title: 'POPULAR',
    items: ['NPK Fertilizers', 'Liquid Fertilizers', 'Seaweed Extracts', 'Fertilizer Enhancers']
  }
];

const equipmentsMenu = [
  {
    title: 'IMPLEMENTS',
    items: ['Sprayers', 'Brush Cutter', 'Weeder/Tiller', 'Chaff Cutter and Parts', 'Solar Dryer', 'Rice Mill', 'Earth Augers', 'Power Reaper', 'Chain Saw', 'Sugarcane Machine', 'Pellet Machine']
  },
  {
    title: 'AGRICULTURE TOOLS',
    items: ['Nursery Inputs', 'Fruit Harvester/Plucker', 'Garden Tools', 'Seeder/Transplanter']
  },
  {
    title: 'ACCESSORIES',
    items: ['Tirpal/Tarpaulin', 'Mulch', 'Shade Net', 'Traps and Lure', 'Safety Kit', 'Torch/Lantern', 'Crop Cover']
  },
  {
    title: 'IRRIGATION',
    items: ['Pipe', 'Water Pump', 'Sprinkler', 'Drip Kit']
  }
];

const seedsMenu = [
  {
    title: 'HORTICULTURE CROPS',
    items: ['Vegetables Seeds', 'Fruit Seeds', 'Flower Seeds', 'Seed Germinator']
  },
  {
    title: 'FIELD CROPS',
    items: ['Forages', 'Maize/Corn', 'Paddy', 'Mustard', 'Jowar', 'Cotton']
  },
  {
    title: 'SPECIAL CATEGORY',
    items: ['Polyhouse', 'Exotics', 'Forestry', 'Urban Garden', 'Saplings']
  },
  {
    title: 'POPULAR PRODUCTS',
    items: ['Tomato', 'Chilli', 'Brinjal', 'Cucumber', 'Cauliflower']
  }
];

const EcommercePage = () => {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState('telangana');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [tapasOpen, setTapasOpen] = useState(false);
  const [organicOpen, setOrganicOpen] = useState(false);
  const [animalOpen, setAnimalOpen] = useState(false);
  const [cropProtectionOpen, setCropProtectionOpen] = useState(false);
  const [cropNutritionOpen, setCropNutritionOpen] = useState(false);
  const [equipmentsOpen, setEquipmentsOpen] = useState(false);
  const [seedsOpen, setSeedsOpen] = useState(false);
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [sliderPrice, setSliderPrice] = useState(10000);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  // Collapsible filter sections
  const [openFilters, setOpenFilters] = useState({
    category: true,
    brand: true,
    price: true,
    rating: true,
    availability: true
  });
  // Brand search
  const [brandSearch, setBrandSearch] = useState('');
  const visibleBrands = filterBrands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()));

  // Filtering logic
  const filteredProducts = products.filter(product => {
    // Category
    if (selectedCategories.length && !selectedCategories.includes(product.category)) return false;
    // Brand
    if (selectedBrands.length && !selectedBrands.includes(product.brand)) return false;
    // Price
    if (selectedPrice) {
      const [min, max] = selectedPrice.replace(/₹/g, '').replace('+', '').split('-').map(s => parseInt(s.trim()));
      if (max) {
        if (product.price < min || product.price > max) return false;
      } else {
        if (product.price < min) return false;
      }
    }
    if (product.price > sliderPrice) return false;
    // Rating
    if (selectedRating && product.rating !== selectedRating) return false;
    // Availability
    if (selectedAvailability) {
      if (selectedAvailability === 'In Stock' && !product.available) return false;
      if (selectedAvailability === 'Out of Stock' && product.available) return false;
    }
    return true;
  });

  // Handlers for filters
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedDistrict('');
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };
  const handlePriceChange = (bucket) => {
    setSelectedPrice(bucket);
  };
  const handleSliderPrice = (e) => {
    setSliderPrice(Number(e.target.value));
  };
  const handleRatingChange = (star) => {
    setSelectedRating(star);
  };
  const handleAvailabilityChange = (avail) => {
    setSelectedAvailability(avail);
  };

  // Toggle filter section
  const toggleFilter = (key) => {
    setOpenFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh', margin: 0 }}>
      {/* Main Header */}
      <div style={{ background: '#fff', display: 'flex', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ fontWeight: 'bold', fontSize: '2em', color: '#22543d', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 32, marginRight: 6 }}>🌱</span> Farm2Home
        </div>
        <input type="text" placeholder="Search..." style={{ marginLeft: 40, flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16, maxWidth: 400 }} />
        <div style={{ marginLeft: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
          <select style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc', fontSize: 15 }}>
            <option>English</option>
            <option>हिंदी</option>
            <option>తెలుగు</option>
            <option>தமிழ்</option>
            <option>മലയാളം</option>
            <option>ಕನ್ನಡ</option>
            <option>మరాఠీ</option>
          </select>
          <a href="#" style={{ color: '#22543d', textDecoration: 'none', fontWeight: 500 }}>Track Order</a>
          <a href="#" style={{ color: '#22543d', textDecoration: 'none', fontWeight: 500 }}>Wishlist</a>
          <a href="#" style={{ color: '#22543d', textDecoration: 'none', fontWeight: 500 }}>Login</a>
          <a href="#" style={{ color: '#22543d', textDecoration: 'none', fontWeight: 500 }}>Cart</a>
        </div>
      </div>
      {/* Category Menu */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', padding: '0 32px', position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'relative' }} onMouseEnter={() => setBrandsOpen(true)} onMouseLeave={() => setBrandsOpen(false)}>
          <button style={{ background: brandsOpen ? '#22543d' : '#fff', color: brandsOpen ? '#fff' : '#22543d', border: 'none', padding: '16px 18px', fontWeight: 600, fontSize: 16, borderRadius: '6px 6px 0 0', cursor: 'pointer' }}>BRANDS ▼</button>
          {brandsOpen && (
            <div style={{ position: 'absolute', left: 0, top: '100%', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', borderRadius: '0 0 12px 12px', padding: 24, display: 'flex', gap: 48, minWidth: 900, zIndex: 10 }}>
              {Object.entries(brandsData).map(([section, brands]) => (
                <div key={section} style={{ minWidth: 170 }}>
                  <div style={{ fontWeight: 700, color: '#22543d', marginBottom: 10, fontSize: 15 }}>{section.toUpperCase()}</div>
                  {brands.map((brand, idx) => (
                    <div key={idx} style={{ color: '#333', marginBottom: 6, fontSize: 15 }}>{brand}</div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        {categories.map((cat, idx) => (
          cat === 'Tapas' ? (
            <div key={cat} style={{ position: 'relative', marginLeft: idx === 0 ? 8 : 0 }}
              onMouseEnter={() => setTapasOpen(true)}
              onMouseLeave={() => setTapasOpen(false)}
            >
              <a href="#" style={{ color: tapasOpen ? '#fff' : '#22543d', background: tapasOpen ? '#38a169' : 'transparent', textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '16px 18px', borderRadius: 6, display: 'inline-block' }}>TAPAS ▼</a>
              {tapasOpen && (
                <div style={{ position: 'absolute', left: 0, top: '100%', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', borderRadius: '0 0 12px 12px', padding: '12px 0', minWidth: 220, zIndex: 10 }}>
                  {tapasSubcategories.map((sub, subIdx) => (
                    <div key={subIdx} style={{ color: '#22543d', padding: '10px 24px', fontSize: 15, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => setTapasOpen(false)}
                      onMouseOver={e => e.currentTarget.style.background = '#f0f0f0'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >{sub}</div>
                  ))}
                </div>
              )}
            </div>
          ) : cat === 'Organic' ? (
            <div key={cat} style={{ position: 'relative', marginLeft: idx === 0 ? 8 : 0 }}
              onMouseEnter={() => setOrganicOpen(true)}
              onMouseLeave={() => setOrganicOpen(false)}
            >
              <a href="#" style={{ color: organicOpen ? '#fff' : '#22543d', background: organicOpen ? '#38a169' : 'transparent', textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '16px 18px', borderRadius: 6, display: 'inline-block' }}>ORGANIC ▼</a>
              {organicOpen && (
                <div style={{ position: 'absolute', left: 0, top: '100%', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', borderRadius: '0 0 12px 12px', padding: '32px 48px', minWidth: 600, zIndex: 10, display: 'flex', gap: 60 }}>
                  {organicMenu.map((col, colIdx) => (
                    <div key={colIdx} style={{ minWidth: 220 }}>
                      <div style={{ fontWeight: 700, color: '#38a169', marginBottom: 12, fontSize: 16 }}>{col.title}</div>
                      {col.items.map((item, itemIdx) => (
                        <div key={itemIdx} style={{ color: '#22543d', fontSize: 15, marginBottom: 10, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: '1px solid #eee', paddingBottom: 2 }}>{item}</div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : cat === 'Animal Husbandry' ? (
            <div key={cat} style={{ position: 'relative', marginLeft: idx === 0 ? 8 : 0 }}
              onMouseEnter={() => setAnimalOpen(true)}
              onMouseLeave={() => setAnimalOpen(false)}
            >
              <a href="#" style={{ color: animalOpen ? '#fff' : '#22543d', background: animalOpen ? '#38a169' : 'transparent', textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '16px 18px', borderRadius: 6, display: 'inline-block' }}>ANIMAL HUSBANDRY ▼</a>
              {animalOpen && (
                <div style={{ position: 'absolute', left: 0, top: '100%', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', borderRadius: '0 0 12px 12px', padding: '32px 48px', minWidth: 900, zIndex: 10, display: 'flex', gap: 60 }}>
                  {animalHusbandryMenu.map((col, colIdx) => (
                    <div key={colIdx} style={{ minWidth: 180 }}>
                      <div style={{ fontWeight: 700, color: '#38a169', marginBottom: 12, fontSize: 16 }}>{col.title}</div>
                      {col.items.map((item, itemIdx) => (
                        <div key={itemIdx} style={{ color: '#22543d', fontSize: 15, marginBottom: 10, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: '1px solid #eee', paddingBottom: 2 }}>{item}</div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : cat === 'Crop Protection' ? (
            <div key={cat} style={{ position: 'relative', marginLeft: idx === 0 ? 8 : 0 }}
              onMouseEnter={() => setCropProtectionOpen(true)}
              onMouseLeave={() => setCropProtectionOpen(false)}
            >
              <a href="#" style={{ color: cropProtectionOpen ? '#fff' : '#22543d', background: cropProtectionOpen ? '#38a169' : 'transparent', textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '16px 18px', borderRadius: 6, display: 'inline-block' }}>CROP PROTECTION ▼</a>
              {cropProtectionOpen && (
                <div style={{ position: 'absolute', left: 0, top: '100%', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', borderRadius: '0 0 12px 12px', padding: '32px 48px', minWidth: 900, zIndex: 10, display: 'flex', gap: 60 }}>
                  {cropProtectionMenu.map((col, colIdx) => (
                    <div key={colIdx} style={{ minWidth: 180 }}>
                      <div style={{ fontWeight: 700, color: '#38a169', marginBottom: 12, fontSize: 16 }}>{col.title}</div>
                      {col.items.map((item, itemIdx) => (
                        <div key={itemIdx} style={{ color: '#22543d', fontSize: 15, marginBottom: 10, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: '1px solid #eee', paddingBottom: 2 }}>{item}</div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : cat === 'Crop Nutrition' ? (
            <div key={cat} style={{ position: 'relative', marginLeft: idx === 0 ? 8 : 0 }}
              onMouseEnter={() => setCropNutritionOpen(true)}
              onMouseLeave={() => setCropNutritionOpen(false)}
            >
              <a href="#" style={{ color: cropNutritionOpen ? '#fff' : '#22543d', background: cropNutritionOpen ? '#38a169' : 'transparent', textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '16px 18px', borderRadius: 6, display: 'inline-block' }}>CROP NUTRITION ▼</a>
              {cropNutritionOpen && (
                <div style={{ position: 'absolute', left: 0, top: '100%', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', borderRadius: '0 0 12px 12px', padding: '32px 48px', minWidth: 900, zIndex: 10, display: 'flex', gap: 60 }}>
                  {cropNutritionMenu.map((col, colIdx) => (
                    <div key={colIdx} style={{ minWidth: 180 }}>
                      <div style={{ fontWeight: 700, color: '#38a169', marginBottom: 12, fontSize: 16 }}>{col.title}</div>
                      {col.items.map((item, itemIdx) => (
                        <div key={itemIdx} style={{ color: '#22543d', fontSize: 15, marginBottom: 10, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: '1px solid #eee', paddingBottom: 2 }}>{item}</div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : cat === 'Equipments' ? (
            <div key={cat} style={{ position: 'relative', marginLeft: idx === 0 ? 8 : 0 }}
              onMouseEnter={() => setEquipmentsOpen(true)}
              onMouseLeave={() => setEquipmentsOpen(false)}
            >
              <a href="#" style={{ color: equipmentsOpen ? '#fff' : '#22543d', background: equipmentsOpen ? '#38a169' : 'transparent', textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '16px 18px', borderRadius: 6, display: 'inline-block' }}>EQUIPMENTS ▼</a>
              {equipmentsOpen && (
                <div style={{ position: 'absolute', left: 0, top: '100%', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', borderRadius: '0 0 12px 12px', padding: '32px 48px', minWidth: 900, zIndex: 10, display: 'flex', gap: 60 }}>
                  {equipmentsMenu.map((col, colIdx) => (
                    <div key={colIdx} style={{ minWidth: 180 }}>
                      <div style={{ fontWeight: 700, color: '#38a169', marginBottom: 12, fontSize: 16 }}>{col.title}</div>
                      {col.items.map((item, itemIdx) => (
                        <div key={itemIdx} style={{ color: '#22543d', fontSize: 15, marginBottom: 10, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: '1px solid #eee', paddingBottom: 2 }}>{item}</div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : cat === 'Seeds' ? (
            <div key={cat} style={{ position: 'relative', marginLeft: idx === 0 ? 8 : 0 }}
              onMouseEnter={() => setSeedsOpen(true)}
              onMouseLeave={() => setSeedsOpen(false)}
            >
              <a href="#" style={{ color: seedsOpen ? '#fff' : '#22543d', background: seedsOpen ? '#38a169' : 'transparent', textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '16px 18px', borderRadius: 6, display: 'inline-block' }}>SEEDS ▼</a>
              {seedsOpen && (
                <div style={{ position: 'absolute', left: 0, top: '100%', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', borderRadius: '0 0 12px 12px', padding: '32px 48px', minWidth: 900, zIndex: 10, display: 'flex', gap: 60 }}>
                  {seedsMenu.map((col, colIdx) => (
                    <div key={colIdx} style={{ minWidth: 180 }}>
                      <div style={{ fontWeight: 700, color: '#38a169', marginBottom: 12, fontSize: 16 }}>{col.title}</div>
                      {col.items.map((item, itemIdx) => (
                        <div key={itemIdx} style={{ color: '#22543d', fontSize: 15, marginBottom: 10, cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: '1px solid #eee', paddingBottom: 2 }}>{item}</div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <a key={cat} href="#" style={{ color: '#22543d', textDecoration: 'none', fontWeight: 600, fontSize: 16, padding: '16px 18px', borderRadius: 6, marginLeft: idx === 0 ? 8 : 0 }}>{cat}</a>
          )
        ))}
      </div>

      {/* Banner */}
      <div style={{ background: '#e5ffe6', margin: '10px 0', borderRadius: 8, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3em' }}>
        <div style={{ background: '#fff', border: '2px dashed #c4c4c4', width: '90%', height: 70, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Hero Banner (empty)</div>
      </div>

      {/* Featured Categories */}
      <div style={{ display: 'flex', gap: 16, marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        {categories.map((cat, idx) => (
          <div key={idx} style={{ background: '#fff', border: '2px dashed #c4c4c4', height: 100, width: 130, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>{cat}</div>
        ))}
      </div>

      {/* Top Deals Row */}
      <div style={{ display: 'flex', gap: 16, marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        {deals.map((deal, idx) => (
          <div key={idx} style={{ background: '#fff', border: '2px dashed #d3d3d3', height: 100, width: 130, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>{deal}</div>
        ))}
      </div>

      {/* Why Shop With Us */}
      <div style={{ display: 'flex', gap: 16, marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        {info.map((item, idx) => (
          <div key={idx} style={{ background: '#fff', border: '2px dashed #c4c4c4', height: 100, width: 130, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>{item}</div>
        ))}
      </div>

      {/* Main Shop Area */}
      <div style={{ display: 'flex', gap: 20, marginTop: 30, justifyContent: 'center' }}>
        {/* Sidebar */}
        <div style={{ width: 240, background: '#fff', border: '1px solid #ccc', padding: 18, borderRadius: 8, marginRight: 20, minHeight: 500 }}>
          <h4 style={{ marginTop: 0, color: '#22543d' }}>ఫిల్టర్లు</h4>
          {/* Category Filter */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => toggleFilter('category')}>
              <span>వర్గం</span>
              <span>{openFilters.category ? '▲' : '▼'}</span>
            </div>
            {openFilters.category && filterCategories.map((cat, idx) => (
              <div key={idx} style={{ marginBottom: 4 }}>
                <input type="checkbox" id={`cat-${idx}`} style={{ marginRight: 6 }}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                <label htmlFor={`cat-${idx}`}>{cat}</label>
              </div>
            ))}
          </div>
          {/* Brand Filter */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => toggleFilter('brand')}>
              <span>బ్రాండ్లు</span>
              <span>{openFilters.brand ? '▲' : '▼'}</span>
            </div>
            {openFilters.brand && (
              <>
                <input
                  type="text"
                  placeholder="Search Brands"
                  value={brandSearch}
                  onChange={e => setBrandSearch(e.target.value)}
                  style={{ width: '100%', marginBottom: 6, padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }}
                />
                {visibleBrands.length === 0 && <div style={{ color: '#888', fontSize: 13 }}>No Brands Found</div>}
                {visibleBrands.map((brand, idx) => (
                  <div key={idx} style={{ marginBottom: 4 }}>
                    <input type="checkbox" id={`brand-${idx}`} style={{ marginRight: 6 }}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <label htmlFor={`brand-${idx}`}>{brand}</label>
                  </div>
                ))}
              </>
            )}
          </div>
          {/* Price Filter */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => toggleFilter('price')}>
              <span>ధర</span>
              <span>{openFilters.price ? '▲' : '▼'}</span>
            </div>
            {openFilters.price && <>
              <input type="range" min="0" max="10000" value={sliderPrice} onChange={handleSliderPrice} style={{ width: '100%' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
                {priceBuckets.map((bucket, idx) => (
                  <label key={idx} style={{ fontSize: 14 }}>
                    <input type="radio" name="price" style={{ marginRight: 6 }}
                      checked={selectedPrice === bucket}
                      onChange={() => handlePriceChange(bucket)}
                    />{bucket}
                  </label>
                ))}
              </div>
              <div style={{ fontSize: 13, marginTop: 4, color: '#22543d' }}>Max: ₹{sliderPrice}</div>
            </>}
          </div>
          {/* Rating Filter */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => toggleFilter('rating')}>
              <span>రేటింగ్</span>
              <span>{openFilters.rating ? '▲' : '▼'}</span>
            </div>
            {openFilters.rating && <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {ratings.map((star, idx) => (
                <label key={idx} style={{ fontSize: 14 }}>
                  <input type="radio" name="rating" style={{ marginRight: 6 }}
                    checked={selectedRating === star}
                    onChange={() => handleRatingChange(star)}
                  />{'★'.repeat(star)}{'☆'.repeat(5-star)}
                </label>
              ))}
            </div>}
          </div>
          {/* Availability Filter */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => toggleFilter('availability')}>
              <span>లభ్యత</span>
              <span>{openFilters.availability ? '▲' : '▼'}</span>
            </div>
            {openFilters.availability && availability.map((avail, idx) => (
              <label key={idx} style={{ fontSize: 14, display: 'block' }}>
                <input type="radio" name="availability" style={{ marginRight: 6 }}
                  checked={selectedAvailability === avail}
                  onChange={() => handleAvailabilityChange(avail)}
                />{avail}
              </label>
            ))}
          </div>
        </div>
        {/* Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, flex: 1 }}>
          {filteredProducts.map((product, idx) => (
            <div key={idx} style={{ background: '#fff', border: '2px dashed #d3d3d3', borderRadius: 8, padding: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 100, height: 80, background: '#eee', borderRadius: 4, marginBottom: 12 }} />
              <div>{product.name}</div>
              <div>₹{product.price}</div>
              <div style={{ fontSize: 13, color: '#888', margin: '4px 0' }}>{product.category} | {product.brand}</div>
              <div style={{ fontSize: 13, color: product.available ? '#28a745' : '#d32f2f' }}>{product.available ? 'In Stock' : 'Out of Stock'}</div>
              <div style={{ fontSize: 15, color: '#fbc02d', margin: '2px 0' }}>{'★'.repeat(product.rating)}{'☆'.repeat(5-product.rating)}</div>
              <button style={{ marginTop: 8, padding: '6px 16px', borderRadius: 4, border: 'none', background: '#28a745', color: '#fff', cursor: 'pointer' }}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 30, background: '#333', color: '#fff', padding: 20, textAlign: 'center' }}>
        © 2025 Farm2Home. All rights reserved.
      </div>
    </div>
  );
};

export default EcommercePage;
