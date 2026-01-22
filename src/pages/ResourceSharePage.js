import React, { useState } from 'react';
import { 
  FaTools, FaPlus, FaSearch, FaMapMarkerAlt, FaRupeeSign, FaUser, FaPhone, 
  FaTractor, FaCog, FaWrench, FaSeedling, FaTint, FaStar, FaHeart, FaShareAlt, 
  FaCalendarAlt, FaShieldAlt, FaClock, FaFilter, FaImage, FaCheckCircle, FaTimesCircle 
} from 'react-icons/fa';
import './ResourceSharePage.css';

const ResourceSharePage = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');

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
  const states = ['all', 'Telangana', 'Maharashtra', 'Karnataka', 'Punjab', 'Haryana', 'Rajasthan', 'Gujarat', 'Uttar Pradesh', 'Madhya Pradesh'];

  // Function to get icon based on tool category
  const getToolIcon = (category) => {
    switch (category) {
      case 'Heavy Machinery':
        return <FaTractor size={60} />;
      case 'Tillage Equipment':
        return <FaCog size={60} />;
      case 'Irrigation':
        return <FaTint size={60} />;
      case 'Planting Equipment':
        return <FaSeedling size={60} />;
      case 'Harvesting':
        return <FaCog size={60} />;
      case 'Hand Tools':
        return <FaWrench size={60} />;
      case 'Modern Technology':
        return <FaTools size={60} />;
      default:
        return <FaTools size={60} />;
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesState = selectedState === 'all' || tool.state === selectedState;
    return matchesSearch && matchesCategory && matchesState;
  });

  const handleAddTool = () => {
    if (newTool.name && newTool.category && newTool.costPerHour) {
      const tool = {
        ...newTool,
        id: tools.length + 1,
        costPerHour: parseInt(newTool.costPerHour),
        rating: 4.5,
        totalBookings: 0,
        yearMade: new Date().getFullYear(),
        featured: false,
        tags: []
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
    <div className="resource-share-page">
      <div className="resource-container">
        {/* Header */}
        <div className="resource-header">
          <h1>
            <FaTools />
            Resource Share Hub
          </h1>
          <p className="resource-subtitle">
            Connect, Share, and Rent Premium Agricultural Equipment
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            <FaSearch />
            Browse Tools
          </button>
          <button 
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            <FaPlus />
            List Your Tool
          </button>
        </div>

        {activeTab === 'browse' ? (
          <>
            {/* Filter Section */}
            <div className="filter-section">
              <div className="filter-row">
                <div className="filter-group">
                  <label className="filter-label">
                    <FaSearch />
                    Search Tools
                  </label>
                  <div className="search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search by name, owner, location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">
                    <FaFilter />
                    Category
                  </label>
                  <select
                    className="filter-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">
                    <FaMapMarkerAlt />
                    State
                  </label>
                  <select
                    className="filter-select"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    {states.map(state => (
                      <option key={state} value={state}>
                        {state === 'all' ? 'All States' : state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tools Grid */}
            {filteredTools.length > 0 ? (
              <div className="tools-grid">
                {filteredTools.map(tool => (
                  <div 
                    key={tool.id}
                    className={`tool-card ${tool.featured ? 'featured' : ''}`}
                  >
                    {tool.featured && (
                      <div className="featured-badge">
                        <FaStar />
                        Featured
                      </div>
                    )}

                    <div className="tool-image-container">
                      {tool.image ? (
                        <img 
                          src={tool.image}
                          alt={tool.name}
                          className="tool-image"
                        />
                      ) : (
                        <div className="tool-image-placeholder">
                          {getToolIcon(tool.category)}
                          <span>{tool.name}</span>
                        </div>
                      )}
                      
                      <div className={`availability-badge ${tool.availability === 'Available' ? 'available' : 'unavailable'}`}>
                        {tool.availability === 'Available' ? <FaCheckCircle /> : <FaTimesCircle />}
                        {tool.availability}
                      </div>

                      <div className="tool-actions-overlay">
                        <button className="action-btn" title="Add to Favorites">
                          <FaHeart />
                        </button>
                        <button className="action-btn" title="Share">
                          <FaShareAlt />
                        </button>
                      </div>
                    </div>

                    <div className="tool-info">
                      <div className="tool-header">
                        <h3 className="tool-name">{tool.name}</h3>
                        <div className="rating-badge">
                          <FaStar />
                          {tool.rating}
                        </div>
                      </div>

                      <div className="tool-meta">
                        <span className="category-badge">{tool.category}</span>
                        <span className="year-badge">{tool.yearMade}</span>
                      </div>

                      <p className="tool-description">{tool.description}</p>

                      <div className="tool-tags">
                        {tool.tags && tool.tags.map((tag, idx) => (
                          <span key={idx} className="tag">{tag}</span>
                        ))}
                      </div>

                      <div className="tool-details">
                        <div className="detail-item">
                          <div className="detail-icon">
                            <FaRupeeSign />
                          </div>
                          <span className="detail-text price">₹{tool.costPerHour}/hour</span>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon">
                            <FaMapMarkerAlt />
                          </div>
                          <span className="detail-text">{tool.village}, {tool.district}, {tool.state}</span>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon">
                            <FaUser />
                          </div>
                          <span className="detail-text">{tool.owner}</span>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon">
                            <FaPhone />
                          </div>
                          <span className="detail-text">{tool.phone}</span>
                        </div>
                        <div className="detail-item">
                          <div className="detail-icon">
                            <FaCalendarAlt />
                          </div>
                          <span className="detail-text">{tool.totalBookings} Bookings</span>
                        </div>
                      </div>

                      <div className="tool-buttons">
                        <button 
                          className="btn-primary"
                          disabled={tool.availability !== 'Available'}
                        >
                          {tool.availability === 'Available' ? (
                            <>
                              <FaShieldAlt />
                              Book Now
                            </>
                          ) : (
                            <>
                              <FaClock />
                              Not Available
                            </>
                          )}
                        </button>
                        <button className="btn-secondary">
                          <FaPhone />
                          Call
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <FaTools />
                <h3>No Tools Found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        ) : (
          <div className="add-tool-section">
            <h2 className="section-title">List Your Tool for Rent</h2>
            <form className="add-tool-form" onSubmit={(e) => { e.preventDefault(); handleAddTool(); }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <FaTools />
                    Tool Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Tractor (John Deere)"
                    value={newTool.name}
                    onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaFilter />
                    Category
                  </label>
                  <select
                    className="form-select"
                    value={newTool.category}
                    onChange={(e) => setNewTool({...newTool, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <FaRupeeSign />
                    Cost per Hour (₹)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Enter hourly rate"
                    value={newTool.costPerHour}
                    onChange={(e) => setNewTool({...newTool, costPerHour: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaMapMarkerAlt />
                    State
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Telangana"
                    value={newTool.state}
                    onChange={(e) => setNewTool({...newTool, state: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <FaMapMarkerAlt />
                    District
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Hyderabad"
                    value={newTool.district}
                    onChange={(e) => setNewTool({...newTool, district: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaMapMarkerAlt />
                    Village/Area
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Gachibowli"
                    value={newTool.village}
                    onChange={(e) => setNewTool({...newTool, village: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <FaUser />
                    Owner Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your name"
                    value={newTool.owner}
                    onChange={(e) => setNewTool({...newTool, owner: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FaPhone />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 9876543210"
                    value={newTool.phone}
                    onChange={(e) => setNewTool({...newTool, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  <FaImage />
                  Description
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe your tool, its condition, features, and any special instructions..."
                  value={newTool.description}
                  onChange={(e) => setNewTool({...newTool, description: e.target.value})}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  <FaCheckCircle />
                  Add Tool
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
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
                >
                  <FaTimesCircle />
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceSharePage;
