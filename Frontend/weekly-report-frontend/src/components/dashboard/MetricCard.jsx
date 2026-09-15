export default function MetricCard({ label, value, accent = "text-gray-900" }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
