import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  EmailOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { sendRegister, sendLogin } from "../services/UserService";

export default function Login({ open, handleClose, onLogin }) {
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Form States
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const resetForm = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setUser("");
    setErrors({});
    setLoading(false);
  };

  const validate = () => {
    let tempErrors = {};

    if (authMode === "login") {
      // Login validation logic
      if (!user) tempErrors.user = "Username or email is required";
    } else {
      // Signup validation logic
      if (!username) tempErrors.username = "Username is required";
      if (!email) {
        tempErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        tempErrors.email = "Email is invalid";
      }
    }

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      let accessToken;
      if (authMode === "login") {
        // Send 'user' (which holds the login identifier)
        accessToken = await sendLogin(user, password);
      } else {
        // Send 'username' and 'email' separately for registration
        accessToken = await sendRegister(username, email, password);
      }

      sessionStorage.setItem("accessToken", accessToken);
      handleClose();
      resetForm();
      onLogin();
    } catch (err) {
      const backendMsg = err.response?.data?.message || "Authentication failed";
      setErrors({ server: backendMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
        resetForm();
      }}
      PaperProps={{
        sx: {
          bgcolor: "#111827",
          backgroundImage: "none",
          borderRadius: 4,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          width: "100%",
          maxWidth: "440px",
          p: 2,
        },
      }}
      BackdropProps={{
        sx: { backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.7)" },
      }}
    >
      <IconButton
        onClick={() => {
          handleClose();
          resetForm();
        }}
        sx={{ position: "absolute", right: 16, top: 16, color: "grey.500" }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ textAlign: "center", p: 3 }}>
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
          {authMode === "login" ? "Welcome Back" : "Create New Account"}
        </Typography>
        <Typography variant="body2" sx={{ color: "grey.500", mb: 4 }}>
          Please enter your details to access your portfolio.
        </Typography>

        <ToggleButtonGroup
          value={authMode}
          exclusive
          onChange={(e, next) => {
            if (next) {
              setAuthMode(next);
              resetForm(); // Clear errors and fields when switching modes
            }
          }}
          fullWidth
          sx={toggleGroupStyles}
        >
          <ToggleButton value="login">Log In</ToggleButton>
          <ToggleButton value="signup">Sign Up</ToggleButton>
        </ToggleButtonGroup>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          {/* SIGNUP FIELDS */}
          {authMode === "signup" && (
            <>
              <Box>
                <Typography variant="caption" sx={labelStyles}>
                  USERNAME
                </Typography>
                <TextField
                  fullWidth
                  placeholder="metu123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!errors.username}
                  helperText={errors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline
                          sx={{ color: "grey.600", fontSize: 20 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles}
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={labelStyles}>
                  EMAIL ADDRESS
                </Typography>
                <TextField
                  fullWidth
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined
                          sx={{ color: "grey.600", fontSize: 20 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles}
                />
              </Box>
            </>
          )}

          {/* LOGIN FIELD */}
          {authMode === "login" && (
            <Box>
              <Typography variant="caption" sx={labelStyles}>
                USERNAME OR EMAIL
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your username or email"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                error={!!errors.user}
                helperText={errors.user}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: "grey.600", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={inputStyles}
              />
            </Box>
          )}

          {/* PASSWORD FIELD (Common to both) */}
          <Box>
            <Typography variant="caption" sx={labelStyles}>
              PASSWORD
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "grey.600", fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      sx={{ color: "grey.600" }}
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? (
                        <VisibilityOutlined fontSize="small" />
                      ) : (
                        <VisibilityOffOutlined fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />
          </Box>

          {errors.server && (
            <Typography
              variant="caption"
              sx={{ color: "#f87171", textAlign: "center", mt: -1 }}
            >
              {errors.server}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={submitBtnStyles}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : authMode === "login" ? (
              "Log In"
            ) : (
              "Sign Up"
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// --- Styles (Identical to your original styles) ---

const labelStyles = {
  color: "grey.500",
  display: "block",
  textAlign: "left",
  mb: 0.5,
  fontWeight: 700,
  letterSpacing: 1,
};

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    bgcolor: "rgba(0,0,0,0.2)",
    borderRadius: 2,
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
    "&.Mui-error fieldset": { borderColor: "#f87171" },
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    color: "#f87171",
  },
};

const toggleGroupStyles = {
  bgcolor: "rgba(0,0,0,0.3)",
  p: 0.5,
  border: "1px solid rgba(255, 255, 255, 0.05)",
  mb: 4,
  "& .MuiToggleButton-root": {
    border: "none",
    borderRadius: "8px !important",
    color: "grey.500",
    textTransform: "none",
    "&.Mui-selected": {
      bgcolor: "#1f2937",
      color: "#fff",
      "&:hover": { bgcolor: "#374151" },
    },
  },
};

const submitBtnStyles = {
  py: 1.5,
  mt: 1,
  bgcolor: "#1d4ed8",
  "&:hover": { bgcolor: "#2563eb" },
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 2,
};
