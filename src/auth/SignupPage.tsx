// src/auth/SignupPage.tsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";
import { registerUser } from "../core/AuthSignup"; // adjust path if needed
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

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Sign Up
          </Typography>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            type="password"
            value={password}
            error={!!error}
            helperText={error}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Box mt={2}>
            <Link component={RouterLink} to="/login" underline="hover"> Already have an account? Login </Link>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
        <Alert severity="success">Signup successful! Redirecting to login...</Alert>
      </Snackbar>
    </Box>
  );
};

export default SignupPage;
