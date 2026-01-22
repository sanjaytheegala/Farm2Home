import React from 'react';
import { FaFilter, FaSort, FaLeaf, FaTimes } from 'react-icons/fa';
import './FilterSection.css';

const FilterSection = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  organicOnly,
  onOrganicToggle,
  onResetFilters,
  categories = ['all', 'Fruits', 'Vegetables', 'Dry Fruits']
}) => {
  return (
    <div className="filter-section">
      {/* Category Filter */}
      <div className="filter-group">
        <label className="filter-label">
          <FaFilter /> Category
        </label>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
            >
              {category === 'all' ? 'All Products' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Sort and Filters */}
      <div className="filter-controls">
        {/* Sort Dropdown */}
        <div className="filter-control">
          <label className="filter-label">
            <FaSort /> Sort By
          </label>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Organic Filter */}
        <div className="filter-control">
          <label className="organic-checkbox">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => onOrganicToggle(e.target.checked)}
            />
            <FaLeaf className="organic-icon" />
            <span>Organic Only</span>
          </label>
        </div>

        {/* Reset Filters */}
        <button 
          className="reset-filters-btn"
          onClick={onResetFilters}
        >
          <FaTimes />
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
