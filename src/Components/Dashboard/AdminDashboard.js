import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Utility/AuthContext";
import { useNavigate, Outlet, useLocation } from "react-router-dom"; // ✅ useLocation ve useEffect kullanıldı
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import AirplaneTicketIcon from "../../Images/aircraft-airplane-airline-logo-or-label-journey-vector-21441986.jpg";
import { Box, Typography, IconButton } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Şu anki URL yolunu al
  const [currentPath, setCurrentPath] = useState(location.pathname); // ✅ URL değişimini takip etmek için state oluştur

  // 🏆 URL değiştiğinde içeriği zorla güncelle
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    logout(() => navigate("/login"));
  };

  const navigationItems = [
    {
      title: "Flight List",
      icon: <FlightIcon />,
      onClick: () => navigate("/admin-home/flights"),
    },
    {
      title: "Add Flight",
      icon: <AddCircleOutlineIcon />,
      onClick: () => navigate("/admin-home/add-flight"),
    },
  ];

  return (
    <AppProvider 
      navigation={navigationItems}
      branding={{
        logo: <img src={AirplaneTicketIcon} alt="Flight Logo" style={{ height: 40 }} />, 
        title: "Flight Planning App",
        homeUrl: "/admin-home/flights",
      }}
    >
      {/* 🏆 Key prop'u ile sayfa değişimlerini algılayıp tekrar render ediyoruz */}
      <DashboardLayout key={currentPath}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Typography variant="h6">Admin Dashboard</Typography>
          <IconButton onClick={handleLogout} color="error">
            <LogoutIcon />
          </IconButton>
        </Box>
        
        {/* 🏆 Nested Routes İçin Outlet Kullanıldı */}
        <Box sx={{ padding: "20px" }}>
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
};

export default AdminDashboard;
