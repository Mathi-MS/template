import React from "react";
import { Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  type Plugin,
  type ChartData,
  type ChartOptions,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler
);

interface Annexure {
  annexureName: string;
  total?: number; // single value per annexure
}

interface MiniChartProps {
  apiData: Annexure[];
  lineColor?: string; // optional theme-based line color
}

const MiniChart: React.FC<MiniChartProps> = ({ apiData = [], lineColor }) => {
  console.log(apiData);
  
  const labels = apiData.map((item) => item.annexureName || "Unknown");
  const values = apiData.map((item) => item.total ?? 0);

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Total",
        data: values,
        borderColor: lineColor || "#465fff",
        backgroundColor: "transparent",
        borderWidth: 3,
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointBackgroundColor: lineColor || "var(--primary)",
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#00000",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#ffffff",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`, // show value only
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "var(--text-secondary)" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "var(--text-secondary)" },
      },
    },
  };

  // Optional glow effect plugin
  const glowPlugin: Plugin<"line"> = {
    id: "glow",
    beforeDatasetsDraw: (chart) => {
      const ctx = chart.ctx;
      ctx.save();
      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        if (!meta.hidden) {
          const color = (dataset.borderColor as string) + "A0";
          ctx.shadowColor = color;
          ctx.shadowBlur = 15;
          ctx.lineWidth = dataset.borderWidth as number;
          meta.dataset.draw(ctx);
          ctx.shadowColor = "transparent";
          meta.dataset.draw(ctx);
        }
      });
      ctx.restore();
    },
  };

  return (
    <Box sx={{ width: "100%", height: "220px", position: "relative" }}>
      <Line data={data} options={options} plugins={[glowPlugin]} />
    </Box>
  );
};

export default MiniChart;
