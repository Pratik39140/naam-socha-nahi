import React, { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Snackbar, Alert, Link,
} from "@mui/material";
import { loginUser } from "../core/AuthLogin";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    const result = await loginUser(username, password);
    if (result.success) {
      setSuccess(true);
      setError("");
      localStorage.setItem("logged_in", "true");
      localStorage.setItem("username", username);
      if (result.token) localStorage.setItem("jwt", result.token);
      setTimeout(() => navigate("/main/upload"), 1500);
    } else {
      setError(result.message || "Login failed");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center"
      minHeight="100vh" sx={{ px: 2, position: "relative", zIndex: 1 }}>
      <Box sx={{ width: "100%", maxWidth: 380 }}>

        {/* Branding */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.2, mb: 1.5 }}>
            <Box sx={{
              width: 12, height: 12, borderRadius: "50%",
              background: "#F69E3D",
              boxShadow: "0 0 12px #F69E3D",
            }} />
            <Typography sx={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.5px", color: "#F2F2F2" }}>
              PrintMate
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: "#5E6266", fontFamily: "'JetBrains Mono', monospace" }}>
            Vending Print System — NODE-04
          </Typography>
        </Box>

        {/* Card */}
        <Card>
          <CardContent sx={{ p: "28px !important" }}>
            <Typography variant="h6" sx={{ mb: 0.5, color: "#F2F2F2" }}>
              Welcome back
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#B0B3B8", mb: 3 }}>
              Sign in to your account to continue
            </Typography>

            <TextField fullWidth label="Username" margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="username"
            />
            <TextField fullWidth label="Password" margin="normal" type="password"
              value={password}
              error={!!error}
              helperText={error}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />

            <Button fullWidth variant="contained" color="primary" sx={{ mt: 3, py: 1.3 }} onClick={handleSubmit}>
              Sign In
            </Button>

            <Box mt={2.5} textAlign="center">
              <Typography sx={{ fontSize: 13, color: "#B0B3B8" }}>
                Don't have an account?{" "}
                <Link component={RouterLink} to="/signup" sx={{ color: "#F69E3D", fontWeight: 600 }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography sx={{ textAlign: "center", mt: 3, fontSize: 11, color: "#5E6266", fontFamily: "'JetBrains Mono', monospace" }}>
          Secure · Encrypted · Fast
        </Typography>
      </Box>

      <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
        <Alert severity="success" sx={{ fontFamily: "'Sora', sans-serif" }}>
          Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
