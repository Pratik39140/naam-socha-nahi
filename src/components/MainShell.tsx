import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import QueueIcon from "@mui/icons-material/Queue";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";

const MainShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read username from localStorage (set during login)
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
    { label: "History", value: "/main/history", icon: <PaymentIcon /> },
    { label: "Profile", value: "/main/profile", icon: <PersonIcon /> },
  ];

  const current =
    tabs.find((t) => location.pathname.startsWith(t.value))?.value ??
    "/main/upload";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top App Bar */}
      <AppBar position="static" elevation={1} sx={{ zIndex: 999 }}>
        <Toolbar variant="dense">
          <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 500 }}>
            Hi, {username}!
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} size="small" title="Logout">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Content Area */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          pb: "56px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Outlet />
      </Box>

      {/* Bottom Navigation - Fixed */}
      <BottomNavigation
        value={current}
        onChange={(_, newValue) => navigate(newValue)}
        showLabels
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          borderTop: "1px solid",
          borderColor: "divider",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
          zIndex: 1000,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {tabs.map((tab) => (
          <BottomNavigationAction
            key={tab.value}
            label={tab.label}
            value={tab.value}
            icon={tab.icon}
            sx={{
              minWidth: "60px",
              padding: "6px 12px",
              "& .MuiBottomNavigationAction-label": {
                fontSize: "0.75rem",
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default MainShell;