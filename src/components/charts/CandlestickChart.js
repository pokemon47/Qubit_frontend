import React from "react";
import ReactApexChart from "react-apexcharts";

class CandlestickChart extends React.Component {
  render() {
    return (
      <ReactApexChart
        options={this.props.chartOptions}
        series={this.props.chartData}
        type="candlestick"
        width="100%"
        height="100%"
      />
    );
  }
}

export default CandlestickChart;