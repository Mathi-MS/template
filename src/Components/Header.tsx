import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import LanguageIcon from "@mui/icons-material/Language";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
  Select,
  FormControl,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { HiBars3CenterLeft } from "react-icons/hi2";
import { useMemo, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../Custom/CustomInput";
import { RiSearchLine } from "react-icons/ri";
import { keyframes } from "@mui/material";

// Badge pulse animation
const badgePulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--primary);
    opacity: 1;
  }
  25% {
    transform: scale(1.1);
    box-shadow: 0 0 0 4px rgba(var(--primary-rgb, 25, 118, 210), 0.4);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 0 0 8px rgba(var(--primary-rgb, 25, 118, 210), 0.2);
    opacity: 0.8;
  }
  75% {
    transform: scale(1.1);
    box-shadow: 0 0 0 12px rgba(var(--primary-rgb, 25, 118, 210), 0.1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 16px rgba(var(--primary-rgb, 25, 118, 210), 0);
    opacity: 1;
  }
`;

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarCollapsed?: boolean;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const navigate = useNavigate();

  // Profile dropdown handlers
  const openProfile = (e: React.MouseEvent<HTMLElement>) =>
    setProfileAnchorEl(e.currentTarget);
  const closeProfile = () => {
    setProfileAnchorEl(null);
  };

  // Notification dropdown handlers
  const openNotifications = (e: React.MouseEvent<HTMLElement>) =>
    setNotificationAnchorEl(e.currentTarget);
  const closeNotifications = () => {
    setNotificationAnchorEl(null);
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can add theme context logic here
  };

  // Language change handler
  const handleLanguageChange = (event: any) => {
    setSelectedLanguage(event.target.value);
  };

  // Profile menu actions
  const handleProfileClick = () => {
    closeProfile();
    navigate("/profile");
  };

  const handleSignOut = () => {
    closeProfile();
    Cookies.remove("authToken"); // Adjust based on your auth implementation
    navigate("/login");
  };

  const handleSupport = () => {
    closeProfile();
    navigate("/support");
  };

  // Mock user data - replace with actual user data
  const userData = {
    name: "John Doe",
    userId: "JD001",
    avatar: "/path/to/avatar.jpg", // Replace with actual avatar path
  };

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "var(--white)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "space-between",
          px: { xs: 2, md: 3 },
          py: { xs: 1, md: 2 },
          backgroundColor: "var(--white)",
        }}
      >
        {/* Left: menu + title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Menu button - only show on desktop */}
          <IconButton
            onClick={onMenuClick}
            aria-label="toggle sidebar"
            size="small"
            sx={{
              color: "var(--text-secondar)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              width: "38px",
              height: "38px",
              display: { xs: "none", md: "flex" },
            }}
          >
            <HiBars3CenterLeft />
          </IconButton>

          {/* Logo/Brand on mobile */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1,
              fontWeight: 700,
              fontSize: 18,
              color: "#111",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "SemiBold_M",
                fontSize: "18px",
                color: "var(--primary)",
              }}
            >
              Boil
            </Typography>
          </Box>

          {/* Search - desktop only */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            <CustomInput
              label=""
              placeholder="Search or type command..."
              type="text"
              name="email"
              startAdornment={<RiSearchLine />}
              boxSx={{
                width: "300px",
                "& input": {
                  padding: "10px 12px",
                  fontSize: "13px",
                  fontFamily: "Regular_M",
                },
              }}
            />
          </Box>
        </Box>

        {/* Center: search (md+) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flex: 1,
            justifyContent: "center",
            px: 2,
          }}
        ></Box>

        {/* Right: actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, md: 1 },
          }}
        >
          {/* Dark Mode Toggle - show on all devices */}
          <Tooltip
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <IconButton
              onClick={toggleDarkMode}
              size="small"
              sx={{
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "200px",
                width: "38px",
                height: "38px",
              }}
            >
              {isDarkMode ? (
                <LightModeOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>

          {/* Language Selector - show on all devices but compact on mobile */}
          <FormControl size="small">
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              displayEmpty
              sx={{
                minWidth: { xs: 60, md: 80 },
                height: "38px",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSelect-select": {
                  padding: { xs: "8px 8px", md: "8px 12px" },
                  fontSize: "13px",
                  fontFamily: "Regular_M",
                },
              }}
              startAdornment={
                <LanguageIcon
                  sx={{
                    mr: { xs: 0.5, md: 1 },
                    fontSize: 16,
                    display: { xs: "none", sm: "block" },
                  }}
                />
              }
            >
              <MenuItem value="en" sx={{ fontFamily: "Regular_M" }}>
                EN
              </MenuItem>
              <MenuItem value="es" sx={{ fontFamily: "Regular_M" }}>
                ES
              </MenuItem>
              <MenuItem value="fr" sx={{ fontFamily: "Regular_M" }}>
                FR
              </MenuItem>
              <MenuItem value="de" sx={{ fontFamily: "Regular_M" }}>
                DE
              </MenuItem>
            </Select>
          </FormControl>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={openNotifications}
              size="small"
              sx={{
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "200px",
                width: "38px",
                height: "38px",
              }}
            >
              <Badge
                badgeContent={3}
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    background: "var(--primary)",
                    animation: `${badgePulse} 2s infinite`,
                    animationDelay: "0.5s",
                    top: "-5px",
                    right: "-5px",
                  },
                }}
              >
                <NotificationsNoneOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Dropdown */}
          <Box
            onClick={openProfile}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              padding: { xs: "6px", md: "6px 12px" },
              borderRadius: "6px",
              "&:hover": {
                backgroundColor: "var(--hover-bg, #f5f5f5)",
              },
            }}
          >
            <Avatar
              src={userData.avatar}
              sx={{
                width: 28,
                height: 28,
                fontSize: "12px",
                backgroundColor: "var(--primary)",
              }}
            >
              {userData.name.charAt(0)}
            </Avatar>
            <Typography
              variant="body2"
              sx={{
                fontSize: "13px",
                fontFamily: "Regular_M",
                color: "var(--text-primary)",
                display: { xs: "none", sm: "block" },
              }}
            >
              {userData.name}
            </Typography>
            <KeyboardArrowDownIcon
              sx={{
                fontSize: 16,
                display: { xs: "none", sm: "block" },
              }}
            />
          </Box>
        </Box>

        {/* Notification Dropdown Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={closeNotifications}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 260,
              maxHeight: 400,
              border: "1px solid var(--border)",
              borderRadius: "8px",
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid var(--border)" }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "Regular_M",
              }}
            >
              Notifications
            </Typography>
          </Box>
          <MenuItem onClick={closeNotifications}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: "Regular_M",
                }}
              >
                New message received
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "var(--text-secondary)", fontFamily: "Regular_M" }}
              >
                2 minutes ago
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={closeNotifications}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: "Regular_M",
                }}
              >
                New message received
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "var(--text-secondary)", fontFamily: "Regular_M" }}
              >
                2 minutes ago
              </Typography>
            </Box>
          </MenuItem>
        </Menu>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={closeProfile}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 220,
              border: "1px solid var(--border)",
              borderRadius: "8px",
            },
          }}
        >
          <Box sx={{ py: 1, px: 2, borderBottom: "1px solid var(--border)" }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "Regular_M",
              }}
            >
              {userData.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "var(--text-secondary)", fontFamily: "Regular_M" }}
            >
              ID: {userData.userId}
            </Typography>
          </Box>

          <MenuItem
            onClick={handleProfileClick}
            sx={{
              mt: 1,
              minHeight: "0px !important",

              "& .MuiButtonBase-root": {
                minHeight: "0px !important",
              },
            }}
          >
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Profile"
              primaryTypographyProps={{
                fontSize: "13px",
                fontFamily: "Regular_M",
              }}
            />
          </MenuItem>

          <MenuItem
            onClick={handleSupport}
            sx={{ minHeight: "0px !important" }}
          >
            <ListItemIcon>
              <InfoOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Support"
              primaryTypographyProps={{
                fontSize: "13px",
                fontFamily: "Regular_M",
              }}
            />
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleSignOut}
            sx={{ minHeight: "0px !important" }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{
                fontSize: "13px",
                fontFamily: "Regular_M",
              }}
            />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};
