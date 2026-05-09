import React, { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Snackbar, Alert, Link,
} from "@mui/material";
import { registerUser } from "../core/AuthSignup";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    const result = await registerUser(username, email, password);
    if (result.success) {
      setSuccess(true);
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(result.message || "Signup failed");
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
              background: "#3b82f6",
              boxShadow: "0 0 12px #3b82f6",
            }} />
            <Typography sx={{
              fontSize: 24, fontWeight: 700,
              letterSpacing: "-0.5px", color: "#f1f5f9",
            }}>
              PrintMate
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
            Vending Print System — NODE-04
          </Typography>
        </Box>

        {/* Card */}
        <Card>
          <CardContent sx={{ p: "28px !important" }}>
            <Typography variant="h6" sx={{ mb: 0.5, color: "#f1f5f9" }}>
              Create account
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#475569", mb: 3 }}>
              Join to start printing from anywhere
            </Typography>

            <TextField
              fullWidth label="Username" margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <TextField
              fullWidth label="Email" margin="normal" type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <TextField
              fullWidth label="Password" margin="normal" type="password"
              value={password}
              error={!!error}
              helperText={error}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
            />

            <Button
              fullWidth variant="contained"
              sx={{ mt: 3, py: 1.3 }}
              onClick={handleSubmit}
            >
              Create Account
            </Button>

            <Box mt={2.5} textAlign="center">
              <Typography sx={{ fontSize: 13, color: "#475569" }}>
                Already have an account?{" "}
                <Link component={RouterLink} to="/login"
                  sx={{ color: "#3b82f6", fontWeight: 600 }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography sx={{
          textAlign: "center", mt: 3, fontSize: 11,
          color: "#334155", fontFamily: "'JetBrains Mono', monospace",
        }}>
          Secure · Encrypted · Fast
        </Typography>
      </Box>

      <Snackbar open={success} autoHideDuration={2000}>
        <Alert severity="success">Signup successful! Redirecting to login...</Alert>
      </Snackbar>
    </Box>
  );
};

export default SignupPage;
