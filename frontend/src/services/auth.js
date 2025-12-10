// src/services/auth.js
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";
const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

// ===============================
// Token helpers (localStorage)
// ===============================

export const saveTokens = ({ access, refresh }) => {
  if (access) {
    localStorage.setItem(ACCESS_KEY, access);
  }
  if (refresh) {
    localStorage.setItem(REFRESH_KEY, refresh);
  }
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_KEY);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

// ===============================
// Auth API calls
// ===============================

// LOGIN: /api/auth/login/  (SimpleJWT TokenObtainPairView)
export const login = async (username, password) => {
  try {
    const res = await axios.post(`${API_BASE}/api/auth/login/`, {
      username,
      password,
    });

    const { access, refresh } = res.data || {};
    if (access || refresh) {
      saveTokens({ access, refresh });
    }

    return res.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    // Re-throw so the page can show "Invalid credentials" etc.
    throw error;
  }
};

export const logout = () => {
  clearTokens();
};

// REGISTER: /api/auth/register/
// Your Django view should accept { username, password, email }
// and usually return something like { id, username, email } or tokens.
export const register = async (username, password, email = "") => {
  try {
    const res = await axios.post(`${API_BASE}/api/auth/register/`, {
      username,
      password,
      email,
    });

    // If your backend ALSO returns tokens on register, you can auto-login:
    const { access, refresh } = res.data || {};
    if (access || refresh) {
      saveTokens({ access, refresh });
    }

    return res.data;
  } catch (error) {
    console.error(
      "Register error:",
      error.response?.data || error.message
    );
    // Let the caller (Signup page) show the correct message
    throw error;
  }
};
