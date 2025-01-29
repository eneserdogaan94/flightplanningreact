import React from "react";
import { MenuItem, FormControl, InputLabel, Select as MuiSelect, FormHelperText } from "@mui/material";

const Select = ({ label, value, onChange, options, error, helperText, ...props }) => {
  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect value={value} onChange={onChange} {...props}>
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default Select;