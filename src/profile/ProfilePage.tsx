import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Stack, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

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
      <Typography variant="h6" sx={{ color: "#F2F2F2", mb: 3 }}>Profile</Typography>

      {/* User card */}
      <Box sx={{
        background: "#373A3C", border: "1px solid #5E6266",
        borderRadius: 3, p: "24px", mb: 2,
      }}>
        <Stack direction="row" alignItems="center" gap={2} mb={2.5}>
          {/* Avatar */}
          <Box sx={{
            width: 52, height: 52, borderRadius: "50%",
            background: "#F69E3D15", border: "1px solid #F69E3D40",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Typography sx={{
              fontSize: 18, fontWeight: 700,
              color: "#F69E3D", fontFamily: "'JetBrains Mono', monospace",
            }}>
              {initials}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 16, color: "#F2F2F2" }}>
              {username}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#B0B3B8", fontFamily: "'JetBrains Mono', monospace" }}>
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
        background: "#373A3C", border: "1px solid #5E6266",
        borderRadius: 3, p: "20px", mb: 3,
      }}>
        <Typography sx={{ fontSize: 11, color: "#B0B3B8", fontFamily: "'JetBrains Mono', monospace", mb: 1.5, letterSpacing: "0.08em" }}>
          DEVICE INFO
        </Typography>
        {[
          ["Node", "NODE-04"],
          ["System", "PrintMate Vend v1.0"],
          ["Status", "Online"],
        ].map(([k, v]) => (
          <Box key={String(k)} sx={{
            display: "flex", justifyContent: "space-between",
            py: 0.75, borderBottom: "1px solid #5E6266",
            "&:last-child": { borderBottom: "none" },
          }}>
            <Typography sx={{ fontSize: 13, color: "#B0B3B8" }}>{k}</Typography>
            <Typography sx={{ fontSize: 13, color: "#9FA3A7", fontFamily: "'JetBrains Mono', monospace" }}>{v}</Typography>
          </Box>
        ))}
      </Box>

      {/* Logout */}
      <Button
        fullWidth variant="outlined"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{
          borderColor: "#D9302530", color: "#D93025", py: 1.3,
          "&:hover": { borderColor: "#D93025", background: "#D9302510" },
        }}
      >
        Sign Out
      </Button>
    </Container>
  );
};

export default ProfilePage;
