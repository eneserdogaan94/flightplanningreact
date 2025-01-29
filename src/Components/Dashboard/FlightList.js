import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

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

  return (
    <>
      <Typography variant="h6">Flight List</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Departure City</TableCell>
              <TableCell>Arrival City</TableCell>
              <TableCell>Departure Time</TableCell>
              <TableCell>Arrival Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.length > 0 ? (
              flights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell>{flight.departureAirport?.city || "Unknown"}</TableCell>
                  <TableCell>{flight.arrivalAirport?.city || "Unknown"}</TableCell>
                  <TableCell>{flight.departureTime ? new Date(flight.departureTime).toLocaleString() : "N/A"}</TableCell>
                  <TableCell>{flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleString() : "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No flights available.
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
