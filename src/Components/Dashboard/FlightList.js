import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
  Box,
  TablePagination,
} from "@mui/material";
import "../../styles/FlightList.css"; // 📌 CSS Dosyasını İçeri Aktardık

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [page, setPage] = useState(0); // 📌 Aktif sayfa
  const [rowsPerPage, setRowsPerPage] = useState(10); // 📌 Sayfa başına uçuş sayısı
  const [totalFlights, setTotalFlights] = useState(0); // 📌 Toplam uçuş sayısı

  useEffect(() => {
    fetchFlights();
  }, [page, rowsPerPage]);

  const fetchFlights = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/flights?page=${page}&size=${rowsPerPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFlights(response.data.content);
      setTotalFlights(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  // 📌 **Uçuş Tarihine Göre Renk Belirleme**
  const getTextColorClass = (departureTime) => {
    const now = new Date();
    const flightDate = new Date(departureTime);
    const diffInDays = Math.floor((flightDate - now) / (1000 * 60 * 60 * 24));

    if (flightDate < now) {
      return "flight-red"; // 🔴 Geçmiş tarihli uçuşlar için kırmızı
    } else if (diffInDays <= 3) {
      return "flight-orange"; // 🟠 3 gün içinde olan uçuşlar için turuncu
    } else {
      return "flight-blue"; // 🔵 Diğer tüm ileri tarihler için mavi
    }
  };

  // 📌 Sayfa değiştirildiğinde çalışacak fonksiyon
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 📌 Sayfa başına kaç satır gösterileceğini değiştiren fonksiyon
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box className="flight-list-container">
      {/* 📌 Bilgilendirme Mesajı */}
      <Box className="flight-info-alert">
        <Alert severity="info">
          <strong>Uçuş Renk Kodları:</strong>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li><span style={{ color: "red", fontWeight: "bold" }}>Kırmızı</span>: Geçmiş tarihli uçuşlar</li>
            <li><span style={{ color: "orange", fontWeight: "bold" }}>Turuncu</span>: 3 gün içinde olan uçuşlar</li>
            <li><span style={{ color: "blue", fontWeight: "bold" }}>Mavi</span>: 3 günden daha ileri tarihli uçuşlar</li>
          </ul>
        </Alert>
      </Box>

      <Typography variant="h6" className="flight-list-title">
        Uçuş Listesi
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small"> {/* 📌 Dense Table */}
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
                const textColorClass = getTextColorClass(flight.departureTime);
                return (
                  <TableRow key={flight.id} className="flight-table-row">
                    <TableCell className={textColorClass}>
                      {flight.departureAirport?.city || "Unknown"}
                    </TableCell>
                    <TableCell className={textColorClass}>
                      {flight.arrivalAirport?.city || "Unknown"}
                    </TableCell>
                    <TableCell className={textColorClass}>
                      {flight.departureTime
                        ? new Date(flight.departureTime).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className={textColorClass}>
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

      {/* 📌 Sayfalama Kontrolleri */}
      <TablePagination
        className="flight-pagination"
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalFlights}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default FlightList;
