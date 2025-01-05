
import BookDetailsPage from "@/pages/bookDetailsPage";
import LibraryPage from "@/pages/libraryPage";
import HomePage from "@/pages/homePage";
import FriendsPage from "@/pages/friendsPage";
import LoginSignupPage from "@/pages/loginSignupPage";
import ReservationsPage from "@/pages/reservationsPage";
import { Navigate } from "react-router-dom";

const pagesConfig = {
    private: [
      { index: true, element: <Navigate to="/home" replace /> },
      {
        path: '/home',
        navLinkInfo: {
          pageIconUrl: './src/assets/icons/home.svg',
          linkText: 'Home'
        },
        element: <HomePage />,
      },
      {
        path: '/library',
        navLinkInfo: {
          pageIconUrl: './src/assets/icons/library.svg',
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
          pageIconUrl: './src/assets/icons/reservations.svg',
          linkText: 'Reservations'
        },
        element: <ReservationsPage />,
      },
      {
        path: '/friends',
        navLinkInfo: {
          pageIconUrl: './src/assets/icons/friends.svg',
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