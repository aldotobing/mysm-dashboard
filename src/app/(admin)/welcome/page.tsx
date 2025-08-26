"use client";

import { useAuth } from "@/context/AuthContext";
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function WelcomePage() {
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You have successfully logged in as <span className="font-semibold">{user?.email || "User"}</span>
          </p>
          
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4">
              Getting Started
            </h2>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Use the sidebar menu to navigate through the different sections of the admin dashboard.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-900 dark:text-white">Dashboard</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  View your main dashboard metrics
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-900 dark:text-white">Products</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  Manage your product catalog
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-900 dark:text-white">Orders</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  View and process customer orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}