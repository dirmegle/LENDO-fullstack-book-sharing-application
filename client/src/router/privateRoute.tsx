import { isAuthenticated } from "@/utils/isAuthenticated";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProp {
    children: ReactNode;
  }
  
  export default function PrivateRoute({ children }: PrivateRouteProp) {
  
    return isAuthenticated() ? children : <Navigate to="/login" />;
  }