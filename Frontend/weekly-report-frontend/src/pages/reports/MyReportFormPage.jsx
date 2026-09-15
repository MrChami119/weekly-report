import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as reportApi from "../../api/reportApi";
import * as projectApi from "../../api/projectApi";
import TaskEntryTable from "../../components/report/TaskEntryTable";
import BlockerList from "../../components/report/BlockerList";
import AchievementList from "../../components/report/AchievementList";
import HoursBreakdownInput from "../../components/report/HoursBreakdownInput";
import StatusBadge from "../../components/report/StatusBadge";
import Button from "../../components/common/Button";
import { TASK_TYPE } from "../../utils/constants";

const reportSchema = z.object({
  weekStartDate: z.string().min(1, "Required"),
  weekEndDate: z.string().min(1, "Required"),
  projectId: z.coerce.number({ invalid_type_error: "Select a project" }),
  tasks: z
    .array(
      z.object({
        taskName: z.string().min(1, "Task name required"),
        priority: z.string(),
        plannedPercent: z.coerce.number().min(0).max(100),
        actualPercent: z.coerce.number().min(0).max(100),
        status: z.string(),
        timePlannedHours: z.coerce.number().min(0),
        timeSpentHours: z.coerce.number().min(0),
        outputDeliverable: z.string().optional(),
      }),
    )
    .min(1, "Add at least one task before submitting"),
  blockers: z.array(
    z.object({
      description: z.string().min(1, "Description required"),
      keyIssue: z.boolean(),
    }),
  ),
  achievements: z.array(
    z.object({
      description: z.string().min(1, "Description required"),
      keyAchievement: z.boolean(),
    }),
  ),
  hoursBreakdown: z.array(
    z.object({
      taskType: z.string(),
      hours: z.coerce.number().min(0),
    }),
  ),
  tasksPlannedNextWeek: z.string().optional(),
  notesOrLinks: z.string().optional(),
});

const defaultHours = Object.values(TASK_TYPE).map((type) => ({
  taskType: type,
  hours: 0,
}));

export default function MyReportFormPage() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [reportStatus, setReportStatus] = useState(null);
  const [reviewComment, setReviewComment] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      weekStartDate: "",
      weekEndDate: "",
      projectId: "",
      tasks: [],
      blockers: [],
      achievements: [],
      hoursBreakdown: defaultHours,
      tasksPlannedNextWeek: "",
      notesOrLinks: "",
    },
  });

  useEffect(() => {
    projectApi.getActiveProjects().then((res) => setProjects(res.data));
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    reportApi.getReportDetail(id).then((res) => {
      const report = res.data;
      const v = report.currentVersion;
      setReportStatus(report.status);
      setReviewComment(v.reviewComment);

      reset({
        weekStartDate: report.weekStartDate,
        weekEndDate: report.weekEndDate,
        projectId: v.projectId,
        tasks: v.tasks,
        blockers: v.blockers,
        achievements: v.achievements,
        hoursBreakdown: v.hoursBreakdown.length
          ? v.hoursBreakdown
          : defaultHours,
        tasksPlannedNextWeek: v.tasksPlannedNextWeek || "",
        notesOrLinks: v.notesOrLinks || "",
      });
      setLoading(false);
    });
  }, [id]);

  const onSaveDraft = async (data) => {
    setServerError("");
    setSaving(true);
    try {
      if (isEditMode) {
        await reportApi.updateDraft(id, data);
      } else {
        const res = await reportApi.createDraft(data);
        navigate(`/reports/${res.data.id}/edit`, { replace: true });
        return;
      }
      navigate("/reports/history");
    } catch (err) {
      setServerError(err.response?.data?.error || "Failed to save report");
    } finally {
      setSaving(false);
    }
  };

  const onSubmitForReview = handleSubmit(async (data) => {
    setServerError("");
    setSaving(true);
    try {
      let reportId = id;
      if (isEditMode) {
        await reportApi.updateDraft(id, data);
      } else {
        const res = await reportApi.createDraft(data);
        reportId = res.data.id;
      }
      await reportApi.submitReport(reportId);
      navigate("/reports/history");
    } catch (err) {
      setServerError(err.response?.data?.error || "Failed to submit report");
    } finally {
      setSaving(false);
    }
  });

  const isLocked = reportStatus === "SUBMITTED" || reportStatus === "APPROVED";

  if (loading) return <div className="text-gray-500">Loading report...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          {isEditMode ? "Edit Weekly Report" : "New Weekly Report"}
        </h1>
        {reportStatus && <StatusBadge status={reportStatus} />}
      </div>

      {reviewComment && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm font-medium text-red-800">
            Manager requested changes:
          </p>
          <p className="text-sm text-red-700 mt-1">{reviewComment.comment}</p>
        </div>
      )}

      {isLocked && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
          This report is currently {reportStatus.toLowerCase()} and cannot be
          edited.
        </div>
      )}

      {serverError && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {serverError}
        </div>
      )}

      <fieldset disabled={isLocked} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-md p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Week Start
            </label>
            <input
              type="date"
              {...register("weekStartDate")}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
            {errors.weekStartDate && (
              <p className="text-xs text-red-600 mt-1">
                {errors.weekStartDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Week End
            </label>
            <input
              type="date"
              {...register("weekEndDate")}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
            {errors.weekEndDate && (
              <p className="text-xs text-red-600 mt-1">
                {errors.weekEndDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project / Category
            </label>
            <select
              {...register("projectId")}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-xs text-red-600 mt-1">
                {errors.projectId.message}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <TaskEntryTable
            control={control}
            register={register}
            errors={errors}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tasks Planned for Next Week
          </label>
          <textarea
            {...register("tasksPlannedNextWeek")}
            rows={3}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <BlockerList
            control={control}
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <AchievementList
            control={control}
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <HoursBreakdownInput register={register} />
        </div>

        <div className="bg-white border border-gray-200 rounded-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes / Links
          </label>
          <textarea
            {...register("notesOrLinks")}
            rows={2}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
          />
        </div>
      </fieldset>

      {!isLocked && (
        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={handleSubmit(onSaveDraft)}
            disabled={saving}
          >
            Save as Draft
          </Button>
          <Button
            variant="primary"
            onClick={onSubmitForReview}
            disabled={saving}
          >
            Submit for Review
          </Button>
        </div>
      )}
    </div>
  );
}
