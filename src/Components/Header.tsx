import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
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
} from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarCollapsed?: boolean;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const openProfile = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const closeProfile = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    Cookies.remove("name");
    Cookies.remove("role");
    Cookies.remove("email");
    navigate("/login");
  };

  const username = Cookies.get("name");
  const role = Cookies.get("role");
  // Dummy user
  const user = useMemo(() => ({ name: username, role: role, image: "" }), []);
  const userInitial = user.name?.trim()?.charAt(0)?.toUpperCase() ?? "U";

  const pageTitle = "Welcome back,";

  // Theme toggle: sync with localStorage and HTML attribute
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") return attr;
    } catch {}
    return "dark";
  });
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "var(--white)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "space-between",
          px: { xs: 1.5, md: 2.5 },
          py: { xs: 0.75, md: 1.4 },
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
          <IconButton
            onClick={onMenuClick}
            aria-label="toggle sidebar"
            size="small"
            sx={{ color: "var(--titleThird)" }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              color: "var(--title)",
              fontWeight: 700,
              lineHeight: 1.2,
              fontSize: { xs: "15px", md: "16px" },
              letterSpacing: 0.2,
            }}
            noWrap
          >
            {pageTitle + " " + user.name}
          </Typography>
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* Theme toggle */}
          {/*<Tooltip
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <IconButton
              onClick={toggleTheme}
              aria-label="toggle theme"
              sx={{ color: "var(--title)" }}
            >
              {theme === "dark" ? (
                <LightModeOutlinedIcon fontSize="small" />
              ) : (
                <DarkModeOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip> 

          <IconButton aria-label="notifications" sx={{ color: "var(--title)" }}>
            <Badge color="primary" variant="dot" overlap="circular">
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
            */}
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          <IconButton
            onClick={openProfile}
            sx={{ p: 0.25 }}
            aria-label="open profile menu"
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "var(--avatar-bg)",
                color: "var(--avatar-fg)",
                fontSize: 14,
                fontWeight: 700,
              }}
              src={user.image || undefined}
            >
              {!user.image && userInitial}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeProfile}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "hidden",
                mt: 1,
                borderRadius: 2,
                border: "1px solid var(--border-color)",
                boxShadow: "0px 4px 16px rgba(0,0,0,0.06)",
                minWidth: 220,
                backgroundColor: "var(--white)",
              },
            }}
          >
            <Box sx={{ px: 1.5, py: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "var(--title)", lineHeight: 1.2 }}
              >
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "var(--titleSec)" }}>
                {user.role}
              </Typography>
            </Box>
            <Divider />
            {/* <MenuItem onClick={closeProfile} sx={{ color: "var(--title)" }}>
              Profile
            </MenuItem>
            <MenuItem onClick={closeProfile} sx={{ color: "var(--title)" }}>
              Settings
            </MenuItem> */}
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};
