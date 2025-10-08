import { useState, } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { City } from "../Pages/City";
import { Location } from "../Pages/Location";
import { LocationCost } from "../Pages/LocationCost";
import { Vendor } from "../Pages/Vendor";
import TransportTable from "../Pages/Transport";
import { useUser } from "../Config/userContext";
import UserTable from "../Pages/user";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export const Masters = () => {
  const [value, setValue] = useState(0);
  const { user } = useUser();

  const role = user?.user?.role?.toLowerCase(); 

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


   const tabs = [
     { label: "City", component: <City />, roles: ["superadmin"] },
     {
       label: "Location",
       component: <Location />,
       roles: ["superadmin"],
     },
     { label: "Location Cost", component: <LocationCost />, roles: ["superadmin"] },
     { label: "Vendor", component: <Vendor />, roles: ["superadmin"] },
     { label: "User", component: <UserTable/>, roles: ["superadmin"] },
     {
       label: "Transport",
       component: <TransportTable />,
       roles: ["vendor"],
     },
   ];

   // Filter tabs based on current role
   const visibleTabs = tabs.filter((tab) => tab.roles.includes(role ?? ""));
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "var(--white)",
        padding: "20px",
        border: "solid 1px var(--border)",
        borderRadius: "10px",
      }}
    >
      {/* Tabs */}
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          "& button": {
            fontFamily: "Medium_M",
            textTransform: "capitalize",
            fontSize: "14px",
            padding: "10px 20px",
            minHeight: "unset",
          },
          "& .MuiTabs-indicator": {
            display: "none",
          },
          "& button.Mui-selected": {
            backgroundColor: "var(--white)",
            borderRadius: "6px",
            color: "var(--primary)",
          },
          backgroundColor: "var(--backgroundInner)",
          borderRadius: "6px",
          padding: "5px",
        }}
      >
        {visibleTabs.map((tab, index) => (
          <Tab key={tab.label} label={tab.label} />
        ))}
      </Tabs>

      {/* Tab Panels */}
      {visibleTabs.map((tab, index) => (
        <TabPanel key={tab.label} value={value} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </Box>
  );
};
