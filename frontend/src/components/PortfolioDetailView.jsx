import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Grid,
  Button,
  Paper,
  Stack,
  CircularProgress,
  InputAdornment,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getPortfolioHistory } from "../services/PortfolioService";

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// Unified Dark Theme to match PortfolioCreator
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2979ff" },
    background: { default: "#0c1119", paper: "#131b28" },
    text: { primary: "#ffffff", secondary: "#94a3b8" },
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
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 8, fontWeight: 600 },
      },
    },
  },
});

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: "#131b28",
          border: "1px solid #1e293b",
          p: 1.5,
          borderRadius: 2,
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "#94a3b8", display: "block", mb: 0.5 }}
        >
          {dayjs(label).format("DD MMMM YYYY")}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#2979ff", fontWeight: "bold" }}
        >
          Value: {payload[0].value.toLocaleString("tr-TR")} ₺
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function PortfolioDetailDrawer({ open, onClose, portfolio }) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState("2025-10-15");
  const [endDate, setEndDate] = useState("2025-12-25");
  const [startDateValue, setStartDateValue] = useState(0);
  const [endDateValue, setEndDateValue] = useState(0);

  const formatCurrency = (value) => {
    return value
      ? value.toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";
  };

  const initial = portfolio?.totalAmount || 0;

  useEffect(() => {
    if (open && portfolio) {
      handleCalculate();
    } else {
      setHistoryData([]);
    }
  }, [open, portfolio]);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const data = await getPortfolioHistory(
        1,
        portfolio.id,
        startDate,
        endDate
      );
      if (data && data.length > 0) {
        setHistoryData(data);
        setStartDateValue(data.at(0).totalValue);
        setEndDateValue(data.at(-1).totalValue);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const shouldDisableDate = (date) => {
    const startDate = dayjs("2025-10-15");
    const endDate = dayjs("2025-12-25");

    return !date.isBetween(startDate, endDate, "day", "[]");
  };

  if (!portfolio) return null;

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Drawer
          anchor="right"
          open={open}
          onClose={onClose}
          transitionDuration={400}
          PaperProps={{
            sx: {
              width: { xs: "100%", sm: "800px" },
              backgroundColor: "#0c1119",
              borderLeft: "1px solid #1e293b",
              boxShadow: "-10px 0px 30px rgba(0,0,0,0.5)",
            },
          }}
        >
          <Box
            sx={{ p: 3, borderBottom: "1px solid #1e293b", bgcolor: "#131b28" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h5" sx={{ color: "white", mb: 0.5 }}>
                  {portfolio.name}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarTodayIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                  <Typography
                    variant="body1"
                    sx={{ color: "#94a3b8", fontWeight: "bold" }}
                  >
                    {dayjs(portfolio.creationTime).format("DD/MM/YYYY")}
                  </Typography>
                </Stack>
              </Box>
              <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ p: 2, overflowY: "auto", height: "100%" }}>
            <Stack spacing={2}>
              <Paper sx={{ p: 3, bgcolor: "#131b28" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "white", fontWeight: 600, mb: 3 }}
                >
                  Calculate Performance
                </Typography>
                <Grid container spacing={3} alignItems="flex-end">
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#94a3b8",
                        fontWeight: 700,
                        display: "block",
                        mb: 1,
                        ml: 0.5,
                      }}
                    >
                      START DATE
                    </Typography>
                    <DatePicker
                      value={dayjs(startDate)}
                      onChange={(newValue) =>
                        setStartDate(newValue?.format("YYYY-MM-DD"))
                      }
                      shouldDisableDate={shouldDisableDate}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          sx: {
                            "& .MuiOutlinedInput-root": { bgcolor: "#17202e" },
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#94a3b8",
                        fontWeight: 700,
                        display: "block",
                        mb: 1,
                        ml: 0.5,
                      }}
                    >
                      END DATE
                    </Typography>
                    <DatePicker
                      value={dayjs(endDate)}
                      onChange={(newValue) =>
                        setEndDate(newValue?.format("YYYY-MM-DD"))
                      }
                      shouldDisableDate={shouldDisableDate}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          sx: {
                            "& .MuiOutlinedInput-root": { bgcolor: "#17202e" },
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleCalculate}
                      sx={{
                        height: 40,
                        bgcolor: "#2979ff",
                        "&:hover": { bgcolor: "#1c66e6" },
                      }}
                    >
                      Calculate
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {/* Stats Grid */}
              <Grid
                container
                spacing={1}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                {[
                  { label: "Initial Investment", value: initial },
                  { label: "Start Date Value", value: startDateValue },
                  { label: "End Date Value", value: endDateValue },
                  {
                    label: "Gain",
                    value: endDateValue - initial,
                    isGain: true,
                  },
                ].map((item, idx) => (
                  <Grid item xs={6} md={3} key={idx} sx={{ flex: 1 }}>
                    <Paper sx={{ p: 2, bgcolor: "#131b28" }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "#94a3b8", fontWeight: 600 }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          my: 0.5,
                          color: item.isGain
                            ? item.value >= 0
                              ? "#00e676"
                              : "#ff1744"
                            : "white",
                        }}
                      >
                        {formatCurrency(Math.abs(item.value))} ₺
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Chart Section */}
              <Paper sx={{ p: 2, bgcolor: "#131b28" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "white", fontWeight: 600, mb: 3 }}
                >
                  Value Performance
                </Typography>
                <Box height={280}>
                  {loading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="100%"
                    >
                      <CircularProgress size={30} sx={{ color: "#2979ff" }} />
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={historyData}
                        margin={{ top: 25, right: 30, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#334155"
                          opacity={0.4}
                        />
                        <XAxis
                          dataKey="date"
                          axisLine={{ stroke: "#475569" }}
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          tickFormatter={(str) => dayjs(str).format("DD/MM")}
                        />
                        <YAxis
                          axisLine={{ stroke: "#475569" }}
                          tick={{ fill: "#64748b", fontSize: 11 }}
                          domain={["auto", "auto"]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="totalValue"
                          stroke="#2979ff"
                          strokeWidth={3}
                          dot={false}
                        >
                          <LabelList
                            content={(props) => {
                              const { x, y, index } = props;
                              if (
                                historyData[index].date ===
                                portfolio.creationTime
                              ) {
                                return (
                                  <g>
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r={5}
                                      fill="#2979ff"
                                      stroke="#fff"
                                      strokeWidth={2}
                                    />
                                    <text
                                      x={x}
                                      y={y}
                                      dy={-15}
                                      fill="#fff"
                                      fontSize={12}
                                      fontWeight="bold"
                                      textAnchor="middle"
                                    >
                                      Created
                                    </text>
                                  </g>
                                );
                              }
                              return null;
                            }}
                          />
                        </Line>
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </Box>
              </Paper>

              {/* Composition Table */}
              <Paper sx={{ bgcolor: "#131b28", overflow: "hidden" }}>
                <Box sx={{ p: 2, borderBottom: "1px solid #1e293b" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    Portfolio Composition
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#0c1119" }}>
                      <TableRow>
                        <TableCell
                          sx={{ color: "#64748b", fontWeight: 700, border: 0 }}
                        >
                          FUND
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ color: "#64748b", fontWeight: 700, border: 0 }}
                        >
                          WEIGHT
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ color: "#64748b", fontWeight: 700, border: 0 }}
                        >
                          PERF.
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {portfolio.funds.map((fund) => (
                        <TableRow
                          key={fund.fundCode}
                          sx={{
                            "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                          }}
                        >
                          <TableCell
                            sx={{
                              color: "white",
                              borderBottom: "1px solid #1e293b",
                              fontWeight: 500,
                            }}
                          >
                            {fund.fundCode}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color: "#94a3b8",
                              borderBottom: "1px solid #1e293b",
                            }}
                          >
                            {fund.allocationPercent}%
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color: "#00e676",
                              borderBottom: "1px solid #1e293b",
                              fontWeight: 600,
                            }}
                          >
                            +12.4%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Stack>
          </Box>
        </Drawer>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
