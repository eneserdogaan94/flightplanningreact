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
import ToastNotification from "../../Base Components/ToastNotification";

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
  const [toast, setToast] = useState({ open: false, severity: "info", message: "" });

  const showToast = (severity, message) => {
    setToast({ open: true, severity, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 5000);
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const success = await signup(formData);
      if (success) {
        showToast("success", "Kullanıcı kaydı tamamlandı.Giriş sayfasına yönlendiriliyorsunuz.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        showToast("error", "Kayıt sırasında hata oluştu lütfen tekrar deneyiniz.");
        setGeneralError("Kayıt sırasında hata oluştu lütfen tekrar deneyiniz.");
      }
    } catch (err) {
      showToast("error", err.message || "Kayıt sırasında hata oluştu lütfen tekrar deneyiniz.");
      setGeneralError(err.message || "Kayıt sırasında hata oluştu lütfen tekrar deneyiniz.");
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
            label="Ad"
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
            label="Soyad"
            name="lastName"
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <CitySelect
            required
            fullWidth
            label="Şehir"
            onCityChange={(city) => handleChange("city", city)}
            error={!!errors.city}
            helperText={errors.city}
          />
          <Input
            required
            fullWidth
            id="username"
            label="Kullanıcı Adı"
            name="username"
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
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button type="submit" text="Kaydol" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} />
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Hesabın zaten var mı??"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Toast Notification */}
      <ToastNotification
        open={toast.open}
        severity={toast.severity}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Container>
  );
};

export default SignUp;
