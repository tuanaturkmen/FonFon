import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getAllFunds } from "../services/FundService";
import FundDetailDrawer from "./FundDetailDrawer";

export default function FundTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await getAllFunds();
      if (res) {
        setData(res);
      }
    }
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenDrawer = (fund) => {
    setSelectedFund(fund);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

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

  const pageCount = Math.ceil(data.length / rowsPerPage);

  return (
    <Box sx={{ width: "95%", margin: "0 auto", py: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: "white", mb: 3 }}>
        Available Funds
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "none",
          borderRadius: 2,
          border: "1px solid #1F2937",
          mb: 3,
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="fund table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Fund Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Circulating Units</TableCell>
              <TableCell align="right">Holders</TableCell>
              <TableCell align="right">Total Value</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(
                (page - 1) * rowsPerPage,
                (page - 1) * rowsPerPage + rowsPerPage
              )
              .map((row) => (
                <TableRow key={row.code} hover>
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
                      onClick={() => handleOpenDrawer(row)}
                      underline="none"
                      sx={{
                        color: "info.main",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        "&:hover": { color: "#34D399" },
                      }}
                    >
                      View Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
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
                  "&:hover": {
                    backgroundColor: "#059669",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
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
    </Box>
  );
}
