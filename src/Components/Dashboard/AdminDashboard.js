import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Login/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../Base Components/Button";
import Input from "../../Base Components/Input";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

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

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchFlights();
  }, []);

  // 🛠 Uçuşları API'den çeker (JWT token ile)
  const fetchFlights = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please log in.");
        return;
      }

      const response = await axios.get("/api/flights", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFlights(response.data);
      console.log("Flights:", response.data);
    } catch (error) {
      console.error("Error fetching flights:", error.response?.data || error.message);
    }
  };

  // 🛠 Yeni uçuş ekler (JWT token ile)
  const handleAddFlight = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please log in.");
        return;
      }

      await axios.post("/api/flights", newFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchFlights(); // Listeyi güncelle
    } catch (error) {
      console.error("Error adding flight:", error.response?.data || error.message);
    }
  };


  // 🛠 Logout işlemi
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Manage Flights</h2>

      {/* ✈️ Yeni Uçuş Ekleme Formu */}
      <h3>Add New Flight</h3>
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

      {/* ✈️ Uçuş Listesi */}
      <h3>Flight List</h3>
      <List>
  {flights.length > 0 ? (
    flights.map((flight) => (
      <Card key={flight.id} sx={{ marginBottom: 2 }}>
        <CardContent>
          <ListItem
          >
            <ListItemText
              primary={`${
                flight.departureAirport?.city || "Unknown Departure"
              } → ${flight.arrivalAirport?.city || "Unknown Arrival"}`}
              secondary={`Departure: ${flight.departureTime || "N/A"} | Arrival: ${flight.arrivalTime || "N/A"}`}
            />
          </ListItem>
        </CardContent>
      </Card>
    ))
  ) : (
    <Typography>No flights available</Typography>
  )}
</List>


      <Button text="Logout" onClick={handleLogout} />
    </div>
  );
};

export default AdminDashboard;
