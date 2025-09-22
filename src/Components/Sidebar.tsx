import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import {
  Box,
  Avatar,
  Typography,
  Divider,
  Menu,
  MenuItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LogoutIcon from "@mui/icons-material/Logout";
import type { SidebarProps } from "../Interface/Custom";
import { images } from "../assets/Images/Images";
import Cookies from "js-cookie";

export const Sidebar = ({
  onNavigate,
  onNavigateLink,
  onLogout,
  onProfileSettings,
}: SidebarProps) => {
  const location = useLocation(); // Get current route location
  const role = Cookies.get("role");

  const navLinks = useMemo(() => {
    if (role === "plant") {
      return [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: <DashboardIcon fontSize="small" />,
        },
        {
          label: "Upload Invoice",
          path: "/upload-invoice",
          icon: <UploadFileIcon fontSize="small" />,
        },
        {
          label: "All Tickets",
          path: "/tickets",
          icon: <AssessmentIcon fontSize="small" />,
        },
      ];
    } else if (role === "ra") {
      return [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: <DashboardIcon fontSize="small" />,
        },
        {
          label: "All Tickets",
          path: "/tickets",
          icon: <AssessmentIcon fontSize="small" />,
        },
      ];
    } else {
      return [];
    }
  }, [role]);

  const user = { name: "John Doe", role: "Admin", image: "" };
  const userInitial = user.name?.trim()?.charAt(0)?.toUpperCase() ?? "U";

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const openMenu = (e: React.MouseEvent<HTMLElement>) =>
    setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const handleNavClick = (path: string) => {
    onNavigateLink?.(path);
    onNavigate?.();
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--white)",
      }}
    >
      {/* Logo / Brand */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "var(--white)",
        }}
      >
        <Box
          component="img"
          src={images.logincompany}
          alt="Brand"
          sx={{ width: 130, display: "block", mx: "auto", userSelect: "none" }}
        />
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: "auto", p: 1.25 }}>
        <List sx={{ mt: 0.5 }}>
          {navLinks.map((link) => {
            const selected = location.pathname === link.path; // Compare with current location
            return (
              <Tooltip
                key={link.path}
                title={link.label}
                placement="right"
                disableInteractive
              >
                <ListItemButton
                  selected={selected}
                  onClick={() => handleNavClick(link.path)}
                  sx={{
                    position: "relative",
                    borderRadius: "5px",
                    mb: 0.5,
                    px: 1.25,
                    py: 0.8,
                    transition: "background-color 0.2s ease, color 0.2s ease",
                    color: "var(--title)",
                    "& .MuiListItemIcon-root": {
                      minWidth: 32,
                      color: "var(--titleSec)",
                    },
                    "&:not(.Mui-selected):hover": {
                      backgroundColor: "var(--secondary)",
                    },
                    "&.Mui-selected, &.Mui-selected:hover": {
                      backgroundColor: "var(--primary)",
                    },
                    "&.Mui-selected .MuiListItemIcon-root, &.Mui-selected .MuiListItemText-primary":
                      {
                        color: "var(--white)",
                      },
                  }}
                >
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 700,
                      noWrap: true,
                      letterSpacing: 0.2,
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      <Divider />
    </Box>
  );
};
