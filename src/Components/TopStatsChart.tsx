import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Box, Typography } from "@mui/material";
import Card from "./card";
import { TrendingUp } from "@mui/icons-material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface TopStatsItem {
  label: string;
  value: number;
}

interface TopStatsChartProps {
  title: string;
  data?: TopStatsItem[] | Record<string, number>; // Accept both array and object
  color?: string;
}

const TopStatsChart: React.FC<TopStatsChartProps> = ({
  title,
  data,
  color = "var(--primary)",
}) => {
  // Convert object to array if necessary
  const formattedData: TopStatsItem[] = Array.isArray(data)
    ? data
    : data
    ? Object.entries(data).map(([label, value]) => ({
        label,
        value: Number(value),
      }))
    : [];

  // Sort by value descending and take top 5
  const topData = formattedData.sort((a, b) => b.value - a.value).slice(0, 5);

  const chartData = {
    labels: topData.map((item) => item.label),
    datasets: [
      {
        data: topData.map((item) => item.value),
        backgroundColor: "#465fff",
        borderRadius: 6,
        barThickness: 18,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#465fff",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        callbacks: {
          label: (context: any) => `${context.parsed.x}`,
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        display: true,
        grid: { display: false },
        ticks: {
          color: "var(--text-secondary)",
          font: { size: 11, weight: "500" },
        },
      },
    },
  };

  return (
    <Card title={title} icon={<TrendingUp style={{ color }} />}>
      <Box height={180}>
        {topData.length === 0 ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            color="var(--text-secondary)"
          >
            <Typography variant="body2">No data available</Typography>
          </Box>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </Box>
    </Card>
  );
};

export default TopStatsChart;
