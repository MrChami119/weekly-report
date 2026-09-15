import { TASK_STATUS_LABELS } from "../../utils/constants";

export default function TaskEntryReadOnlyTable({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return <p className="text-sm text-gray-400 italic">No tasks recorded.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-3 py-2 font-medium text-gray-600">
              Task
            </th>
            <th className="text-left px-3 py-2 font-medium text-gray-600">
              Priority
            </th>
            <th className="text-left px-3 py-2 font-medium text-gray-600">
              Planned %
            </th>
            <th className="text-left px-3 py-2 font-medium text-gray-600">
              Actual %
            </th>
            <th className="text-left px-3 py-2 font-medium text-gray-600">
              Status
            </th>
            <th className="text-left px-3 py-2 font-medium text-gray-600">
              Time (planned/spent)
            </th>
            <th className="text-left px-3 py-2 font-medium text-gray-600">
              Output
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className="border-b border-gray-100">
              <td className="px-3 py-2 text-gray-900">{t.taskName}</td>
              <td className="px-3 py-2 text-gray-600">{t.priority}</td>
              <td className="px-3 py-2 text-gray-600">{t.plannedPercent}%</td>
              <td className="px-3 py-2 text-gray-600">{t.actualPercent}%</td>
              <td className="px-3 py-2 text-gray-600">
                {TASK_STATUS_LABELS[t.status]}
              </td>
              <td className="px-3 py-2 text-gray-600">
                {t.timePlannedHours}h / {t.timeSpentHours}h
              </td>
              <td className="px-3 py-2 text-gray-600">
                {t.outputDeliverable || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
