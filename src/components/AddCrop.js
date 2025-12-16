import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CROP_DICTIONARY } from '../data/cropData';

const AddCrop = () => {
  const [cropName, setCropName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  // Levenshtein Distance Algorithm - Calculates similarity between two strings
  // Returns the minimum number of edits (insertions, deletions, substitutions) needed
  const calculateLevenshteinDistance = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    
    // Create a 2D array for dynamic programming
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    
    // Initialize first row and column
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    // Fill the matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    return matrix[len1][len2];
  };

  // Calculate similarity score (0 to 1, where 1 is identical)
  const calculateSimilarity = (str1, str2) => {
    const distance = calculateLevenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    
    // Convert distance to similarity score (0 to 1)
    return maxLength === 0 ? 1 : 1 - (distance / maxLength);
  };

  // Helper function with Fuzzy Matching - handles spelling mistakes
  const getCropImage = (userInput) => {
    const normalizedInput = userInput.toLowerCase().trim();
    
    // Default image
    const defaultImage = 'https://cdn-icons-png.flaticon.com/512/6008/6008522.png';
    
    // If input is empty, return default
    if (!normalizedInput) return defaultImage;
    
    let bestMatch = null;
    let bestScore = 0;
    const SIMILARITY_THRESHOLD = 0.7; // 70% similarity required
    
    // Loop through each crop in the dictionary
    for (const crop of CROP_DICTIONARY) {
      // Loop through each keyword of the crop
      for (const keyword of crop.keywords) {
        const normalizedKeyword = keyword.toLowerCase();
        
        // Check for exact match first
        if (normalizedInput === normalizedKeyword || normalizedInput.includes(normalizedKeyword)) {
          return crop.image;
        }
        
        // Calculate similarity for fuzzy matching
        const similarity = calculateSimilarity(normalizedInput, normalizedKeyword);
        
        // Allow 1-2 character differences (typos)
        const distance = calculateLevenshteinDistance(normalizedInput, normalizedKeyword);
        const allowedErrors = normalizedKeyword.length <= 4 ? 1 : 2;
        
        if (distance <= allowedErrors && similarity > bestScore) {
          bestScore = similarity;
          bestMatch = crop;
        } else if (similarity >= SIMILARITY_THRESHOLD && similarity > bestScore) {
          bestScore = similarity;
          bestMatch = crop;
        }
      }
    }
    
    // Return matched crop image or default
    return bestMatch ? bestMatch.image : defaultImage;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Add document to Firestore
      await addDoc(collection(db, 'crops'), {
        cropName,
        price: Number(price),
        quantity,
        district,
        imageURL: getCropImage(cropName),
        farmerId: 'test_farmer_123',
        createdAt: new Date()
      });

      // Success message
      alert('Crop Added Successfully');

      // Clear form
      setCropName('');
      setPrice('');
      setQuantity('');
      setDistrict('');
    } catch (error) {
      console.error('Error adding crop:', error);
      alert('Failed to add crop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ textAlign: 'center', color: '#28a745', marginBottom: '30px' }}>Add New Crop</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            Crop Name
          </label>
          <input
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            required
            placeholder="e.g., Rice, Tomato, Cotton"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            Price (per kg)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="e.g., 50"
            min="0"
            step="0.01"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            Quantity
          </label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            placeholder="e.g., 100 kg"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            District
          </label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
            placeholder="e.g., Hyderabad, Mumbai"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: loading ? '#ccc' : '#28a745',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          {loading ? 'Adding Crop...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default AddCrop;
