import ReactApexChart from "react-apexcharts";

export default function LineChart({ chartData, chartOptions }) {
  if (!chartData?.length || !chartOptions) return null;

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartData}
      type="line"
      width="100%"
      height="300"
    />
  );
}
