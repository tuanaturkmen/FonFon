import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function PortfolioDeleteDialog({
  open,
  onClose,
  onConfirm,
  portfolioName,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      // Styling the inner paper to match your card's dark theme
      PaperProps={{
        sx: {
          bgcolor: "#1e293b",
          color: "white",
          backgroundImage: "none",
          borderRadius: 3,
          border: "1px solid #334155",
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "#94a3b8" }}>
          Are you sure you want to delete <strong>{portfolioName}</strong>? This
          action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        {/* Back Button */}
        <Button
          onClick={onClose}
          sx={{ color: "#cbd5e1", textTransform: "none" }}
        >
          Back
        </Button>
        {/* Confirm Button */}
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
