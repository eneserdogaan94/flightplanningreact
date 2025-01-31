import React, { useState, useEffect } from "react";
import axios from "axios";
import ToastNotification from "../../Base Components/ToastNotification";

import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddFlight = () => {
  const navigate = useNavigate();
  const [airports, setAirports] = useState([]);
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [toast, setToast] = useState({ open: false, severity: "info", message: "" });
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchAirports();
  }, []);

  const showToast = (severity, message) => {
    setToast({ open: true, severity, message });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 5000);
  };


const fetchAirports = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/api/airports`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    setAirports(response.data);
  } catch (error) {
    console.error("Havalimanları yüklenirken hata oluştu:", error);
    
    const errorMessage =
      error.response?.data?.message || "Havalimanları yüklenirken bir hata oluştu.";
    
    showToast("error", errorMessage);
  }
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const flightData = {
        departureAirportId: departureAirport,
        arrivalAirportId: arrivalAirport,
        departureTime,
        arrivalTime,
      };

      const saveFlight = async (flightData) => {
        try {
          const token = localStorage.getItem("token");
      
          const response = await axios.post(
            `${API_URL}/api/flights/saveFlight`,
            flightData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
      
          showToast("success", "Uçuş başarıyla kaydedildi!");
          
          return response.data;
      
        } catch (error) {
          console.error("Uçuş kaydedilirken hata oluştu:", error);
      
          const errorMessage =
            error.response?.data?.message || "Uçuş eklenirken bir hata oluştu.";
      
          showToast("error", errorMessage);
      
          throw error;
        }
      };
      
  
      showToast("success", "Uçuş başarıyla kaydedildi!");
      setTimeout(() => {
        navigate("/admin-home/flights");
      }, 1500);
    } catch (error) {
      console.error("Error saving flight:", error);
  
      let errorMessage = "Uçuş eklenirken bir hata oluştu.";
  
      if (error.response && error.response.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      showToast("error", errorMessage);
    }
  };
  

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "auto",
        mt: 4,
        p: 3,
        backgroundColor: "white",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Uçuş planlaması yapılırken dikkate alınması gereken kurallar:</strong>
        <ul style={{ margin: 0, paddingLeft: "20px" }}>
          <li>Bir uçuşun iniş veya kalkış yaptığı hava sahasında, uçak 30 dakika boyunca başka bir iniş veya kalkış yapamaz.</li>
          <li>Aynı şehirden yapılan uçuşların 30 dakikalık bu süre içinde birbirleriyle çakışmaması gerekir.</li>
        </ul>
      </Alert>

      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        Yeni Uçuş Ekle
      </Typography>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Kalkış Havalimanı</InputLabel>
          <Select
            value={departureAirport}
            onChange={(e) => setDepartureAirport(e.target.value)}
            required
          >
            {airports.map((airport) => (
              <MenuItem key={airport.id} value={airport.id}>
                {airport.city} - {airport.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Varış Havalimanı</InputLabel>
          <Select
            value={arrivalAirport}
            onChange={(e) => setArrivalAirport(e.target.value)}
            required
          >
            {airports.map((airport) => (
              <MenuItem key={airport.id} value={airport.id}>
                {airport.city} - {airport.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Kalkış Saati"
          type="datetime-local"
          fullWidth
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          label="Varış Saati"
          type="datetime-local"
          fullWidth
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          required
        />

        <Button variant="contained" color="primary" fullWidth type="submit">
          Uçuşu Kaydet
        </Button>
      </form>

      {/* Snackbar Bildirimleri */}
      <ToastNotification
        open={toast.open}
        severity={toast.severity}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Box>
  );
};

export default AddFlight;
