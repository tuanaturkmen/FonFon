import React from "react";
import { Box, Paper, Typography, Grid, Chip, Stack } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function TopFundsCards({ topFunds }) {
  const formatCurrency = (value) => {
    return value
      ? value.toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";
  };

  if (topFunds.length === 0) return null;

  return (
    <Box sx={{ width: "95%", margin: "0 auto", mb: 0 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: "white", mb: 2, fontWeight: "bold" }}
      >
        Market Highlights
      </Typography>

      <Grid
        container
        spacing={1.2}
        columns={{ xs: 1, sm: 2, md: 5 }}
        alignItems="stretch"
        sx={{ display: "flex" }}
      >
        {topFunds.map((fund) => (
          <Grid item xs={1} key={fund.code} sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                backgroundColor: "#111827",
                border: "1px solid #1F2937",
                borderRadius: 2,
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.2s, border-color 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: "#374151",
                  cursor: "pointer",
                },
              }}
            >
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={1}
                >
                  <Chip
                    label={fund.code}
                    size="small"
                    sx={{
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      color: "#10B981",
                      fontWeight: 700,
                      borderRadius: 1,
                      height: 24,
                    }}
                  />
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    height: "70px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {fund.name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h5" color="white" fontWeight={700}>
                  {formatCurrency(fund.price)} ₺
                </Typography>

                <Stack direction="row" alignItems="center" gap={0.5} mt={0.5}>
                  <TrendingUpIcon sx={{ fontSize: 16, color: "#10B981" }} />
                  <Typography
                    variant="caption"
                    color="success.main"
                    fontWeight={600}
                  >
                    {fund.change > 0 ? "+" : ""}
                    {fund.change}%
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
