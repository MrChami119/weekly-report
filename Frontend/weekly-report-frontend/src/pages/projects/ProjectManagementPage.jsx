import { useEffect, useState } from "react";
import * as projectApi from "../../api/projectApi";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Plus, Pencil, Ban, RotateCcw } from "lucide-react";

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null = creating
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  const loadProjects = () => {
    setLoading(true);
    projectApi
      .getAllProjects()
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({ name: "", description: "" });
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({ name: project.name, description: project.description || "" });
    setError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Project name is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingProject) {
        await projectApi.updateProject(editingProject.id, formData);
      } else {
        await projectApi.createProject(formData);
      }
      setModalOpen(false);
      loadProjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (project) => {
    if (project.active) {
      await projectApi.deactivateProject(project.id);
    } else {
      await projectApi.reactivateProject(project.id);
    }
    loadProjects();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Projects & Categories
        </h1>
        <Button onClick={openCreateModal} className="flex items-center gap-1.5">
          <Plus size={16} /> Add Project
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">
                  Name
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">
                  Description
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-right px-4 py-2.5 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-gray-100">
                  <td className="px-4 py-2.5 text-gray-900">{p.name}</td>
                  <td className="px-4 py-2.5 text-gray-600">
                    {p.description || "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        p.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right space-x-3">
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-indigo-600 hover:underline inline-flex items-center gap-1 text-xs"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                    <button
                      onClick={() => toggleActive(p)}
                      className={`inline-flex items-center gap-1 text-xs hover:underline ${
                        p.active ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {p.active ? (
                        <>
                          <Ban size={13} /> Deactivate
                        </>
                      ) : (
                        <>
                          <RotateCcw size={13} /> Reactivate
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? "Edit Project" : "New Project"}
      >
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData((f) => ({ ...f, name: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
