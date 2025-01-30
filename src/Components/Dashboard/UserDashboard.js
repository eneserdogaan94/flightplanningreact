import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ToastNotification from "../../Base Components/ToastNotification";

import { AppProvider } from "@toolpad/core/AppProvider";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';

import Input from "../../Base Components/Input";

import AirplaneTicketIcon from "../../Images/aircraft-airplane-airline-logo-or-label-journey-vector-21441986.jpg";
import { CancelScheduleSend, CancelScheduleSendOutlined } from "@mui/icons-material";

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const [toast, setToast] = useState({ open: false, severity: "info", message: "" });
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [filter, setFilter] = useState({
    departure: "",
    arrival: "",
    date: "",
  });

  const showToast = (severity, message) => {
    setToast({ open: true, severity, message });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 5000);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      showToast("success", `Hoş geldiniz!`);
      fetchFlights();
    }
  }, [user, navigate]);

  const fetchFlights = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/flights/searchById", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights(response.data);
      setFilteredFlights(response.data);
    } catch (error) {
      console.error("Error fetching flights:", error);
      showToast("error", `Uçuşlar yüklenirken bir hata oluştu.${error}`);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    const filtered = flights.filter((flight) => {
      return (
        (name !== "departure" ||
          !value ||
          flight.departureAirport?.city
            ?.toLowerCase()
            .includes(value.toLowerCase())) &&
        (name !== "arrival" ||
          !value ||
          flight.arrivalAirport?.city
            ?.toLowerCase()
            .includes(value.toLowerCase())) &&
        (name !== "date" || !value || flight.departureTime?.includes(value))
      );
    });

    setFilteredFlights(filtered);
  };

  const handleClearFilters = () => {
    setFilter({ departure: "", arrival: "", date: "" });
    setFilteredFlights(flights);
  };

  const handleLogout = () => {
    logout(() => {
      showToast("info", "Başarıyla çıkış yapıldı.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    });
  };

  return (
    <AppProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid #ddd",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={AirplaneTicketIcon}
              alt="Flight Logo"
              style={{ height: 40, marginRight: 10 }}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Kullanıcı Dashboard
            </Typography>
          </Box>

          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>

        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <h2>Uçuş Listesi</h2>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
            <Input
              name="departure"
              label="Kalkış Şehri"
              value={filter.departure}
              onChange={handleFilterChange}
            />
            <Input
              name="arrival"
              label="Varış Şehri"
              value={filter.arrival}
              onChange={handleFilterChange}
            />
            <Input
              name="date"
              label=""
              type="date"
              value={filter.date}
              onChange={handleFilterChange}
            />

            {/* Temizle Butonu (Küçük) */}
            <IconButton
              onClick={handleClearFilters}
            >
              <CancelScheduleSendOutlined />
            </IconButton>
          </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kalkış Şehri</TableCell>
                  <TableCell>Varış Şehri</TableCell>
                  <TableCell>Kalkış Saati</TableCell>
                  <TableCell>Varış Saati</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {filteredFlights.length > 0 ? (
    filteredFlights.map((flight) => (
      <TableRow key={flight.id}>
        <TableCell>{flight.departureAirport?.city || "Unknown"}</TableCell>
        <TableCell>{flight.arrivalAirport?.city || "Unknown"}</TableCell>
        <TableCell>
          {flight.departureTime ? new Date(flight.departureTime).toLocaleString() : "N/A"}
        </TableCell>
        <TableCell>
          {flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleString() : "N/A"}
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={4} align="center">
        Uçuş bulunmamaktadır.
      </TableCell>
    </TableRow>
  )}
</TableBody>
            </Table>
          </TableContainer>
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

export default UserDashboard;
