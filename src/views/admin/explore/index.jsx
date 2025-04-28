import {
  Container,
  SimpleGrid,
  Heading,
  Box,
} from "@chakra-ui/react";
import { SearchBar } from "components/navbar/searchBar/SearchBar";
import CompanyCard from "components/card/Companycard";

export default function Explore() {
  const mockCompanies = [
    { companyName: "Apple", ticker: "AAPL" },
    { companyName: "Microsoft", ticker: "MSFT" },
    { companyName: "Amazon", ticker: "AMZN" },
    { companyName: "Google", ticker: "GOOGL" },
    { companyName: "Meta", ticker: "META" },
  ];

  return (
    <Container maxW="container.xl" pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Box mb={8}>
        <Heading size="lg" mb={6}>Explore Companies</Heading>
        <SearchBar />
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {mockCompanies.map(company => (
          <CompanyCard key={company.name} company={company} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
