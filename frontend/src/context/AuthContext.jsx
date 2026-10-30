import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await api.get("/auth/me");

        setUser(response.data.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    const authenticatedUser = response.data.data.user;

    setUser(authenticatedUser);

    return authenticatedUser;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
