import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FileText,
  History,
  LayoutDashboard,
  FolderKanban,
  Users,
} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-60 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Weekly Reports</h2>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {user?.role === "TEAM_MEMBER" && (
          <>
            <NavLink to="/reports/new" className={linkClass}>
              <FileText size={18} />
              New / Draft Report
            </NavLink>
            <NavLink to="/reports/history" className={linkClass}>
              <History size={18} />
              My Report History
            </NavLink>
          </>
        )}

        {(user?.role === "MANAGER" || user?.role === "ADMIN") && (
          <>
            <NavLink to="/manager/dashboard" className={linkClass}>
              <LayoutDashboard size={18} />
              Team Dashboard
            </NavLink>
            <NavLink to="/projects" className={linkClass}>
              <FolderKanban size={18} />
              Projects
            </NavLink>
          </>
        )}

        {user?.role === "ADMIN" && (
          <NavLink to="/admin/users" className={linkClass}>
            <Users size={18} />
            User Management
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
