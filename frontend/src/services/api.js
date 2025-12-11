// src/services/api.js
import axios from "axios";
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./auth";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// attach access token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor to try refresh once if 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    // If unauthorized and we have refresh token, try refresh (once)
    if (status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("No refresh token");
        const r = await axios.post(`${API_BASE_URL.replace("/api","")}/api/auth/refresh/`, { refresh });
        const newAccess = r.data?.access;
        const newRefresh = r.data?.refresh || refresh;
        saveTokens(newAccess, newRefresh);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(original);
      } catch (e) {
        clearTokens();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// endpoints
export const predictFraud = async (transactionData) => {
  const res = await apiClient.post("/predict/", transactionData);
  return res.data;
};

// fetch current user's transactions
export const getMyTransactions = async () => {
  const res = await apiClient.get("/my-transactions/");
  return res.data;
};

// alias for older naming if you used getTransactionHistory
export const getTransactionHistory = getMyTransactions;

export default apiClient;
