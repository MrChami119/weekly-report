import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const STATUS_COLORS = {
  DRAFT: "#9ca3af",
  SUBMITTED: "#3b82f6",
  NEEDS_CORRECTION: "#ef4444",
  APPROVED: "#22c55e",
};

export default function StatusByMemberChart({ data }) {
  // transform [{userFullName, status}] into one row per member with a count-of-1 per status
  const grouped = {};
  data.forEach(({ userFullName, status }) => {
    if (!grouped[userFullName]) grouped[userFullName] = { name: userFullName };
    grouped[userFullName][status] = (grouped[userFullName][status] || 0) + 1;
  });
  const chartData = Object.values(grouped);
  const statuses = Object.keys(STATUS_COLORS);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {statuses.map((s) => (
          <Bar key={s} dataKey={s} stackId="a" fill={STATUS_COLORS[s]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
