import { ExternalLinkIcon } from '@chakra-ui/icons';
import axios from "axios";

import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CompanyCard({ company }) {
  const navigate = useNavigate();
  const textColor = useColorModeValue("navy.700", "white");
  const cardBg = useColorModeValue("white", "navy.700");
  const newsCardBg = useColorModeValue("gray.50", "navy.800");
  const newsCardHoverBg = useColorModeValue("gray.100", "navy.900");
  const [scores, setScores] = useState({
    esg: 0,
    financial: 0,
    sentiment: 0
  });

  // Company Profile State
  const [companyName, setCompanyName] = useState(company.name);
  const [companyIndustry, setCompanyIndustry] = useState(company.industry);
  const [companyDescription, setCompanyDescription] = useState(company.description);


  // News state
  const [newsArticles, setNewsArticles] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);


  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await fetch(`https://financialmodelingprep.com/api/v3/profile/${company.ticker}?apikey=oFYyPHWTk9rKrTMI976B0jk9OiVCaTe8`);
        const data = await response.json();

        if (data && data.length > 0) {
          const profile = data[0];
          setCompanyName(profile.companyName);
          setCompanyIndustry(profile.industry);
          setCompanyDescription(profile.description);
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };

    fetchCompanyProfile();
  }, [company.ticker]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
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
    
        // Update state - limit to 2 articles for the card
        if (data?.events?.length > 0) {
          setNewsArticles(data.events.slice(0, 2));
        }

        // get the esg score:
        const symbol = company.ticker;
        const esgRes = await axios.get(`https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/esg/${symbol}`);
        const esg = esgRes.data.historical_ratings[0].total_score;
        const financialScoreRes = await fetch(`http://170.64.162.86/financial-score?ticker=${symbol}`);
        const financialScoreData = await financialScoreRes.json();
        const financial = financialScoreData.score;
        
        setScores({
          ... scores,
          esg,
          financial,  
        })
      } catch (err) {
        console.error("Failed to fetch company news:", err);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, [company.name]);

  const handleViewDetails = () => {
    console.log("Navigating to company ticker:", company.ticker);
    navigate(`/admin/company/${company.ticker}`, { state: { company } });
  };
  

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
    p: "12px",
    borderRadius: "10px",
    boxShadow: "sm",
    textAlign: "center",
    bg: useColorModeValue("gray.50", "gray.700"),
    transition: "all 0.2s",
    _hover: {
      transform: "translateY(-2px)",
      boxShadow: "md",
    }
  };

  return (
    <Card
      p="24px"
      bg={cardBg}
      transition="all 0.3s ease-in-out"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
      }}
      h="100%"
      display="flex"
      flexDirection="column"
    >
      <Flex direction="column" flex="1">
        {/* Company Header */}
        <Heading as="h4" size="md" color={textColor} fontWeight="700" mb="10px">
          {companyName}
        </Heading>
        <Flex gap={2} mb="10px">
          <Badge colorScheme="blue" alignSelf="flex-start">
            {company.ticker}
          </Badge>
          <Badge colorScheme="green" alignSelf="flex-start">
            {companyIndustry}
          </Badge>
        </Flex>
        <Text color="gray.600" fontSize="md" mb="20px" noOfLines={3}>
          {companyDescription}
        </Text>
  
        {/* Scores Section */}
        <Heading size="xs" color="gray.600" mb={3}>COMPANY SCORES</Heading>
        <SimpleGrid columns={3} spacing={4} mb={6}>
          <Box {...scoreCardStyle}>
            <Text fontSize="xs" color="gray.500" mb={1}>ESG Score</Text>
            <Text fontWeight="bold" fontSize="xl" color="green.500">{scores.esg}</Text>
          </Box>
          <Box {...scoreCardStyle}>
            <Text fontSize="xs" color="gray.500" mb={1}>Financial</Text>
            <Text fontWeight="bold" fontSize="xl" color="blue.500">{scores.financial}</Text>
          </Box>
          <Box {...scoreCardStyle}>
            <Text fontSize="xs" color="gray.500" mb={1}>Sentiment</Text>
            <Text fontWeight="bold" fontSize="xl" color="purple.500">{scores.sentiment}</Text>
          </Box>
        </SimpleGrid>
  
        <Divider my={4} />
  
        {/* News Section */}
        <Box mb={5} flex="1">
          <Flex justify="space-between" align="center" mb={3}>
            <Heading size="xs" color="gray.600">RECENT NEWS</Heading>
            <Badge colorScheme="blue" borderRadius="full" px={2}>
              {loadingNews ? "..." : newsArticles.length} articles
            </Badge>
          </Flex>
          
          {loadingNews ? (
            <Flex justify="center" py={4}>
              <Spinner size="sm" color="blue.500" />
            </Flex>
          ) : newsArticles.length > 0 ? (
            newsArticles.map((article, idx) => (
              <Box 
                key={idx} 
                mb={3} 
                p={3} 
                borderRadius="md" 
                bg={newsCardBg}
                transition="all 0.2s"
                _hover={{ bg: newsCardHoverBg }}
              >
                <Flex justify="space-between" align="start" mb={1}>
                  <Text fontSize="xs" color="gray.500">
                    {article?.attribute?.publisher || "Unknown Publisher"}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    {formatDateTime(article?.time_object?.timestamp)}
                  </Text>
                </Flex>
                <Text fontSize="sm" fontWeight="bold" noOfLines={2} mb={1}>
                  {article?.attribute?.title || "Untitled Article"}
                </Text>
                <Text fontSize="xs" color="gray.600" noOfLines={2} mb={2}>
                  {article?.attribute?.description || "No description available"}
                </Text>
                <Link 
                  href={article?.attribute?.url || "#"} 
                  isExternal 
                  fontSize="xs" 
                  color="blue.500"
                  display="flex"
                  alignItems="center"
                >
                  Read full article <Icon as={ExternalLinkIcon} mx={1} />
                </Link>
              </Box>
            ))
          ) : (
            <Box p={4} textAlign="center" bg={newsCardBg} borderRadius="md">
              <Text fontSize="sm" color="gray.500">No news articles found.</Text>
            </Box>
          )}
        </Box>
  
        {/* Button */}
        <Button
          variant="darkBrand"
          color="white"
          fontSize="sm"
          fontWeight="500"
          borderRadius="70px"
          px="24px"
          py="5px"
          onClick={handleViewDetails}
          mt="auto"
        >
          Company Details
        </Button>
      </Flex>
    </Card>
  );
}

export default CompanyCard;