// src/services/auth.js
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000"; // update if different
const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

// helpers
export const saveTokens = (access, refresh) => {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

// API calls
export const login = async (username, password) => {
  const res = await axios.post(`${API_BASE}/api/auth/login/`, { username, password });
  const { access, refresh } = res.data || {};
  saveTokens(access, refresh);
  return res.data;
};

export const register = async (username, password, email = "") => {
  // backend must implement /api/auth/register/ if you want sign-up
  const res = await axios.post(`${API_BASE}/api/auth/register/`, { username, password, email });
  return res.data;
};

export const logout = () => {
  clearTokens();
};
