
import { Icon } from '@chakra-ui/react';
import {
  MdBusiness,
  MdHome,
  MdSearch
} from 'react-icons/md';

// Admin Imports
import CompanyDetails from 'components/navbar/CompanyDetails';
import SearchResults from 'components/navbar/SearchResults'; // Import the new search results component
import Dashboard from 'views/admin/dashboard';


// Auth Imports
import AuthCallback from 'views/auth/callback';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Dashboard />,
  },
  {
    name: 'Search Results',
    layout: '/admin',
    path: '/search-results',
    icon: <Icon as={MdSearch} width="20px" height="20px" color="inherit" />,
    component: <SearchResults />,
    hideInNav: true,
  },
  {
    name: 'Company Details',
    layout: '/admin',
    // path: '/company/:companyId',
    path: '/company/:companyName',
    icon: <Icon as={MdBusiness} width="20px" height="20px" color="inherit" />,
    component: <CompanyDetails />,
    hideInNav: true,
  },
  {
    name: 'Auth Callback',
    layout: '/auth',
    path: '/callback',
    component: <AuthCallback />,
    hideInNav: true,
  },
];

export default routes;
