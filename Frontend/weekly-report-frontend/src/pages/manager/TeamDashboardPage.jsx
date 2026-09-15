import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfWeek } from "date-fns";
import * as dashboardApi from "../../api/dashboardApi";
import * as projectApi from "../../api/projectApi";
import * as userApi from "../../api/userApi";
import MetricCard from "../../components/dashboard/MetricCard";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import TaskTrendChart from "../../components/charts/TaskTrendChart";
import StatusByMemberChart from "../../components/charts/StatusByMemberChart";
import WorkloadByProjectChart from "../../components/charts/WorkloadByProjectChart";
import HoursByTaskTypeChart from "../../components/charts/HoursByTaskTypeChart";
import StatusBadge from "../../components/report/StatusBadge";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { REPORT_STATUS, REPORT_STATUS_LABELS } from "../../utils/constants";

function getCurrentWeekStart() {
  return format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
}

export default function TeamDashboardPage() {
  const navigate = useNavigate();

  const [weekStart, setWeekStart] = useState(getCurrentWeekStart());
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [filters, setFilters] = useState({
    userId: "",
    projectId: "",
    status: "",
  });
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [metrics, setMetrics] = useState(null);
  const [taskTrend, setTaskTrend] = useState([]);
  const [statusByMember, setStatusByMember] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [hoursByType, setHoursByType] = useState([]);
  const [activity, setActivity] = useState([]);

  const [loading, setLoading] = useState(true);

  // static lookups
  useEffect(() => {
    userApi
      .getAllUsers()
      .then((res) =>
        setMembers(res.data.filter((u) => u.role === "TEAM_MEMBER")),
      );
    projectApi.getActiveProjects().then((res) => setProjects(res.data));
  }, []);

  // metrics + charts (depend on weekStart)
  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashboardApi.getMetrics(weekStart),
      dashboardApi.getTaskTrend(),
      dashboardApi.getStatusByMember(weekStart),
      dashboardApi.getWorkloadByProject(),
      dashboardApi.getHoursByTaskType(weekStart),
      dashboardApi.getActivityFeed(8),
    ])
      .then(([m, trend, status, workloadRes, hours, act]) => {
        setMetrics(m.data);
        setTaskTrend(trend.data);
        setStatusByMember(status.data);
        setWorkload(workloadRes.data);
        setHoursByType(hours.data);
        setActivity(act.data);
      })
      .finally(() => setLoading(false));
  }, [weekStart]);

  // filtered report table (depends on filters + page)
  useEffect(() => {
    const params = {
      userId: filters.userId || undefined,
      projectId: filters.projectId || undefined,
      status: filters.status || undefined,
      weekStart,
    };
    dashboardApi.filterReports(params, page, 10).then((res) => {
      setReports(res.data.content);
      setTotalPages(res.data.totalPages);
    });
  }, [filters, page, weekStart]);

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Team Dashboard</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Week of:</label>
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      {loading || !metrics ? (
        <LoadingSpinner label="Loading dashboard..." />
      ) : (
        <>
          {/* Summary metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Submitted This Week"
              value={metrics.totalReportsSubmittedThisWeek}
            />
            <MetricCard
              label="Pending / Not Started"
              value={metrics.pendingCount}
              accent="text-amber-600"
            />
            <MetricCard
              label="Needs Correction"
              value={metrics.needsCorrectionCount}
              accent="text-red-600"
            />
            <MetricCard
              label="Open Blockers"
              value={metrics.openBlockersCount}
              accent="text-red-600"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                Tasks Completed Trend
              </h2>
              <TaskTrendChart data={taskTrend} />
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                Status by Team Member
              </h2>
              <StatusByMemberChart data={statusByMember} />
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                Workload by Project
              </h2>
              <WorkloadByProjectChart data={workload} />
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <h2 className="text-sm font-medium text-gray-700 mb-2">
                Hours by Task Type
              </h2>
              <HoursByTaskTypeChart data={hoursByType} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Filterable report table */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-md p-4">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <select
                  value={filters.userId}
                  onChange={(e) => handleFilterChange("userId", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                >
                  <option value="">All Members</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.projectId}
                  onChange={(e) =>
                    handleFilterChange("projectId", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                >
                  <option value="">All Projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                >
                  <option value="">All Statuses</option>
                  {Object.values(REPORT_STATUS).map((s) => (
                    <option key={s} value={s}>
                      {REPORT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              {reports.length === 0 ? (
                <p className="text-sm text-gray-400 italic py-6 text-center">
                  No reports match these filters.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium text-gray-600">
                        Member
                      </th>
                      <th className="text-left px-3 py-2 font-medium text-gray-600">
                        Project
                      </th>
                      <th className="text-left px-3 py-2 font-medium text-gray-600">
                        Status
                      </th>
                      <th className="text-left px-3 py-2 font-medium text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        {/* <td className="px-3 py-2 text-gray-900">
                          {r.userFullName}
                        </td> */}
                        <td className="px-3 py-2 text-gray-900">
                          <button
                            onClick={() =>
                              navigate(`/manager/team/${r.userId}`)
                            }
                            className="hover:underline hover:text-indigo-600"
                          >
                            {r.userFullName}
                          </button>
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {r.projectName || "—"}
                        </td>
                        <td className="px-3 py-2">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() =>
                              r.status === "SUBMITTED"
                                ? navigate(`/manager/reports/${r.id}/review`)
                                : navigate(`/reports/${r.id}`)
                            }
                            className="text-indigo-600 hover:underline text-xs font-medium"
                          >
                            {r.status === "SUBMITTED" ? "Review" : "View"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>

            {/* Activity feed */}
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <h2 className="text-sm font-medium text-gray-700 mb-3">
                Recent Activity
              </h2>
              <ActivityFeed items={activity} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
