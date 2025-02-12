import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    if (token && role) {
      setUser({ role });
    }
  }, [token, role]);

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/signup`, userData);
      return response.data; 
    } catch (error) {
      console.error("Signup failed:", error);
      return null;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      const { token, role } = response.data;
  
      setUser({ role });
      setRole(role);
      setToken(token);
  
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
  
      return { role };
    } catch (error) {
      console.log("Login hatası:", error);
  
      if (error.response) {
        console.log(error.response.data.message || "Giriş başarısız!");
      } else {
        throw new Error("Sunucuya bağlanılamadı!");
      }
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
