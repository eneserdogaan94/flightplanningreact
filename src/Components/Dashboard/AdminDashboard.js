import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { AppProvider } from "@toolpad/core/AppProvider";
import ToastNotification from "../../Base Components/ToastNotification";

import {
  Box,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
} from "@mui/material";

import FlightIcon from "@mui/icons-material/Flight";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";

import AirplaneTicketIcon from "../../Images/aircraft-airplane-airline-logo-or-label-journey-vector-21441986.jpg";

import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const { token,logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [bottomNavValue, setBottomNavValue] = useState(0);
  const [toast, setToast] = useState({ open: false, severity: "info", message: "" });

  useEffect(() => {
    setCurrentPath(location.pathname);

    if (location.pathname === "/admin-home") {
      showToast("success", "Hoş geldiniz, Admin!");
    }
  }, [location.pathname]);
    useEffect(() => {
      if (!token) {
        showToast("info", "Oturum süresi dolmuştur.Lütfen tekrar giriş yapınız.");
        logout(() => navigate("/login"));
      }
    }, [token, navigate]);

  const showToast = (severity, message) => {
    setToast({ open: true, severity, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 5000);
  };

  const handleLogout = () => {
    showToast("info", "Başarıyla çıkış yapıldı.");
    setTimeout(() => {
      logout(() => navigate("/login"));
    }, 1500);
  };

  const bottomNavItems = [
    {
      label: "Uçuş Listesi",
      icon: <FlightIcon />,
      onClick: () => {
        showToast("info", "Uçuş listesine yönlendiriliyorsunuz...");
        setTimeout(() => {
          navigate("/admin-home/flights");
        }, 500);
      },
    },
    {
      label: "Uçuş Ekle",
      icon: <AddCircleOutlineIcon />,
      onClick: () => {
        showToast("info", "Yeni uçuş ekleme sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => {
          navigate("/admin-home/add-flight");
        }, 500);
      },
    },
  ];

  return (
    <AppProvider>
      <Box className="admin-dashboard">
        <Box className="admin-dashboard-header">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={AirplaneTicketIcon} alt="Flight Logo" />
            <Typography variant="h6">Admin Dashboard</Typography>
          </Box>

          <IconButton className="admin-dashboard-logout" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>

        <Box className="admin-dashboard-content">
          <Outlet />
        </Box>

        <Paper className="admin-dashboard-bottom-nav" elevation={3}>
          <BottomNavigation
            showLabels
            value={bottomNavValue}
            onChange={(_, newValue) => {
              setBottomNavValue(newValue);
              bottomNavItems[newValue]?.onClick?.();
            }}
          >
            {bottomNavItems.map((item, index) => (
              <BottomNavigationAction key={index} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        </Paper>

        <Box className="admin-dashboard-toast">
          <ToastNotification
            open={toast.open}
            severity={toast.severity}
            message={toast.message}
            onClose={() => setToast({ ...toast, open: false })}
          />
        </Box>
      </Box>
    </AppProvider>
  );
};

export default AdminDashboard;
