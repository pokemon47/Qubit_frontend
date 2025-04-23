import React from "react";
import CandlestickChart from "./CandlestickChart";

class StockChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      isLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    const { symbol, from, to } = this.props;
    const apiKey = "oFYyPHWTk9rKrTMI976B0jk9OiVCaTe8";
    const url = `https://financialmodelingprep.com/stable/historical-price-eod/non-split-adjusted?symbol=${symbol}${from ? `&from=${from}` : ""}${to ? `&to=${to}` : ""}&apikey=${apiKey}`;


    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch stock data");
        }
        return response.json();
      })
      .then((data) => {
        const formattedData = data.map((item) => ({
          x: new Date(item.date),
          y: [item.adjOpen, item.adjHigh, item.adjLow, item.adjClose],
        }));
        this.setState({
          chartData: [{ data: formattedData }],
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message,
          isLoading: false,
        });
      });
  }

  render() {
    const { isLoading, error, chartData } = this.state;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error: {error}</div>;
    }

    const chartOptions = {
      chart: {
        type: "candlestick",
      },
      title: {
        text: `Stock Price - ${this.props.symbol}`,
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    };

    return (
      <CandlestickChart
        chartData={chartData}
        chartOptions={chartOptions}
      />
    );
  }
}

export default StockChart;