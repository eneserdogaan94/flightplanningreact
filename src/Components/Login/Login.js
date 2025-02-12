import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Typography,
  Container,
  Alert,
  Grid,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Input from "../../Base Components/Input";
import Button from "../../Base Components/Button";
import Checkbox from "../../Base Components/Checkbox";
import { motion } from "framer-motion";
import ToastNotification from "../../Base Components/ToastNotification";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, severity: "info", message: "" });

  const showToast = (severity, message) => {
    setToast({ open: true, severity, message });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 5000);
  };

  const handleChange = (name, value) => {
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!credentials.username) newErrors.username = "Lütfen kullanıcı adı giriniz.";
    if (!credentials.password) newErrors.password = "Lütfen parola giriniz.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const user = await login(credentials.username, credentials.password);
    setLoading(true);
    if (user) {
      showToast("success", "Giriş başarılı! Yönlendiriliyorsunuz...");
      setTimeout(() => {
        if (user.role === "ADMIN") {
          navigate("/admin-home");
        } else if (user.role === "USER") {
          navigate("/user-home");
        } else {
          navigate("/");
        }
      }, 1500);
    } else {
      setLoading(false);
      showToast("error", "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      {loading ? (
        <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgb(255, 255, 255)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999, 
        }}
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          <LockOpenOutlinedIcon sx={{ fontSize: 80, color: "blue" }} />
        </motion.div>
      
        <Typography 
          component="h1" 
          variant="h5" 
          color="blue"
          sx={{ marginTop: 2 }} 
        >
          Giriş Yapıldı!
        </Typography>
      </Box>
      
      ) : (
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
      )}

      <ToastNotification
        open={toast.open}
        severity={toast.severity}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Container>
  );
};

export default Login;
