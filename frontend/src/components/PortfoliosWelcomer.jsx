import React from "react";
import { Typography, Button, Box } from "@mui/material";
import {
  Notifications as NotificationsIcon,
  AccountBalanceWallet as WalletIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

const themeColors = {
  bgDark: "#0d131f",
  bgIcon: "#1F2937",
  primary: "#10B981",
  primaryHover: "#059669",
  textGrey: "#9CA3AF",
  border: "#374151",
};

export default function PortfoliosWelcomer({ handleCreatePortfolioClick }) {
  return (
    <Box
      sx={{
        mt: 20,
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: themeColors.bgIcon,
          p: 4,
          borderRadius: "50%",
          mb: 4,
          border: `1px solid ${themeColors.border}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <WalletIcon sx={{ fontSize: 60, color: themeColors.primary }} />
      </Box>

      <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
        Welcome to Your Portfolio
        <br />
        Dashboard
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: themeColors.textGrey,
          mb: 4,
          maxWidth: 500,
          fontSize: "1.1rem",
          letterSpacing: 0.5,
        }}
      >
        You don't have any portfolios yet. Let's create your first one!
      </Typography>

      <Button
        variant="contained"
        size="large"
        sx={{
          bgcolor: themeColors.primary,
          textTransform: "none",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          borderRadius: 2,
          fontSize: "1rem",
        }}
        onClick={() => handleCreatePortfolioClick()}
      >
        Create New Portfolio
      </Button>
    </Box>
  );
}
