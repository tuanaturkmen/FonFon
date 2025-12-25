import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  TablePagination,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";

const headerStyle = { bgcolor: "#131b28", borderBottom: "1px solid #334155" };

export default function FundList({
  onAddFund,
  currentPortfolio = [],
  allFunds,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredFunds = allFunds?.filter((fund) => {
    const matchesSearch = fund.name
      .toLocaleLowerCase("tr-TR")
      .includes(searchQuery.toLocaleLowerCase("tr-TR"));
    return matchesSearch;
  });

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleFunds = filteredFunds?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);

  const formatNumber = (val) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(val);

  return (
    <Paper sx={{ p: 3, display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Available Funds
      </Typography>

      <TextField
        fullWidth
        placeholder="Search..."
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(0);
        }}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer>
        <Table size="small" aria-label="fund table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "30%", ...headerStyle }}>Name</TableCell>
              <TableCell sx={{ width: "5%", ...headerStyle }}>Code</TableCell>
              <TableCell align="right" sx={{ width: "15%", ...headerStyle }}>
                Price
              </TableCell>
              <TableCell align="right" sx={{ width: "15%", ...headerStyle }}>
                Circulating Units
              </TableCell>
              <TableCell align="right" sx={{ width: "15%", ...headerStyle }}>
                Holders
              </TableCell>
              <TableCell align="right" sx={{ width: "15%", ...headerStyle }}>
                Total Value
              </TableCell>
              <TableCell
                align="right"
                sx={{ width: "5%", ...headerStyle }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleFunds?.map((fund) => {
              const isAdded = currentPortfolio.some(
                (p) => p.code === fund.code
              );

              return (
                <TableRow
                  key={fund.code}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    bgcolor: isAdded ? "rgba(46, 204, 113, 0.15)" : "inherit",
                    "&:hover": {
                      bgcolor: isAdded
                        ? "rgba(46, 204, 113, 0.25)"
                        : "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ borderBottom: "1px solid #1e293b", maxWidth: 500 }}
                  >
                    <Box>
                      <Tooltip title={fund.name} arrow placement="top">
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          noWrap
                          sx={{ color: isAdded ? "#2ecc71" : "inherit" }}
                        >
                          {fund.name}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderBottom: "1px solid #1e293b",
                      color: "text.secondary",
                    }}
                  >
                    {fund.code}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderBottom: "1px solid #1e293b",
                      color: "text.secondary",
                    }}
                  >
                    {fund.price}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderBottom: "1px solid #1e293b",
                      color: "text.secondary",
                    }}
                  >
                    {formatNumber(fund.circulatingUnits)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderBottom: "1px solid #1e293b",
                      color: "text.secondary",
                    }}
                  >
                    {formatNumber(fund.investorCount)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      borderBottom: "1px solid #1e293b",
                      color: "text.secondary",
                    }}
                  >
                    {formatCurrency(fund.totalValue)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ borderBottom: "1px solid #1e293b" }}
                  >
                    {isAdded ? (
                      <IconButton
                        size="small"
                        disabled
                        sx={{ color: "#2ecc71" }}
                      >
                        <CheckIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => onAddFund(fund)}
                        size="small"
                        sx={{
                          bgcolor: "rgba(41, 121, 255, 0.1)",
                          color: "#2979ff",
                          "&:hover": { bgcolor: "rgba(41, 121, 255, 0.2)" },
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {visibleFunds?.length < rowsPerPage && (
              <TableRow
                style={{ height: 53 * (rowsPerPage - visibleFunds.length) }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredFunds?.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5]}
        sx={{ borderTop: "1px solid #334155", color: "text.secondary" }}
      />
    </Paper>
  );
}
