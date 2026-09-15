import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import * as reportApi from "../../api/reportApi";
import StatusBadge from "../../components/report/StatusBadge";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Button from "../../components/common/Button";
import { REPORT_STATUS, REPORT_STATUS_LABELS } from "../../utils/constants";
import { Plus } from "lucide-react";

export default function ReportHistoryPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    reportApi
      .getMyReports(statusFilter || null, page, 10)
      .then((res) => {
        setReports(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  const handleRowClick = (report) => {
    if (report.status === "DRAFT" || report.status === "NEEDS_CORRECTION") {
      navigate(`/reports/${report.id}/edit`);
    } else {
      navigate(`/reports/${report.id}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          My Report History
        </h1>
        <Button
          onClick={() => navigate("/reports/new")}
          className="flex items-center gap-1.5"
        >
          <Plus size={16} /> New Report
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-gray-600">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm"
        >
          <option value="">All</option>
          {Object.values(REPORT_STATUS).map((s) => (
            <option key={s} value={s}>
              {REPORT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">
            No reports found.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">
                  Week
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">
                  Project
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => handleRowClick(r)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-2.5 text-gray-900">
                    {format(new Date(r.weekStartDate), "MMM d")} –{" "}
                    {format(new Date(r.weekEndDate), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">
                    {r.projectName || "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">
                    {format(new Date(r.lastUpdatedAt), "MMM d, yyyy HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
