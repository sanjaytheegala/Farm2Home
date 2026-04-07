import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaSort } from 'react-icons/fa';
import './FilterSection.css';

const FilterSection = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  organicOnly,
  onOrganicToggle,
  onResetFilters,
  layout = 'sidebar', // Add layout prop
  categories
}) => {
  const { t } = useTranslation();

  const effectiveCategories = (categories && categories.length > 0)
    ? categories
    : [
      { id: 'all', label: t('cd_category_all') },
      { id: 'grains-pulses', label: t('cd_category_grains_pulses') },
      { id: 'vegetables', label: t('cd_category_vegetables') },
      { id: 'leafy-greens', label: t('cd_category_leafy_greens') },
      { id: 'fruits', label: t('cd_category_fruits') },
      { id: 'spices', label: t('cd_category_spices') },
      { id: 'dry-fruits', label: t('dry_fruits') },
    ];

  return (
    <div className={`filter-section filter-section--${layout}`}>
      {/* Organic Toggle + Reset — cleaner row */}
      <div className="filter-actions-row">
        <label className="organic-switch">
          <input 
            type="checkbox" 
            checked={organicOnly} 
            onChange={(e) => onOrganicToggle(e.target.checked)} 
          />
          <span className="slider"></span>
          <span className="label-text">{t('organic_only')}</span>
        </label>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <label className="filter-label">{t('categories')}</label>
        <div className="category-list-sidebar">
          {effectiveCategories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="filter-controls">
        <div className="filter-control">
          <label className="filter-label">
            <FaSort /> {t('sort_by')}
          </label>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="featured">{t('featured')}</option>
            <option value="price_low">{t('price_low_to_high')}</option>
            <option value="price_high">{t('price_high_to_low')}</option>
            <option value="rating">{t('rating_high_to_low')}</option>
            <option value="newest">{t('newest_first')}</option>
            <option value="popular">{t('most_popular')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
