import { Icon } from '@chakra-ui/react';
import {
  MdBusiness,
  MdHome,
  MdLock,
  MdPerson,
  MdSearch,
  MdExplore
} from 'react-icons/md';

// Admin Imports
import CompanyDetails from 'components/navbar/CompanyDetails';
import SearchResults from 'components/navbar/SearchResults'; // Import the new search results component
import Dashboard from 'views/admin/dashboard';
import Profile from 'views/admin/profile';
import Explore from 'views/admin/explore';


// Auth Imports
import AuthCallback from 'views/auth/callback';
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Dashboard />,
  },
  {
    name: 'Explore',
    layout: '/admin',
    path: '/explore',
    icon: <Icon as={MdExplore} width="20px" height="20px" color="inherit" />,
    component: <Explore />,
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
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
    hideInNav: true
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
    hideInNav: true
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
