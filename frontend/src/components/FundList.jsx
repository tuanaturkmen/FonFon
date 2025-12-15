import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Stack,
  Chip,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const AVAILABLE_FUNDS = [
  {
    id: 101,
    name: "US Equity Fund",
    ticker: "USEF",
    returnRate: 15.2,
    type: "Equity",
  },
  {
    id: 102,
    name: "Global Bond Index",
    ticker: "GBI",
    returnRate: 4.5,
    type: "Bonds",
  },
  {
    id: 103,
    name: "Real Estate REIT",
    ticker: "REIT",
    returnRate: -2.1,
    type: "Real Estate",
  },
  {
    id: 104,
    name: "Sustainable Energy Fund",
    ticker: "SEF",
    returnRate: 22.8,
    type: "Equity",
  },
  {
    id: 105,
    name: "Healthcare Advances",
    ticker: "HCA",
    returnRate: 11.3,
    type: "Equity",
  },
  {
    id: 106,
    name: "Asia Pacific Dividend",
    ticker: "APD",
    returnRate: 7.9,
    type: "Equity",
  },
];

const FILTERS = ["All", "Equity", "Bonds", "Real Estate"];

export default function FundList({ onAddFund }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFunds = AVAILABLE_FUNDS.filter((fund) => {
    const matchesFilter = activeFilter === "All" || fund.type === activeFilter;
    const matchesSearch =
      fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Paper
      sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Available Funds
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search by name or ticker..."
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Filter Chips */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {FILTERS.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            clickable
            onClick={() => setActiveFilter(filter)}
            sx={{
              bgcolor:
                activeFilter === filter ? "#2979ff" : "rgba(255,255,255,0.05)",
              color: activeFilter === filter ? "white" : "text.secondary",
              "&:hover": {
                bgcolor:
                  activeFilter === filter ? "#256be0" : "rgba(255,255,255,0.1)",
              },
            }}
          />
        ))}
      </Stack>

      {/* Scrollable List */}
      <Stack spacing={2} sx={{ overflowY: "auto", flexGrow: 1, pr: 1 }}>
        {filteredFunds.map((fund) => (
          <Box
            key={fund.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
            }}
          >
            {/* Left: Name & Ticker */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {fund.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({fund.ticker})
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: fund.returnRate >= 0 ? "#4caf50" : "#f44336",
                  fontWeight: "medium",
                }}
              >
                1Y Return: {fund.returnRate > 0 ? "+" : ""}
                {fund.returnRate}%
              </Typography>
            </Box>

            {/* Right: Add Button */}
            <IconButton
              onClick={() => onAddFund(fund)}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
