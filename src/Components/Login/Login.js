import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
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
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
        navigate("/admin-home");
      } else if (user.role === "USER") {
        navigate("/user-home");
      } else {
        navigate("/");
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
          Giriş
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
            label="Kullanıcı Adı"
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
            label="Parola"
            type="password"
            id="password"
            value={credentials.password || ""}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Checkbox label="Beni Hatırla" />

          <Button type="submit" text="Giriş Yap" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} />

          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Hesabın yok mu? Kaydol!"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
