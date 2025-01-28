import React, { useContext } from "react";
import { AuthContext } from "../Login/AuthContext";
import { Input } from "../../Base Components/Input";
import { Button } from "../../Base Components/Button";
import "./Home.css";

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="home-container">
      <h1>Welcome, {user}!</h1>
      <Button text="Logout" onClick={logout} />
    </div>
  );
};

export default Home;
