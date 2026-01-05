import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  getPortfolios,
  getPortfolioHistory,
} from "../services/PortfolioService";

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

const DUMMY_CHART_DATA = [
  { date: "2025-01-01", valA: 110000, valB: 98000 },
  { date: "2025-02-01", valA: 115000, valB: 98500 },
  { date: "2025-03-01", valA: 113000, valB: 99000 },
  { date: "2025-04-01", valA: 122000, valB: 99200 },
  { date: "2025-05-01", valA: 120000, valB: 100000 },
  { date: "2025-06-01", valA: 128000, valB: 100500 },
  { date: "2025-07-01", valA: 135000, valB: 101000 },
  { date: "2025-08-01", valA: 142000, valB: 102000 },
  { date: "2025-09-01", valA: 138000, valB: 102500 },
  { date: "2025-10-01", valA: 145000, valB: 103000 },
  { date: "2025-11-01", valA: 148000, valB: 103500 },
  { date: "2025-12-01", valA: 155000, valB: 104500 },
];

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
        <Typography
          variant="body2"
          sx={{ color: "#f50057", fontWeight: "bold" }}
        >
          Value: {payload[1].value.toLocaleString("tr-TR")} ₺
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function PortfolioComparisonScreen() {
  const [portfolios, setPortfolios] = useState([]);

  const [leftPortfolio, setLeftPortfolio] = useState(null);
  const [leftPortfolioHistory, setLeftPortfolioHistory] = useState(null);
  const [leftPortfolioValues, setLeftPortfolioValues] = useState(null);

  const [rightPortfolio, setRightPortfolio] = useState(null);
  const [rightPortfolioHistory, setRighttPortfolioHistory] = useState(null);
  const [rightPortfolioValues, setRightPortfolioValues] = useState(null);

  const [startDate, setStartDate] = useState("2025-10-15");
  const [endDate, setEndDate] = useState("2025-12-25");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const data = await getPortfolios(1);
      setTimeout(() => {
        setReady(true);
      }, 2000);
      setPortfolios(data);
    } catch (error) {
      showToast("Error loading portfolios", "error");
    }
  };

  const shouldDisableDate = (date) => {
    const startDate = dayjs("2025-10-15");
    const endDate = dayjs("2025-12-25");

    return !date.isBetween(startDate, endDate, "day", "[]");
  };

  const handleSelecterChange = async (isLeft, selectedId) => {
    const selectedPortfolio = portfolios.find(
      (portfolio) => portfolio.id == selectedId
    );
    const data = await getPortfolioHistory(
      1,
      selectedPortfolio.id,
      startDate,
      endDate
    );
    if (isLeft) {
      setLeftPortfolio(selectedPortfolio);
      setLeftPortfolioHistory(data);
      setLeftPortfolioValues({
        startValue: data.points.at(0).totalValue,
        endValue: data.points.at(-1).totalValue,
      });
    } else {
      setRightPortfolio(selectedPortfolio);
      setRighttPortfolioHistory(data);
      setRightPortfolioValues({
        startValue: data.points.at(0).totalValue,
        endValue: data.points.at(-1).totalValue,
      });
    }
  };

  const handleCalculate = async () => {
    const leftPortfolioData = await getPortfolioHistory(
      1,
      leftPortfolio.id,
      startDate,
      endDate
    );

    setLeftPortfolioHistory(leftPortfolioData);
    setLeftPortfolioValues({
      startValue: leftPortfolioData.points.at(0).totalValue,
      endValue: leftPortfolioData.points.at(-1).totalValue,
    });

    const rightPortfolioData = await getPortfolioHistory(
      1,
      rightPortfolio.id,
      startDate,
      endDate
    );

    setRighttPortfolioHistory(rightPortfolioData);
    setRightPortfolioValues({
      startValue: rightPortfolioData.points.at(0).totalValue,
      endValue: rightPortfolioData.points.at(-1).totalValue,
    });
  };

  const getChartData = () => {
    if (!leftPortfolioHistory || !rightPortfolioHistory) {
      return [];
    }

    const combinedData = leftPortfolioHistory.points.map((leftData) => {
      const rightData = rightPortfolioHistory.points.find(
        (rightData) => rightData.date === leftData.date
      );

      return {
        date: leftData.date,
        valueLeft: leftData.totalValue,
        valueRight: rightData ? rightData.totalValue : 0,
      };
    });

    return combinedData;
  };

  const renderPortfolioColumn = (portfolio, history, values, label, isLeft) => (
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="caption"
        sx={{ color: "#64748b", fontWeight: 700, mb: 1, display: "block" }}
      >
        {label}
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <Select
          value={portfolio?.id || ""}
          onChange={(e) => handleSelecterChange(isLeft, e.target.value)}
          sx={{
            bgcolor: "#1e293b",
            color: "white",
            borderRadius: 2,
            fontWeight: "bold",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
          }}
        >
          {portfolios.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700} color="white">
          {portfolio?.name}
        </Typography>

        <Grid container spacing={2} sx={{ display: "flex" }}>
          <Grid item xs={6} sx={{ flex: 1 }}>
            <Paper
              sx={{
                p: 2,
                bgcolor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: 3,
              }}
            >
              <Typography variant="caption" color="#64748b">
                Initial Investment
              </Typography>
              <Typography variant="h6" fontWeight={700} color="white">
                {portfolio?.totalAmount.toLocaleString("tr-TR")}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sx={{ flex: 1 }}>
            <Paper
              sx={{
                p: 2,
                bgcolor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: 3,
              }}
            >
              <Typography variant="caption" color="#64748b">
                Start Date Value
              </Typography>
              <Typography variant="h6" fontWeight={700} color="white">
                {values?.startValue?.toLocaleString("tr-TR")}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sx={{ flex: 1 }}>
            <Paper
              sx={{
                p: 2,
                bgcolor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: 3,
              }}
            >
              <Typography variant="caption" color="#64748b">
                End Date Value
              </Typography>
              <Typography variant="h6" fontWeight={700} color="white">
                {values?.endValue?.toLocaleString("tr-TR")}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper
          sx={{
            p: 2,
            bgcolor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 3,
          }}
        >
          <Typography variant="caption" color="#64748b">
            Overall Gain/Loss
          </Typography>
          <Typography variant="h6" fontWeight={700} color="white">
            {(values?.endValue - portfolio?.totalAmount).toLocaleString(
              "tr-TR"
            )}
          </Typography>
        </Paper>

        <TableContainer
          component={Paper}
          sx={{
            bgcolor: "#1e293b",
            borderRadius: 3,
            border: "1px solid #334155",
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid #334155" }}>
            <Typography variant="subtitle2" fontWeight={700} color="white">
              Funds Breakdown
            </Typography>
          </Box>
          <Table size="small">
            <TableHead sx={{ bgcolor: "#111827" }}>
              <TableRow>
                <TableCell
                  sx={{ color: "#64748b", border: 0, fontWeight: "bold" }}
                >
                  CODE
                </TableCell>
                <TableCell
                  sx={{ color: "#64748b", border: 0, fontWeight: "bold" }}
                >
                  ALLOC.
                </TableCell>
                <TableCell
                  sx={{ color: "#64748b", border: 0, fontWeight: "bold" }}
                  align="right"
                >
                  PERF.
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history?.fundChanges.map((fund) => (
                <TableRow key={fund.fundCode}>
                  <TableCell
                    sx={{ color: "white", borderBottom: "1px solid #334155" }}
                  >
                    {fund.fundCode}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#94a3b8", borderBottom: "1px solid #334155" }}
                  >
                    {fund.allocationPercent}%
                  </TableCell>
                  <TableCell
                    sx={{
                      color: fund.percentChange >= 0 ? "#00e676" : "#ff1744",
                      borderBottom: "1px solid #334155",
                      fontWeight: 600,
                    }}
                    align="right"
                  >
                    {fund.percentChange >= 0
                      ? "+" + fund.percentChange
                      : fund.percentChange}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{ bgcolor: "#0f172a", minHeight: "100vh", py: 4, color: "white" }}
        >
          <Container maxWidth="xl">
            <Typography variant="h6" fontWeight={700}>
              Performance Comparison
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 4 }}>
              Compare performance and composition of your portfolios
              side-by-side.
            </Typography>

            <Paper sx={{ p: 3, bgcolor: "#1e293b", mb: 4 }}>
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

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              sx={{ mb: 6 }}
            >
              {renderPortfolioColumn(
                leftPortfolio,
                leftPortfolioHistory,
                leftPortfolioValues,
                "PORTFOLIO A",
                true
              )}
              {renderPortfolioColumn(
                rightPortfolio,
                rightPortfolioHistory,
                rightPortfolioValues,
                "PORTFOLIO B",
                false
              )}
            </Stack>

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
                mb={4}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "white" }}
                >
                  Performance Comparison
                </Typography>
                <Stack direction="row" spacing={3}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#2979ff",
                      }}
                    />
                    <Typography variant="caption" color="#94a3b8">
                      {leftPortfolio?.name}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#f50057",
                      }}
                    />
                    <Typography variant="caption" color="#94a3b8">
                      {rightPortfolio?.name}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box height={400}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
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

                    {/* Line for Portfolio A (Left) */}
                    <Line
                      name={leftPortfolio?.name || "Portfolio A"}
                      type="monotone"
                      dataKey="valueLeft"
                      stroke="#2979ff"
                      strokeWidth={3}
                      dot={false}
                    />

                    {/* Line for Portfolio B (Right) */}
                    <Line
                      name={rightPortfolio?.name || "Portfolio B"}
                      type="monotone"
                      dataKey="valueRight"
                      stroke="#f50057"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
