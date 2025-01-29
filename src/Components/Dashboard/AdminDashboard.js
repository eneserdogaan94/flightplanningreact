import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../Base Components/Button";
import Input from "../../Base Components/Input";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
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
  }, [user]);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get("/api/flights");
      setFlights(response.data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  const handleAddFlight = async () => {
    try {
      await axios.post("/api/flights", newFlight);
      fetchFlights();
    } catch (error) {
      console.error("Error adding flight:", error);
    }
  };

  const handleDeleteFlight = async (flightId) => {
    try {
      await axios.delete(`/api/flights/${flightId}`);
      fetchFlights();
    } catch (error) {
      console.error("Error deleting flight:", error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Manage Flights</h2>

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
        label="Departure Time"
        type="datetime-local"
        onChange={(e) => setNewFlight({ ...newFlight, departureTime: e.target.value })}
      />
      <Input
        name="arrivalTime"
        label="Arrival Time"
        type="datetime-local"
        onChange={(e) => setNewFlight({ ...newFlight, arrivalTime: e.target.value })}
      />
      <Button text="Add Flight" onClick={handleAddFlight} />

      <h3>Flight List</h3>
      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            {flight.departureAirport.city} → {flight.arrivalAirport.city} at {flight.departureTime}
            <Button text="Delete" onClick={() => handleDeleteFlight(flight.id)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
