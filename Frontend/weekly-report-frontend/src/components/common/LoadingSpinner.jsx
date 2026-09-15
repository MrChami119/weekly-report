export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-12 text-sm text-gray-500">
      {label}
    </div>
  );
}
