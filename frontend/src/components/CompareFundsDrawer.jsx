import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getFundHistory } from "../services/FundService";

const COLORS = [
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export default function CompareFundsDrawer({ open, onClose, funds = [] }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && funds.length > 0) {
      const fetchAndMergeData = async () => {
        setLoading(true);
        try {
          const promises = funds.map((fund) => getFundHistory(fund.code));
          const results = await Promise.all(promises);
          const dataMap = {};

          results.forEach((fundHistory, index) => {
            const fundCode = funds[index].code;
            if (fundHistory) {
              fundHistory.forEach((point) => {
                const dateKey = point.date;
                if (!dataMap[dateKey]) {
                  dataMap[dateKey] = { date: dateKey };
                }
                dataMap[dateKey][fundCode] = point.price;
              });
            }
          });
          const mergedData = Object.values(dataMap).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );

          setChartData(mergedData);
        } catch (error) {
          console.error("Error fetching comparison data", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAndMergeData();
    } else {
      setChartData([]);
    }
  }, [open, funds]);

  const formatCurrency = (value) =>
    value
      ? value.toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";

  const formatNumber = (value) => (value ? value.toLocaleString("tr-TR") : "0");

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      return (
        <Box
          sx={{
            backgroundColor: "#1F2937",
            padding: 2,
            border: "1px solid #374151",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={1}
          >
            {formattedDate}
          </Typography>
          {payload.map((entry, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              gap={1}
              mb={0.5}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                }}
              />
              <Typography variant="body2" color="white" sx={{ minWidth: 40 }}>
                {entry.name}:
              </Typography>
              <Typography variant="body2" color="white" fontWeight="bold">
                ₺{formatCurrency(entry.value)}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", md: "800px" },
          backgroundColor: "#111827",
          borderLeft: "1px solid #1F2937",
          padding: 4,
        },
      }}
    >
      <Box role="presentation">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={3}
        >
          <Box>
            <Typography
              variant="h5"
              color="white"
              fontWeight={700}
              gutterBottom
            >
              Fund Comparison
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {funds.map((fund, index) => (
                <Chip
                  key={fund.code}
                  label={fund.code}
                  size="small"
                  icon={
                    <CircleIcon
                      style={{
                        fontSize: 10,
                        color: COLORS[index % COLORS.length],
                      }}
                    />
                  }
                  sx={{
                    backgroundColor: "#1F2937",
                    color: "white",
                    fontWeight: 600,
                    border: "1px solid #374151",
                    "& .MuiChip-icon": { marginLeft: 1 },
                  }}
                />
              ))}
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: "text.secondary", "&:hover": { color: "white" } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "#1F2937", mb: 4 }} />

        <Box sx={{ width: "100%", height: 350, mb: 4 }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress color="success" />
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(str) => {
                    const date = new Date(str);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  domain={["auto", "auto"]}
                  tickFormatter={(val) => `₺${val}`}
                />
                <Tooltip content={<CustomTooltip />} />

                {funds.map((fund, index) => (
                  <Line
                    key={fund.code}
                    type="monotone"
                    dataKey={fund.code}
                    name={fund.code}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>

        <Typography variant="h6" color="white" gutterBottom sx={{ mt: 2 }}>
          Stats Overview
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            border: "1px solid #1F2937",
          }}
        >
          <Table size="small" aria-label="comparison table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1F2937" }}>
                <TableCell sx={{ color: "#9CA3AF", borderBottom: "none" }}>
                  Fund
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#9CA3AF", borderBottom: "none" }}
                >
                  Price
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#9CA3AF", borderBottom: "none" }}
                >
                  Total Value
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#9CA3AF", borderBottom: "none" }}
                >
                  Investors
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {funds.map((fund, index) => (
                <TableRow
                  key={fund.code}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ color: "white", borderBottom: "1px solid #1F2937" }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {fund.code}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", borderBottom: "1px solid #1F2937" }}
                  >
                    {formatCurrency(fund.price)} ₺
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", borderBottom: "1px solid #1F2937" }}
                  >
                    {formatCurrency(fund.totalValue)} ₺
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "white", borderBottom: "1px solid #1F2937" }}
                  >
                    {formatNumber(fund.investorCount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Drawer>
  );
}
