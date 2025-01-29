import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token && role) {
      setUser({ role }); // Eğer token varsa ve role localStorage'dan geliyorsa user bilgisini set et
    }
  }, [token, role]);

  const login = async (username, password) => {
    try {
      const response = await axios.post("/api/auth/login", { username, password });
      const { token, role } = response.data;
  
      setUser({ role });
      setRole(role);
      setToken(token);
  
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
  
      // Burada sadece true döndürmek yerine rolü döndürelim:
      return { role };
    } catch (error) {
      console.error("Login failed:", error);
      return null; // veya undefined
    }
  };

  const logout = (callback) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    if (callback) callback(); // Kullanıcıyı yönlendirmek için callback çağır
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
