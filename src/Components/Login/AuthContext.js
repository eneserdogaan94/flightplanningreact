import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = async (username, password) => {
    try {
      const response = await axios.post("/api/auth/login", { username, password });
      setUser(username);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      return true; // Login başarılıysa true döner
    } catch (error) {
      if (error.response) {
        alert(`Login failed`);
      } else {
        console.error("Login failed");
      }
      return false; // Login başarısızsa false döner
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post("/api/auth/signup", userData);
      if (response.status === 200 || response.status === 201) {
        return true; // Başarılı
      }
      return false;
    } catch (error) {
      console.error("Signup failed:", error);
      return false; // Başarısız
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    alert("You have been logged out.");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
