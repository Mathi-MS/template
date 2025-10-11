import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useUser } from "../Config/userContext"; // ✅ import user context

export const MobileBottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser(); // get logged-in user info
  const role = user?.user?.role?.toLowerCase();

  // Define nav items
  let navItems = [];

  if (role === "user") {
    // Only show "Create Ride" and "Help"
    navItems = [
      {
        label: "Create Ride",
        path: "/ride",
        icon: <AddCircleOutlineIcon />,
      },
      { label: "Tickets", path: "/tickets", icon: <ReceiptLongOutlinedIcon /> },
      { label: "Help", path: "/help", icon: <HelpOutlineIcon /> },
    ];
  } else if (role === "vendor") {
    // Vendor menu (no Tickets)
    navItems = [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: <DashboardOutlinedIcon />,
      },
      {
        label: "Masters",
        path: "/masters",
        icon: <ManageAccountsOutlinedIcon />,
      },
    ];
  } else {
    // Full menu for other roles (like admin)
    navItems = [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: <DashboardOutlinedIcon />,
      },
      { label: "Tickets", path: "/tickets", icon: <ReceiptLongOutlinedIcon /> },
      {
        label: "Masters",
        path: "/masters",
        icon: <ManageAccountsOutlinedIcon />,
      },
    ];
  }


  // Find current active index
  const currentIndex = navItems.findIndex(
    (item) => location.pathname === item.path
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(navItems[newValue].path);
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: "1px solid var(--border-color)",
        backgroundColor: "var(--white)",
      }}
      elevation={3}
    >
      <BottomNavigation
        value={currentIndex >= 0 ? currentIndex : 0}
        onChange={handleChange}
        sx={{
          height: 70,
          "& .MuiBottomNavigationAction-root": {
            color: "var(--text-secondary)",
            fontSize: "12px",
            fontFamily: "Regular_M",
            "&.Mui-selected": {
              color: "var(--primary)",
            },
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "11px",
            fontFamily: "Regular_M",
            "&.Mui-selected": {
              fontSize: "11px",
            },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
