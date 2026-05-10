import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import QueueIcon from "@mui/icons-material/Queue";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, AppBar, Toolbar, Typography, IconButton, Chip } from "@mui/material";

const MainShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username") || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("logged_in");
    localStorage.removeItem("username");
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  const tabs = [
    { label: "Upload", value: "/main/upload", icon: <CloudUploadIcon /> },
    { label: "Queue", value: "/main/queue", icon: <QueueIcon /> },
    { label: "History", value: "/main/history", icon: <HistoryIcon /> },
    { label: "Profile", value: "/main/profile", icon: <PersonIcon /> },
  ];

  const current =
    tabs.find((t) => location.pathname.startsWith(t.value))?.value ??
    "/main/upload";

  return (
    <Box sx={{
      display: "flex", flexDirection: "column",
      height: "100vh", width: "100vw",
      overflow: "hidden", position: "relative",
    }}>
      <AppBar position="static" elevation={0}>
        <Toolbar variant="dense" sx={{ minHeight: 52, px: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
            <Box sx={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#F69E3D",
              boxShadow: "0 0 8px #F69E3D",
            }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: "-0.3px", color: "#F2F2F2" }}>
              PrintMate
            </Typography>
            <Typography sx={{ color: "#5E6266", fontSize: 13, fontWeight: 300 }}>
              / {username}
            </Typography>
          </Box>

          <Chip
            label="● ONLINE"
            size="small"
            sx={{
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              color: "#22c55e", background: "#22c55e12",
              border: "1px solid #22c55e30", height: 22, mr: 1,
              "& .MuiChip-label": { px: 1 },
            }}
          />

          <IconButton color="inherit" onClick={handleLogout} size="small" title="Logout"
            sx={{
              color: "#5E6266",
              "&:hover": { color: "#D93025", background: "#D9302512" },
              transition: "all 0.2s",
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflow: "auto", pb: "64px", WebkitOverflowScrolling: "touch", position: "relative", zIndex: 1 }}>
        <Outlet />
      </Box>

      <BottomNavigation
        value={current}
        onChange={(_, newValue) => navigate(newValue)}
        showLabels
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, width: "100%", paddingBottom: "env(safe-area-inset-bottom)", zIndex: 1000 }}
      >
        {tabs.map((tab) => (
          <BottomNavigationAction key={tab.value} label={tab.label} value={tab.value} icon={tab.icon} sx={{ minWidth: 60 }} />
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default MainShell;
