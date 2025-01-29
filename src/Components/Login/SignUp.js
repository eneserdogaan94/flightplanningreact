import React, { useState, useContext } from "react";
import { AuthContext } from "../../Utility/AuthContext";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";

// Base Components
import Input from "../../Base Components/Input";
import Button from "../../Base Components/Button";
import CitySelect from "../../Base Components/CitySelect";

const SignUp = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Alan değişince hatayı temizle
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Hata yoksa true döner
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Validation geçerli değilse devam etme

    try {
      const success = await signup(formData);
      if (success) {
        navigate("/login");
      } else {
        setGeneralError("Signup failed. Please try again.");
      }
    } catch (err) {
      setGeneralError(err.message || "Something went wrong.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {generalError && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {generalError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Input
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoFocus
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <Input
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <CitySelect
            required
            fullWidth
            label="Select City"
            onCityChange={(city) => handleChange("city", city)}
            error={!!errors.city}
            helperText={errors.city}
          />
          <Input
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
          />
          <Input
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button type="submit" text="Sign Up" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} />
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Already have an account? Login"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
