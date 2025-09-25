import { useState, } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { City } from "../Pages/City";

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


  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
            padding:"10px 20px",
            minHeight:"unset"
          },
          "& .MuiTabs-indicator":{
            display:"none",
          },
          "& button.Mui-selected": {
            backgroundColor: "var(--white)",
            borderRadius: "6px",
            color:"var(--primary)",
          },
          backgroundColor: "var(--backgroundInner)",
          borderRadius: "6px",
          padding:"5px"
        }}
      >
        <Tab label="City" />
        <Tab label="Location" />
        <Tab label="Location Cost" />
        <Tab label="Vendor" />
        <Tab label="User" />
      </Tabs>

      {/* Tab Panels */}
      <TabPanel value={value} index={0}>
        <City />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Location Content here
      </TabPanel>
      <TabPanel value={value} index={2}>
        Location Cost Content here
      </TabPanel>
      <TabPanel value={value} index={3}>
        Vendor Content here
      </TabPanel>
      <TabPanel value={value} index={4}>
        User Content here
      </TabPanel>
    </Box>
  );
};
