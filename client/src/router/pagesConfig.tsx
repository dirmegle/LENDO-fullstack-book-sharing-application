
import BookDetailsPage from "@/pages/bookDetailsPage";
import BooksPage from "@/pages/booksPage";
import DashboardPage from "@/pages/dashboardPage";
import FriendsPage from "@/pages/friendsPage";
import LoginSignupPage from "@/pages/loginSignupPage";
import ReservationsPage from "@/pages/reservationsPage";
import { Navigate } from "react-router-dom";

const pagesConfig = {
    private: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/books',
        element: <BooksPage />,
      },
      {
        path: '/books/:id',
        element: <BookDetailsPage />
      },
      {
        path: '/reservations',
        element: <ReservationsPage />,
      },
      {
        path: '/friends',
        element: <FriendsPage />,
      },
    ],
    public: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: '/login', element: <LoginSignupPage /> },
      { path: '/register', element: <LoginSignupPage /> },
    ],
  };
  
  export default pagesConfig;