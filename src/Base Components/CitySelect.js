import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

// 81 ilin olduğu liste
const cities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya",
  "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur",
  "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne",
  "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane",
  "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş",
  "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli",
  "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
  "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye",
  "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak",
  "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat",
  "Zonguldak"
];

const CitySelect = ({ onCityChange }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [error, setError] = useState(false);

  const handleChange = (event, newValue) => {
    setSelectedCity(newValue);
    setError(false); // Şehir seçildiğinde hata mesajını sıfırla
    if (onCityChange) onCityChange(newValue);
  };

  const handleBlur = () => {
    if (!selectedCity) {
      setError(true); // Şehir seçilmemişse hata mesajını göster
    }
  };

  return (
      <Autocomplete
        options={cities}
        value={selectedCity}
        onChange={handleChange}
        onBlur={handleBlur} // Bileşen dışına tıklandığında kontrol et
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select City"
            placeholder="Search city"
            error={error} // Hata durumunu TextField'a ilet
            helperText={error ? "Şehir seçilmesi zorunludur." : ""} // Hata mesajı
          />
        )}
      />
  );
};

export default CitySelect;
