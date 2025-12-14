import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika route ini khusus admin
  if (adminOnly) {
    const userData =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    let user = null;

    // Parse JSON user
    try {
      user = userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return <Navigate to="/login" replace />;
    }
    // Jika user tidak ada
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    // Jika role bukan admin
    if (adminOnly && Number(user.role_id) !== 1) {
      return <Navigate to="/" replace />;
    }
  }

  // Jika semua lolos → render children
  return <>{children}</>;
}
