import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Next.js Admin Dashboard",
  description: "The page you are looking for could not be found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Sorry, the page you are looking for could not be found.
        </p>
        <div className="mt-6">
          <Link
            href="/signin"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}