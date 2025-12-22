import React from "react";
import { Grid, Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PortfolioAnalysisCard from "./PortfolioAnalysisCard";

export default function Portfolios({
  portfolios,
  handleCreatePortfolioClick,
  handleDeletePortfolioClick,
  handleViewMoreClick,
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
          My Portfolios
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreatePortfolioClick}
          sx={{
            bgcolor: "#2979ff",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#2962ff" },
          }}
        >
          Create New
        </Button>
      </Box>

      <Grid container spacing={3}>
        {portfolios.map((portfolio) => (
          <Grid item xs={12} md={12} lg={6} xl={6} key={portfolio.id}>
            <PortfolioAnalysisCard
              portfolio={portfolio}
              onDelete={handleDeletePortfolioClick}
              onView={handleViewMoreClick}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
