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

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
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
          logout(() => navigate("/admin-home/flights"));
        }, 500);
      },
    },
    {
      label: "Uçuş Ekle",
      icon: <AddCircleOutlineIcon />,
      onClick: () => {
        showToast("info", "Yeni uçuş ekleme sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => {
          logout(() => navigate("/admin-home/add-flight"));
        }, 500);
      },
    },
  ];

  return (
    <AppProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
        key={currentPath}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={AirplaneTicketIcon}
              alt="Flight Logo"
              style={{ height: 40, marginRight: 10 }}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Admin Dashboard
            </Typography>
          </Box>

          <IconButton onClick={handleLogout} color="error">
            <LogoutIcon />
          </IconButton>
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: "auto",
            p: 2,
          }}
        >
          <Outlet />
        </Box>

        <Paper
          elevation={3}
          sx={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
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

        <ToastNotification
          open={toast.open}
          severity={toast.severity}
          message={toast.message}
          onClose={() => setToast({ ...toast, open: false })}
        />
      </Box>
    </AppProvider>
  );
};

export default AdminDashboard;
