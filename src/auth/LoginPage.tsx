// src/auth/LoginPage.tsx
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
import { loginUser } from "../core/AuthLogin"; // adjust path if needed
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
      // Save login state so RequireAuth sees it
      localStorage.setItem("logged_in", "true");
      setTimeout(() => navigate("/main/upload"), 1500); // redirect after login
    } else {
      setError(result.message || "Login failed");
    }
  };

  return (
    <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{ px: 2 }}
        >
      <Card
              sx={{
                width: "100%",
                maxWidth: 400,
                p: 2,
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Login
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
            Login
          </Button>
          <Box mt={2}>
            <Link component={RouterLink} to="/signup" underline="hover"> Don’t have an account? Sign up </Link>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
        <Alert severity="success">Login successful! Redirecting...</Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
