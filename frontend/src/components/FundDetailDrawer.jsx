import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getFundHistory } from "../services/FundService";

export default function FundDetailDrawer({ open, onClose, fund }) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && fund) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getFundHistory(fund.code);

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
  }, [open, fund]);

  const formatCurrency = (value) => {
    return value
      ? value.toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";
  };

  const formatNumber = (value) => {
    return value ? value.toLocaleString("tr-TR") : "0";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "#1F2937",
            padding: 2,
            border: "1px solid #374151",
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body2" color="white" fontWeight="bold">
            ₺{formatCurrency(payload[0].value)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (!fund) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "600px" },
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
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Chip
                label={fund.code}
                size="small"
                sx={{
                  backgroundColor: "#1F2937",
                  color: "#9CA3AF",
                  fontWeight: 700,
                  borderRadius: 1,
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <CalendarTodayIcon sx={{ fontSize: 14 }} />{" "}
                {formatDate(fund.date)}
              </Typography>
            </Box>

            <Typography
              variant="h5"
              color="white"
              fontWeight={700}
              lineHeight={1.3}
            >
              {fund.name}
            </Typography>
            <Typography
              variant="body2"
              color="success.main"
              sx={{ mt: 1, fontWeight: 500 }}
            >
              {fund.type}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: "text.secondary", "&:hover": { color: "white" } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "#1F2937", mb: 4 }} />

        <Typography variant="h6" color="white" gutterBottom>
          Price History (1 Year)
        </Typography>

        <Box sx={{ width: "100%", height: 300, mb: 4 }}>
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
              <LineChart data={historyData}>
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
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Current Price
            </Typography>
            <Typography
              variant="h4"
              color="white"
              fontWeight={600}
              sx={{ mt: 1 }}
            >
              ₺{formatCurrency(fund.price)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Fund Value
            </Typography>
            <Typography
              variant="h6"
              color="white"
              fontWeight={500}
              sx={{ mt: 1 }}
            >
              ₺{formatCurrency(fund.totalValue)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Investor Count
            </Typography>
            <Typography variant="h6" color="white" sx={{ mt: 1 }}>
              {formatNumber(fund.investorCount)}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Circulating Units
            </Typography>
            <Typography variant="h6" color="white" sx={{ mt: 1 }}>
              {formatNumber(fund.circulatingUnits)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
}
