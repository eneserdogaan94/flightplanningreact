import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Login/SignUp";
import UserHome from "./Components/Dashboard/UserDashboard"; // Kullanıcı sayfası
import AdminHome from "./Components/Dashboard/AdminDashboard"; // Admin sayfası
import { AuthProvider, AuthContext } from "./Components/Login/AuthContext";

// **🛠 Kullanıcının Yetkisini Kontrol Eden Component**
const PrivateRoute = ({ element, allowedRoles }) => {
  const { role } = useContext(AuthContext);
  return allowedRoles.includes(role) ? element : <Navigate to="/login" />;
};

// **📌 Kullanıcı Rolüne Göre Doğru Yönlendirme Yapan Component**
const RedirectAfterLogin = () => {
  const { role } = useContext(AuthContext);

  if (role === "ADMIN") return <Navigate to="/admin-home" />;
  if (role === "USER") return <Navigate to="/user-home" />;
  
  return <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 📌 Kullanıcı giriş yaptıysa rolüne göre yönlendirme */}
          <Route path="/" element={<RedirectAfterLogin />} />

          {/* 🔐 Login ve Signup Sayfaları */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* 👤 Kullanıcı Sayfası (Sadece USER rolü erişebilir) */}
          <Route path="/user-home" element={<PrivateRoute element={<UserHome />} allowedRoles={["USER"]} />} />

          {/* 🔧 Admin Sayfası (Sadece ADMIN rolü erişebilir) */}
          <Route path="/admin-home" element={<PrivateRoute element={<AdminHome />} allowedRoles={["ADMIN"]} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
