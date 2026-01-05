import React, { useState, useMemo } from "react";
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
  Pagination,
  PaginationItem,
  Stack,
  Checkbox,
  Button,
  TableSortLabel,
  TextField,
  Collapse,
  Grid,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import FilterListIcon from "@mui/icons-material/FilterList";
import FundDetailDrawer from "./FundDetailDrawer";
import CompareFundsDrawer from "./CompareFundsDrawer";

// --- Helpers ---
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
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
    if (order !== 0) return order;
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

export default function FundTable({ funds }) {
  const [data, setData] = useState(funds);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
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

  const MAX_SELECTION = 5;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  const sortedData = useMemo(
    () => stableSort(data, getComparator(order, orderBy)),
    [data, order, orderBy]
  );

  const handleGlobalSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setPage(1);
    setData(
      funds.filter(
        (f) =>
          f.name.toLowerCase().includes(term) ||
          f.code.toLowerCase().includes(term)
      )
    );
  };

  const handleApplyFilters = () => {
    setPage(1);
    let filtered = [...funds];
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
    setSearchTerm("");
    setPage(1);
    setData(funds);
  };

  const visibleRows = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ width: "95%", margin: "0 auto", py: 4 }}>
      {/* Top Header & Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
          Available Funds
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          {/* Styled Row Selector - Same size as buttons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1.5,
              height: "36.5px",
              border: "1px solid rgba(255, 255, 255, 0.23)",
              borderRadius: "1px", // Using 1px for a sharper look or 4px for standard MUI
              backgroundColor: "transparent",
              "&:hover": { borderColor: "white" },
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 500,
                mr: 1,
              }}
            >
              ROWS:
            </Typography>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value));
                setPage(1);
              }}
              style={{
                background: "transparent",
                color: "white",
                border: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
              }}
            >
              {[5, 10, 20, 50].map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  style={{ background: "#1F2937", color: "white" }}
                >
                  {opt}
                </option>
              ))}
            </select>
          </Box>

          <Button
            variant={showFilters ? "contained" : "outlined"}
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              height: "36.5px",
              color: showFilters ? "#1F2937" : "white",
              borderColor: "rgba(255, 255, 255, 0.23)",
              backgroundColor: showFilters ? "white" : "transparent",
              "&:hover": { borderColor: "white" },
            }}
          >
            Filters
          </Button>

          <Button
            variant="contained"
            startIcon={<CompareArrowsIcon />}
            onClick={() => setIsCompareDrawerOpen(true)}
            disabled={selected.length < 2}
            sx={{
              height: "36.5px",
              backgroundColor: "#34D399",
              "&:hover": { backgroundColor: "#059669" },
            }}
          >
            Compare ({selected.length}/{MAX_SELECTION})
          </Button>
        </Stack>
      </Box>

      {/* Search Field */}
      <TextField
        placeholder="Quick search..."
        fullWidth
        value={searchTerm}
        onChange={handleGlobalSearch}
        sx={{ ...inputStyle, mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#9CA3AF" }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Advanced Filters Section */}
      <Collapse in={showFilters}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid #374151",
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#9CA3AF", fontWeight: "bold", mb: 2 }}
              >
                FINANCIALS
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "white", display: "block", mb: 1 }}
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
                      onChange={(e) =>
                        setFilterValues({
                          ...filterValues,
                          minPrice: e.target.value,
                        })
                      }
                      sx={inputStyle}
                    />
                    <TextField
                      placeholder="Max"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.maxPrice}
                      onChange={(e) =>
                        setFilterValues({
                          ...filterValues,
                          maxPrice: e.target.value,
                        })
                      }
                      sx={inputStyle}
                    />
                  </Stack>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "white", display: "block", mb: 1 }}
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
                      onChange={(e) =>
                        setFilterValues({
                          ...filterValues,
                          minValue: e.target.value,
                        })
                      }
                      sx={inputStyle}
                    />
                    <TextField
                      placeholder="Max"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.maxValue}
                      onChange={(e) =>
                        setFilterValues({
                          ...filterValues,
                          maxValue: e.target.value,
                        })
                      }
                      sx={inputStyle}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#9CA3AF", fontWeight: "bold", mb: 2 }}
              >
                MARKET DATA
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "white", display: "block", mb: 1 }}
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
                      onChange={(e) =>
                        setFilterValues({
                          ...filterValues,
                          minUnits: e.target.value,
                        })
                      }
                      sx={inputStyle}
                    />
                    <TextField
                      placeholder="Max"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.maxUnits}
                      onChange={(e) =>
                        setFilterValues({
                          ...filterValues,
                          maxUnits: e.target.value,
                        })
                      }
                      sx={inputStyle}
                    />
                  </Stack>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "white", display: "block", mb: 1 }}
                  >
                    Holders
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      placeholder="Min"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.minInvestors}
                      onChange={(e) =>
                        setFilterValues({
                          ...filterValues,
                          minInvestors: e.target.value,
                        })
                      }
                      sx={inputStyle}
                    />
                    <TextField
                      placeholder="Max"
                      type="number"
                      size="small"
                      fullWidth
                      value={filterValues.maxInvestors}
                      onChange={(e) =>
                        setFilterValues({
                          ...filterValues,
                          maxInvestors: e.target.value,
                        })
                      }
                      sx={inputStyle}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button onClick={handleClearFilters} sx={{ color: "#9CA3AF" }}>
              Clear All
            </Button>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              sx={{
                backgroundColor: "#10B981",
                "&:hover": { backgroundColor: "#059669" },
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {/* Table Body */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "none",
          borderRadius: 2,
          border: "1px solid #1F2937",
          mb: 2,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={
                    visibleRows.length > 0 &&
                    visibleRows.every((r) => selected.includes(r.code))
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      const toAdd = visibleRows
                        .filter((r) => !selected.includes(r.code))
                        .map((r) => r.code)
                        .slice(0, MAX_SELECTION - selected.length);
                      setSelected([...selected, ...toAdd]);
                    } else setSelected([]);
                  }}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={order}
                  onClick={() => {
                    setOrder(order === "asc" ? "desc" : "asc");
                    setOrderBy("name");
                  }}
                >
                  Fund Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Holders</TableCell>
              <TableCell align="right">Total Value</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow
                key={row.code}
                hover
                selected={selected.includes(row.code)}
                onClick={() => {
                  const isItemSelected = selected.includes(row.code);
                  if (isItemSelected)
                    setSelected(selected.filter((i) => i !== row.code));
                  else if (selected.length < MAX_SELECTION)
                    setSelected([...selected, row.code]);
                }}
                sx={{
                  cursor:
                    selected.length >= MAX_SELECTION &&
                    !selected.includes(row.code)
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    selected.length >= MAX_SELECTION &&
                    !selected.includes(row.code)
                      ? 0.5
                      : 1,
                  "& .MuiTableCell-root": { padding: "4px 16px" },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selected.includes(row.code)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {row.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.code}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {row.price.toLocaleString("tr-TR")} ₺
                </TableCell>
                <TableCell align="right">
                  {row.investorCount.toLocaleString("tr-TR")}
                </TableCell>
                <TableCell align="right">
                  {row.totalValue.toLocaleString("tr-TR")} ₺
                </TableCell>
                <TableCell align="right">
                  <Typography
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFund(row);
                      setIsDrawerOpen(true);
                    }}
                    sx={{
                      color: "info.main",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      "&:hover": { color: "#34D399" },
                    }}
                  >
                    View Details
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Stack alignItems="center" sx={{ mt: 3 }}>
        <Pagination
          count={Math.ceil(data.length / rowsPerPage)}
          page={page}
          onChange={(e, p) => setPage(p)}
          shape="rounded"
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
              sx={{ color: "white" }}
            />
          )}
        />
      </Stack>

      {/* Drawers */}
      <FundDetailDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        fund={selectedFund}
      />
      <CompareFundsDrawer
        open={isCompareDrawerOpen}
        onClose={() => setIsCompareDrawerOpen(false)}
        funds={funds.filter((f) => selected.includes(f.code))}
      />
    </Box>
  );
}
