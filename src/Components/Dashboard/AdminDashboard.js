import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Login/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import AirplaneTicketIcon from '../../Images/aircraft-airplane-airline-logo-or-label-journey-vector-21441986.jpg';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "../../Base Components/Button";
import Input from "../../Base Components/Input";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [newFlight, setNewFlight] = useState({
    departureAirportId: "",
    arrivalAirportId: "",
    departureTime: "",
    arrivalTime: "",
  });
  const [activeTab, setActiveTab] = useState("flights");

  useEffect(() => {
    fetchFlights();
  }, [user]);

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

  const handleAddFlight = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/flights", newFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFlights();
    } catch (error) {
      console.error("Error adding flight:", error);
    }
  };

  const handleLogout = () => {
    logout(() => navigate("/login"));
  };

  return (
    <AppProvider 
      navigation={[
        {
          title: "Flight List",
          icon: <FlightIcon />,
          onClick: () => setActiveTab("flights"),
        },
        {
          title: "Add Flight",
          icon: <AddCircleOutlineIcon />,
          onClick: () => setActiveTab("add-flight"),
        },
      ]}
      branding={{
        logo: <img src={AirplaneTicketIcon} alt="Flight Logo" style={{ height: 40 }} />, 
        title: 'Flight Planning App',
        homeUrl: '/',
      }}
    >
      <DashboardLayout>
        <Box sx={{ padding: "20px" }}>
          {activeTab === "add-flight" && (
            <>
              <Typography variant="h6" sx={{ marginTop: "20px" }}>Add New Flight</Typography>
              <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <Input
                  name="departureAirportId"
                  label="Departure Airport ID"
                  onChange={(e) => setNewFlight({ ...newFlight, departureAirportId: e.target.value })}
                />
                <Input
                  name="arrivalAirportId"
                  label="Arrival Airport ID"
                  onChange={(e) => setNewFlight({ ...newFlight, arrivalAirportId: e.target.value })}
                />
                <Input
                  name="departureTime"
                  type="datetime-local"
                  onChange={(e) => setNewFlight({ ...newFlight, departureTime: e.target.value })}
                />
                <Input
                  name="arrivalTime"
                  type="datetime-local"
                  onChange={(e) => setNewFlight({ ...newFlight, arrivalTime: e.target.value })}
                />
                <Button text="Add Flight" onClick={handleAddFlight} />
              </Box>
            </>
          )}

          {activeTab === "flights" && (
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
                        <TableCell colSpan={5} align="center">
                          No flights available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
};

export default AdminDashboard;
