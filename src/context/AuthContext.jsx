import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api as axiosApi } from "@/services/api";
import { AuthContext } from "./createAuthContext";

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
      const { data } = await axiosApi.get(`/api/auth/user/`);
      setUser(data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null);
        setToken(null);
      } else {
        setUser(null);
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const { data } = await axiosApi.post(`/api/auth/login/`, {
        username,
        password,
      });

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
    } catch (error) {
      const message = error.response?.data?.detail || "Login failed";
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      const token = getToken();
      if (token) {
        await axiosApi.post(
          `/api/auth/logout/`,
          {},
          { headers: getAuthHeaders() },
        );
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
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
