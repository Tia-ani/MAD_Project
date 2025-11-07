import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    // Simple authentication logic - in production, this would call an API
    // For now, we'll just check if credentials are provided
    if (email && password) {
      setUser({ email });
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Please enter both email and password' };
  };

  const signup = (name, email, password, confirmPassword) => {
    // Simple validation - in production, this would call an API
    if (!name || !email || !password || !confirmPassword) {
      return { success: false, error: 'Please fill in all fields' };
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    setUser({ name, email });
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
