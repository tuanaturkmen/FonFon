import React, { useState } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  TextField,
  LinearProgress,
  Slider,
  IconButton,
  Stack,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FundList from "./FundList";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2979ff",
    },
    background: {
      default: "#0c1119",
      paper: "#131b28",
    },
    text: {
      primary: "#ffffff",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 12,
          border: "1px solid #1e293b",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#17202e",
            borderRadius: 8,
            "& fieldset": { borderColor: "#334155" },
            "&:hover fieldset": { borderColor: "#475569" },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

export default function PortfolioCreator() {
  const [funds, setFunds] = useState([
    {
      id: 1,
      name: "Global Tech Innovators",
      ticker: "GTI",
      percent: 45,
    },
    {
      id: 2,
      name: "Emerging Markets Growth",
      ticker: "EMG",
      percent: 30,
    },
  ]);

  const totalAllocation = funds.reduce((acc, fund) => acc + fund.percent, 0);

  const handleSliderChange = (id, newValue) => {
    setFunds(funds.map((f) => (f.id === id ? { ...f, percent: newValue } : f)));
  };

  const handleDelete = (id) => {
    setFunds(funds.filter((f) => f.id !== id));
  };

  const handleAddFund = (newFund) => {
    // Check if already exists
    if (funds.some((f) => f.ticker === newFund.ticker)) {
      alert("This fund is already in your portfolio.");
      return;
    }

    // Add with 0 percent initially
    setFunds([
      ...funds,
      {
        id: newFund.id,
        name: newFund.name,
        ticker: newFund.ticker,
        percent: 0,
      },
    ]);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Create Your Portfolio
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Build and customize your investment portfolio by selecting from
            available funds.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} lg={7}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, color: "text.secondary" }}
                  >
                    Portfolio Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g., Long-Term Growth"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, color: "text.secondary" }}
                  >
                    Total Investment
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g., $10,000"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, minHeight: 400 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Selected Funds
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Total Allocation</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {totalAllocation}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={totalAllocation}
                  sx={{ height: 8, borderRadius: 4, bgcolor: "#1e293b" }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  Allocate 100% to create portfolio
                </Typography>
              </Box>

              {/* Funds List */}
              <Stack spacing={2}>
                {funds.map((fund) => (
                  <Paper
                    key={fund.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "#17202e",
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      border: "none",
                    }}
                  >
                    {/* Name & Ticker */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">{fund.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {fund.ticker}
                      </Typography>
                    </Box>

                    {/* Slider */}
                    <Box sx={{ width: 140, mr: 2 }}>
                      <Slider
                        value={fund.percent}
                        onChange={(e, val) => handleSliderChange(fund.id, val)}
                        size="small"
                      />
                    </Box>

                    {/* Percentage */}
                    <Typography
                      variant="body2"
                      sx={{ width: 40, textAlign: "right", fontWeight: "bold" }}
                    >
                      {fund.percent}%
                    </Typography>

                    {/* Delete Button */}
                    <IconButton
                      onClick={() => handleDelete(fund.id)}
                      size="small"
                      sx={{ color: "text.secondary" }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={5}>
            <Box sx={{ height: "100%" }}>
              <FundList onAddFund={handleAddFund} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
