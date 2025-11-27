import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./createAuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Token storage helpers
const TOKEN_KEY = "family_member_token";

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Token ${token}` }),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/user/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setUser(data);
        } else {
          console.warn("Auth check returned non-JSON response");
          setUser(null);
          setToken(null);
        }
      } else if (response.status === 403 || response.status === 401) {
        // Token is invalid or expired
        setUser(null);
        setToken(null);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Failed to verify session", error);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let error;
      if (contentType && contentType.includes("application/json")) {
        error = await response.json().catch(() => ({}));
      } else {
        error = { detail: "Login failed" };
      }
      throw new Error(error.detail || "Login failed");
    }

    const data = await response.json();

    // Store the token
    if (data.token) {
      setToken(data.token);
    }

    // Set user data
    if (data.user) {
      setUser(data.user);
    } else {
      // If user data not in response, fetch it
      await checkAuth();
    }
  };

  const logout = async () => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout/`, {
          method: "POST",
          headers: getAuthHeaders(),
        });
      }
    } catch (error) {
      console.warn("Logout network error (ignored): ", error);
    } finally {
      // Clear token and user data
      setUser(null);
      setToken(null);
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, checkAuth, getAuthHeaders }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
