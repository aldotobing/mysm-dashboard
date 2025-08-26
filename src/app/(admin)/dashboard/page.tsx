"use client";

import { useAuth } from "@/context/AuthContext";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default function DashboardPage() {
  const { user } = useAuth();
  useAuthRedirect(); // This will redirect to signin if not authenticated

  // Show loading state while checking auth
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.email || "User"}! Here's what's happening today.
        </p>
      </div>

      <DashboardCharts />
    </div>
  );
}