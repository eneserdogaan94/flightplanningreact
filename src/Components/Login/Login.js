import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "../../Base Components/Input";
import { Button } from "../../Base Components/Button";
import "./login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleChange = (name, value) => {
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials.username, credentials.password);
    if (success) {
      navigate("/home"); // Login başarılıysa anasayfaya yönlendir
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <Input
        name="username"
        placeholder="Username"
        value={credentials.username}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      <Button type="submit" text="Login" />
    </form>
  );
};

export default Login;
