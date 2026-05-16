import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, loading } = useAuth();

  // wait until auth check finishes
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // no token -> redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // authenticated
  return <>{children}</>;
}