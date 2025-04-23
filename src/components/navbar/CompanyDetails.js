import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Spinner,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Center,
  Flex,
  Badge,
  Link,
  Icon,
  Grid,
  GridItem,
  Divider,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import Card from "components/card/Card";

function CompanyDetails() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newsArticles, setNewsArticles] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    // Mock function - replace with your actual API call
    const fetchCompanyDetails = async () => {
      try {
        // Replace with your actual API call
        // const response = await api.getCompanyById(companyId);
        // setCompany(response.data);
        
        // Mocked data for demonstration
        setTimeout(() => {
          const mockCompany = {
            id: companyId,
            name: `Company ${companyId}`,
            description: "This is a detailed description of the company. It includes information about their business model, history, and current operations.",
            industry: "Technology",
            founded: "2010",
            employees: "500-1000",
            revenue: "$50M-$100M",
            headquarters: "San Francisco, CA",
            website: "https://example.com",
            keyMetrics: {
              growthRate: "15%",
              marketShare: "8%",
              customerSatisfaction: "4.5/5"
            }
          };
          
          setCompany(mockCompany);
          setLoading(false);
          
          // Once we have company data, fetch news
          fetchCompanyNews(mockCompany.name);
        }, 800);
      } catch (error) {
        console.error("Error fetching company details:", error);
        setLoading(false);
      }
    };

    const fetchCompanyNews = async (companyName) => {
      try {
        setLoadingNews(true);
        console.log(`Fetching news for company: ${companyName}`);
        
        const response = await fetch(
          `/company/${encodeURIComponent(companyName)}?api_key=hrppk6zHXrrFYM3CHqx0_Q`
        );
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Parsed news data:", data);
    
        // Update state - limit to 4 articles for the details page
        if (data?.events?.length > 0) {
          setNewsArticles(data.events.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch company news:", err);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  // Format date and time
  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Unknown Date';
    const date = new Date(timestamp);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <Container maxW="container.xl" pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Center p={10}>
          <Spinner size="xl" />
        </Center>
      </Container>
    );
  }

  if (!company) {
    return (
      <Container maxW="container.xl" pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Text>Company not found</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Company Overview */}
      <Card mb={6} p={6}>
        <Heading mb={2}>{company.name}</Heading>
        <Text color="gray.500" mb={4}>{company.industry}</Text>
        <Text fontSize="lg" mb={6}>{company.description}</Text>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
          <Stat>
            <StatLabel>Founded</StatLabel>
            <StatNumber>{company.founded}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Employees</StatLabel>
            <StatNumber>{company.employees}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Revenue</StatLabel>
            <StatNumber>{company.revenue}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Headquarters</StatLabel>
            <StatNumber>{company.headquarters}</StatNumber>
          </Stat>
        </SimpleGrid>
        
        <Heading size="md" mb={4}>Key Metrics</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat>
            <StatLabel>Growth Rate</StatLabel>
            <StatNumber>{company.keyMetrics.growthRate}</StatNumber>
            <StatHelpText>Year over Year</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Market Share</StatLabel>
            <StatNumber>{company.keyMetrics.marketShare}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Customer Satisfaction</StatLabel>
            <StatNumber>{company.keyMetrics.customerSatisfaction}</StatNumber>
          </Stat>
        </SimpleGrid>
      </Card>
      
      {/* News Articles Section */}
      <Card mb={6} p={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md">Recent News</Heading>
          <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
            {loadingNews ? "-" : newsArticles.length} articles
          </Badge>
        </Flex>
        
        {loadingNews ? (
          <Center p={10}>
            <Spinner size="lg" />
          </Center>
        ) : newsArticles.length > 0 ? (
          <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
            {newsArticles.map((news, index) => {
              // Get news attributes safely
              const title = news.attribute?.title || 'Untitled Article';
              const publisher = news.attribute?.publisher || 'Unknown Publisher';
              const author = news.attribute?.author ? `by ${news.attribute.author}` : '';
              const publishedAt = news.time_object?.timestamp ? formatDateTime(new Date(news.time_object.timestamp)) : 'Unknown Date';
              const description = news.attribute?.description || 'No description available';
              const url = news.attribute?.url || '#';
              const eventType = news.event_type || 'News';
              
              return (
                <GridItem key={index}>
                  <Box 
                    p={5} 
                    borderWidth="1px" 
                    borderRadius="lg" 
                    overflow="hidden"
                    transition="all 0.3s"
                    _hover={{ boxShadow: "md", borderColor: "blue.200" }}
                  >
                    <Flex justify="space-between" align="start" mb={2}>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.500">{publisher}</Text>
                        {author && <Text fontSize="xs" color="gray.500" ml={1}>{author}</Text>}
                      </Box>
                      <Flex direction="column" align="flex-end">
                        <Text fontSize="xs" color="gray.400">{publishedAt}</Text>
                        <Badge size="sm" colorScheme="gray" mt={1}>{eventType}</Badge>
                      </Flex>
                    </Flex>
                    
                    <Heading size="md" my={2}>{title}</Heading>
                    <Text color="gray.600" mb={4} noOfLines={3}>{description}</Text>
                    
                    <Link 
                      href={url} 
                      isExternal 
                      color="blue.500" 
                      display="inline-flex" 
                      alignItems="center"
                      fontWeight="medium"
                    >
                      Read full article <Icon as={ExternalLinkIcon} ml={1} />
                    </Link>
                  </Box>
                </GridItem>
              );
            })}
          </Grid>
        ) : (
          <Box p={10} textAlign="center" borderWidth="1px" borderRadius="lg">
            <Text color="gray.500">No news articles found for this company.</Text>
          </Box>
        )}
      </Card>
    </Container>
  );
}

export default CompanyDetails;