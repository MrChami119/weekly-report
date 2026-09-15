import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        404 — Page Not Found
      </h1>
      <Link to="/" className="text-indigo-600 hover:underline">
        Go home
      </Link>
    </div>
  );
}
