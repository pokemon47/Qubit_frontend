import { AddIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

// Custom components
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import BarChart from "components/charts/BarChart";
import LineChart from "components/charts/LineChart";
import PieChart from "components/charts/PieChart";

const apikeySentiment = "ade3668a3d3b62e96858f79361c35f75657285b4c251e94d660ffe9f29120d40";

let initialData = {
  valueHistory: [
    { date: "2025-04-14", value: 1450 },
    { date: "2025-04-15", value: 1470 },
    { date: "2025-04-16", value: 1460 },
    { date: "2025-04-17", value: 2080 },
    { date: "2025-04-18", value: 2590 },
    { date: "2025-04-19", value: 3095 },
    { date: "2025-04-20", value: 4500 }
  ],
  carbonEmissions: [
    { date: "Mon", value: 250 },
    { date: "Tue", value: 230 },
    { date: "Wed", value: 220 },
    { date: "Thu", value: 240 },
    { date: "Fri", value: 235 },
    { date: "Sat", value: 225 },
    { date: "Sun", value: 220 }
  ]
};

const initialSymbols = [
  { symbol: "AAPL", units: 5 },
  { symbol: "MSFT", units: 10 }
];

export default function Dashboard() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [symbol, setSymbol] = useState("");
  const [units, setUnits] = useState("");
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(false);
  const [summaryData, setSummaryData] = useState({
    totalValue: 0,
    avgESG: 0,
    avgFinancial: 0,
    avgSentiment: 0
  });
  const [pieChartData, setPieChartData] = useState([]);
  const [pieChartOptions, setPieChartOptions] = useState({});

  const [lineChartData, setLineChartData] = useState([]);
  const [lineChartOptions, setLineChartOptions] = useState({});

  const getDailyChange = async (symbol) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
  
    const format = (date) => date.toISOString().split("T")[0];
    const startDate = format(yesterday);
    const endDate = format(today);
    const res = await axios.get(
      `https://8a38hm2y70.execute-api.ap-southeast-2.amazonaws.com/v1/stocks/historical/${symbol}?start_date=${startDate}&end_date=${endDate}&interval=1d`
    );
  
    const rawData = res.data.historical_data[0];
    console.log(rawData);
    const prevClose = rawData.open;
    const currClose = rawData.close;
    const dailyChange = currClose - prevClose;
    const dailyChangePercent = (dailyChange / prevClose) * 100;
    return { dailyChange, dailyChangePercent };

  };
  

  const fetchInitialData = async () => {
    try {
      const updatedCompanies = await Promise.all(
        initialSymbols.map(async ({ symbol, units }) => {
          const overviewRes = await axios.get(`https://8a38hm2y70.execute-api.ap-southeast-2.amazonaws.com/v1/stocks/overview/${symbol}`);
          const currentPrice = overviewRes.data.currentPrice;
          const name = overviewRes.data.name;
          const { dailyChange, dailyChangePercent } = await getDailyChange(symbol);
          return {
            symbol,
            name,
            units,
            currentPrice,
            dailyChange,
            dailyChangePercent,
            value: currentPrice * units,
            esgScore: 85,
            financialScore: 78,
            sentimentScore: 92
          };
        })
      );

      setCompanies(updatedCompanies);
      const totalValue = updatedCompanies.reduce((sum, c) => sum + c.currentPrice * c.units, 0);
      setSummaryData(prev => ({
        ...prev,
        totalValue
      }));
    } catch (err) {
      console.log("Failed to fetch initial data", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAddStock = async () => {
    setError(false);
    try {
      const overviewRes = await axios.get(`https://8a38hm2y70.execute-api.ap-southeast-2.amazonaws.com/v1/stocks/overview/${symbol}`);
      const currentPrice = overviewRes.data.currentPrice;
      const name = overviewRes.data.name;
      const symbolUpper = symbol.toUpperCase();

      const { dailyChange, dailyChangePercent } = await getDailyChange(symbol);

      const updatedCompanies = [...companies];
      const index = updatedCompanies.findIndex(c => c.symbol.toLowerCase() === symbol.toLowerCase());

      if (index !== -1) {
        updatedCompanies[index].units += Number(units);
        updatedCompanies[index].currentPrice = currentPrice;
        updatedCompanies[index].dailyChange = dailyChange;
        updatedCompanies[index].dailyChangePercent = dailyChangePercent;
        updatedCompanies[index].value += currentPrice * Number(units)
      } else {
        updatedCompanies.push({
          symbol: symbolUpper,
          name,
          units: Number(units),
          currentPrice,
          dailyChange,
          dailyChangePercent,
          value: currentPrice * Number(units),
          esgScore: 85,
          financialScore: 78,
          sentimentScore: 92
        });
      }

      setCompanies(updatedCompanies);
      console.log(companies);
      const totalValue = updatedCompanies.reduce((sum, c) => sum + c.currentPrice * c.units, 0);
      setSummaryData(prev => ({
        ...prev,
        totalValue
      }));
      setSymbol("");
      setUnits("");
      onClose();
    } catch (err) {
      console.error("API error:", err);
      setError(true);
    }
  };

  useEffect(() => {
    // PIE CHART
    if (summaryData.totalValue > 0 && companies.length > 0) {
      const pieChartData = companies
        .map(item => Math.round(Number(item.value) / summaryData.totalValue * 100))
        .filter(val => !isNaN(val));
  
      const pieChartLabels = companies
        .map(item => item.name?.toString?.())
        .filter(name => typeof name === "string");

      setPieChartData(pieChartData);
      setPieChartOptions(pieChartLabels);
    } else {
      // fallback when data is missing or total is zero
      setPieChartData([]);
      setPieChartOptions({
        chart: { type: 'pie' },
        labels: [],
        legend: { show: false },
        dataLabels: { enabled: false }
      });
    }

    // LINE CHART
    if (summaryData.totalValue > 0) {
      const today = new Date().toISOString().split("T")[0]; // "2025-04-23"
      const existingIndex = initialData.valueHistory.findIndex(item => item.date === today);
    
      if (existingIndex !== -1) {
        initialData.valueHistory[existingIndex].value = summaryData.totalValue;
      } else {
        initialData.valueHistory.push({
          date: today,
          value: summaryData.totalValue,
        });
      }
    }
    
    setLineChartData([{
      name: "Portfolio Value",
      data:  initialData.valueHistory.map(item => item.value)
    }]);
    
    setLineChartOptions({
      chart: { toolbar: { show: false }, type: 'line' },
      xaxis: {
        categories: initialData.valueHistory.map(item =>
          new Date(item.date).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })
        ),
        labels: { style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" } }
      },
      yaxis: {
        title: { text: 'Value (AUD)', style: { color: "#A3AED0" } },
        labels: {
          formatter: value => 'AUD ' + value.toLocaleString(),
          style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" }
        }
      },
      tooltip: {
        y: { formatter: value => 'AUD ' + value.toLocaleString() }
      }
    });
  }, [companies, summaryData.totalValue]);


  const barChartData = [{
    name: "Carbon Emissions",
    data: initialData.carbonEmissions.map(item => item.value)
  }];

  const barChartOptions = {
    chart: { toolbar: { show: false }, type: 'bar' },
    plotOptions: {
      bar: { borderRadius: 5, columnWidth: '40%' }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: { style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" } }
    },
    yaxis: {
      title: { text: 'Carbon Emissions (tons)', style: { color: "#A3AED0" } },
      labels: {
        formatter: value => value + ' tons',
        style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" }
      }
    },
    tooltip: { y: { formatter: value => value + ' tons' } }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap='20px' mb='20px'>
        <MiniStatistics name="Portfolio Value" value={`$${summaryData.totalValue.toLocaleString()}`}/>
        <MiniStatistics name="ESG Score" value={summaryData.avgESG} />
        <MiniStatistics name="Financial Score" value={summaryData.avgFinancial} />
        <MiniStatistics name="Public Sentiment" value={summaryData.avgSentiment} />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap='20px' mb='20px'>
        <Card p='20px' display="flex" flexDirection="column">
          <Text color={textColor} fontSize='lg' fontWeight='700' mb='4'>
            Portfolio Distribution
          </Text>
          <Box flex="1" display="flex" alignItems="center" justifyContent="center">
            <PieChart chartData={pieChartData} chartLabels={pieChartOptions} />
          </Box>
        </Card>

        <Card p='20px'>
          <Text color={textColor} fontSize='lg' fontWeight='700' mb='4'>Portfolio Value</Text>
          <LineChart h='300px' w='100%' chartData={lineChartData} chartOptions={lineChartOptions} />
        </Card>

        <Card p='20px'>
          <Text color={textColor} fontSize='lg' fontWeight='700' mb='4'>Carbon Emissions</Text>
          <BarChart h='300px' w='100%' chartData={barChartData} chartOptions={barChartOptions} />
        </Card>
      </SimpleGrid>

      <Card p='20px'>
        <Text color={textColor} fontSize='lg' fontWeight='700' mb='4'>
          Portfolio Companies
          <IconButton icon={<AddIcon />} size='sm' ml='10px' onClick={onOpen} aria-label='Add new stock' />
        </Text>
        <Box overflowX="auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px' }}>Company</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Today's Change</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Market Value</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>ESG Score</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Financial Score</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Sentiment Score</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px' }}>{company.name}</td>
                  <td style={{
                    textAlign: 'right',
                    padding: '12px',
                    color: company.dailyChange < 0 ? 'red' : 'green'
                  }}>
                    {company.dailyChange !== undefined && company.dailyChangePercent !== undefined ? (
                      company.dailyChange >= 0
                        ? `+$${company.dailyChange.toFixed(2)} (+${company.dailyChangePercent.toFixed(2)}%)`
                        : `-$${Math.abs(company.dailyChange).toFixed(2)} (${company.dailyChangePercent.toFixed(2)}%)`
                    ) : (
                      "N/A"
                    )}
                  </td>
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

      
      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(2px)" />
        <ModalContent>
          <ModalHeader>Add New Stock</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                Error in fetching details, try again
              </Alert>
            )}
            <FormControl>
              <FormLabel>Ticker Symbol</FormLabel>
              <Input placeholder="e.g. AAPL" value={symbol} onChange={e => setSymbol(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Units Bought</FormLabel>
              <Input type="number" placeholder="e.g. 10" value={units} onChange={e => setUnits(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleAddStock}>Add</Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
