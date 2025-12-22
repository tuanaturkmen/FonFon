import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { getPortfolioHistory } from "../services/PortfolioService";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PortfolioDetailDrawer({ open, onClose, portfolio }) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState("2025-12-15");
  const [endDate, setEndDate] = useState("2025-12-19");

  const formatCurrency = (value) => {
    return value
      ? value.toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";
  };

  const initial = portfolio?.totalAmount || 0;
  const current = portfolio?.currentValue || 0;
  const diff = current - initial;
  const isProfit = diff >= 0;

  useEffect(() => {
    if (open && portfolio) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getPortfolioHistory(
            1,
            portfolio.id,
            startDate,
            endDate
          );
          if (data) {
            setHistoryData(data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
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
      if (data) {
        setHistoryData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!portfolio) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      transitionDuration={400}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "650px" },
          backgroundColor: "#0f172a", // Deep slate background
          borderLeft: "1px solid #1e293b",
          boxShadow: "-10px 0px 30px rgba(0,0,0,0.5)",
        },
      }}
    >
      {/* 1. HEADER SECTION */}
      <Box sx={{ p: 3, borderBottom: "1px solid #1e293b", bgcolor: "#111827" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography
              variant="h5"
              sx={{ color: "white", fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              {portfolio.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
              Detailed performance metrics and fund distribution.
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#94a3b8",
              bgcolor: "rgba(255,255,255,0.03)",
              "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* 2. SCROLLABLE CONTENT */}
      <Box sx={{ p: 3, overflowY: "auto", height: "100%" }}>
        <Stack spacing={4} sx={{ pb: 10 }}>
          {/* --- CALCULATE PERFORMANCE CARD --- */}
          <Paper
            sx={{
              p: 3,
              bgcolor: "#1e293b",
              borderRadius: 4,
              border: "1px solid #334155",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "white", fontWeight: 600, mb: 3 }}
            >
              Calculate Performance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#94a3b8",
                    fontWeight: 700,
                    display: "block",
                    ml: 0.5,
                  }}
                >
                  START DATE
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon
                          sx={{ fontSize: 18, color: "#2979ff" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    input: { color: "white", fontSize: "0.85rem", ml: -1 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#0f172a",
                      borderRadius: 2,
                      "& fieldset": { borderColor: "#334155" },
                      "&:hover fieldset": { borderColor: "#2979ff" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#94a3b8",
                    fontWeight: 700,
                    display: "block",
                    ml: 0.5,
                  }}
                >
                  END DATE
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon
                          sx={{ fontSize: 18, color: "#2979ff" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    input: { color: "white", fontSize: "0.85rem", ml: -1 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#0f172a",
                      borderRadius: 2,
                      "& fieldset": { borderColor: "#334155" },
                      "&:hover fieldset": { borderColor: "#2979ff" },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#2979ff",
                    textTransform: "none",
                    fontWeight: 700,
                    py: 1.2,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#1c66e6" },
                  }}
                  onClick={() => handleCalculate()}
                >
                  Calculate Performance
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* --- THREE STAT BOXES --- */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "#1e293b",
                  borderRadius: 3,
                  border: "1px solid #334155",
                  height: "90%",
                  width: "150px",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", fontWeight: 600 }}
                >
                  Total Investment
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: 700, my: 0.5 }}
                >
                  {formatCurrency(initial)} ₺
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#00e676",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                ></Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "#1e293b",
                  borderRadius: 3,
                  border: "1px solid #334155",
                  height: "90%",
                  width: "150px",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", fontWeight: 600 }}
                >
                  Current Value
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: 700, my: 0.5 }}
                >
                  {formatCurrency(current)} ₺
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#00e676",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                ></Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "#1e293b",
                  borderRadius: 3,
                  border: "1px solid #334155",
                  height: "90%",
                  width: "150px",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", fontWeight: 600 }}
                >
                  Overall Gain
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: isProfit ? "#00e676" : "#ff1744",
                    fontWeight: 700,
                    my: 0.5,
                  }}
                >
                  {formatCurrency(Math.abs(diff))} ₺
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: isProfit ? "#00e676" : "#ff1744" }}
                ></Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* --- PERFORMANCE CHART CARD --- */}
          <Paper
            sx={{
              p: 3,
              bgcolor: "#1e293b",
              borderRadius: 4,
              border: "1px solid #334155",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: "white", fontWeight: 600 }}
              >
                Value Performance
              </Typography>
            </Box>
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
                  <AreaChart data={historyData}>
                    <defs>
                      <linearGradient
                        id="drawerChartColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2979ff"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#2979ff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                      itemStyle={{ color: "#2979ff" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalValue"
                      stroke="#2979ff"
                      strokeWidth={3}
                      fill="url(#drawerChartColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>

          {/* --- COMPOSITION TABLE CARD --- */}
          {/*
          <Paper
            sx={{
              bgcolor: "#1e293b",
              borderRadius: 4,
              border: "1px solid #334155",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2.5, borderBottom: "1px solid #334155" }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "white", fontWeight: 600 }}
              >
                Portfolio Composition
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: "#111827" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                        border: 0,
                        py: 1.5,
                      }}
                    >
                      FUND
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                        border: 0,
                        py: 1.5,
                      }}
                      align="right"
                    >
                      WEIGHT
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                        border: 0,
                        py: 1.5,
                      }}
                      align="right"
                    >
                      PERF.
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {portfolio.funds.map((fund) => (
                    <TableRow
                      key={fund.fundCode}
                      sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}
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
                        sx={{
                          color: "#94a3b8",
                          borderBottom: "1px solid #1e293b",
                        }}
                        align="right"
                      >
                        {fund.allocationPercent}%
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#00e676",
                          borderBottom: "1px solid #1e293b",
                          fontWeight: 600,
                        }}
                        align="right"
                      >
                        +12.4%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          */}
        </Stack>
      </Box>
    </Drawer>
  );
}
