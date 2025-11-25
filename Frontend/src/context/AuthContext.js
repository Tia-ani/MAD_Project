import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const API_BASE_URL = "https://mad-project-ryls.onrender.com/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from storage on startup
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  const saveUser = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  // SIGNUP
  const signup = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, error: data.message };

      await saveUser(data.user);

      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) return { success: false, error: data.message };

      await saveUser(data.user);

      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
