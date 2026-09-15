import { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import TaskEntryReadOnlyTable from "./TaskEntryReadOnlyTable";

export default function VersionHistoryPanel({ pastVersions }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!pastVersions || pastVersions.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        No previous versions — this is the first submission.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {pastVersions.map((v) => (
        <div key={v.id} className="border border-gray-200 rounded-md bg-white">
          <button
            onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <div>
              <span className="text-sm font-medium text-gray-900">
                Version {v.versionNumber}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                Submitted{" "}
                {v.submittedAt
                  ? format(new Date(v.submittedAt), "MMM d, yyyy HH:mm")
                  : "—"}
              </span>
              {v.reviewComment && (
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    v.reviewComment.action === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {v.reviewComment.action === "APPROVED"
                    ? "Approved"
                    : "Changes Requested"}
                </span>
              )}
            </div>
            {expandedId === v.id ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {expandedId === v.id && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
              {v.reviewComment && (
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-medium text-gray-700">
                    Review by {v.reviewComment.reviewerName} (
                    {format(
                      new Date(v.reviewComment.reviewedAt),
                      "MMM d, yyyy",
                    )}
                    )
                  </p>
                  {v.reviewComment.comment && (
                    <p className="text-gray-600 mt-1">
                      {v.reviewComment.comment}
                    </p>
                  )}
                </div>
              )}

              <TaskEntryReadOnlyTable tasks={v.tasks} />

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Blockers
                </p>
                {v.blockers.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">None</p>
                ) : (
                  v.blockers.map((b) => (
                    <p key={b.id} className="text-sm text-gray-700">
                      {b.keyIssue && "⭐ "}
                      {b.description}
                    </p>
                  ))
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Achievements
                </p>
                {v.achievements.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">None</p>
                ) : (
                  v.achievements.map((a) => (
                    <p key={a.id} className="text-sm text-gray-700">
                      {a.keyAchievement && "⭐ "}
                      {a.description}
                    </p>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
