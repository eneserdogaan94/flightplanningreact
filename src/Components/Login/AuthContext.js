import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null; // Eğer JSON parse edilemiyorsa null döndür
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = async (username, password) => {
    try {
      const response = await axios.post("/api/auth/login", { username, password });

      // Kullanıcı bilgilerini ve token'ı kaydet
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // JSON.parse için güvenli hale getirildi

      return response.data.user; // Kullanıcı bilgilerini döndür
    } catch (error) {
      console.error("Login failed:", error);
      return null; // Başarısız giriş
    }
  };
  

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Kullanıcı bilgisini de temizleyelim
    alert("You have been logged out.");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
