import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const GuestRoute = ({ children }) => {
  const { user, isAuthLoading } = useAuth();

  // while auth is still loading, don't redirect too early
  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  // if user exists, block access to guest pages
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;