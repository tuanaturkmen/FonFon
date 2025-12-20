import React from "react";
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
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const COLORS = [
  "#00e676",
  "#2979ff",
  "#651fff",
  "#ff1744",
  "#ffea00",
  "#f50057",
];

export default function PortfolioAnalysisCard({ portfolio }) {
  const chartData = portfolio.funds.map((fund, index) => ({
    id: index,
    value: fund.allocationPercent,
    label: fund.fundCode,
    color: COLORS[index % COLORS.length],
  }));

  const formattedTotal = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(portfolio.totalAmount);

  return (
    <Card
      sx={{
        height: "100%", // Ensures card fills grid item height
        display: "flex",
        flexDirection: "column",
        bgcolor: "#1e293b",
        color: "white",
        borderRadius: 3,
        border: "1px solid #334155",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          border: "1px solid #2979ff",
        },
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* HEADER SECTION: Fixed height container to ensure alignment */}
        <Box
          sx={{
            mb: 2,
            minHeight: 60,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            noWrap // Truncates long titles with "..."
            title={portfolio.name} // Shows full name on hover
            sx={{ width: "100%", display: "block" }}
          >
            {portfolio.name}
          </Typography>

          <Typography
            variant="h5" // Made slightly larger for emphasis
            fontWeight="bold"
            sx={{ color: "#2979ff" }}
          >
            {formattedTotal}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "#334155", mb: 2 }} />

        <Grid container alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
          {/* LEFT: Donut Chart */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{ height: 140, display: "flex", justifyContent: "center" }}
            >
              <PieChart
                series={[
                  {
                    data: chartData,
                    innerRadius: 40,
                    outerRadius: 60,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  },
                ]}
                height={140}
                width={140}
                slotProps={{ legend: { hidden: true } }}
              />
            </Box>
          </Grid>

          {/* RIGHT: List with Progress Bars */}
          <Grid item xs={12} sm={8}>
            <Stack spacing={1}>
              {chartData.map((item) => (
                <Box key={item.label}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                      alignItems: "center", // Ensures vertical alignment
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: item.color,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ color: "#cbd5e1" }}
                    >
                      {item.label}{" "}
                      <span style={{ color: "white" }}>{item.value}%</span>
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.value}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.05)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: item.color,
                        borderRadius: 3,
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
          size="small"
          sx={{
            borderColor: "#334155",
            color: "#94a3b8",
            "&:hover": { borderColor: "#2979ff", color: "#2979ff" },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
