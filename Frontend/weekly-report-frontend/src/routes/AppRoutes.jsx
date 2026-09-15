import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedLayout from "../components/layouts/ProtectedLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";

// Will be uncommented as we build each page
import ReportHistoryPage from "../pages/reports/ReportHistoryPage";
import MyReportFormPage from "../pages/reports/MyReportFormPage";
import ReportDetailPage from "../pages/reports/ReportDetailPage";
import TeamDashboardPage from "../pages/manager/TeamDashboardPage";
import ReviewReportPage from "../pages/manager/ReviewReportPage";
import ProjectManagementPage from "../pages/projects/ProjectManagementPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import TeamMemberProfilePage from "../pages/manager/TeamMemberProfilePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        {/* Shared / team member routes */}
        <Route path="/reports/new" element={<MyReportFormPage />} />
        <Route path="/reports/:id/edit" element={<MyReportFormPage />} />
        <Route path="/reports/history" element={<ReportHistoryPage />} />
        <Route path="/reports/:id" element={<ReportDetailPage />} />

        {/* Manager/Admin routes */}

        {/* <Route path="/manager/dashboard" element={<TeamDashboardPage />} /> */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
              <TeamDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/manager/reports/:id/review" element={<ReviewReportPage />} /> */}
        <Route
          path="/manager/reports/:id/review"
          element={
            <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
              <ReviewReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/team/:userId"
          element={
            <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
              <TeamMemberProfilePage />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/projects" element={<ProjectManagementPage />} /> */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute allowedRoles={["MANAGER", "ADMIN"]}>
              <ProjectManagementPage />
            </ProtectedRoute>
          }
        />
        {/* Admin-only route */}
        {/* <Route path="/admin/users" element={<UserManagementPage />} /> */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
