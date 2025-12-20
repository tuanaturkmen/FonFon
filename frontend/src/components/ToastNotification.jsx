import React from "react";
import { Snackbar, Alert, Box } from "@mui/material";
import { keyframes } from "@mui/system";

const shrinkAnimation = keyframes`
  from { width: 100%; }
  to { width: 0%; }
`;

export default function ToastNotification({
  open,
  message,
  severity,
  onClose,
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClick={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: 2,
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          pb: 0.5,
          "& .MuiAlert-message": { mb: 1 },
        }}
      >
        {message}

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "4px",
            bgcolor: "rgba(255, 255, 255, 0.7)",
            animation: open ? `${shrinkAnimation} 5s linear forwards` : "none",
          }}
        />
      </Alert>
    </Snackbar>
  );
}
