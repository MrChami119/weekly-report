import { TASK_TYPE } from "../../utils/constants";

export default function HoursBreakdownInput({ register }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Hours Worked by Task Type{" "}
        <span className="text-gray-400 font-normal">(optional)</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.values(TASK_TYPE).map((type, index) => (
          <div key={type}>
            <label className="block text-xs text-gray-500 mb-1">{type}</label>
            <input
              type="number"
              step="0.5"
              min="0"
              {...register(`hoursBreakdown.${index}.hours`, {
                valueAsNumber: true,
              })}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
            <input
              type="hidden"
              {...register(`hoursBreakdown.${index}.taskType`)}
              value={type}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
