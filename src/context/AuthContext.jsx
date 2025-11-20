import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./createAuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Helper function to delete a cookie
const deleteCookie = (name, path = "/", domain = window.location.hostname) => {
  // Try deleting with the current domain
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
  // Also try without domain (for localhost)
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/user/`, {
        credentials: "include",
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setUser(data);
        } else {
          // Response is not JSON (likely HTML error page)
          console.warn("Auth check returned non-JSON response");
          setUser(null);
        }
      } else if (response.status === 403 || response.status === 401) {
        // User is not authenticated - this is expected, not an error
        setUser(null);
      } else {
        // Other error status
        setUser(null);
      }
    } catch (error) {
      // Only log actual network errors, not expected 403s
      if (error.name !== "TypeError") {
        console.error("Failed to verify session", error);
      }
      setUser(null);
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

    // After successful login, fetch the user data
    await checkAuth();
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });

      // Logout should succeed locally even if backend returns 403/401
      // (session might already be expired)
      if (!response.ok && response.status !== 403 && response.status !== 401) {
        // Only log if it's not an auth error (might be a real server error)
        console.warn("Logout request failed with status: ", response.status);
      }
    } catch (error) {
      // Only log network errors, not expected auth failures
      console.warn("Logout network error (ignored): ", error);
    } finally {
      // Delete authentication cookies
      deleteCookie("sessionid");
      deleteCookie("csrftoken");

      // Always clear local state and redirect, regardless of backend response
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, checkAuth }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
