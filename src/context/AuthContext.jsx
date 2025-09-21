"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { loginUser, authFetch as apiAuthFetch } from "../lib/api";

const AuthContext = createContext();

// Constants
const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Secure token storage (you might want to use a more secure method in production)
  const setTokenSecure = useCallback((tokenData) => {
    if (typeof window !== "undefined") {
      // In production, consider using httpOnly cookies or a more secure storage method
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
    }
  }, []);

  const getTokenSecure = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(TOKEN_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (error) {
        console.error("Failed to parse stored token:", error);
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }
    }
    return null;
  }, []);

  const removeTokenSecure = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  // Check if token is expired or about to expire
  const isTokenExpired = useCallback((tokenData) => {
    if (!tokenData || !tokenData.expires_at) return true;
    const expiryTime = new Date(tokenData.expires_at).getTime();
    const currentTime = Date.now();

    return currentTime >= expiryTime - TOKEN_REFRESH_THRESHOLD;
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const tokenData = getTokenSecure();
      if (!tokenData?.refresh_token) {
        throw new Error("No refresh token available");
      }
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: tokenData.refresh_token }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const newTokenData = await response.json();
      setTokenSecure(newTokenData);
      setToken(newTokenData.access_token);

      return newTokenData.access_token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    }
  }, [getTokenSecure, setTokenSecure]);

  // Load user from storage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const tokenData = getTokenSecure();
        const savedUser = localStorage.getItem(USER_KEY);
        if (tokenData?.access_token && savedUser) {
          // Check if token needs refresh
          if (isTokenExpired(tokenData)) {
            const newToken = await refreshToken();
            if (!newToken) return; // logout was called
          } else {
            setToken(tokenData.access_token);
          }

          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        removeTokenSecure();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [getTokenSecure, isTokenExpired, refreshToken, removeTokenSecure]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!token) return;
    const tokenData = getTokenSecure();
    if (!tokenData?.expires_at) return;

    const expiryTime = new Date(tokenData.expires_at).getTime();
    const refreshTime = expiryTime - TOKEN_REFRESH_THRESHOLD;
    const timeUntilRefresh = refreshTime - Date.now();

    if (timeUntilRefresh <= 0) {
      refreshToken();
      return;
    }

    const refreshTimer = setTimeout(() => {
      refreshToken();
    }, timeUntilRefresh);

    return () => clearTimeout(refreshTimer);
  }, [token, getTokenSecure, refreshToken]);

  // Login with email/password
  const login = useCallback(
    async (email, password) => {
      setAuthError(null);
      setLoading(true);
      try {
        const data = await loginUser({ email, password });

        // Assume the API returns token with expiry information
        const tokenData = {
          access_token: data.token,
          refresh_token: data.refresh_token,
          expires_at:
            data.expires_at ||
            new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default 24h if not provided
        };

        setTokenSecure(tokenData);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        setToken(tokenData.access_token);
        setUser(data.user);

        return { success: true, user: data.user };
      } catch (error) {
        console.error("Login failed:", error);
        setAuthError(error.message || "Login failed");
        return { success: false, error: error.message || "Login failed" };
      } finally {
        setLoading(false);
      }
    },
    [setTokenSecure]
  );

  // Logout
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Call logout API if available
      if (token) {
        await apiAuthFetch("/api/auth/logout", token, {
          method: "POST",
        }).catch(console.warn); // Don't fail logout if API call fails
      }
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear local state regardless of API call success
      removeTokenSecure();
      setToken(null);
      setUser(null);
      setAuthError(null);
      setLoading(false);
    }
  }, [token, removeTokenSecure]);

  // Enhanced auth fetch with automatic token refresh
  const authFetch = useCallback(
    async (url, options = {}) => {
      let currentToken = token;
      // Check if token needs refresh before making request
      const tokenData = getTokenSecure();
      if (tokenData && isTokenExpired(tokenData)) {
        currentToken = await refreshToken();
        if (!currentToken) {
          throw new Error("Authentication required");
        }
      }

      try {
        return await apiAuthFetch(url, currentToken, options);
      } catch (error) {
        // If we get 401, try to refresh token once
        if (error.message === "Unauthorized" && tokenData?.refresh_token) {
          const newToken = await refreshToken();
          if (newToken) {
            // Retry with new token
            return await apiAuthFetch(url, newToken, options);
          }
        }
        throw error;
      }
    },
    [token, getTokenSecure, isTokenExpired, refreshToken]
  );

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!(user && token);
  }, [user, token]);

  // Clear auth error
  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const contextValue = {
    user,
    token,
    loading,
    authError,
    login,
    logout,
    authFetch,
    isAuthenticated,
    clearAuthError,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
