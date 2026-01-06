import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Login from "./Login";

// Creating a custom theme to match the image colors
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2", // The bright blue for the button
    },
    background: {
      default: "#0b1221", // The deep dark background
      paper: "#1e293b",
    },
    text: {
      secondary: "#94a3b8", // Slate color for descriptions
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
});

const UnauthorizedPage = ({ onLogin }) => {
  const [loginOpen, setLoginOpen] = useState(false);

  const handleLoginClose = () => {
    setLoginOpen(false);
  };
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "90vh",
          bgcolor: "background.default",
        }}
      >
        <Container
          component="main"
          maxWidth="sm"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Lock Icon Circle */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              bgcolor: "rgba(30, 41, 59, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 48, color: "primary.main" }} />
          </Box>

          <Typography variant="h4" gutterBottom>
            Unauthorized Access
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 400 }}
          >
            You need to be logged in to access this page. Please log in or
            create an account to continue.
          </Typography>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              disableElevation
              sx={{
                px: 6,
                py: 1.5,
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
              }}
              onClick={() => {
                setLoginOpen(true);
              }}
            >
              Continue with authorization
            </Button>
          </Box>
        </Container>
      </Box>

      <Login
        open={loginOpen}
        handleClose={handleLoginClose}
        onLogin={onLogin}
      ></Login>
    </ThemeProvider>
  );
};

export default UnauthorizedPage;
