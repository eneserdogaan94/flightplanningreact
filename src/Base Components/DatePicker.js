import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";

const DatePicker = ({ label, value, onChange, ...props }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        label={label}
        value={value}
        onChange={(newValue) => onChange(newValue)}
        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
