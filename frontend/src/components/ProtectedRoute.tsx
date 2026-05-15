import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, loading } = useAuth();

  // wait until localStorage check finishes
  if (loading) {
    return ;
  }

  // if no token -> redirect
  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}