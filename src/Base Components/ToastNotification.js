import React from "react";
import { Snackbar, Alert } from "@mui/material";

const ToastNotification = ({ open, severity, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000} // 5 saniye sonra kaybolur
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Sağ alt köşe
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
