// import { useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Chip,
// } from "@mui/material";
// import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
// import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
// import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
// export const Sidebar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

//   const handleToggle = (label: string) => {
//     setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
//   };

//   const handleNavigation = (path: string) => {
//     navigate(path);
//   };

//   const navLinks = useMemo(
//     () => [
//       {
//         label: "Dashboard",
//         path: "/dashboard",
//         icon: <DashboardOutlinedIcon fontSize="small" />,
//       },
//       {
//         label: "Tickets",
//         path: "/tickets",
//         icon: <ReceiptLongOutlinedIcon fontSize="small" />,
//       },
//       {
//         label: "Masters",
//         path: "/masters",
//         icon: <ManageAccountsOutlinedIcon fontSize="small" />,
//       },
//       // {
//       //   label: "AI Assistant",
//       //   icon: <AssignmentIcon fontSize="small" />,
//       //   badge: "NEW",
//       //   children: [
//       //     { label: "Chatbot", path: "/ai/chatbot" },
//       //     { label: "Summarizer", path: "/ai/summarizer" },
//       //   ],
//       // },
//     ],
//     []
//   );

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         height: "100vh",
//         backgroundColor: "#fff",
//         borderRight: "1px solid #e5e7eb",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* Logo */}
//       <Box sx={{ p: 3, fontWeight: 700, fontSize: 22, color: "#111" }}>
//         <TravelExploreOutlinedIcon sx={{color:"var(--primary)"}}/> BoilerPlate
//       </Box>

//       {/* Menu */}
//       <List sx={{ flex: 1 }}>
//         {navLinks.map((item) => {
//           const isSelected = location.pathname === item.path;

//           return (
//             <Box key={item.label} sx={{px:1.5}}>
//               <ListItemButton
//                 selected={isSelected}
//                 onClick={() =>
//                   item?.children ? handleToggle(item.label) : handleNavigation(item.path)
//                 }
//                 sx={{
//                   borderRadius: 2,
//                   mb: 0.5,
//                   color:"var(--text-secondary)",
//                   "&.Mui-selected": {
//                     backgroundColor: "rgba(59,130,246,0.1)",
//                     color: "#2563eb",
//                     "& .MuiListItemIcon-root": { color: "#2563eb" },
//                   },
//                   "& .MuiTypography-root ":{
//                     fontFamily:"Light_M",
//                   }
//                 }}
//               >
//                 <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
//                 <ListItemText
//                   primary={item.label}
//                   primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}
//                 />
//                 {item.badge && (
//                   <Chip
//                     label={item.badge}
//                     size="small"
//                     sx={{
//                       ml: "auto",
//                       fontSize: 10,
//                       bgcolor: "#dcfce7",
//                       color: "#16a34a",
//                       fontFamily:'Bold_M',
//                     }}
//                   />
//                 )}
//                 {item.children &&
//                   (openMenus[item.label] ? <ExpandLess /> : <ExpandMore />)}
//               </ListItemButton>

//               {/* Submenu */}
//               {item.children && (
//                 <Collapse in={openMenus[item.label]} timeout="auto" unmountOnExit>
//                   <List component="div" disablePadding>
//                     {item.children.map((sub) => (
//                       <ListItemButton
//                         key={sub.path}
//                         selected={location.pathname === sub.path}
//                         onClick={() => handleNavigation(sub.path)}
//                         sx={{
//                           pl: 6,
//                           "&.Mui-selected": {
//                             backgroundColor: "rgba(59,130,246,0.08)",
//                             color: "#2563eb",
//                           },
//                           "& .MuiTypography-root ":{
//                     fontFamily:"Regular_M",
//                   }
//                         }}
//                       >
//                         <ListItemText
//                           primary={sub.label}
//                           primaryTypographyProps={{ fontSize: 13 }}
//                         />
//                       </ListItemButton>
//                     ))}
//                   </List>
//                 </Collapse>
//               )}
//             </Box>
//           );
//         })}
//       </List>
//     </Box>
//   );
// };

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Chip,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import { useUser } from "../Config/userContext"; // ✅ import user context

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const { user } = useUser(); // ✅ get logged-in user info
  const role = user?.user?.role?.toLowerCase();

  const handleToggle = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // ✅ Define navigation items and which roles can see them
  const navLinks = useMemo(
    () => [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: <DashboardOutlinedIcon fontSize="small" />,
        roles: ["superadmin", "vendor", "admin","transport"],
      },
      {
        label: "Tickets",
        path: "/tickets",
        icon: <ReceiptLongOutlinedIcon fontSize="small" />,
        roles: ["superadmin","admin","transport"],
      },
      {
        label: "Masters",
        path: "/masters",
        icon: <ManageAccountsOutlinedIcon fontSize="small" />,
        roles: ["superadmin"],
      },
      // Example of nested menu (if needed)
      // {
      //   label: "AI Assistant",
      //   icon: <AssignmentIcon fontSize="small" />,
      //   badge: "NEW",
      //   roles: ["superadmin"],
      //   children: [
      //     { label: "Chatbot", path: "/ai/chatbot" },
      //     { label: "Summarizer", path: "/ai/summarizer" },
      //   ],
      // },
    ],
    []
  );

  // ✅ Filter visible links based on the current user role
  const visibleLinks = navLinks.filter((item) =>
    item.roles.includes(role ?? "")
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#fff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, fontWeight: 700, fontSize: 22, color: "#111" }}>
        <TravelExploreOutlinedIcon sx={{ color: "var(--primary)" }} /> BoilerPlate
      </Box>

      {/* Menu */}
      <List sx={{ flex: 1 }}>
        {visibleLinks.map((item) => {
          const isSelected = location.pathname === item.path;

          return (
            <Box key={item.label} sx={{ px: 1.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() =>
                  item?.children
                    ? handleToggle(item.label)
                    : handleNavigation(item.path)
                }
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: "var(--text-secondary)",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(59,130,246,0.1)",
                    color: "#2563eb",
                    "& .MuiListItemIcon-root": { color: "#2563eb" },
                  },
                  "& .MuiTypography-root ": {
                    fontFamily: "Light_M",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      ml: "auto",
                      fontSize: 10,
                      bgcolor: "#dcfce7",
                      color: "#16a34a",
                      fontFamily: "Bold_M",
                    }}
                  />
                )}
                {item.children &&
                  (openMenus[item.label] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>

              {/* Submenu (if any) */}
              {item.children && (
                <Collapse
                  in={openMenus[item.label]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.children.map((sub) => (
                      <ListItemButton
                        key={sub.path}
                        selected={location.pathname === sub.path}
                        onClick={() => handleNavigation(sub.path)}
                        sx={{
                          pl: 6,
                          "&.Mui-selected": {
                            backgroundColor: "rgba(59,130,246,0.08)",
                            color: "#2563eb",
                          },
                          "& .MuiTypography-root ": {
                            fontFamily: "Regular_M",
                          },
                        }}
                      >
                        <ListItemText
                          primary={sub.label}
                          primaryTypographyProps={{ fontSize: 13 }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

