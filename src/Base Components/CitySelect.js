import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

// 81 il olarak kaydetmedim o kadar örnek olmasın diye.
const cities = [
  "İstanbul","Ankara","İzmir","Antalya","Trabzon"
];

const CitySelect = ({ onCityChange }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [error, setError] = useState(false);

  const handleChange = (event, newValue) => {
    setSelectedCity(newValue);
    setError(false);
    if (onCityChange) onCityChange(newValue);
  };

  const handleBlur = () => {
    if (!selectedCity) {
      setError(true);
    }
  };

  return (
      <Autocomplete
        options={cities}
        value={selectedCity}
        onChange={handleChange}
        onBlur={handleBlur}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Şehir"
            placeholder="Search city"
            error={error}
            helperText={error ? "Şehir seçilmesi zorunludur." : ""}
          />
        )}
      />
  );
};

export default CitySelect;
