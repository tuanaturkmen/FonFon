import React from "react";
import { Box, Typography, CssBaseline } from "@mui/material";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import { keyframes } from "@mui/system";

// Animations
const moveRight = keyframes`
  0%   { left: -10%; opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { left: 110%; opacity: 0; }
`;

const solidGravity = keyframes`
  0%   { bottom: 100px; animation-timing-function: ease-in; }
  15%  { bottom: 0; animation-timing-function: ease-out; }
  28%  { bottom: 45px; animation-timing-function: ease-in; }
  40%  { bottom: 0; animation-timing-function: ease-out; }
  52%  { bottom: 18px; animation-timing-function: ease-in; }
  62%  { bottom: 0; animation-timing-function: ease-out; }
  72%  { bottom: 6px; animation-timing-function: ease-in; }
  80%  { bottom: 0; }
  100% { bottom: 0; }
`;

const shadowPhysics = keyframes`
  0%, 100% { transform: scale(0.3); opacity: 0.1; }
  15%, 40%, 62%, 80% { transform: scale(1); opacity: 0.25; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(1440deg); }
`;

export default function BrandedLoaders({ message = "loading.." }) {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <CssBaseline />

      {/* Animation Stage */}
      <Box
        sx={{ width: "85%", maxWidth: 800, position: "relative", height: 140 }}
      >
        {/* Horizontal Track */}
        <Box
          sx={{
            position: "absolute",
            width: 40,
            height: "100%",
            animation: `${moveRight} 5.5s infinite linear`,
          }}
        >
          {/* Vertical Bounce */}
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: 40,
              animation: `${solidGravity} 5.5s infinite`,
            }}
          >
            <DonutSmallIcon
              sx={{
                fontSize: 40,
                color: "#10B981",
                animation: `${spin} 5.5s infinite linear`,
                display: "block",
                opacity: 0.9,
              }}
            />
          </Box>

          {/* Minimal Shadow */}
          <Box
            sx={{
              position: "absolute",
              bottom: -1,
              left: 0,
              right: 0,
              height: "2px",
              borderRadius: "50%",
              bgcolor: "rgba(16, 185, 129, 0.3)",
              filter: "blur(3px)",
              margin: "auto",
              width: "70%",
              animation: `${shadowPhysics} 5.5s infinite`,
            }}
          />
        </Box>

        {/* Ultra-thin Floor Line */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #1F2937 20%, #1F2937 80%, transparent)",
          }}
        />
      </Box>

      {/* Minimalist Lowercase Text */}
      <Typography
        variant="h1"
        sx={{
          color: "#475569",
          fontWeight: 400,
          letterSpacing: "0.1em",
          fontSize: "2rem",
          textTransform: "lowercase",
          mt: 8,
          ml: "0.8em",
          textAlign: "center",
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}
