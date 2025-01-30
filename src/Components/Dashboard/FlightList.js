import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, Box } from "@mui/material";

const FlightList = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/flights", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights(response.data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  // 📌 **Fonksiyon: Uçuş Tarihine Göre Renk Belirleme**
  const getTextColor = (departureTime) => {
    const now = new Date();
    const flightDate = new Date(departureTime);
    const diffInDays = Math.floor((flightDate - now) / (1000 * 60 * 60 * 24)); // Gün farkı hesapla

    if (flightDate < now) {
      return "red"; // Geçmiş tarihli uçuşlar için kırmızı
    } else if (diffInDays <= 3) {
      return "orange"; // 3 gün içinde olan uçuşlar için turuncu
    } else {
      return "blue"; // Diğer tüm ileri tarihler için mavi
    }
  };

  return (
    <>
      {/* 📌 Bilgilendirme Mesajı */}
      <Box sx={{ mb: 2 }}>
        <Alert severity="info">
          <strong>Uçuş Renk Kodları:</strong>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li><span style={{ color: "red", fontWeight: "bold" }}>Kırmızı</span>: Geçmiş tarihli uçuşlar</li>
            <li><span style={{ color: "orange", fontWeight: "bold" }}>Turuncu</span>: 3 gün içinde olan uçuşlar</li>
            <li><span style={{ color: "blue", fontWeight: "bold" }}>Mavi</span>: 3 günden daha ileri tarihli uçuşlar</li>
          </ul>
        </Alert>
      </Box>

      <Typography variant="h6">Uçuş Listesi</Typography>

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
            {flights.length > 0 ? (
              flights.map((flight) => {
                const textColor = getTextColor(flight.departureTime);
                return (
                  <TableRow key={flight.id}>
                    <TableCell sx={{ color: textColor }}>
                      {flight.departureAirport?.city || "Unknown"}
                    </TableCell>
                    <TableCell sx={{ color: textColor }}>
                      {flight.arrivalAirport?.city || "Unknown"}
                    </TableCell>
                    <TableCell sx={{ color: textColor }}>
                      {flight.departureTime
                        ? new Date(flight.departureTime).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ color: textColor }}>
                      {flight.arrivalTime
                        ? new Date(flight.arrivalTime).toLocaleString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Uçuş bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default FlightList;
