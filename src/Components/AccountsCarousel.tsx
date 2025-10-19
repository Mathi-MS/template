import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ShowChart, BarChart } from "@mui/icons-material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import Card from "./card";
import MiniChart from "./MiniChart";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// --------------------- Types ---------------------
interface ChannelCount {
  annexureName: string;
  total: number;
}

interface MiniBarChartProps {
  dataPoints: ChannelCount[];
}

interface AccountsCarouselProps {
  cityCostMap: Record<string, number>; // e.g. { "Cuddalore": 4.0 }
}

// --------------------- MiniBarChart ---------------------
const MiniBarChart: React.FC<MiniBarChartProps> = ({ dataPoints }) => {
  const labels = dataPoints.map((item) => item.annexureName);
  const values = dataPoints.map((item) => item.total);

  const barThickness = Math.max(6, Math.min(30, 200 / dataPoints.length));

  const data = {
    labels,
    datasets: [
      {
        label: "Total",
        data: values,
        backgroundColor: "#465fff",
        borderRadius: 4,
        barThickness,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "var(--text-secondary)",
          font: { size: 13, weight: "500" },
        },
      },
      y: {
        display: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: {
          color: "var(--text-secondary)",
          stepSize: 1,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

// --------------------- AccountsCarousel ---------------------
const AccountsCarousel: React.FC<AccountsCarouselProps> = ({ cityCostMap = {} }) => {
  const [chartType, setChartType] = useState<"line" | "bar">("bar");

  // Transform cityCostMap into array for charts
  const chartData: ChannelCount[] = Object.entries(cityCostMap).map(
    ([city, cost]) => ({
      annexureName: city,
      total: cost,
    })
  );

  const hasData = chartData.length > 0;

  return (
    <Card title="">
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h6"
          sx={{ color: "var(--text-primary)", fontWeight: 600, fontSize: 16 }}
        >
          Cost by Cities
        </Typography>

        {/* Chart Toggle Buttons */}
        <Box display="flex" gap={1}>
          <IconButton
            onClick={() => setChartType("bar")}
            sx={{
              fontSize: 20,
              cursor: "pointer",
              color:
                chartType === "bar"
                  ? "var(--primary)"
                  : "var(--text-secondary)",
              backgroundColor:
                chartType === "bar" ? "var(--secondary)" : "transparent",
              borderRadius: 2,
              p: 0.5,
              transition: "all 0.2s ease",
              "&:hover": { backgroundColor: "var(--secondary)" },
            }}
          >
            <BarChart fontSize="small" />
          </IconButton>

          <IconButton
            onClick={() => setChartType("line")}
            sx={{
              fontSize: 20,
              cursor: "pointer",
              color:
                chartType === "line"
                  ? "var(--primary)"
                  : "var(--text-secondary)",
              backgroundColor:
                chartType === "line" ? "var(--secondary)" : "transparent",
              borderRadius: 2,
              p: 0.5,
              transition: "all 0.2s ease",
              "&:hover": { backgroundColor: "var(--secondary)" },
            }}
          >
            <ShowChart fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Chart Container */}
      <Box width="100%" height={200}>
        {!hasData ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="body2" color="var(--text-secondary)">
              No data available
            </Typography>
          </Box>
        ) : chartType === "line" ? (
          <MiniChart apiData={chartData} lineColor="#465fff" />
        ) : (
          <MiniBarChart dataPoints={chartData} />
        )}
      </Box>
    </Card>
  );
};

export default AccountsCarousel;
