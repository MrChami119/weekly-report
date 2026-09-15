import { format } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";

export default function ActivityFeed({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-400 italic">No recent activity.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          {item.action === "Approved" ? (
            <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
          ) : (
            <XCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
          )}
          <div>
            <span className="text-gray-900 font-medium">
              {item.userFullName}
            </span>{" "}
            <span className="text-gray-600">
              {item.action === "Approved"
                ? "'s report was approved"
                : "'s report was sent back for correction"}
            </span>
            <p className="text-xs text-gray-400">
              {format(new Date(item.timestamp), "MMM d, yyyy HH:mm")}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
