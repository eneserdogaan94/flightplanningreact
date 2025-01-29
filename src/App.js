import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Login/SignUp";
import UserHome from "./Components/Dashboard/UserDashboard";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import FlightList from "./Components/Dashboard/FlightList";
import AddFlight from "./Components/Dashboard/AddFlight";
import { AuthProvider, AuthContext } from "./Utility/AuthContext";

const PrivateRoute = ({ element, allowedRoles }) => {
  const { role } = useContext(AuthContext);
  return allowedRoles.includes(role) ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user-home" element={<PrivateRoute element={<UserHome />} allowedRoles={["USER"]} />} />

          {/* 🔥 Admin Paneli için Nested Route */}
          <Route path="/admin-home" element={<PrivateRoute element={<AdminDashboard />} allowedRoles={["ADMIN"]} />}>
            <Route index element={<Navigate to="flights" />} /> {/* 🏆 Eğer "/admin-home" girilirse "/flights" göster */}
            <Route path="flights" element={<FlightList />} />
            <Route path="add-flight" element={<AddFlight />} />
          </Route>

          {/* 🌟 Eğer giriş yapılmışsa doğru sayfaya yönlendir */}
          <Route path="/" element={<Navigate to="/admin-home/flights" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
