import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Login/SignUp";
import Home from "./Components/Dashboard/Home";
import { AuthProvider, AuthContext } from "./Components/Login/AuthContext";

// **🛠 Private Route Component (Giriş Yapmamış Kullanıcıyı Engelle)**
const PrivateRoute = ({ element }) => {
  const { token } = useContext(AuthContext);
  return token ? element : <Navigate to="/login" />;
};

// **📌 Eğer kullanıcı giriş yaptıysa otomatik olarak /home'a yönlendir**
const RedirectIfLoggedIn = ({ element }) => {
  const { token } = useContext(AuthContext);
  return token ? <Navigate to="/home" /> : element;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 🏠 Eğer kullanıcı giriş yaptıysa direkt Home sayfasına yönlendir */}
          <Route path="/" element={<RedirectIfLoggedIn element={<Login />} />} />
          
          {/* 🔐 Login ve Signup Sayfaları */}
          <Route path="/login" element={<RedirectIfLoggedIn element={<Login />} />} />
          <Route path="/signup" element={<RedirectIfLoggedIn element={<SignUp />} />} />

          {/* 🔒 Home sayfası sadece giriş yapmış kullanıcılar için */}
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
