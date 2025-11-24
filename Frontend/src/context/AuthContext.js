import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

const API_BASE_URL = "http://192.168.143.120:5050/api"; // your IP

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // SIGNUP
  const signup = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message };
      }

      setUser(data.user);
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

      if (!res.ok) {
        return { success: false, error: data.message };
      }

      setUser(data.user);
      return { success: true };

    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
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
