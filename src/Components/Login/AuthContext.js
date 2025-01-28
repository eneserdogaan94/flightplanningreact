import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post("/api/auth/login", { username, password });
      setUser(username);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      if (error.response) {
        alert(`Login failed: ${error.response.data}`);
      } else {
        console.error("Login failed", error.message);
      }
    }
  };

  const signup = async (userData) => {
    try {
      await axios.post("/api/auth/signup", userData);
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
