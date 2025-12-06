import axios from 'axios';

// Base URL for your Django backend
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Predict fraud for a single transaction
export const predictFraud = async (transactionData) => {
  try {
    const response = await apiClient.post('/predict/', transactionData);
    return response.data;
  } catch (error) {
    console.error('Error predicting fraud:', error.response?.data || error.message);
    throw error;
  }
};

// Get transaction history (if you have this endpoint)
export const getTransactionHistory = async () => {
  try {
    const response = await apiClient.get('/transactions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.response?.data || error.message);
    throw error;
  }
};

// Get statistics/dashboard data (if you have this endpoint)
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/stats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error.response?.data || error.message);
    throw error;
  }
};

export default apiClient;
