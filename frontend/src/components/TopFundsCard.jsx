import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid, Chip, Stack } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getTopFunds } from "../services/FundService";

export default function TopFundsCards() {
  const [topFunds, setTopFunds] = useState([
    {
      code: "YDI",
      name: "YAPI KREDİ PORTFÖY YABANCI TEKNOLOJİ FONU",
      price: 145.2045,
      date: "2025-11-20",
      type: "Yabancı Hisse Senedi",
      changeRate: 2.45,
    },
    {
      code: "KZL",
      name: "KUVEYT TÜRK PORTFÖY ALTIN KATILIM FONU",
      price: 28.4501,
      date: "2025-11-20",
      type: "Kıymetli Madenler",
      changeRate: 0.85,
    },
    {
      code: "TTE",
      name: "İŞ PORTFÖY BIST TEKNOLOJİ AĞIRLIKLI SINIRLAMALI",
      price: 78.9012,
      date: "2025-11-20",
      type: "Hisse Senedi",
      changeRate: 1.12,
    },
    {
      code: "IPB",
      name: "İSTANBUL PORTFÖY BİRİNCİ DEĞİŞKEN FON",
      price: 4.125,
      date: "2025-11-20",
      type: "Değişken Fon",
      changeRate: 3.05,
    },
    {
      code: "GBC",
      name: "GARANTİ PORTFÖY BIST 30 ENDEKSİ FONU",
      price: 54.3021,
      date: "2025-11-20",
      type: "Endeks Fonu",
      changeRate: 0.45,
    },
  ]);

  useEffect(() => {
    async function fetchTopFunds() {
      try {
        const data = await getTopFunds();
        if (data) {
          //setTopFunds(data.slice(0, 5));
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchTopFunds();
  }, []);

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
      <Typography variant="h5" gutterBottom sx={{ color: "white", mb: 2 }}>
        Market Highlights
      </Typography>

      <Grid
        container
        spacing={1.2}
        columns={{ xs: 1, sm: 2, md: 5 }}
        alignItems="stretch"
      >
        {topFunds.map((fund) => (
          <Grid item xs={1} key={fund.code}>
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
                    height: "40px",
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
                    {fund.changeRate > 0 ? "+" : ""}
                    {fund.changeRate}%
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
