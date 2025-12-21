import React, { useState } from "react"; // Added useState
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Stack,
  Divider,
  Button,
  CardActions,
  IconButton,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PortfolioDeleteDialog from "./PortfolioDeleteDialog";

const COLORS = [
  "#00e676",
  "#2979ff",
  "#651fff",
  "#ff1744",
  "#ffea00",
  "#f50057",
];

export default function PortfolioAnalysisCard({ portfolio, onDelete, onView }) {
  // State for the popup
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const initial = portfolio.totalAmount || 0;
  const current = portfolio.currentValue || 0;
  const diff = current - initial;
  const percentChange = initial !== 0 ? ((diff / initial) * 100).toFixed(2) : 0;
  const isProfit = diff >= 0;

  const currencyFormatter = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  });

  const chartData = portfolio.funds.map((fund, index) => ({
    id: index,
    value: fund.allocationPercent,
    label: fund.fundCode,
    color: COLORS[index % COLORS.length],
  }));

  // Handle Dialog Actions
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  const handleConfirmDelete = () => {
    onDelete(portfolio.id);
    setIsDialogOpen(false);
  };
  const handleViewMore = () => {
    onView(portfolio);
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#1e293b",
          color: "white",
          borderRadius: 3,
          border: "1px solid #334155",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            borderColor: "#2979ff",
            boxShadow: "0 12px 24px -12px rgba(0,0,0,0.5)",
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}
            >
              {portfolio.name}
            </Typography>
            <IconButton
              size="small"
              onClick={handleOpenDialog} // Changed to open dialog
              sx={{
                color: "#64748b",
                cursor: "pointer", // Explicitly added as requested
                "&:hover": {
                  color: "#ff1744",
                  bgcolor: "rgba(255, 23, 68, 0.08)",
                },
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* ... Rest of your existing Grid and PieChart code remains exactly same ... */}
          <Grid container spacing={1} sx={{ mb: 3 }}>
            {/* [Your existing Grid code] */}
            <Grid item xs={4}>
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", display: "block" }}
              >
                Initial Inv.
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {currencyFormatter.format(initial)}
              </Typography>
            </Grid>
            <Grid item xs={4} sx={{ borderLeft: "1px solid #334155", pl: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", display: "block" }}
              >
                Current Value
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {currencyFormatter.format(current)}
              </Typography>
            </Grid>
            <Grid item xs={4} sx={{ borderLeft: "1px solid #334155", pl: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", display: "block" }}
              >
                Change
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: isProfit ? "#00e676" : "#ff1744",
                }}
              >
                {isProfit ? (
                  <TrendingUpIcon sx={{ fontSize: 16 }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16 }} />
                )}
                <Typography variant="body2" fontWeight="bold" sx={{ ml: 0.5 }}>
                  {isProfit ? "+" : ""}
                  {percentChange}%
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "#334155", mb: 3 }} />
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={5}>
              <Box
                sx={{ height: 110, display: "flex", justifyContent: "center" }}
              >
                <PieChart
                  series={[
                    {
                      data: chartData,
                      innerRadius: 28,
                      outerRadius: 45,
                      paddingAngle: 2,
                      cornerRadius: 3,
                    },
                  ]}
                  height={110}
                  width={110}
                  slotProps={{ legend: { hidden: true } }}
                />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <Stack spacing={2}>
                {chartData.slice(0, 3).map((item) => (
                  <Box key={item.label}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.3,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        {item.value}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.value}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.05)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: item.color,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            endIcon={<ArrowForwardIcon />}
            fullWidth
            variant="outlined"
            sx={{
              borderColor: "#475569",
              color: "#cbd5e1",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": {
                borderColor: "#2979ff",
                color: "white",
                bgcolor: "rgba(41, 121, 255, 0.05)",
              },
            }}
            onClick={() => handleViewMore(portfolio)}
          >
            View More
          </Button>
        </CardActions>
      </Card>

      {/* The Dialog Component */}
      <PortfolioDeleteDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        portfolioName={portfolio.name}
      />
    </>
  );
}
