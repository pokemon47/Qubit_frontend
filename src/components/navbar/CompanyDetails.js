import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  Badge,
  Link,
  Icon,
  Button,
  useColorModeValue,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ExternalLinkIcon, ArrowBackIcon, ExpandIcon } from '@chakra-ui/icons';
import { FiMaximize2 } from 'react-icons/fi'; // Import expand icon from react-icons
import Card from "components/card/Card";
import StockChart from 'components/charts/StockChart';

function CompanyDetails() {
  const { id } = useParams();
  const location = useLocation();
  const company = location.state?.company;
  const [loading, setLoading] = useState(true);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [ticker, setTicker] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [tickerError, setTickerError] = useState(null);
  
  // Modal control for expanded chart
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Color values
  const textColor = useColorModeValue("navy.700", "white");
  const cardBg = useColorModeValue("white", "navy.700");
  const secondaryBg = useColorModeValue("gray.50", "navy.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Mock scores - will be replaced with real data later
  const companyScores = {
    esg: {
      overall: 82,
      environmental: 78,
      social: 88,
      governance: 80
    },
    financial: {
      overall: 76,
      revenue: 85,
      profitability: 72,
      growth: 71
    },
    sentiment: {
      overall: 88,
      media: 84,
      social: 92,
      employees: 89
    }
  };

  useEffect(() => {
    // This would be replaced with a real API call in production
    if (company) {
      setLoading(false);
    } else {
      // If company data wasn't passed via state, fetch it using the ID
      console.log(`Need to fetch company data for ID: ${id}`);
      // Mock fetching company data - replace with actual API call
      setTimeout(() => {
        // Mock data
        setLoading(false);
      }, 800);
    }
  }, [id, company]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!company?.name) return;
        
        console.log(`Fetching news for company: ${company.name}`);
        
        const response = await fetch(
          `/company/${encodeURIComponent(company.name)}?api_key=hrppk6zHXrrFYM3CHqx0_Q`
        );
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const rawText = await response.text();
        if (!rawText) {
          console.error("Empty response from API");
          return;
        }
    
        // Check for HTML response
        if (rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<')) {
          console.error("Received HTML instead of JSON");
          return;
        }
    
        // Parse JSON
        const data = JSON.parse(rawText);
        console.log("Parsed data:", data);
    
        // Update state - limit to 4 articles for the detail page
        if (data?.events?.length > 0) {
          setNewsArticles(data.events.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch company news:", err);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, [company?.name]);

  useEffect(() => {
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    const formatDate = (date) => date.toISOString().split('T')[0];
    setFromDate(formatDate(sixMonthsAgo));
    setToDate(formatDate(today));
  }, []);

  useEffect(() => {
    if (company?.name) {
      fetch(`/convert/company_to_ticker?name=${encodeURIComponent(company.name)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch ticker');
          }
          return response.json();
        })
        .then(data => {
          if (data.ticker) {
            setTicker(data.ticker);
          } else {
            setTickerError('Ticker not found');
          }
        })
        .catch(error => {
          console.error('Error fetching ticker:', error);
          setTickerError('Error fetching ticker');
        });
    }
  }, [company?.name]);

  // Format date function
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Score card styles
  const scoreCardStyle = {
    p: "20px",
    borderRadius: "16px",
    boxShadow: "sm",
    bg: cardBg,
    border: "1px solid",
    borderColor: borderColor,
    transition: "all 0.3s",
    _hover: {
      transform: "translateY(-4px)",
      boxShadow: "md",
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Flex justifyContent="center" alignItems="center" minH="500px">
          <Spinner size="xl" />
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" pt={{ base: "130px", md: "80px", xl: "80px" }} pb={10}>
      <Button 
        leftIcon={<ArrowBackIcon />} 
        variant="ghost" 
        mb={6} 
        onClick={() => window.history.back()}
      >
        Back
      </Button>
      
      {/* Company Header */}
      <Box mb={10}>
        <Heading as="h1" size="xl" mb={3}>{company?.name}</Heading>
        <Badge colorScheme="blue" mb={4}>{company?.industry}</Badge>
        <Text color="gray.600" fontSize="md">
          {company?.description}
        </Text>
      </Box>

      {/* Tabs for different sections */}
      <Tabs variant="soft-rounded" colorScheme="blue" mb={8}>
        <TabList mb={6}>
          <Tab>Overview</Tab>
          <Tab>Scores</Tab>
          <Tab>News</Tab>
        </TabList>
        
        <TabPanels>
          {/* Overview Tab */}
          <TabPanel px={0}>
            <Box mb={12}>
              <Heading as="h3" size="md" mb={6}>Key Metrics</Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel color="gray.500">ESG Score</StatLabel>
                    <StatNumber color="green.500">{companyScores.esg.overall}</StatNumber>
                    <StatHelpText>Environmental, Social, Governance</StatHelpText>
                  </Stat>
                </Card>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel color="gray.500">Financial Health</StatLabel>
                    <StatNumber color="blue.500">{companyScores.financial.overall}</StatNumber>
                    <StatHelpText>Revenue, Growth, Profitability</StatHelpText>
                  </Stat>
                </Card>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel color="gray.500">Sentiment Analysis</StatLabel>
                    <StatNumber color="purple.500">{companyScores.sentiment.overall}</StatNumber>
                    <StatHelpText>Media, Social, Employee</StatHelpText>
                  </Stat>
                </Card>
              </SimpleGrid>
            </Box>

            {/* Stock Chart Section with expand button */}
            <Box mb={16}>
              <Flex align="center" justify="space-between" mb={6}>
                <Heading as="h3" size="md">Stock Price Chart</Heading>
                {ticker && (
                  <IconButton
                    aria-label="Expand chart"
                    icon={<FiMaximize2 />}
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    onClick={onOpen}
                    title="Expand chart"
                  />
                )}
              </Flex>
              <Box height="400px" mb={4} position="relative">
                {ticker ? (
                  <StockChart symbol={ticker} from={fromDate} to={toDate} />
                ) : tickerError ? (
                  <Text color="red.500">{tickerError}</Text>
                ) : (
                  <Flex justify="center" align="center" height="100%">
                    <Spinner size="md" color="blue.500" mr={3} />
                    <Text>Loading stock chart...</Text>
                  </Flex>
                )}
              </Box>
            </Box>

            

            {/* Top News Preview */}
            <Box mb={8}>
              <Heading as="h3" size="md" mb={6}>Recent News</Heading>
              {loadingNews ? (
                <Flex justify="center" py={6}>
                  <Spinner size="md" color="blue.500" />
                </Flex>
              ) : newsArticles.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {newsArticles.slice(0, 2).map((article, idx) => (
                    <Box 
                      key={idx} 
                      p={5} 
                      borderRadius="md" 
                      bg={secondaryBg}
                      boxShadow="sm"
                      transition="all 0.2s"
                      _hover={{ boxShadow: "md" }}
                    >
                      <Text fontSize="sm" fontWeight="bold" noOfLines={2} mb={3}>
                        {article?.attribute?.title || "Untitled Article"}
                      </Text>
                      <Flex justify="space-between" align="center" mb={3}>
                        <Text fontSize="xs" color="gray.500">
                          {article?.attribute?.publisher || "Unknown"}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {formatDateTime(article?.time_object?.timestamp)}
                        </Text>
                      </Flex>
                      <Link 
                        href={article?.attribute?.url || "#"} 
                        isExternal 
                        fontSize="xs" 
                        color="blue.500"
                        display="flex"
                        alignItems="center"
                      >
                        Read article <Icon as={ExternalLinkIcon} mx={1} />
                      </Link>
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <Text color="gray.500" py={4}>No news articles found.</Text>
              )}
            </Box>
          </TabPanel>

          {/* Scores Tab */}
          <TabPanel px={0}>
            {/* ESG Scores */}
            <Box mb={12}>
              <Heading as="h3" size="md" mb={6}>ESG Performance</Heading>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel>Overall ESG</StatLabel>
                    <StatNumber color="green.500">{companyScores.esg.overall}</StatNumber>
                  </Stat>
                </Card>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel>Environmental</StatLabel>
                    <StatNumber color="green.400">{companyScores.esg.environmental}</StatNumber>
                  </Stat>
                </Card>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel>Social</StatLabel>
                    <StatNumber color="green.400">{companyScores.esg.social}</StatNumber>
                  </Stat>
                </Card>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel>Governance</StatLabel>
                    <StatNumber color="green.400">{companyScores.esg.governance}</StatNumber>
                  </Stat>
                </Card>
              </SimpleGrid>
            </Box>

            {/* Financial Scores */}
            <Box mb={12}>
              <Heading as="h3" size="md" mb={6}>Financial Health</Heading>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel>Overall Financial</StatLabel>
                    <StatNumber color="blue.500">{companyScores.financial.overall}</StatNumber>
                  </Stat>
                </Card>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel>Revenue</StatLabel>
                    <StatNumber color="blue.400">{companyScores.financial.revenue}</StatNumber>
                  </Stat>
                </Card>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel>Profitability</StatLabel>
                    <StatNumber color="blue.400">{companyScores.financial.profitability}</StatNumber>
                  </Stat>
                </Card>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel>Growth</StatLabel>
                    <StatNumber color="blue.400">{companyScores.financial.growth}</StatNumber>
                  </Stat>
                </Card>
              </SimpleGrid>
            </Box>

            {/* Sentiment Scores */}
            <Box mb={8}>
              <Heading as="h3" size="md" mb={6}>Sentiment Analysis</Heading>
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel>Overall Sentiment</StatLabel>
                    <StatNumber color="purple.500">{companyScores.sentiment.overall}</StatNumber>
                  </Stat>
                </Card>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel>Media</StatLabel>
                    <StatNumber color="purple.400">{companyScores.sentiment.media}</StatNumber>
                  </Stat>
                </Card>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel>Social Media</StatLabel>
                    <StatNumber color="purple.400">{companyScores.sentiment.social}</StatNumber>
                  </Stat>
                </Card>
                <Card {...scoreCardStyle}>
                  <Stat>
                    <StatLabel>Employee</StatLabel>
                    <StatNumber color="purple.400">{companyScores.sentiment.employees}</StatNumber>
                  </Stat>
                </Card>
              </SimpleGrid>
            </Box>
          </TabPanel>

          {/* News Tab */}
          <TabPanel px={0}>
            <Box mb={6}>
              <Heading as="h3" size="md" mb={6}>Company News Articles</Heading>
              {loadingNews ? (
                <Flex justify="center" py={8}>
                  <Spinner size="md" color="blue.500" />
                </Flex>
              ) : newsArticles.length > 0 ? (
                <>
                  <Text color="gray.500" mb={6}>
                    Showing {newsArticles.length} recent news articles about {company?.name}
                  </Text>
                  {newsArticles.map((article, idx) => (
                    <Box 
                      key={idx} 
                      p={6} 
                      borderRadius="lg" 
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      mb={6}
                      boxShadow="sm"
                      transition="all 0.2s"
                      _hover={{ boxShadow: "md" }}
                    >
                      <Flex justify="space-between" align="start" mb={3}>
                        <Badge colorScheme="blue">
                          {article?.attribute?.publisher || "Unknown Publisher"}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          {formatDateTime(article?.time_object?.timestamp)}
                        </Text>
                      </Flex>
                      <Heading size="sm" mb={3}>
                        {article?.attribute?.title || "Untitled Article"}
                      </Heading>
                      <Text color="gray.600" mb={4}>
                        {article?.attribute?.description || "No description available"}
                      </Text>
                      <Link 
                        href={article?.attribute?.url || "#"} 
                        isExternal 
                        color="blue.500"
                        fontWeight="medium"
                        display="flex"
                        alignItems="center"
                        width="fit-content"
                      >
                        Read full article <Icon as={ExternalLinkIcon} mx={1} />
                      </Link>
                    </Box>
                  ))}
                </>
              ) : (
                <Text color="gray.500" py={4}>No news articles found for {company?.name}.</Text>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modal for expanded chart */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent maxW="900px">
          <ModalHeader>
            {ticker && `${company?.name} (${ticker}) Stock Chart`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box height="600px">
              {ticker && (
                <StockChart symbol={ticker} from={fromDate} to={toDate} />
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default CompanyDetails;