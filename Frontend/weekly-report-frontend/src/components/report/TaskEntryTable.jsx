import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import Button from "../common/Button";
import { PRIORITY, TASK_STATUS, TASK_STATUS_LABELS } from "../../utils/constants";

export default function TaskEntryTable({ control, register, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Tasks
        </label>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({
            taskName: "",
            priority: PRIORITY.MEDIUM,
            plannedPercent: 0,
            actualPercent: 0,
            status: TASK_STATUS.NOT_STARTED,
            timePlannedHours: 0,
            timeSpentHours: 0,
            outputDeliverable: ""
          })}
          className="flex items-center gap-1"
        >
          <Plus size={14} /> Add Task
        </Button>
      </div>

      {errors?.tasks?.root && (
        <p className="text-xs text-red-600 mb-2">{errors.tasks.root.message}</p>
      )}
      {errors?.tasks?.message && (
        <p className="text-xs text-red-600 mb-2">{errors.tasks.message}</p>
      )}

      {fields.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No tasks added.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-2 py-2 font-medium text-gray-600">Task Name</th>
                <th className="px-2 py-2 font-medium text-gray-600">Priority</th>
                <th className="px-2 py-2 font-medium text-gray-600">Status</th>
                <th className="px-2 py-2 font-medium text-gray-600">% Plan / % Act</th>
                <th className="px-2 py-2 font-medium text-gray-600">Hrs Plan / Hrs Spt</th>
                <th className="px-2 py-2 font-medium text-gray-600">Deliverable</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b border-gray-100">
                  <td className="px-2 py-2 align-top">
                    <input
                      {...register(`tasks.${index}.taskName`)}
                      placeholder="Task name"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    {errors?.tasks?.[index]?.taskName && (
                      <p className="text-xs text-red-500 mt-1">{errors.tasks[index].taskName.message}</p>
                    )}
                  </td>
                  <td className="px-2 py-2 align-top">
                    <select
                      {...register(`tasks.${index}.priority`)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {Object.values(PRIORITY).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2 align-top">
                    <select
                      {...register(`tasks.${index}.status`)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {Object.values(TASK_STATUS).map(s => (
                        <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2 align-top">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        {...register(`tasks.${index}.plannedPercent`)}
                        className="w-12 border border-gray-300 rounded px-1 py-1 text-sm text-center"
                      />
                      <span className="text-gray-400">/</span>
                      <input
                        type="number"
                        {...register(`tasks.${index}.actualPercent`)}
                        className="w-12 border border-gray-300 rounded px-1 py-1 text-sm text-center"
                      />
                    </div>
                  </td>
                  <td className="px-2 py-2 align-top">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        {...register(`tasks.${index}.timePlannedHours`)}
                        className="w-12 border border-gray-300 rounded px-1 py-1 text-sm text-center"
                      />
                      <span className="text-gray-400">/</span>
                      <input
                        type="number"
                        {...register(`tasks.${index}.timeSpentHours`)}
                        className="w-12 border border-gray-300 rounded px-1 py-1 text-sm text-center"
                      />
                    </div>
                  </td>
                  <td className="px-2 py-2 align-top">
                    <input
                      {...register(`tasks.${index}.outputDeliverable`)}
                      placeholder="Deliverable"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-2 py-2 text-right align-top">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-gray-400 hover:text-red-500 mt-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
