import { useState } from "react";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileBottomNavigation } from "./BottomNavigation";
import { Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 260;

export const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isDesktop = useMediaQuery("(min-width:900px)");
  const isMobile = useMediaQuery("(max-width:899px)");

  const handleToggleSidebar = () => {
    if (isDesktop) {
      setSidebarCollapsed((prev) => !prev);
    } else {
      setMobileOpen((prev) => !prev);
    }
  };
  const handleCloseMobile = () => setMobileOpen(false);

  // Handlers for navigation and profile actions
  const navigate = useNavigate();
  const handleNavigateLink = (path: string) => {
    navigate(path);
  };
  const handleLogout = () => {
    console.log("Logout clicked");
  };
  const handleProfileSettings = () => {
    console.log("Profile settings clicked");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      {/* Left Sidebar - Desktop Only */}
      {isDesktop && !sidebarCollapsed && (
        <Box component="nav" sx={{ width: drawerWidth, flexShrink: 0 }}>
          <Box
            sx={{
              width: drawerWidth,
              height: "100vh",
              position: "sticky",
              top: 0,
              borderRight: "1px solid var(--border-color)",
              backgroundColor: "var(--white)",
            }}
          >
            <Sidebar />
          </Box>
        </Box>
      )}

      {/* Mobile Drawer - Hidden by default, only for special cases */}
      {!isDesktop && (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleCloseMobile}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: "none", // Hide mobile drawer since we're using bottom nav
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Sidebar />
        </Drawer>
      )}

      {/* Right Content: Header (top) + Dashboard (bottom) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header
          onMenuClick={handleToggleSidebar}
          isSidebarCollapsed={isDesktop ? sidebarCollapsed : false}
        />
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: { xs: 2, md: 3 },
            pb: { xs: 10, md: 3 }, // Add bottom padding on mobile for bottom nav
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNavigation />}
    </Box>
  );
};
