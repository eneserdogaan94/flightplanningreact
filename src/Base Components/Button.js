import React from "react";
import MuiButton from "@mui/material/Button";

const Button = ({ text, onClick, ...props }) => {
  return (
    <MuiButton onClick={onClick} fullWidth variant="contained" {...props}>
      {text}
    </MuiButton>
  );
};

export default Button;
