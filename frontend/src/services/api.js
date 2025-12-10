// src/services/api.js
import axios from "axios";
import { getAccessToken, saveTokens, clearTokens } from "./auth";

// Base URL for your Django backend
const API_BASE_URL = "http://127.0.0.1:8000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

/**
 * REQUEST INTERCEPTOR
 * Attach Authorization: Bearer <access_token> if available
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * -------------------------
 *  AUTH ENDPOINTS
 * -------------------------
 */

// Login: POST /api/auth/login/
export const login = async (username, password) => {
  try {
    const res = await apiClient.post("/auth/login/", { username, password });

    // SimpleJWT returns: { access, refresh }
    const { access, refresh } = res.data || {};
    if (access && refresh) {
      saveTokens(access, refresh);
    }

    return res.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

// Refresh token: POST /api/auth/refresh/
export const refreshAccessToken = async () => {
  try {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) throw new Error("No refresh token available");

    const res = await apiClient.post("/auth/refresh/", { refresh });
    const { access } = res.data || {};
    if (access) {
      saveTokens(access, refresh);
    }
    return access;
  } catch (error) {
    console.error("Refresh token error:", error.response?.data || error.message);
    clearTokens();
    throw error;
  }
};

// Logout helper (frontend-only)
export const logout = () => {
  clearTokens();
};

/**
 * -------------------------
 *  FRAUD & TRANSACTIONS
 * -------------------------
 */

// Predict fraud for a single transaction
// (this is your existing function, now automatically sends JWT)
export const predictFraud = async (transactionData) => {
  try {
    const response = await apiClient.post("/predict/", transactionData);
    return response.data;
  } catch (error) {
    console.error(
      "Error predicting fraud:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Get transaction history for current logged-in user
// You will implement /api/transactions/ in Django as "my_transactions"
export const getTransactionHistory = async () => {
  try {
    const response = await apiClient.get("/transactions/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching transactions:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// (Optional) stats/dashboard endpoint if you create it
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get("/stats/");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching stats:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default apiClient;
