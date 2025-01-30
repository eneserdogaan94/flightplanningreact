import React, { useState, useEffect } from "react";
import axios from "axios";
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

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await axios.get("/api/airports");
      setAirports(response.data);
    } catch (error) {
      console.error("Error fetching airports:", error);
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
  
      const token = localStorage.getItem("token"); // Token'ı localStorage'dan al
  
      await axios.post("/api/flights/saveFlight", flightData, {
        headers: {
          Authorization: `Bearer ${token}`, // Yetkilendirme başlığını ekle
        },
      });
  
      navigate("/admin-home/flights");
    } catch (error) {
      console.error("Error saving flight:", error);
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
      {/* Bilgilendirici Kutu */}
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
        {/* Departure Select */}
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

        {/* Arrival Select */}
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

        {/* Departure Time */}
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

        {/* Arrival Time */}
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

        {/* Submit Button */}
        <Button variant="contained" color="primary" fullWidth type="submit">
          Uçuşu Kaydet
        </Button>
      </form>
    </Box>
  );
};

export default AddFlight;
