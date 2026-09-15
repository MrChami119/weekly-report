import { REPORT_STATUS_LABELS, REPORT_STATUS_COLORS } from "../../utils/constants";

export default function StatusBadge({ status }) {
  const label = REPORT_STATUS_LABELS[status] || status;
  const colorClass = REPORT_STATUS_COLORS[status] || "bg-gray-100 text-gray-800";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}
