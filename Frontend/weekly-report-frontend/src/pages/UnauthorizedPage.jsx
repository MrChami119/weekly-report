import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        403 — Unauthorized
      </h1>
      <p className="text-gray-500 mb-6">
        You don't have permission to view this page.
      </p>
      <Link to="/" className="text-indigo-600 hover:underline">
        Go home
      </Link>
    </div>
  );
}
