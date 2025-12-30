import React, { useState } from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Divider,
  IconButton,
  Switch,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function UserMenu({ onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleClick} size="small" sx={{ p: 0 }}>
        <Avatar
          alt="User Profile"
          sx={{
            width: 40,
            height: 40,
            border: "2px solid #374151",
            transition: "all 0.2s",
            "&:hover": { borderColor: "#10B981" },
          }}
        />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        marginThreshold={0}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            // These lines force the menu to the absolute edge
            right: "0 !important",
            left: "auto !important",
            bgcolor: "#111827",
            border: "1px solid #1F2937",
            color: "white",
            minWidth: 220,
            borderRadius: "8px 0 0 8px",
            "& .MuiList-root": { padding: 0 },
            "& .MuiMenuItem-root": {
              fontSize: "0.875rem",
              py: 1.5,
              px: 2.5,
              "&:hover": { bgcolor: "#1F2937" },
            },
          },
        }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: "#9CA3AF" }} />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <StarIcon fontSize="small" sx={{ color: "#F59E0B" }} />
          </ListItemIcon>
          Premium
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <EmojiEventsIcon fontSize="small" sx={{ color: "#3B82F6" }} />
          </ListItemIcon>
          Achievements
        </MenuItem>

        <Divider sx={{ bgcolor: "#1F2937" }} />

        {/* Theme Toggle - Logic to be filled later */}
        <MenuItem onClick={(e) => e.stopPropagation()}>
          <ListItemIcon>
            <DarkModeIcon fontSize="small" sx={{ color: "#9CA3AF" }} />
          </ListItemIcon>
          <Box sx={{ flexGrow: 1 }}>Dark Mode</Box>
          <Switch size="small" edge="end" checked={true} disableRipple />
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" sx={{ color: "#9CA3AF" }} />
          </ListItemIcon>
          Settings
        </MenuItem>

        <Divider sx={{ bgcolor: "#1F2937" }} />

        <MenuItem onClick={() => onLogout()}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "#EF4444" }} />
          </ListItemIcon>
          <Typography
            sx={{ color: "#EF4444", fontSize: "0.875rem", fontWeight: 600 }}
          >
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
