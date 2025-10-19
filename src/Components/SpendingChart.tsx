import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend as ChartLegend,
} from "chart.js";
import { Box, Typography } from "@mui/material";
import SpendingLegend from "./SpendingLegend";
import Card from "./card";

ChartJS.register(ArcElement, Tooltip, ChartLegend);

interface SpendingChartProps {
  dashboardData: any;
  title?: string;
}

const SpendingChart: React.FC<SpendingChartProps> = ({
  dashboardData,
  title = "Rides by Location",
}) => {
  const ridesByLocation = dashboardData?.ridesByLocation || [];
  const totalRides = ridesByLocation.reduce(
    (sum: number, item: any) => sum + item.count,
    0
  );

  const apiData = ridesByLocation.map((item: any) => ({
    annexureName: item.locationName,
    totalTransactionsCount: item.count,
    percentage:
      totalRides > 0
        ? ((item.count / totalRides) * 100).toFixed(0) + "%"
        : "0%",
  }));

  const labels = apiData.map((item: any) => item.annexureName);
  const values = apiData.map((item: any) => item.totalTransactionsCount);
  const percentages = apiData.map((item: any) => item.percentage);

  const rootStyles = getComputedStyle(document.documentElement);
  const baseColors = [
    rootStyles.getPropertyValue("--primary").trim(),
    rootStyles.getPropertyValue("--success").trim(),
    rootStyles.getPropertyValue("--error").trim(),
    rootStyles.getPropertyValue("--text-secondary-dark").trim(),
  ];

  const chartColors = apiData.map(
    (_, index) => baseColors[index % baseColors.length]
  );

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: chartColors,
        borderWidth: 2,
        borderColor: rootStyles.getPropertyValue("--white").trim(),
        hoverOffset: 6,
      },
    ],
  };

  if (apiData.length === 0) {
    return (
      <Card title={title} glow>
        <Box
          width="100%"
          height={200}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
            No data available
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card title={title} glow>
      <Box
        width={230}
        height={200}
        mx="auto"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Doughnut
          data={chartData}
          options={{
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: rootStyles
                  .getPropertyValue("--primary")
                  .trim(),
                titleColor: rootStyles.getPropertyValue("--white").trim(),
                bodyColor: rootStyles.getPropertyValue("--white").trim(),
                cornerRadius: 6,
                padding: 10,
                callbacks: {
                  label: (context) => {
                    const index = context.dataIndex;
                    return `${labels[index]}: ${values[index]} (${percentages[index]})`;
                  },
                },
              },
            },
          }}
        />
      </Box>

      <SpendingLegend
        series={apiData.map((item, index) => ({
          category: item.annexureName,
          value: item.totalTransactionsCount,
          color: chartColors[index],
          percentage: item.percentage,
        }))}
      />
    </Card>
  );
};

export default SpendingChart;
