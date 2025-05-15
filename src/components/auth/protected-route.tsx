
"use client"
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Role } from "@/context/auth-context";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to sign in
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // If user doesn't have the required role, redirect to appropriate dashboard
  if (!role || !allowedRoles.includes(role)) {
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    } else if (role === "TEACHER") {
      return <Navigate to="/teacher" replace />;
    } else if (role === "STUDENT") {
      return <Navigate to="/student" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // If authenticated and has the correct role, render children
  return <>{children}</>;
}