import React, { useState } from "react";
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
  Tooltip,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StarIcon from "@mui/icons-material/Star"; // Icon for the "Best" badge
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PortfolioDeleteDialog from "./PortfolioDeleteDialog";
import dayjs from "dayjs";

const COLORS = [
  "#00e676",
  "#2979ff",
  "#651fff",
  "#ff1744",
  "#ffea00",
  "#f50057",
];

export default function PortfolioAnalysisCard({
  portfolio,
  onDelete,
  onView,
  onEdit,
  isBest, // New prop to identify the top performer
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const initial = portfolio.totalAmount || 0;
  const current = portfolio.currentValue || 0;
  const diff = current - initial;
  const percentChange = initial !== 0 ? ((diff / initial) * 100).toFixed(2) : 0;
  const isProfit = diff >= 0;

  const sortedFunds = [...portfolio.funds].sort(
    (a, b) => b.allocationPercent - a.allocationPercent
  );

  let chartData = [];
  if (sortedFunds.length <= 4) {
    chartData = sortedFunds.map((fund, index) => ({
      id: index,
      value: fund.allocationPercent,
      label: fund.fundCode,
      color: COLORS[index % COLORS.length],
    }));
  } else {
    const topThree = sortedFunds.slice(0, 3).map((fund, index) => ({
      id: index,
      value: fund.allocationPercent,
      label: fund.fundCode,
      color: COLORS[index % COLORS.length],
    }));

    const othersValue = sortedFunds
      .slice(3)
      .reduce((acc, fund) => acc + fund.allocationPercent, 0);

    chartData = [
      ...topThree,
      {
        id: 3,
        value: othersValue,
        label: "Others",
        color: "#64748b",
      },
    ];
  }

  const formatCurrency = (value) => {
    if (value === 0) return "0,00 ₺";
    if (value >= 1000000) {
      return `₺${(value / 1000000).toLocaleString("tr-TR", {
        maximumFractionDigits: 2,
      })}M ₺`;
    } else if (value >= 10000) {
      return `${(value / 1000).toLocaleString("tr-TR", {
        maximumFractionDigits: 2,
      })}K ₺`;
    } else {
      return `${(value / 1).toLocaleString("tr-TR", {
        maximumFractionDigits: 2,
      })} ₺`;
    }
  };

  const formatChange = (isProfit, percentChange) => {
    let change = String(percentChange);
    if (
      (isProfit && percentChange < 10 && percentChange >= 0) ||
      (!isProfit && percentChange > -10 && percentChange <= 0)
    ) {
      // Logic for adding leading zero if desired
    }
    const sign = isProfit ? "+" : "";
    return sign + change + "%";
  };

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
          width: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#1e293b",
          color: "white",
          borderRadius: 3,
          position: "relative", // Needed for absolute positioning of the badge
          border: isBest ? "2px solid #00e676" : "1px solid #334155",
          transition: "all 0.2s ease-in-out",
          boxShadow: isBest ? "0 0 15px rgba(0, 230, 118, 0.2)" : "none",
          "&:hover": {
            transform: "translateY(-4px)",
            borderColor: isBest ? "#00e676" : "#2979ff",
            boxShadow: isBest
              ? "0 12px 24px -12px rgba(0,230,118,0.5)"
              : "0 12px 24px -12px rgba(0,0,0,0.5)",
          },
        }}
      >
        {/* TOP PERFORMER BADGE */}
        {isBest && (
          <Box
            sx={{
              position: "absolute",
              top: -3,
              right: -3,
              bgcolor: "#00e676",
              color: "#0f172a",
              px: 0.5,
              py: 0.5,
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              zIndex: 0,
            }}
          >
            <WorkspacePremiumIcon sx={{ fontSize: 20 }} />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1, pt: isBest ? 3 : 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  lineHeight: 1.2,
                }}
              >
                {portfolio.name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 0.5,
                  gap: 0.5,
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 12, color: "#94a3b8" }} />
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  {dayjs(portfolio.creationTime).format("DD/MM/YYYY")}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title="Edit Portfolio">
                <IconButton
                  size="small"
                  onClick={() => onEdit(portfolio)}
                  sx={{
                    color: "#64748b",
                    "&:hover": {
                      color: "#2979ff",
                      bgcolor: "rgba(41, 121, 255, 0.08)",
                    },
                  }}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete Portfolio">
                <IconButton
                  size="small"
                  onClick={handleOpenDialog}
                  sx={{
                    color: "#64748b",
                    "&:hover": {
                      color: "#ff1744",
                      bgcolor: "rgba(255, 23, 68, 0.08)",
                    },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Grid container spacing={1} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Typography
                variant="caption"
                sx={{ color: "#94a3b8", display: "block" }}
              >
                Initial Inv.
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {formatCurrency(initial)}
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
                {formatCurrency(current)}
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
                  {formatChange(isProfit, percentChange)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "#334155", mb: 3 }} />

          <Grid
            container
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Grid
              item
              xs={12}
              sm={5}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box sx={{ height: 110, width: 110 }}>
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
                  sx={{
                    "& .MuiChartsLegend-root": { display: "none" },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Stack spacing={1.5}>
                {chartData.map((item) => (
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
                          color: "#ffffff !important",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#ffffff !important",
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
            onClick={handleViewMore}
          >
            View More
          </Button>
        </CardActions>
      </Card>

      <PortfolioDeleteDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        portfolioName={portfolio.name}
      />
    </>
  );
}
