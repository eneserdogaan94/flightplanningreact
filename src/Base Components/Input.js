import React from "react";
import TextField from "@mui/material/TextField";

const Input = ({ label, value, onChange, error, helperText, ...props }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={helperText}
      fullWidth
      margin="normal"
      {...props}
    />
  );
};

export default Input;
