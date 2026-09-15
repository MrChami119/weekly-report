import { useEffect, useState } from "react";
import * as userApi from "../../api/userApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ROLES } from "../../utils/constants";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = () => {
    setLoading(true);
    userApi
      .getAllUsers()
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setError("");
    try {
      await userApi.updateUserRole(userId, newRole);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update role");
    }
  };

  const handleToggleEnabled = async (user) => {
    setError("");
    try {
      await userApi.setUserEnabled(user.id, !user.enabled);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        User Management
      </h1>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

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
                  Email
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">
                  Role
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
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100">
                  <td className="px-4 py-2.5 text-gray-900">{u.fullName}</td>
                  <td className="px-4 py-2.5 text-gray-600">{u.email}</td>
                  <td className="px-4 py-2.5">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      {Object.values(ROLES).map((r) => (
                        <option key={r} value={r}>
                          {r.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        u.enabled
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {u.enabled ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => handleToggleEnabled(u)}
                      className={`text-xs hover:underline ${u.enabled ? "text-red-600" : "text-green-600"}`}
                    >
                      {u.enabled ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
