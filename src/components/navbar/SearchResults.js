import {
  Center,
  Container,
  Heading,
  SimpleGrid,
  Spinner,
  Text
} from "@chakra-ui/react";
import CompanyCard from "components/card/Companycard"; // Assuming you have a Card component in your project
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTicker = async (name) => {
    try {
      const response = await fetch(`/convert/company_to_ticker?name=${encodeURIComponent(name)}`);
      const data = await response.json();
      return data.ticker || null;
    } catch (error) {
      console.error("Failed to get ticker for:", name, error);
      return null;
    }
  };

  useEffect(() => {
    setLoading(true);
  
    const fetchCompanies = async () => {
      try {
        const ticker = await getTicker(query);
  
        if (ticker) {
          setResults([
            { id: ticker, name: query, ticker: ticker }
          ]);
        } else {
          // No ticker found, set results to empty
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      } finally {
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