import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export function SearchBar(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { variant, background, children, placeholder, borderRadius, ...rest } = props;
  
  // Chakra Color Mode
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results within the admin layout
      navigate(`/admin/search-results?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ width: "100%" }}>
      <InputGroup w={{ base: "100%", md: "200px" }} {...rest}>
        <InputLeftElement
          children={
            <IconButton
              bg="inherit"
              borderRadius="inherit"
              _hover="none"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
              icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
              onClick={handleSearch}
              type="submit"
            ></IconButton>
          }
        />
        <Input
          variant="search"
          fontSize="sm"
          bg={background ? background : inputBg}
          color={inputText}
          fontWeight="500"
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          borderRadius={borderRadius ? borderRadius : "30px"}
          placeholder={placeholder ? placeholder : "Search Companies"}
          value={searchQuery}
          onChange={handleInputChange}
        />
      </InputGroup>
    </form>
  );
}

export default SearchBar;
