import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
} from "@mui/material";

import DonutSmallIcon from "@mui/icons-material/DonutSmall";

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        borderBottom: "1px solid #1F2937",
        paddingX: 2,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: "70px" }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <DonutSmallIcon sx={{ color: "#10B981", fontSize: 32 }} />
          <Typography
            variant="h6"
            fontWeight={700}
            color="white"
            sx={{ letterSpacing: "0.5px" }}
          >
            FonFon
          </Typography>
        </Box>

        <Box
          display="flex"
          gap={4}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Button
            sx={{
              color: "#10B981",
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { color: "white" },
            }}
          >
            Funds
          </Button>
          <Button
            sx={{
              color: "#9CA3AF",
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { color: "white" },
            }}
          >
            Dashboard
          </Button>
          <Button
            sx={{
              color: "#9CA3AF",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            My Portfolio
          </Button>
          <Button
            sx={{
              color: "#9CA3AF",
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { color: "white" },
            }}
          >
            Settings
          </Button>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            alt="User Profile"
            sx={{ width: 40, height: 40, border: "2px solid #374151" }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
