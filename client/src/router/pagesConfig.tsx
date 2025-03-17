
import BookDetailsPage from "@/pages/BookDetailsPage";
import LibraryPage from "@/pages/LibraryPage";
import HomePage from "@/pages/HomePage";
import FriendsPage from "@/pages/FriendsPage";
import LoginSignupPage from "@/pages/LoginSignupPage";
import ReservationsPage from "@/pages/ReservationsPage";
import { Navigate } from "react-router-dom";
import homeIcon from "@/assets/icons/home.svg"
import libraryIcon from "@/assets/icons/library.svg"
import reservationsIcon from "@/assets/icons/reservations.svg"
import friendsIcon from "@/assets/icons/friends.svg"

const pagesConfig = {
    private: [
      { index: true, element: <Navigate to="/home" replace /> },
      {
        path: '/home',
        navLinkInfo: {
          pageIconUrl: homeIcon,
          linkText: 'Home'
        },
        element: <HomePage />,
      },
      {
        path: '/library',
        navLinkInfo: {
          pageIconUrl: libraryIcon,
          linkText: 'Library'
        },
        element: <LibraryPage />,
      },
      {
        path: '/books/:id',
        element: <BookDetailsPage />
      },
      {
        path: '/reservations',
        navLinkInfo: {
          pageIconUrl: reservationsIcon,
          linkText: 'Reservations'
        },
        element: <ReservationsPage />,
      },
      {
        path: '/friends',
        navLinkInfo: {
          pageIconUrl: friendsIcon,
          linkText: 'Friends'
        },
        element: <FriendsPage />,
      },
    ],
    public: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: '/login', element: <LoginSignupPage /> },
      { path: '/register', element: <LoginSignupPage /> },
    ],
  };

  export const getNavLinks = () =>
    pagesConfig.private
      .filter((configItem) => configItem.navLinkInfo)
      .map((configItem) => ({
        path: configItem.path!,
        pageIconUrl: configItem.navLinkInfo!.pageIconUrl,
        linkText: configItem.navLinkInfo!.linkText,
      }));
  
  export default pagesConfig;