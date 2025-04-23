import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  Container,
} from "@chakra-ui/react";
import CompanyCard from "components/card/Companycard"; // Assuming you have a Card component in your project

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Mock function - replace with your actual API call
    const fetchCompanies = async () => {
      try {
        // Replace this with your actual API call
        // const response = await api.searchCompanies(query);
        // setResults(response.data);
        
        // Mocked results for demonstration
        setTimeout(() => {
          setResults([
            { id: 1, name: `${query}`, description: "Description here", industry: "Technology" },
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setLoading(false);
      }
    };

    if (query) {
      fetchCompanies();
    } else {
      setLoading(false);
    }
  }, [query]);

  return (
    <Container maxW="container.xl" pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Heading mb={6}>Search Results for "{query}"</Heading>
      
      {loading ? (
        <Center p={10}>
          <Spinner size="xl" />
        </Center>
      ) : results.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {results.map(company => (
             <CompanyCard key={company.id} company={company} />
          ))}
        </SimpleGrid>
      ) : (
        <Text>No companies found matching "{query}"</Text>
      )}
    </Container>
  );
}

export default SearchResults;