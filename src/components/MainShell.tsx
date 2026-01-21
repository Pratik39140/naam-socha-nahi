import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import QueueIcon from "@mui/icons-material/Queue";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";

const MainShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Upload", value: "/main/upload", icon: <CloudUploadIcon /> },
    { label: "Queue", value: "/main/queue", icon: <QueueIcon /> },
    { label: "Payment", value: "/main/payment", icon: <PaymentIcon /> },
    { label: "Profile", value: "/main/profile", icon: <PersonIcon /> },
  ];

  const current =
    tabs.find((t) => location.pathname.startsWith(t.value))?.value ??
    "/main/upload";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </div>

      <BottomNavigation
        value={current}
        onChange={(_, newValue) => navigate(newValue)}
        showLabels
      >
        {tabs.map((tab) => (
          <BottomNavigationAction
            key={tab.value}
            label={tab.label}
            value={tab.value}
            icon={tab.icon}
          />
        ))}
      </BottomNavigation>
    </div>
  );
};

export default MainShell;
