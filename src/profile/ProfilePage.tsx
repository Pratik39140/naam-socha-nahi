import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Stack, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("logged_in");
    localStorage.removeItem("username");
    localStorage.removeItem("jwt");
    navigate("/login", { replace: true });
  };

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <Container maxWidth="sm" sx={{ py: 4, position: "relative", zIndex: 1 }}>
      <Typography variant="h6" sx={{ color: "#f1f5f9", mb: 3 }}>Profile</Typography>

      {/* User card */}
      <Box sx={{
        background: "#111827", border: "1px solid #1e2d47",
        borderRadius: 3, p: "24px", mb: 2,
      }}>
        <Stack direction="row" alignItems="center" gap={2} mb={2.5}>
          {/* Avatar */}
          <Box sx={{
            width: 52, height: 52, borderRadius: "50%",
            background: "#3b82f615", border: "1px solid #3b82f630",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Typography sx={{
              fontSize: 18, fontWeight: 700,
              color: "#3b82f6", fontFamily: "'JetBrains Mono', monospace",
            }}>
              {initials}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 16, color: "#f1f5f9" }}>
              {username}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
              Active user
            </Typography>
          </Box>
        </Stack>

        {/* Status row */}
        <Box sx={{
          display: "flex", alignItems: "center", gap: 1,
          p: "10px 14px", borderRadius: 1.5,
          background: "#22c55e08", border: "1px solid #22c55e20",
        }}>
          <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          <Typography sx={{ fontSize: 12, color: "#22c55e", fontFamily: "'JetBrains Mono', monospace" }}>
            SESSION ACTIVE
          </Typography>
        </Box>
      </Box>

      {/* Node info */}
      <Box sx={{
        background: "#111827", border: "1px solid #1e2d47",
        borderRadius: 3, p: "20px", mb: 3,
      }}>
        <Typography sx={{ fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace", mb: 1.5, letterSpacing: "0.08em" }}>
          DEVICE INFO
        </Typography>
        {[
          ["Node", "NODE-04"],
          ["System", "PrintMate Vend v1.0"],
          ["Status", "Online"],
        ].map(([k, v]) => (
          <Box key={String(k)} sx={{
            display: "flex", justifyContent: "space-between",
            py: 0.75, borderBottom: "1px solid #1e2d47",
            "&:last-child": { borderBottom: "none" },
          }}>
            <Typography sx={{ fontSize: 13, color: "#475569" }}>{k}</Typography>
            <Typography sx={{ fontSize: 13, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>{v}</Typography>
          </Box>
        ))}
      </Box>

      {/* Logout */}
      <Button
        fullWidth variant="outlined"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{
          borderColor: "#ef444430", color: "#ef4444", py: 1.3,
          "&:hover": { borderColor: "#ef4444", background: "#ef444410" },
        }}
      >
        Sign Out
      </Button>
    </Container>
  );
};

export default ProfilePage;
