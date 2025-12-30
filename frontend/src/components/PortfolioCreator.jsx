import React, { useState, useEffect } from "react";
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
  Button,
  InputAdornment,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getAllFunds, getAllFundsByDate } from "../services/FundService";
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#334155 transparent",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            backgroundColor: "#334155",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#475569",
            },
        },
      },
    },
  },
});

export default function PortfolioCreator({
  handleBackClick,
  handleCreateClick,
  portfolio,
}) {
  const [allFunds, setAllFunds] = useState([]);
  const [errors, setErrors] = useState({ name: "", amount: "" });

  const [portfolioName, setPortfolioName] = useState(
    portfolio ? portfolio.name : ""
  );
  const [totalAmount, setTotalAmount] = useState(
    portfolio ? portfolio.totalAmount : ""
  );
  const [creationDate, setCreationDate] = useState(
    portfolio ? portfolio.creationTime : "2025-12-19"
  );
  const [funds, setFunds] = useState(portfolio ? portfolio.funds : []);

  const totalAllocation = funds.reduce(
    (acc, fund) => acc + fund.allocationPercent,
    0
  );

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const res = await getAllFunds();
    if (res) {
      setAllFunds(res);
    }
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!portfolioName.trim()) {
      tempErrors.name = "Portfolio name is required.";
      isValid = false;
    }

    const cleanAmount = totalAmount.toString();
    if (!cleanAmount || isNaN(cleanAmount) || parseFloat(cleanAmount) <= 0) {
      tempErrors.amount = "Please enter a valid investment amount.";
      isValid = false;
    }

    if (dayjs(creationDate).isAfter(dayjs(), "day")) {
      tempErrors.date = "Date cannot be in the future.";
      isValid = false;
    }

    if (funds.length === 0 || funds.some((f) => f.allocationPercent <= 0)) {
      tempErrors.funds = "error";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSliderChange = (fundCode, newValue) => {
    const otherFundsTotal = funds
      .filter((f) => f.fundCode !== fundCode)
      .reduce((acc, f) => acc + f.allocationPercent, 0);

    const maxAllowed = 100 - otherFundsTotal;
    const validValue = Math.min(newValue, maxAllowed);

    setFunds(
      funds.map((f) =>
        f.fundCode === fundCode ? { ...f, allocationPercent: validValue } : f
      )
    );
  };

  const handleDelete = (fundCode) => {
    setFunds(funds.filter((f) => f.fundCode !== fundCode));
  };

  const handleAddFund = (newFund) => {
    if (funds.some((f) => f.fundCode === newFund.fundCode)) {
      alert("This fund is already in your portfolio.");
      return;
    }

    setFunds([
      ...funds,
      {
        fundCode: newFund.fundCode,
        fundName: newFund.fundName,
        allocationPercent: 0,
      },
    ]);
  };

  const shouldDisableDate = (date) => {
    const startDate = dayjs("2025-10-15");
    const endDate = dayjs("2025-12-25");

    return !date.isBetween(startDate, endDate, "day", "[]");
  };

  const handleDateChange = async (newValue) => {
    if (!newValue) return;
    const dateStr = newValue.format("YYYY-MM-DD");
    setCreationDate(dateStr);
    const res = await getAllFundsByDate(dateStr);
    if (res && res.length !== 0) {
      setAllFunds(res);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />

        <Container sx={{ mt: 5, mb: 5, maxWidth: "100% !important" }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              {portfolio ? "Update Your Portfolio" : "Create Your Portfolio"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Build and customize your investment portfolio by selecting from
              available funds.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} lg={12}>
              <Paper sx={{ p: 3, mb: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
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
                      value={portfolioName}
                      error={!!errors.name}
                      helperText={errors.name}
                      onChange={(e) => {
                        setPortfolioName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      Total Investment
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g., 10000 "
                      variant="outlined"
                      size="small"
                      value={totalAmount}
                      error={!!errors.amount}
                      helperText={errors.amount}
                      onChange={(e) => {
                        setTotalAmount(e.target.value);
                        if (errors.amount) setErrors({ ...errors, amount: "" });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      Creation Date
                    </Typography>
                    <DatePicker
                      value={dayjs(creationDate)}
                      onChange={handleDateChange}
                      shouldDisableDate={shouldDisableDate}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!errors.date,
                          helperText: errors.date,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarTodayIcon
                                  sx={{ fontSize: 18, color: "#2979ff" }}
                                />
                              </InputAdornment>
                            ),
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  height: 450,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
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
                    {totalAllocation === 100
                      ? "Perfect! Ready to create."
                      : "Allocate 100% to create portfolio"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    pr: 1,
                  }}
                >
                  <Stack spacing={2}>
                    {funds.map((fund) => {
                      const hasError =
                        errors.funds && fund.allocationPercent === 0;
                      return (
                        <Paper
                          key={fund.code}
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: hasError
                              ? "rgba(239, 83, 80, 0.08)"
                              : "#17202e",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            border: hasError
                              ? "1px solid #ef5350"
                              : "1px solid transparent",
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" noWrap>
                              {fund.fundName.length > 30
                                ? fund.fundName.slice(0, 27) + "..."
                                : fund.fundName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {fund.fundCode}
                            </Typography>
                          </Box>
                          <Box sx={{ width: 140, mr: 2 }}>
                            <Slider
                              value={fund.allocationPercent}
                              onChange={(e, val) =>
                                handleSliderChange(fund.fundCode, val)
                              }
                              size="small"
                              color={hasError ? "error" : "primary"}
                              sx={{ mb: 0 }}
                            />
                            {hasError && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{
                                  display: "block",
                                  mt: -0.5,
                                  fontSize: "0.7rem",
                                  fontWeight: "bold",
                                }}
                              >
                                Allocation cannot be 0
                              </Typography>
                            )}
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              width: 40,
                              textAlign: "right",
                              fontWeight: "bold",
                              color: hasError ? "#ef5350" : "inherit",
                            }}
                          >
                            {fund.allocationPercent}%
                          </Typography>
                          <IconButton
                            onClick={() => handleDelete(fund.fundCode)}
                            size="small"
                            sx={{ color: "text.secondary" }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Box>
              </Paper>
              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 2, justifyContent: "flex-end" }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  sx={{ minWidth: 100, borderColor: "#334155" }}
                  onClick={handleBackClick}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ minWidth: 140 }}
                  disabled={totalAllocation !== 100}
                  onClick={() => {
                    if (!validate()) return;

                    const payload = {
                      userId: 1,
                      name: portfolioName,
                      totalAmount: parseFloat(totalAmount),
                      creationTime: creationDate,
                      allocations: funds.map((fund) => ({
                        fundCode: fund.fundCode,
                        allocationPercent: fund.allocationPercent,
                      })),
                    };

                    handleCreateClick(payload);
                  }}
                >
                  {portfolio ? "Update" : "Create"}
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} lg={10}>
              <Box sx={{ height: "100%" }}>
                <FundList
                  onAddFund={handleAddFund}
                  currentPortfolio={funds}
                  allFunds={allFunds}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
