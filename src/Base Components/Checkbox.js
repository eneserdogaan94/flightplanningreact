import React from "react";
import { Checkbox as MuiCheckbox, FormControlLabel } from "@mui/material";

const Checkbox = ({ label, checked, onChange, ...props }) => {
  return (
    <FormControlLabel
      control={<MuiCheckbox checked={checked} onChange={onChange} {...props} />}
      label={label}
    />
  );
};

export default Checkbox;
