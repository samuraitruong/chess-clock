import { Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Chart.js Bar Chart",
    },
  },
};

export interface MoveChartProps {
  data: number[];
}
export function MoveChart(props: MoveChartProps) {
  const labels = props.data.map((x, index) => index + 1);
  const data = {
    labels,
    datasets: [
      {
        label: "Move",
        data: props.data,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  if (props.data.length === 0) return <></>;
  return (
    <Box sx={{ height: "100px", width: "100%" }}>
      <Bar data={data} options={options} />
    </Box>
  );
}
