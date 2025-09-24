import React, { useState } from 'react';
import { FaTools, FaPlus, FaSearch, FaMapMarkerAlt, FaRupeeSign, FaUser, FaPhone, FaTractor, FaCog, FaWrench, FaSeedling, FaTint, FaStar, FaHeart, FaShareAlt, FaCalendarAlt, FaShieldAlt, FaClock } from 'react-icons/fa';

const ResourceSharePage = () => {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'add'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Sample tools data - in real app this would come from backend
  const [tools, setTools] = useState([
    {
      id: 1,
      name: 'Tractor (John Deere)',
      category: 'Heavy Machinery',
      costPerHour: 500,
      state: 'Telangana',
      district: 'Hyderabad',
      village: 'Gachibowli',
      owner: 'Rajesh Kumar',
      phone: '+91 9876543210',
      description: 'High-performance tractor suitable for plowing and cultivation. Well-maintained with latest features.',
      availability: 'Available',
      image: '/Farming Tools Images/Tractor.jpg',
      rating: 4.8,
      totalBookings: 47,
      yearMade: 2020,
      featured: true,
      tags: ['GPS Enabled', 'Fuel Efficient', 'Air Conditioned']
    },
    {
      id: 2,
      name: 'Harvester Combine',
      category: 'Heavy Machinery',
      costPerHour: 800,
      state: 'Andhra Pradesh',
      district: 'Guntur',
      village: 'Tenali',
      owner: 'Suresh Patel',
      phone: '+91 9876543211',
      description: 'Modern combine harvester for efficient crop harvesting. Perfect for wheat, rice, and corn.',
      availability: 'Available',
      image: '/Farming Tools Images/Harvester.jpg',
      rating: 4.9,
      totalBookings: 32,
      yearMade: 2019,
      featured: true,
      tags: ['High Capacity', 'GPS Tracking', 'Auto Steering']
    },
    {
      id: 3,
      name: 'Disc Harrow',
      category: 'Tillage Equipment',
      costPerHour: 200,
      state: 'Karnataka',
      district: 'Bangalore',
      village: 'Devanahalli',
      owner: 'Prakash Singh',
      phone: '+91 9876543212',
      description: 'Professional disc harrow for soil preparation and weed control. Heavy-duty construction.',
      availability: 'Available',
      image: '/Farming Tools Images/Disc Harrow.jpg',
      rating: 4.6,
      totalBookings: 28,
      yearMade: 2021,
      featured: false,
      tags: ['Heavy Duty', 'Adjustable', 'Durable']
    },
    {
      id: 4,
      name: '7.5HP Water Pump',
      category: 'Irrigation',
      costPerHour: 150,
      state: 'Tamil Nadu',
      district: 'Chennai',
      village: 'Tambaram',
      owner: 'Murugan Raj',
      phone: '+91 9876543213',
      description: 'High-capacity water pump for field irrigation. Energy efficient with low maintenance.',
      availability: 'Rented',
      image: '/Farming Tools Images/7.5hp water pump.jpg',
      rating: 4.7,
      totalBookings: 56,
      yearMade: 2020,
      featured: false,
      tags: ['Energy Efficient', 'Low Noise', 'Portable']
    },
    {
      id: 5,
      name: 'Super Seeder',
      category: 'Planting Equipment',
      costPerHour: 300,
      state: 'Maharashtra',
      district: 'Pune',
      village: 'Baramati',
      owner: 'Vikram Patil',
      phone: '+91 9876543214',
      description: 'Precision super seeder for accurate seed placement. Ideal for direct seeding operations.',
      availability: 'Available',
      image: '/Farming Tools Images/Super Seeder.jpg',
      rating: 4.5,
      totalBookings: 23,
      yearMade: 2022,
      featured: true,
      tags: ['Precision Seeding', 'Multi-Crop', 'GPS Compatible']
    },
    {
      id: 6,
      name: 'Hand Cultivator',
      category: 'Hand Tools',
      costPerHour: 50,
      state: 'Punjab',
      district: 'Ludhiana',
      village: 'Sahnewal',
      owner: 'Harpreet Singh',
      phone: '+91 9876543215',
      description: 'Manual cultivator for small-scale farming and garden maintenance. Lightweight and easy to use.',
      availability: 'Available',
      image: '/Farming Tools Images/hand Cultivators.jpg',
      rating: 4.3,
      totalBookings: 15,
      yearMade: 2021,
      featured: false,
      tags: ['Lightweight', 'Ergonomic', 'Rust Resistant']
    },
    {
      id: 7,
      name: 'Rotavator',
      category: 'Tillage Equipment',
      costPerHour: 250,
      state: 'Haryana',
      district: 'Karnal',
      village: 'Indri',
      owner: 'Deepak Kumar',
      phone: '+91 9876543216',
      description: 'Advanced rotavator for soil preparation and mixing. Perfect for preparing seedbed.',
      availability: 'Available',
      image: '/Farming Tools Images/Rotavator.jpg',
      rating: 4.4,
      totalBookings: 31,
      yearMade: 2020,
      featured: false,
      tags: ['Quick Setup', 'Adjustable Depth', 'Low Maintenance']
    },
    {
      id: 8,
      name: 'JCB Excavator',
      category: 'Heavy Machinery',
      costPerHour: 600,
      state: 'Rajasthan',
      district: 'Jaipur',
      village: 'Sanganer',
      owner: 'Ramesh Sharma',
      phone: '+91 9876543217',
      description: 'Heavy-duty JCB for land preparation and construction work. Experienced operator included.',
      availability: 'Available',
      image: '/Farming Tools Images/JCB.jpg',
      rating: 4.7,
      totalBookings: 41,
      yearMade: 2019,
      featured: true,
      tags: ['Operator Included', 'Heavy Duty', 'Multi-Purpose']
    },
    {
      id: 9,
      name: 'Cultivator',
      category: 'Tillage Equipment',
      costPerHour: 180,
      state: 'Gujarat',
      district: 'Ahmedabad',
      village: 'Dholka',
      owner: 'Kiran Patel',
      phone: '+91 9876543218',
      description: 'Multi-purpose cultivator for soil cultivation and weed management. Suitable for various crops.',
      availability: 'Available',
      image: '/Farming Tools Images/Cultivator.jpg',
      rating: 4.2,
      totalBookings: 19,
      yearMade: 2021,
      featured: false,
      tags: ['Multi-Purpose', 'Adjustable', 'Easy Operation']
    },
    {
      id: 10,
      name: 'Sprayer',
      category: 'Irrigation',
      costPerHour: 120,
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      village: 'Mohanlalganj',
      owner: 'Sunil Kumar',
      phone: '+91 9876543219',
      description: 'High-pressure sprayer for pesticide and fertilizer application. Tank capacity 200 liters.',
      availability: 'Available',
      image: '/Farming Tools Images/Sprayer.jpg',
      rating: 4.6,
      totalBookings: 37,
      yearMade: 2020,
      featured: false,
      tags: ['High Pressure', 'Large Tank', 'Even Spray']
    },
    {
      id: 11,
      name: 'Disc Plough',
      category: 'Tillage Equipment',
      costPerHour: 220,
      state: 'Madhya Pradesh',
      district: 'Indore',
      village: 'Mhow',
      owner: 'Akash Verma',
      phone: '+91 9876543220',
      description: 'Heavy-duty disc plough for primary tillage operations. Suitable for hard soil conditions.',
      availability: 'Available',
      image: '/Farming Tools Images/Disc Plough.jpg',
      rating: 4.5,
      totalBookings: 24,
      yearMade: 2021,
      featured: false,
      tags: ['Heavy Duty', 'Hard Soil', 'Durable']
    },
    {
      id: 12,
      name: 'Drone Sprayer',
      category: 'Modern Technology',
      costPerHour: 400,
      state: 'Karnataka',
      district: 'Mysore',
      village: 'Hunsur',
      owner: 'Priya Reddy',
      phone: '+91 9876543221',
      description: 'Advanced drone sprayer for precision agriculture. GPS-enabled with automated spraying.',
      availability: 'Available',
      image: '/Farming Tools Images/Drone Sprayer.jpg',
      rating: 4.9,
      totalBookings: 18,
      yearMade: 2023,
      featured: true,
      tags: ['GPS Enabled', 'Precision Agriculture', 'Automated']
    }
  ]);

  const [newTool, setNewTool] = useState({
    name: '',
    category: '',
    costPerHour: '',
    state: '',
    district: '',
    village: '',
    owner: '',
    phone: '',
    description: '',
    availability: 'Available'
  });

  const categories = ['all', 'Heavy Machinery', 'Tillage Equipment', 'Irrigation', 'Planting Equipment', 'Harvesting', 'Hand Tools', 'Modern Technology'];

  // Function to get icon based on tool category
  const getToolIcon = (category) => {
    switch (category) {
      case 'Heavy Machinery':
        return <FaTractor size={40} color="#28a745" />;
      case 'Tillage Equipment':
        return <FaCog size={40} color="#007bff" />;
      case 'Irrigation':
        return <FaTint size={40} color="#17a2b8" />;
      case 'Planting Equipment':
        return <FaSeedling size={40} color="#28a745" />;
      case 'Harvesting':
        return <FaCog size={40} color="#ffc107" />;
      case 'Hand Tools':
        return <FaWrench size={40} color="#dc3545" />;
      default:
        return <FaTools size={40} color="#666" />;
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddTool = () => {
    if (newTool.name && newTool.category && newTool.costPerHour) {
      const tool = {
        ...newTool,
        id: tools.length + 1,
        costPerHour: parseInt(newTool.costPerHour)
      };
      setTools([...tools, tool]);
      setNewTool({
        name: '',
        category: '',
        costPerHour: '',
        state: '',
        district: '',
        village: '',
        owner: '',
        phone: '',
        description: '',
        availability: 'Available'
      });
      setActiveTab('browse');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', marginTop: '100px' }}>
        {/* Header Section */}
        <div style={headerSection}>
          <h1 style={pageTitle}>
            <FaTools style={{ marginRight: '15px', color: '#28a745' }} />
            Resource Share Hub
          </h1>
          <p style={pageSubtitle}>Share and rent agricultural tools with fellow farmers</p>
        </div>

        {/* Tab Navigation */}
        <div style={tabContainer}>
          <button 
            onClick={() => setActiveTab('browse')}
            style={{...tabButton, ...(activeTab === 'browse' ? activeTabButton : {})}}
          >
            <FaSearch style={{ marginRight: '8px' }} />
            Browse Tools
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            style={{...tabButton, ...(activeTab === 'add' ? activeTabButton : {})}}
          >
            <FaPlus style={{ marginRight: '8px' }} />
            Add Tool
          </button>
        </div>

        {activeTab === 'browse' ? (
          <div>
            {/* Search and Filter Section */}
            <div style={filterSection}>
              <div style={searchContainer}>
                <FaSearch style={searchIcon} />
                <input
                  type="text"
                  placeholder="Search tools, owners, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={searchInput}
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={categorySelect}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tools Grid */}
            <div style={toolsGrid}>
              {filteredTools.map(tool => (
                <div 
                  key={tool.id} 
                  style={{
                    ...toolCard, 
                    ...(tool.featured ? featuredCard : {}),
                    transform: hoveredCard === tool.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: hoveredCard === tool.id ? '0 20px 40px rgba(0,0,0,0.15)' : (tool.featured ? '0 8px 25px rgba(255, 215, 0, 0.2)' : '0 8px 25px rgba(0,0,0,0.1)')
                  }}
                  onMouseEnter={() => setHoveredCard(tool.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {tool.featured && (
                    <div style={featuredBadge}>
                      <FaStar style={{ marginRight: '5px' }} />
                      Featured
                    </div>
                  )}
                  
                  <div style={toolImageContainer}>
                    {tool.image ? (
                      <img 
                        src={tool.image} 
                        alt={tool.name}
                        style={toolImage}
                        onError={(e) => {
                          console.log('Image failed to load:', tool.image);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                        onLoad={(e) => {
                          console.log('Image loaded successfully:', tool.image);
                        }}
                      />
                    ) : null}
                    <div style={{...toolImagePlaceholder, display: tool.image ? 'none' : 'flex'}}>
                      {getToolIcon(tool.category)}
                      <div style={{ marginTop: '10px', textAlign: 'center', color: '#666' }}>
                        <small>{tool.name}</small>
                      </div>
                    </div>
                    <div style={{...availabilityBadge, 
                      backgroundColor: tool.availability === 'Available' ? '#28a745' : '#dc3545'
                    }}>
                      {tool.availability}
                    </div>
                    
                    {/* Image overlay with actions */}
                    <div style={{
                      ...imageOverlay,
                      opacity: hoveredCard === tool.id ? 1 : 0
                    }}>
                      <button style={overlayButton} title="Add to Favorites">
                        <FaHeart />
                      </button>
                      <button style={overlayButton} title="Share">
                        <FaShareAlt />
                      </button>
                    </div>
                  </div>
                  
                  <div style={toolInfo}>
                    <div style={toolHeader}>
                      <h3 style={toolName}>{tool.name}</h3>
                      <div style={ratingContainer}>
                        <FaStar style={{ color: '#ffc107', fontSize: '14px' }} />
                        <span style={ratingText}>{tool.rating}</span>
                      </div>
                    </div>
                    
                    <div style={toolMeta}>
                      <span style={toolCategory}>{tool.category}</span>
                      <span style={yearBadge}>{tool.yearMade}</span>
                    </div>
                    
                    <p style={toolDescription}>{tool.description}</p>
                    
                    {/* Tags */}
                    <div style={tagsContainer}>
                      {tool.tags.map((tag, index) => (
                        <span key={index} style={tagBadge}>{tag}</span>
                      ))}
                    </div>
                    
                    <div style={toolDetails}>
                      <div style={detailRow}>
                        <FaRupeeSign style={detailIcon} />
                        <span style={priceText}>₹{tool.costPerHour}/hour</span>
                      </div>
                      <div style={detailRow}>
                        <FaMapMarkerAlt style={detailIcon} />
                        <span>{tool.village}, {tool.district}, {tool.state}</span>
                      </div>
                      <div style={detailRow}>
                        <FaUser style={detailIcon} />
                        <span>{tool.owner}</span>
                      </div>
                      <div style={detailRow}>
                        <FaPhone style={detailIcon} />
                        <span>{tool.phone}</span>
                      </div>
                      <div style={detailRow}>
                        <FaCalendarAlt style={detailIcon} />
                        <span>{tool.totalBookings} bookings</span>
                      </div>
                    </div>

                    <div style={toolActions}>
                      <button 
                        style={{...primaryActionButton, 
                          backgroundColor: tool.availability === 'Available' ? '#28a745' : '#6c757d',
                          cursor: tool.availability === 'Available' ? 'pointer' : 'not-allowed'
                        }}
                        disabled={tool.availability !== 'Available'}
                      >
                        {tool.availability === 'Available' ? (
                          <>
                            <FaShieldAlt style={{ marginRight: '8px' }} />
                            Book Now
                          </>
                        ) : (
                          <>
                            <FaClock style={{ marginRight: '8px' }} />
                            Not Available
                          </>
                        )}
                      </button>
                      <button style={secondaryActionButton}>
                        <FaPhone style={{ marginRight: '8px' }} />
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={addToolSection}>
            <h2 style={sectionTitle}>Add Your Tool for Rent</h2>
            
            <div style={addToolForm}>
              <div style={formRow}>
                <div style={formGroup}>
                  <label style={formLabel}>Tool Name</label>
                  <input
                    type="text"
                    value={newTool.name}
                    onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                    style={formInput}
                    placeholder="e.g., Tractor (John Deere)"
                  />
                </div>
                <div style={formGroup}>
                  <label style={formLabel}>Category</label>
                  <select
                    value={newTool.category}
                    onChange={(e) => setNewTool({...newTool, category: e.target.value})}
                    style={formInput}
                  >
                    <option value="">Select Category</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={formRow}>
                <div style={formGroup}>
                  <label style={formLabel}>Cost per Hour (₹)</label>
                  <input
                    type="number"
                    value={newTool.costPerHour}
                    onChange={(e) => setNewTool({...newTool, costPerHour: e.target.value})}
                    style={formInput}
                    placeholder="Enter hourly rate"
                  />
                </div>
                <div style={formGroup}>
                  <label style={formLabel}>State</label>
                  <input
                    type="text"
                    value={newTool.state}
                    onChange={(e) => setNewTool({...newTool, state: e.target.value})}
                    style={formInput}
                    placeholder="e.g., Telangana"
                  />
                </div>
              </div>

              <div style={formRow}>
                <div style={formGroup}>
                  <label style={formLabel}>District</label>
                  <input
                    type="text"
                    value={newTool.district}
                    onChange={(e) => setNewTool({...newTool, district: e.target.value})}
                    style={formInput}
                    placeholder="e.g., Hyderabad"
                  />
                </div>
                <div style={formGroup}>
                  <label style={formLabel}>Village/Area</label>
                  <input
                    type="text"
                    value={newTool.village}
                    onChange={(e) => setNewTool({...newTool, village: e.target.value})}
                    style={formInput}
                    placeholder="e.g., Gachibowli"
                  />
                </div>
              </div>

              <div style={formRow}>
                <div style={formGroup}>
                  <label style={formLabel}>Owner Name</label>
                  <input
                    type="text"
                    value={newTool.owner}
                    onChange={(e) => setNewTool({...newTool, owner: e.target.value})}
                    style={formInput}
                    placeholder="Your name"
                  />
                </div>
                <div style={formGroup}>
                  <label style={formLabel}>Phone Number</label>
                  <input
                    type="tel"
                    value={newTool.phone}
                    onChange={(e) => setNewTool({...newTool, phone: e.target.value})}
                    style={formInput}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div style={formGroup}>
                <label style={formLabel}>Description</label>
                <textarea
                  value={newTool.description}
                  onChange={(e) => setNewTool({...newTool, description: e.target.value})}
                  style={{...formInput, height: '100px', resize: 'vertical'}}
                  placeholder="Describe your tool, its condition, and any special instructions..."
                />
              </div>

              <div style={formActions}>
                <button 
                  onClick={handleAddTool}
                  style={submitButton}
                >
                  Add Tool
                </button>
                <button 
                  onClick={() => setNewTool({
                    name: '',
                    category: '',
                    costPerHour: '',
                    state: '',
                    district: '',
                    village: '',
                    owner: '',
                    phone: '',
                    description: '',
                    availability: 'Available'
                  })}
                  style={cancelButton}
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const headerSection = {
  textAlign: 'center',
  padding: '50px 20px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  marginBottom: '40px',
  color: 'white'
};

const pageTitle = {
  fontSize: '3rem',
  fontWeight: 'bold',
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
};

const pageSubtitle = {
  fontSize: '1.3rem',
  margin: 0,
  opacity: 0.9,
  fontWeight: '300'
};

const tabContainer = {
  display: 'flex',
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '8px',
  marginBottom: '40px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  border: '1px solid #e0e0e0'
};

const tabButton = {
  flex: 1,
  padding: '16px 24px',
  border: 'none',
  backgroundColor: 'transparent',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  color: '#666'
};

const activeTabButton = {
  backgroundColor: '#28a745',
  color: 'white',
  boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
};

const filterSection = {
  display: 'flex',
  gap: '20px',
  marginBottom: '40px',
  flexWrap: 'wrap',
  alignItems: 'center'
};

const searchContainer = {
  position: 'relative',
  flex: 1,
  minWidth: '320px'
};

const searchIcon = {
  position: 'absolute',
  left: '18px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#666',
  fontSize: '16px'
};

const searchInput = {
  width: '100%',
  padding: '16px 16px 16px 50px',
  border: '2px solid #e0e0e0',
  borderRadius: '12px',
  fontSize: '16px',
  outline: 'none',
  transition: 'all 0.3s ease',
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const categorySelect = {
  padding: '16px 20px',
  border: '2px solid #e0e0e0',
  borderRadius: '12px',
  fontSize: '16px',
  backgroundColor: 'white',
  outline: 'none',
  minWidth: '200px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const toolsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
  gap: '30px',
  marginTop: '20px'
};

const toolCard = {
  backgroundColor: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  cursor: 'pointer',
  border: '1px solid #f0f0f0',
  position: 'relative',
  height: 'fit-content',
  minHeight: '600px'
};

const featuredCard = {
  border: '2px solid #ffd700',
  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.2)'
};

const featuredBadge = {
  position: 'absolute',
  top: '15px',
  left: '15px',
  backgroundColor: '#ffd700',
  color: '#333',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'bold',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
};

const toolImageContainer = {
  position: 'relative',
  height: '220px',
  overflow: 'hidden',
  background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
  borderRadius: '12px 12px 0 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const toolImage = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  objectPosition: 'center',
  transition: 'transform 0.5s ease',
  backgroundColor: '#f8f9fa'
};

const toolImagePlaceholder = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  backgroundColor: '#f8f9fa',
  color: '#666'
};

const imageOverlay = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  display: 'flex',
  gap: '8px',
  opacity: 0,
  transition: 'opacity 0.3s ease'
};

const overlayButton = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  color: '#333',
  backdropFilter: 'blur(10px)'
};

const availabilityBadge = {
  position: 'absolute',
  bottom: '15px',
  right: '15px',
  padding: '6px 16px',
  borderRadius: '25px',
  color: 'white',
  fontSize: '12px',
  fontWeight: '600',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
};

const toolInfo = {
  padding: '25px'
};

const toolHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px'
};

const toolName = {
  fontSize: '1.4rem',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: 0,
  lineHeight: '1.3'
};

const ratingContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  backgroundColor: '#f8f9fa',
  padding: '4px 8px',
  borderRadius: '12px'
};

const ratingText = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#333'
};

const toolMeta = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px'
};

const toolCategory = {
  fontSize: '14px',
  color: '#28a745',
  fontWeight: '600',
  backgroundColor: '#e8f5e8',
  padding: '4px 12px',
  borderRadius: '12px'
};

const yearBadge = {
  fontSize: '12px',
  color: '#666',
  backgroundColor: '#f0f0f0',
  padding: '4px 8px',
  borderRadius: '8px',
  fontWeight: '500'
};

const toolDescription = {
  fontSize: '14px',
  color: '#666',
  marginBottom: '15px',
  lineHeight: '1.5'
};

const tagsContainer = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginBottom: '20px'
};

const tagBadge = {
  fontSize: '11px',
  color: '#007bff',
  backgroundColor: '#e3f2fd',
  padding: '3px 8px',
  borderRadius: '8px',
  fontWeight: '500',
  border: '1px solid #bbdefb'
};

const toolDetails = {
  marginBottom: '25px'
};

const detailRow = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
  fontSize: '14px',
  color: '#555'
};

const detailIcon = {
  marginRight: '10px',
  color: '#28a745',
  minWidth: '16px',
  fontSize: '14px'
};

const priceText = {
  fontWeight: '700',
  color: '#28a745',
  fontSize: '16px'
};

const toolActions = {
  display: 'flex',
  gap: '12px'
};

const primaryActionButton = {
  flex: 2,
  padding: '14px 20px',
  border: 'none',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

const secondaryActionButton = {
  flex: 1,
  padding: '14px 16px',
  border: '2px solid #007bff',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  color: '#007bff',
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

// Add Tool Section Styles
const addToolSection = {
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '40px',
  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  marginTop: '20px'
};

const sectionTitle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '30px',
  textAlign: 'center'
};

const addToolForm = {
  display: 'flex',
  flexDirection: 'column',
  gap: '25px'
};

const formRow = {
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap'
};

const formGroup = {
  flex: 1,
  minWidth: '250px',
  display: 'flex',
  flexDirection: 'column'
};

const formLabel = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#333',
  marginBottom: '8px'
};

const formInput = {
  padding: '16px',
  border: '2px solid #e0e0e0',
  borderRadius: '12px',
  fontSize: '16px',
  outline: 'none',
  transition: 'all 0.3s ease',
  backgroundColor: 'white'
};

const formActions = {
  display: 'flex',
  gap: '20px',
  justifyContent: 'center',
  marginTop: '30px'
};

const submitButton = {
  padding: '16px 40px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
};

const cancelButton = {
  padding: '16px 40px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(108, 117, 125, 0.3)'
};

export default ResourceSharePage;