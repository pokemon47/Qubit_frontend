import {
  Container,
  SimpleGrid,
  Heading,
  Box,
} from "@chakra-ui/react";
import { SearchBar } from "components/navbar/searchBar/SearchBar";
import ExploreCompanyCard from "components/card/ExploreCompanyCard";
import { useState } from "react";

export default function Explore() {
  // Mock data for company cards
  const mockCompanies = [
    {
      id: 1,
      name: "Apple Inc.",
      cname: "Apple",
      ticker: "AAPL",
      industry: "Technology",
      description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide."
    },
    {
      id: 2,
      name: "Microsoft Corporation",
      cname: "Microsoft",
      ticker: "MSFT",
      industry: "Technology",
      description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide."
    },
    {
      id: 3,
      name: "Amazon Inc.",
      cname: "Amazon",
      ticker: "AMZN",
      industry: "E-commerce",
      description: "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions worldwide."
    },
    {
      id: 4,
      name: "Alphabet Inc.",
      cname: "Google",
      ticker: "GOOGL",
      industry: "Technology",
      description: "Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, and Asia Pacific."
    },
    {
      id: 5,
      name: "Meta Platforms Inc.",
      cname: "Meta",
      ticker: "META",
      industry: "Technology",
      description: "Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, personal computers, and other surfaces worldwide."
    },
    {
      id: 6,
      name: "Tesla Inc.",
      cname: "Tesla",
      ticker: "TSLA",
      industry: "Automotive",
      description: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems worldwide."
    }
  ];

  return (
    <Container maxW="container.xl" pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Box mb={8}>
        <Heading size="lg" mb={6}>Explore Companies</Heading>
        <SearchBar />
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {mockCompanies.map(company => (
          <ExploreCompanyCard key={company.id} company={company} />
        ))}
      </SimpleGrid>
    </Container>
  );
} 