import { useState, useMemo } from 'react';

/**
 * Custom hook to manage product filtering and sorting
 * Handles search, category, price filters, and sorting
 */
export const useFilters = (products) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [selectedStates, setSelectedStates] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Organic filter
    if (organicOnly) {
      filtered = filtered.filter(product => product.organic === true);
    }

    // State filter
    if (selectedStates.length > 0) {
      filtered = filtered.filter(product => selectedStates.includes(product.state));
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.pricePerKg >= priceRange[0] && product.pricePerKg <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.pricePerKg - b.pricePerKg);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.pricePerKg - a.pricePerKg);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate));
        break;
      case 'popular':
        filtered.sort((a, b) => b.totalSales - a.totalSales);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, organicOnly, selectedStates, priceRange]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('featured');
    setOrganicOnly(false);
    setSelectedStates([]);
    setPriceRange([0, 1000]);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    organicOnly,
    setOrganicOnly,
    selectedStates,
    setSelectedStates,
    priceRange,
    setPriceRange,
    filteredProducts,
    resetFilters
  };
};
