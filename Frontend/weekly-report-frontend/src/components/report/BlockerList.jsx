import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import Button from "../common/Button";

export default function BlockerList({ control, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "blockers",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Blockers / Issues
        </label>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => append({ description: "", keyIssue: false })}
          className="flex items-center gap-1"
        >
          <Plus size={14} /> Add Blocker
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-gray-500 italic">No blockers added.</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-3">
            <div className="flex-1">
              <input
                {...register(`blockers.${index}.description`)}
                placeholder="Describe blocker..."
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              />
            </div>
            <label className="flex items-center gap-1.5 text-sm text-gray-700 mt-2">
              <input
                type="checkbox"
                {...register(`blockers.${index}.keyIssue`)}
              />
              Key Issue
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-gray-400 hover:text-red-500 mt-1.5"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
