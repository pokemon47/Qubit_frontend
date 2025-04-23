import ReactApexChart from "react-apexcharts";

export default function ColumnChart({ chartData, chartOptions }) {
  if (!chartData?.length || !chartOptions) return null;

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartData}
      type="bar"
      width="100%"
      height="300"
    />
  );
}
