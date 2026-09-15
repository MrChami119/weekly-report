import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="p-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-sm text-gray-600">
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="p-1.5 rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
