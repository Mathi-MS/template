import React from "react";
import { Box, Typography } from "@mui/material";

interface SpendingItem {
  category: string;
  color: string;
}

interface LegendProps {
  series: SpendingItem[];
}

const SpendingLegend: React.FC<LegendProps> = ({ series }) => {
  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mt={2}>
      {series.map((item, idx) => (
        <Box key={idx} display="flex" alignItems="center" gap={0.5}>
          <Box width={12} height={12} bgcolor={item.color} borderRadius="50%" />
          <Typography fontSize={12} color="#000">
            {item.category}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SpendingLegend;
