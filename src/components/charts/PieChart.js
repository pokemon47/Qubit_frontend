import ReactApexChart from "react-apexcharts";

export default function PieChart({ chartData, chartLabels }) {
  if (!chartData?.length || !chartLabels?.length) return null;

  const options = {
    chart: {
      type: "pie",
    },
    labels: chartLabels,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function (value, opts) {
          const label = opts?.w?.config?.labels?.[opts?.seriesIndex];
          return `${label ?? "%"}: ${value}`;
        },
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={chartData}
      type="pie"
      width="100%"
      height="300"
    />
  );
}
