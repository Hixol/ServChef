import { Navigate, Outlet } from "react-router";

// Function to handle authentication
const HandleAuth = () => {
  // Retrieving token from localStorage or setting it to null if not found
  const loggedToken = localStorage.getItem("token") || null;
  // Checking if the user is authenticated based on the presence of the token
  const isAuthenticated = loggedToken !== null;
  // Redirecting to the login page if the user is not authenticated
  if (!isAuthenticated) return <Navigate to="login" replace />;
  // Rendering the child components if the user is authenticated
  return <Outlet />;
};

export default HandleAuth;
