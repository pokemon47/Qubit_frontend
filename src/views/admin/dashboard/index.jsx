import React from "react";
import {
  Box,
  SimpleGrid,
  Text,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";

// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import PieChart from "components/charts/PieChart";
import LineChart from "components/charts/LineChart";
import BarChart from "components/charts/BarChart";
import Card from "components/card/Card";
import {
  lineChartOptionsTotalSpent,
  pieChartOptions,
} from "variables/charts";

// Mock Data
const portfolioData = {
  totalValue: 150000,
  dayChange: +2.5,
  avgESG: 85,
  avgFinancial: 78,
  avgSentiment: 92,
  portfolioSplit: [
    { name: "AAPL", value: 50 },
    { name: "MSFT", value: 20 },
    { name: "TSLA", value: 30 }
  ],
  valueHistory: [
    { date: "Mon", value: 145000 },
    { date: "Tue", value: 147000 },
    { date: "Wed", value: 146500 },
    { date: "Thu", value: 148000 },
    { date: "Fri", value: 149000 },
    { date: "Sat", value: 149500 },
    { date: "Sun", value: 150000 }
  ],
  carbonEmissions: [
    { date: "Mon", value: 250 },
    { date: "Tue", value: 230 },
    { date: "Wed", value: 220 },
    { date: "Thu", value: 240 },
    { date: "Fri", value: 235 },
    { date: "Sat", value: 225 },
    { date: "Sun", value: 220 }
  ],
  companies: [
    {
      name: "Apple Inc.",
      value: 75000,
      esgScore: 88,
      financialScore: 92,
      sentimentScore: 85
    },
    {
      name: "Microsoft Corp.",
      value: 30000,
      esgScore: 85,
      financialScore: 90,
      sentimentScore: 88
    },
    {
      name: "Tesla Inc.",
      value: 45000,
      esgScore: 82,
      financialScore: 75,
      sentimentScore: 78
    }
  ]
};

export default function Dashboard() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  
  // Chart configurations
  const pieChartData = portfolioData.portfolioSplit.map(item => item.value);
  
  const lineChartData = [{
    name: "Portfolio Value",
    data: portfolioData.valueHistory.map(item => item.value)
  }];
  
  const barChartData = [{
    name: "Carbon Emissions",
    data: portfolioData.carbonEmissions.map(item => item.value)
  }];

  // Chart options configurations
  const updatedPieChartOptions = {
    chart: {
      type: 'pie',
    },
    labels: portfolioData.portfolioSplit.map(item => item.name),
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.labels[opts.seriesIndex]
      }
    }
  };

  const lineChartOptions = {
    chart: {
      toolbar: { show: false },
      type: 'line',
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
    },
    yaxis: {
      title: {
        text: 'Value (AUD)',
        style: {
          color: "#A3AED0",
        }
      },
      labels: {
        formatter: function(value) {
          return 'AUD ' + value.toLocaleString()
        },
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return 'AUD ' + value.toLocaleString()
        }
      }
    }
  };

  const barChartOptions = {
    chart: {
      toolbar: { show: false },
      type: 'bar',
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: '40%',
      }
    },
    dataLabels: {
      enabled: false,  // Remove number text from bars
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
    },
    yaxis: {
      title: {
        text: 'Carbon Emissions (tons)',
        style: {
          color: "#A3AED0",
        }
      },
      labels: {
        formatter: function(value) {
          return value + ' tons'
        },
        style: {
          colors: "#A3AED0",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value + ' tons'
        }
      }
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Stats */}
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          title="Portfolio Value"
          amount={`$${portfolioData.totalValue.toLocaleString()}`}
          percentage={portfolioData.dayChange}
          isUp={portfolioData.dayChange > 0}
        />
        <MiniStatistics
          title="ESG Score"
          amount={portfolioData.avgESG}
        />
        <MiniStatistics
          title="Financial Score"
          amount={portfolioData.avgFinancial}
        />
        <MiniStatistics
          title="Public Sentiment"
          amount={portfolioData.avgSentiment}
        />
      </SimpleGrid>

      {/* Charts */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap='20px' mb='20px'>
        {/* Portfolio Distribution */}
        <Card p='20px' display="flex" flexDirection="column">
          <Text color={textColor} fontSize='lg' fontWeight='700' mb='4'>
            Portfolio Distribution
          </Text>
          <Box flex="1" display="flex" alignItems="center" justifyContent="center">
            <PieChart
              chartData={pieChartData}
              chartOptions={updatedPieChartOptions}
            />
          </Box>
        </Card>

        {/* Portfolio Value */}
        <Card p='20px'>
          <Text color={textColor} fontSize='lg' fontWeight='700' mb='4'>
            Portfolio Value
          </Text>
          <LineChart
            h='300px'
            w='100%'
            chartData={lineChartData}
            chartOptions={lineChartOptions}
          />
        </Card>

        {/* Carbon Emissions */}
        <Card p='20px'>
          <Text color={textColor} fontSize='lg' fontWeight='700' mb='4'>
            Carbon Emissions
          </Text>
          <BarChart
            h='300px'
            w='100%'
            chartData={barChartData}
            chartOptions={barChartOptions}
          />
        </Card>
      </SimpleGrid>

      {/* Companies Table */}
      <Card p='20px'>
        <Text color={textColor} fontSize='lg' fontWeight='700' mb='4'>
          Portfolio Companies
        </Text>
        <Box overflowX="auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px' }}>Company</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Value</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>ESG Score</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Financial Score</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Sentiment Score</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.companies.map((company, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px' }}>{company.name}</td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>${company.value.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>{company.esgScore}</td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>{company.financialScore}</td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>{company.sentimentScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Card>
    </Box>
  );
}