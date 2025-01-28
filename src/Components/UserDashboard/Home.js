import React, { useContext } from "react";
import { AuthContext } from "../Login/AuthContext";
import { Input } from "../../Base Components/Input";
import { Button } from "../../Base Components/Button";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login"); // Çıkış yapıldığında login sayfasına yönlendir
  };

  return (
    <div className="home-container">
      <h1>Welcome, {user}!</h1>
      <Button text="Logout" onClick={handleLogout} />
    </div>
  );
};

export default Home;
