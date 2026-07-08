import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin,
);

// Finsage chart defaults: quiet grids, muted labels, black rounded tooltips.
ChartJS.defaults.font.family =
  '"Inter Variable", system-ui, -apple-system, "Segoe UI", sans-serif';
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = "#6f6f76";
ChartJS.defaults.borderColor = "#e9e9ea";

// Tooltips are flat black pills with white ink, identical in both themes.
ChartJS.defaults.plugins.tooltip.backgroundColor = "#0a0a0b";
ChartJS.defaults.plugins.tooltip.titleColor = "#ffffff";
ChartJS.defaults.plugins.tooltip.bodyColor = "rgba(255, 255, 255, 0.85)";
ChartJS.defaults.plugins.tooltip.cornerRadius = 12;
ChartJS.defaults.plugins.tooltip.padding = 12;
ChartJS.defaults.plugins.tooltip.displayColors = false;
ChartJS.defaults.plugins.tooltip.titleFont = { weight: "bold" };

// Legend swatches read as small Finsage dots rather than squares.
ChartJS.defaults.plugins.legend.labels.usePointStyle = true;
ChartJS.defaults.plugins.legend.labels.pointStyle = "circle";
