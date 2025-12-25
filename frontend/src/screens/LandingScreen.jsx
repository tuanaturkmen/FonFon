import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Stack,
  Paper,
  Chip,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import {
  BarChartOutlined,
  DashboardOutlined,
  BalanceOutlined,
} from "@mui/icons-material";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0A0F16",
      paper: "#111827",
    },
    primary: {
      main: "#059669",
      main2: "#1D8CF8",
    },
    text: {
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
  },
});

const LandingPage = ({ handleStart }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 15 }, pb: 8 }}>
          <Grid container spacing={20} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box display="flex" alignItems="center" gap={1.5} mb={4}>
                <DonutSmallIcon sx={{ color: "#10B981", fontSize: 64 }} />
                <Typography
                  variant="h2"
                  fontWeight={700}
                  color="white"
                  sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
                >
                  FonFon
                </Typography>
              </Box>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{ fontSize: { xs: "3rem", md: "4.5rem" } }}
              >
                Construct the <br /> Perfect
                <Box
                  component="span"
                  sx={{ color: "primary.main", display: "block" }}
                >
                  Fund Portfolio
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  mt: 3,
                  mb: 5,
                  fontWeight: 400,
                  maxWidth: 500,
                }}
              >
                Analyze thousands of funds, build custom strategies, and
                backtest performance in seconds.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 3 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                  }}
                  onClick={() => handleStart()}
                >
                  Start as Guest
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                    bgcolor: "#1E262F",
                    "&:hover": { bgcolor: "#2A3440" },
                  }}
                >
                  Sign Up Free
                </Button>
              </Stack>

              <Grid container spacing={4} sx={{ mt: 6 }}>
                {[
                  { label: "Funds", value: "10k+" },
                  { label: "Portfolios", value: "50k+" },
                  { label: "Data Points", value: "1M+" },
                ].map((stat) => (
                  <Grid item xs={4} key={stat.label}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        textTransform: "uppercase",
                        color: "text.secondary",
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 6,
                  background:
                    "linear-gradient(145deg, #111827 0%, #0A0F16 100%)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  sx={{ mb: 4 }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Portfolio Growth
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      +24.5% vs Benchmark
                    </Typography>
                  </Box>
                  <Chip
                    label="+12.4%"
                    color="success"
                    size="small"
                    sx={{
                      padding: 3,
                      fontWeight: 800,
                      bgcolor: "rgba(76, 175, 80, 0.1)",
                      color: "#4caf50",
                    }}
                  />
                </Stack>

                <Box
                  sx={{
                    height: 250,
                    width: 400,
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 1,
                    position: "relative",
                  }}
                >
                  {[40, 60, 45, 80, 70, 90, 85, 100].map((height, i) => (
                    <Box
                      key={i}
                      sx={{
                        flex: 1,
                        height: `${height}%`,
                        bgcolor:
                          i === 7 ? "primary.main2" : "rgba(29, 140, 248, 0.2)",
                        borderRadius: "4px 4px 0 0",
                        boxShadow:
                          i === 7 ? "0 0 20px rgba(29, 140, 248, 0.4)" : "none",
                      }}
                    />
                  ))}

                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                    }}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,90 Q25,80 50,40 T100,10"
                        fill="none"
                        stroke="#1D8CF8"
                        strokeWidth="2"
                      />
                    </svg>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        <Box
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            pt: 6,
            pb: 8,
            mt: "auto",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6}>
              {[
                {
                  title: "Analytics",
                  desc: "Visualize risk, return, and holdings instantly.",
                  icon: <BarChartOutlined color="primary" />,
                },
                {
                  title: "Builder",
                  desc: "Mix assets to create your ideal strategy.",
                  icon: <DashboardOutlined color="primary" />,
                },
                {
                  title: "Compare",
                  desc: "Benchmark against S&P 500 and indices.",
                  icon: <BalanceOutlined color="primary" />,
                },
              ].map((feature) => (
                <Grid item xs={12} md={4} key={feature.title}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: "rgba(29, 140, 248, 0.1)",
                        borderRadius: 2,
                        display: "flex",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {feature.desc}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
