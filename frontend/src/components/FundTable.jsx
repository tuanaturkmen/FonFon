import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Pagination,
  PaginationItem,
  Stack,
  Checkbox,
  Button,
  TableSortLabel,
  TextField,
  Collapse,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import FilterListIcon from "@mui/icons-material/FilterList";
import { getAllFunds } from "../services/FundService";
import FundDetailDrawer from "./FundDetailDrawer";
import CompareFundsDrawer from "./CompareFundsDrawer";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    "& fieldset": { borderColor: "#4B5563" },
    "&:hover fieldset": { borderColor: "#9CA3AF" },
    "&.Mui-focused fieldset": { borderColor: "#10B981" },
  },
  "& .MuiInputLabel-root": { color: "#9CA3AF" },
  "& .MuiInputBase-input": { padding: "8px 14px" },
};

export default function FundTable() {
  const [allFunds, setAllFunds] = useState([]);
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    minValue: "",
    maxValue: "",
    minUnits: "",
    maxUnits: "",
    minInvestors: "",
    maxInvestors: "",
  });

  const rowsPerPage = 5;
  const MAX_SELECTION = 5;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const res = await getAllFunds();
    if (res) {
      setAllFunds(res);
      setData(res);
    }
  };

  const sortedData = useMemo(
    () => stableSort(data, getComparator(order, orderBy)),
    [data, order, orderBy]
  );

  const handleToggleFilters = () => setShowFilters((prev) => !prev);
  const handleFilterChange = (prop) => (event) =>
    setFilterValues({ ...filterValues, [prop]: event.target.value });

  const handleApplyFilters = () => {
    setPage(1);

    let filtered = [...allFunds];

    if (filterValues.name) {
      const term = filterValues.name.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(term) ||
          f.code.toLowerCase().includes(term)
      );
    }

    const filterRange = (field, min, max) => {
      if (min) filtered = filtered.filter((f) => f[field] >= parseFloat(min));
      if (max) filtered = filtered.filter((f) => f[field] <= parseFloat(max));
    };

    filterRange("price", filterValues.minPrice, filterValues.maxPrice);
    filterRange("totalValue", filterValues.minValue, filterValues.maxValue);
    filterRange(
      "circulatingUnits",
      filterValues.minUnits,
      filterValues.maxUnits
    );
    filterRange(
      "investorCount",
      filterValues.minInvestors,
      filterValues.maxInvestors
    );

    setData(filtered);
  };

  const handleClearFilters = () => {
    setFilterValues({
      name: "",
      minPrice: "",
      maxPrice: "",
      minValue: "",
      maxValue: "",
      minUnits: "",
      maxUnits: "",
      minInvestors: "",
      maxInvestors: "",
    });
    setPage(1);
    setData(allFunds);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(1);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const startIndex = (page - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const visibleRows = sortedData.slice(startIndex, endIndex);
      const availableSlots = MAX_SELECTION - selected.length;

      if (availableSlots <= 0) return;

      const candidates = visibleRows
        .filter((r) => !selected.includes(r.code))
        .map((r) => r.code);

      const toAdd = candidates.slice(0, availableSlots);
      setSelected([...selected, ...toAdd]);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, code) => {
    const selectedIndex = selected.indexOf(code);
    let newSelected = [];

    if (selectedIndex === -1) {
      if (selected.length >= MAX_SELECTION) return;
      newSelected = newSelected.concat(selected, code);
    } else {
      if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleOpenDrawer = (event, fund) => {
    event.stopPropagation();
    setSelectedFund(fund);
    setIsDrawerOpen(true);
  };
  const handleCloseDrawer = () => setIsDrawerOpen(false);
  const handleCompare = () => setIsCompareDrawerOpen(true);
  const handleCloseCompareDrawer = () => setIsCompareDrawerOpen(false);

  const getSelectedFundObjects = () =>
    allFunds.filter((fund) => selected.includes(fund.code));

  const isSelected = (code) => selected.indexOf(code) !== -1;
  const formatCurrency = (value) =>
    value
      ? value.toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";
  const formatNumber = (value) => (value ? value.toLocaleString("tr-TR") : "0");

  const pageCount = Math.ceil(data.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const visibleRows = sortedData.slice(startIndex, endIndex);
  const numSelectedVisible = visibleRows.filter((r) =>
    selected.includes(r.code)
  ).length;
  const isPageAllSelected =
    visibleRows.length > 0 && numSelectedVisible === visibleRows.length;
  const isPageIndeterminate =
    numSelectedVisible > 0 && numSelectedVisible < visibleRows.length;

  return (
    <Box sx={{ width: "95%", margin: "0 auto", py: 4 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: "white" }}>
          Available Funds
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant={showFilters ? "contained" : "outlined"}
            startIcon={<FilterListIcon />}
            onClick={handleToggleFilters}
            sx={{
              color: showFilters ? "#1F2937" : "white",
              borderColor: "rgba(255, 255, 255, 0.23)",
              backgroundColor: showFilters
                ? "rgba(255, 255, 255, 0.9)"
                : "transparent",
              "&:hover": {
                borderColor: "white",
                backgroundColor: showFilters
                  ? "white"
                  : "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Filters
          </Button>

          <Button
            variant="contained"
            startIcon={<CompareArrowsIcon />}
            onClick={handleCompare}
            disabled={selected.length < 2}
            sx={{
              backgroundColor: "#34D399",
              "&:hover": { backgroundColor: "#059669" },
              "&.Mui-disabled": {
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            Compare
          </Button>
        </Stack>
      </Box>

      {/* 3. LAYOUT FIX: Reorganized Filter Grid */}
      <Collapse in={showFilters}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid #374151",
            borderRadius: 2,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#9CA3AF",
                  fontWeight: "bold",
                  mb: 2,
                  letterSpacing: 1,
                }}
              >
                FINANCIALS
              </Typography>

              <Stack spacing={1}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "white", mb: 1, display: "block" }}
                  >
                    Price (₺)
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      placeholder="Min"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.minPrice}
                      onChange={handleFilterChange("minPrice")}
                      sx={inputStyle}
                    />
                    <TextField
                      placeholder="Max"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.maxPrice}
                      onChange={handleFilterChange("maxPrice")}
                      sx={inputStyle}
                    />
                  </Stack>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "white", mb: 1, display: "block" }}
                  >
                    Total Value (₺)
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      placeholder="Min"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.minValue}
                      onChange={handleFilterChange("minValue")}
                      sx={inputStyle}
                    />
                    <TextField
                      placeholder="Max"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.maxValue}
                      onChange={handleFilterChange("maxValue")}
                      sx={inputStyle}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6} sx={{ pl: { md: 2 } }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#9CA3AF",
                  fontWeight: "bold",
                  mb: 2,
                  letterSpacing: 1,
                }}
              >
                MARKET DATA
              </Typography>

              <Stack spacing={1}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "white", mb: 1, display: "block" }}
                  >
                    Circulating Units
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      placeholder="Min"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.minUnits}
                      onChange={handleFilterChange("minUnits")}
                      sx={inputStyle}
                    />
                    <TextField
                      placeholder="Max"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.maxUnits}
                      onChange={handleFilterChange("maxUnits")}
                      sx={inputStyle}
                    />
                  </Stack>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "white", mb: 1, display: "block" }}
                  >
                    Investors
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      placeholder="Min"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.minInvestors}
                      onChange={handleFilterChange("minInvestors")}
                      sx={inputStyle}
                    />
                    <TextField
                      placeholder="Max"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.maxInvestors}
                      onChange={handleFilterChange("maxInvestors")}
                      sx={inputStyle}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2} pt={1}>
              <Button
                onClick={handleClearFilters}
                sx={{ color: "#9CA3AF", "&:hover": { color: "white" } }}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                onClick={handleApplyFilters}
                sx={{
                  px: 4,
                  backgroundColor: "#10B981",
                  "&:hover": { backgroundColor: "#059669" },
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </Grid>
        </Paper>
      </Collapse>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "none",
          borderRadius: 2,
          border: "1px solid #1F2937",
          mb: 2,
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="fund table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={isPageIndeterminate}
                  checked={isPageAllSelected}
                  onChange={handleSelectAllClick}
                  inputProps={{ "aria-label": "select current page" }}
                />
              </TableCell>

              <TableCell align="left">
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>

              <TableCell align="left">
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "name")}
                >
                  Fund Name
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "price"}
                  direction={orderBy === "price" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "price")}
                >
                  Price
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "circulatingUnits"}
                  direction={orderBy === "circulatingUnits" ? order : "asc"}
                  onClick={(event) =>
                    handleRequestSort(event, "circulatingUnits")
                  }
                >
                  Circulating Units
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "investorCount"}
                  direction={orderBy === "investorCount" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "investorCount")}
                >
                  Holders
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === "totalValue"}
                  direction={orderBy === "totalValue" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "totalValue")}
                >
                  Total Value
                </TableSortLabel>
              </TableCell>

              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => {
              const isItemSelected = isSelected(row.code);
              const isCheckBoxDisabled =
                !isItemSelected && selected.length >= MAX_SELECTION;

              return (
                <TableRow
                  key={row.code}
                  hover
                  onClick={(event) =>
                    !isCheckBoxDisabled && handleClick(event, row.code)
                  }
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                  sx={{
                    cursor: isCheckBoxDisabled ? "not-allowed" : "pointer",
                    opacity: isCheckBoxDisabled ? 0.6 : 1,
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      disabled={isCheckBoxDisabled}
                      inputProps={{ "aria-labelledby": row.code }}
                    />
                  </TableCell>

                  <TableCell align="left">
                    <Typography variant="body2" color="text.secondary">
                      {row.date}
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Box display="flex" flexDirection="column">
                      <Typography variant="body1" fontWeight={500}>
                        {row.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {row.code}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight={500}>
                      {formatCurrency(row.price)} ₺
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {formatNumber(row.circulatingUnits)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {formatNumber(row.investorCount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight={500}>
                      {formatCurrency(row.totalValue)} ₺
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Link
                      component="button"
                      onClick={(event) => handleOpenDrawer(event, row)}
                      underline="none"
                      sx={{
                        color: "info.main",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        "&:hover": { color: "#34D399" },
                        cursor: "pointer",
                      }}
                    >
                      View Details
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} alignItems="center">
        <Pagination
          count={pageCount}
          page={page}
          onChange={handleChangePage}
          shape="rounded"
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
              sx={{
                color: "text.secondary",
                fontSize: "0.9rem",
                "&.Mui-selected": {
                  backgroundColor: "success.main",
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#059669" },
                },
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
              }}
            />
          )}
        />
      </Stack>

      <FundDetailDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        fund={selectedFund}
      />
      <CompareFundsDrawer
        open={isCompareDrawerOpen}
        onClose={handleCloseCompareDrawer}
        funds={getSelectedFundObjects()}
      />
    </Box>
  );
}
