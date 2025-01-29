import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../Base Components/Button";
import Input from "../../Base Components/Input";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [filter, setFilter] = useState({
    departure: "",
    arrival: "",
    date: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchFlights();
    }
  }, [user]);

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
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    const filtered = flights.filter((flight) => {
      return (
        (name !== "departure" || !value || flight.departureAirport?.city?.toLowerCase().includes(value.toLowerCase())) &&
        (name !== "arrival" || !value || flight.arrivalAirport?.city?.toLowerCase().includes(value.toLowerCase())) &&
        (name !== "date" || !value || flight.departureTime?.includes(value))
      );
    });

    setFilteredFlights(filtered);
  };

  const handleLogout = () => {
    logout(() => navigate("/login"));
  };

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <h2>Flights List</h2>

      {/* Filtreleme Alanı */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Input
          name="departure"
          label="Departure City"
          onChange={handleFilterChange}
        />
        <Input
          name="arrival"
          label="Arrival City"
          onChange={handleFilterChange}
        />
        <Input
          name="date"
          label=""
          type="date"
          onChange={handleFilterChange}
        />
      </div>

      {/* Uçuş Listesi */}
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
            {filteredFlights.length > 0 ? (
              filteredFlights.map((flight) => (
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

      <Button text="Logout" onClick={handleLogout} />
    </div>
  );
};

export default UserDashboard;
