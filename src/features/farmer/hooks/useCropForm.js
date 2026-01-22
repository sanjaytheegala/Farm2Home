import { useState } from 'react';

/**
 * Custom hook for managing crop form state
 * Handles form inputs, validation, and row management
 */
export const useCropForm = () => {
  const [rows, setRows] = useState([{
    crop: '',
    quantity: '',
    price: '',
    status: 'available',
    harvestDate: '',
    notes: ''
  }]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedState, setSelectedState] = useState('telangana');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Add a new empty row to the form
  const addRow = () => {
    setRows([...rows, {
      crop: '',
      quantity: '',
      price: '',
      status: 'available',
      harvestDate: '',
      notes: ''
    }]);
  };

  // Update a specific field in a row
  const updateField = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Reset form to initial state
  const resetForm = () => {
    setRows([{
      crop: '',
      quantity: '',
      price: '',
      status: 'available',
      harvestDate: '',
      notes: ''
    }]);
    setShowAddForm(false);
  };

  // Validate form data
  const validateRow = (row) => {
    if (!row.crop || !row.quantity || !row.price) {
      return { valid: false, message: 'Please fill in all required fields' };
    }
    if (isNaN(row.price) || parseFloat(row.price) <= 0) {
      return { valid: false, message: 'Please enter a valid price' };
    }
    return { valid: true };
  };

  // Get form data for a row with location
  const getRowData = (index) => {
    const row = rows[index];
    return {
      cropName: row.crop,
      quantity: row.quantity,
      price: parseFloat(row.price),
      status: row.status,
      harvestDate: row.harvestDate,
      notes: row.notes,
      state: selectedState,
      district: selectedDistrict
    };
  };

  return {
    rows,
    showAddForm,
    selectedState,
    selectedDistrict,
    setShowAddForm,
    setSelectedState,
    setSelectedDistrict,
    addRow,
    updateField,
    resetForm,
    validateRow,
    getRowData
  };
};
