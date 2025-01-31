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
import "../../styles/FlightList.css";

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const [totalFlights, setTotalFlights] = useState(0); 
  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    fetchFlights();
  }, [page, rowsPerPage]);


  const fetchFlights = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentPage = page ?? 0;
      const currentRowsPerPage = rowsPerPage ?? 10;
      
      const response = await axios.get(
        `${API_URL}/api/flights?page=${currentPage}&size=${currentRowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setFlights(response.data.content || []);  
      setTotalFlights(response.data.totalElements || 0);

    } catch (error) {
      console.error("Uçuşlar yüklenirken hata oluştu:", error);

      const errorMessage =
        error.response?.data?.message || "Uçuşlar yüklenirken bir hata oluştu.";
    }
};

useEffect(() => {
  fetchFlights();
}, [page, rowsPerPage]); 


  const getTextColorClass = (departureTime) => {
    const now = new Date();
    const flightDate = new Date(departureTime);
    const diffInDays = Math.floor((flightDate - now) / (1000 * 60 * 60 * 24));

    if (flightDate < now) {
      return "flight-red"; 
    } else if (diffInDays <= 3) {
      return "flight-orange"; 
    } else {
      return "flight-blue";
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  return (
    <Box className="flight-list-container">
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
        <Table size="small">
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
