import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Login/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../Base Components/Button";
import CitySelect from "../../Base Components/CitySelect";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [city, setCity] = useState(user?.city || "");

  useEffect(() => {
    if (city) {
      fetchFlights();
    }
  }, [city]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  const fetchFlights = async () => {
    try {
      const response = await axios.get(`/api/flights/from/${city}`);
      setFlights(response.data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  const handleCityChange = (selectedCity) => {
    setCity(selectedCity);
    user.city = selectedCity; // Kullanıcının şehir bilgisi güncellensin
  };

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <h2>Flights from {city || "your location"}</h2>

      {!city && (
        <div>
          <p>Please select your city to view flights.</p>
          <CitySelect onCityChange={handleCityChange} />
        </div>
      )}

      {city && flights.length > 0 ? (
        <ul>
          {flights.map((flight) => (
            <li key={flight.id}>
              {flight.departureAirport.city} → {flight.arrivalAirport.city} at {flight.departureTime}
            </li>
          ))}
        </ul>
      ) : (
        <p>No flights available from this city.</p>
      )}

      <Button text="Logout" onClick={() => navigate("/login")} />
    </div>
  );
};

export default UserDashboard;
