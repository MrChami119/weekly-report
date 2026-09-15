import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import * as dashboardApi from "../../api/dashboardApi";
import * as userApi from "../../api/userApi";
import StatusBadge from "../../components/report/StatusBadge";
import MetricCard from "../../components/dashboard/MetricCard";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ArrowLeft } from "lucide-react";

export default function TeamMemberProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getAllUsers().then((res) => {
      const found = res.data.find((u) => String(u.id) === userId);
      setMember(found);
    });
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    dashboardApi
      .filterReports({ userId }, page, 10)
      .then((res) => {
        setReports(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [userId, page]);

  // basic stats derived from the currently loaded page of reports
  // (fine for a small seeded dataset; a production version would compute
  // these server-side across all pages rather than just the visible one)
  const approvedCount = reports.filter((r) => r.status === "APPROVED").length;
  const needsCorrectionCount = reports.filter(
    (r) => r.status === "NEEDS_CORRECTION",
  ).length;
  const submittedCount = reports.filter((r) => r.status === "SUBMITTED").length;

  const handleRowClick = (report) => {
    if (report.status === "SUBMITTED") {
      navigate(`/manager/reports/${report.id}/review`);
    } else {
      navigate(`/reports/${report.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          {member?.fullName || "Loading..."}
        </h1>
        <p className="text-sm text-gray-500">{member?.email}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          label="Approved (this page)"
          value={approvedCount}
          accent="text-green-600"
        />
        <MetricCard
          label="Needs Correction"
          value={needsCorrectionCount}
          accent="text-red-600"
        />
        <MetricCard
          label="Awaiting Review"
          value={submittedCount}
          accent="text-blue-600"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-700">Report History</h2>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">
            No reports found for this member.
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
