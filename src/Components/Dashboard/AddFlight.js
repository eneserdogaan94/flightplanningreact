import React, { useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import Button from "../../Base Components/Button";
import Input from "../../Base Components/Input";

const AddFlight = () => {
  const [newFlight, setNewFlight] = useState({
    departureAirportId: "",
    arrivalAirportId: "",
    departureTime: "",
    arrivalTime: "",
  });

  const handleAddFlight = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/flights", newFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Flight added successfully!");
    } catch (error) {
      console.error("Error adding flight:", error);
    }
  };

  return (
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
  );
};

export default AddFlight;
