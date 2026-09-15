import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import * as reportApi from "../../api/reportApi";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../components/report/StatusBadge";
import TaskEntryReadOnlyTable from "../../components/report/TaskEntryReadOnlyTable";
import VersionHistoryPanel from "../../components/report/VersionHistoryPanel";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function ReportDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    reportApi
      .getReportDetail(id)
      .then((res) => setReport(res.data))
      .catch((err) =>
        setError(err.response?.data?.error || "Failed to load report"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading report..." />;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (!report) return null;

  const v = report.currentVersion;
  const isManagerOrAdmin = user.role === "MANAGER" || user.role === "ADMIN";
  const canReview = isManagerOrAdmin && report.status === "SUBMITTED";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {report.userFullName}'s Report
          </h1>
          <p className="text-sm text-gray-500">
            {format(new Date(report.weekStartDate), "MMM d")} –{" "}
            {format(new Date(report.weekEndDate), "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={report.status} />
          {canReview && (
            <Button
              onClick={() => navigate(`/manager/reports/${report.id}/review`)}
            >
              Review Report
            </Button>
          )}
        </div>
      </div>

      {v.reviewComment && (
        <div
          className={`rounded-md p-4 text-sm ${
            v.reviewComment.action === "APPROVED"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <p className="font-medium">
            {v.reviewComment.action === "APPROVED"
              ? "Approved"
              : "Changes Requested"}{" "}
            by {v.reviewComment.reviewerName}
          </p>
          {v.reviewComment.comment && (
            <p className="mt-1">{v.reviewComment.comment}</p>
          )}
        </div>
      )}

      <section className="bg-white border border-gray-200 rounded-md p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-3">
          Project: {v.projectName}
        </h2>
        <TaskEntryReadOnlyTable tasks={v.tasks} />
      </section>

      <section className="bg-white border border-gray-200 rounded-md p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-2">
          Tasks Planned for Next Week
        </h2>
        <p className="text-sm text-gray-600 whitespace-pre-wrap">
          {v.tasksPlannedNextWeek || "—"}
        </p>
      </section>

      <section className="bg-white border border-gray-200 rounded-md p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-2">
          Blockers / Challenges
        </h2>
        {v.blockers.length === 0 ? (
          <p className="text-sm text-gray-400 italic">None</p>
        ) : (
          v.blockers.map((b) => (
            <p key={b.id} className="text-sm text-gray-700 mb-1">
              {b.keyIssue && (
                <span className="text-amber-600 font-medium">Key Issue: </span>
              )}
              {b.description}
            </p>
          ))
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-md p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-2">
          Achievements / Highlights
        </h2>
        {v.achievements.length === 0 ? (
          <p className="text-sm text-gray-400 italic">None</p>
        ) : (
          v.achievements.map((a) => (
            <p key={a.id} className="text-sm text-gray-700 mb-1">
              {a.keyAchievement && (
                <span className="text-amber-600 font-medium">
                  Key Achievement:{" "}
                </span>
              )}
              {a.description}
            </p>
          ))
        )}
      </section>

      {v.hoursBreakdown?.length > 0 && (
        <section className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-sm font-medium text-gray-700 mb-2">
            Hours by Task Type
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            {v.hoursBreakdown.map((h) => (
              <span key={h.id}>
                {h.taskType}: <strong>{h.hours}h</strong>
              </span>
            ))}
          </div>
        </section>
      )}

      {v.notesOrLinks && (
        <section className="bg-white border border-gray-200 rounded-md p-4">
          <h2 className="text-sm font-medium text-gray-700 mb-2">
            Notes / Links
          </h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {v.notesOrLinks}
          </p>
        </section>
      )}

      <section>
        <h2 className="text-sm font-medium text-gray-700 mb-2">
          Version History
        </h2>
        <VersionHistoryPanel pastVersions={report.pastVersions} />
      </section>
    </div>
  );
}
