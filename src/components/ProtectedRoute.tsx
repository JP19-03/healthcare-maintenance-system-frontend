import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white px-4">
        <div className="max-w-md bg-slate-800 border border-slate-700 rounded-xl p-6 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            Unauthorized Access
          </h2>
          <p className="text-slate-300 mb-6">
            Your role{" "}
            <span className="font-semibold text-teal-400">({user.role})</span>{" "}
            does not have permission to access this page.
          </p>
          <a
            href="/"
            className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2.5 rounded-lg transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
