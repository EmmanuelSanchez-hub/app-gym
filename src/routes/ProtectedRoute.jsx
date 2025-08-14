import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children, role }) {
  const { user, role: userRole, loading } = useAuth();

  if (loading) return null; // o un spinner

  if (!user) return <Navigate to="/login" />;

  if (Array.isArray(role)) {
    if (!role.includes(userRole)) return <Navigate to="/login" />;
  } else {
    if (userRole !== role) return <Navigate to="/login" />;
  }

  return children;
}

