import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import * as reportApi from "../../api/reportApi";
import * as reviewApi from "../../api/reviewApi";
import StatusBadge from "../../components/report/StatusBadge";
import TaskEntryReadOnlyTable from "../../components/report/TaskEntryReadOnlyTable";
import VersionHistoryPanel from "../../components/report/VersionHistoryPanel";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { REVIEW_ACTION } from "../../utils/constants";
import { CheckCircle, XCircle } from "lucide-react";

export default function ReviewReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [actionInProgress, setActionInProgress] = useState(null); // "APPROVE" | "REJECT" | null
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    reportApi
      .getReportDetail(id)
      .then((res) => setReport(res.data))
      .catch((err) =>
        setError(err.response?.data?.error || "Failed to load report"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async () => {
    setActionInProgress("APPROVE");
    setError("");
    try {
      await reviewApi.reviewReport(id, REVIEW_ACTION.APPROVED, null);
      navigate("/manager/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to approve report");
      setActionInProgress(null);
    }
  };

  const handleRequestChanges = async () => {
    if (!comment.trim()) {
      setError("A comment is required when requesting changes");
      return;
    }
    setActionInProgress("REJECT");
    setError("");
    try {
      await reviewApi.reviewReport(
        id,
        REVIEW_ACTION.CHANGES_REQUESTED,
        comment,
      );
      navigate("/manager/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to request changes");
      setActionInProgress(null);
    }
  };

  if (loading) return <LoadingSpinner label="Loading report..." />;
  if (!report) return <p className="text-red-600 text-sm">{error}</p>;

  const v = report.currentVersion;
  const canTakeAction = report.status === "SUBMITTED";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Review: {report.userFullName}'s Report
          </h1>
          <p className="text-sm text-gray-500">
            {format(new Date(report.weekStartDate), "MMM d")} –{" "}
            {format(new Date(report.weekEndDate), "MMM d, yyyy")}
          </p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      {!canTakeAction && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
          This report is not awaiting review (current status: {report.status}).
          No action can be taken.
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
          Previous Versions
        </h2>
        <VersionHistoryPanel pastVersions={report.pastVersions} />
      </section>

      {canTakeAction && (
        <section className="bg-white border border-gray-200 rounded-md p-5 sticky bottom-4 shadow-md">
          <h2 className="text-sm font-medium text-gray-900 mb-3">
            Take Action
          </h2>

          {!showRejectForm ? (
            <div className="flex gap-3">
              <Button
                onClick={handleApprove}
                disabled={actionInProgress !== null}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle size={16} />
                {actionInProgress === "APPROVE" ? "Approving..." : "Approve"}
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowRejectForm(true)}
                disabled={actionInProgress !== null}
                className="flex items-center gap-2"
              >
                <XCircle size={16} />
                Request Changes
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explain what needs to change..."
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={handleRequestChanges}
                  disabled={actionInProgress !== null}
                >
                  {actionInProgress === "REJECT"
                    ? "Sending..."
                    : "Send Back for Correction"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowRejectForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
