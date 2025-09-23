import { Box, Typography } from "@mui/material";

export const Profile = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontFamily: "Bold_M" }}>
        Profile
      </Typography>
      <Typography variant="body1" sx={{ fontFamily: "Regular_M" }}>
        Profile page content goes here.
      </Typography>
    </Box>
  );
};
