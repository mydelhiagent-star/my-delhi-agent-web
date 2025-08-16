import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />; // if not logged in → send back to landing
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (requiredRole && payload.role !== requiredRole) {
      return <Navigate to="/" replace />; // role mismatch → go home
    }
  } catch (err) {
    return <Navigate to="/" replace />;
  }

  return children;
}
