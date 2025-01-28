import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Input } from "../../Base Components/Input";
import { Button } from "../../Base Components/Button";
import "./login.css";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    username: "",
    password: "",
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <Input
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      <Input
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      <Input
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      <Input
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      <Button type="submit" text="Signup" />
    </form>
  );
};

export default Signup;
