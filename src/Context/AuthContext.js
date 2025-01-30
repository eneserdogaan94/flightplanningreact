import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token && role) {
      setUser({ role });
    }
  }, [token, role]);

  const signup = async (userData) => {
    try {
      const response = await axios.post("/api/users/signup", userData);
      return response.data; 
    } catch (error) {
      console.error("Signup failed:", error);
      return null;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post("/api/auth/login", { username, password });
      const { token, role } = response.data;
  
      setUser({ role });
      setRole(role);
      setToken(token);
  
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
  
      return { role };
    } catch (error) {
      console.error("Login failed:", error);
      return null; 
    }
  };

  const logout = (callback) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    if (callback) callback(); 
  };

  return (
    <AuthContext.Provider value={{ user, role, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
