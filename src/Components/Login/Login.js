import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
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
import Checkbox from "../../Base Components/Checkbox";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (name, value) => {
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Alan değişince hatayı temizle
  };

  const validate = () => {
    const newErrors = {};
    if (!credentials.username) newErrors.username = "Username is required.";
    if (!credentials.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    const user = await login(credentials.username, credentials.password);
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } else {
      setGeneralError("Login failed. Please check your credentials.");
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
          Sign in
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
            id="username"
            label="Username"
            name="username"
            value={credentials.username || ""}
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
            value={credentials.password || ""}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Checkbox label="Remember me" />

          <Button type="submit" text="Sign In" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} />

          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
