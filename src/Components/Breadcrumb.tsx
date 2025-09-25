import { Box, Breadcrumbs, Typography, Link } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";
import { useBreadcrumb } from "../Context/BreadcrumbContext";

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

export const Breadcrumb = () => {
  const { customItems } = useBreadcrumb();
  const location = useLocation();
  const navigate = useNavigate();

  // Define route mappings
  const routeLabels: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/tickets": "Tickets",
    "/masters": "Masters",
    "/profile": "Profile",
  };

  // Generate breadcrumb items based on current route
  const generateBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: "Home", path: "/dashboard" }];

    const currentPath = location.pathname;

    if (currentPath !== "/dashboard" && routeLabels[currentPath]) {
      items.push({
        label: routeLabels[currentPath],
        path: currentPath,
        isActive: true,
      });
    }

    // If custom items are provided (like tab names), add them
    if (customItems && customItems.length > 0) {
      items.push(...customItems);
    }

    return items;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        mb: 2,
        p: 1,
        borderRadius: "8px",
      }}
    >
      <Breadcrumbs
        separator={
          <ChevronRight sx={{ fontSize: 16, color: "var(--text-secondary)" }} />
        }
        sx={{
          "& .MuiBreadcrumbs-ol": {
            alignItems: "center",
          },
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          if (isLast || !item.path) {
            return (
              <Typography
                key={index}
                sx={{
                  fontSize: "14px",
                  fontWeight: isLast ? 600 : 400,
                  color: isLast ? "var(--primary)" : "var(--text-secondary)",
                  fontFamily: "Regular_M",
                }}
              >
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={index}
              component="button"
              onClick={() => handleNavigate(item.path!)}
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontFamily: "Medium_M",
                cursor: "pointer",
                border: "none",
                background: "none",
                padding: 0,
                "&:hover": {
                  color: "var(--primary)",
                  textDecoration: "underline",
                },
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};
