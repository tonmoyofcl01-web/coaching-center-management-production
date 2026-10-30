import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/admin/AdminLayout";
import TeacherLayout from "./layouts/teacher/TeacherLayout";

import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PortalPage from "./pages/PortalPage";
import AdminDashboard from "./layouts/admin/AdminDashboard";
import TeacherDashboard from "./layouts/teacher/TeacherDashboard";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      {/* Home Page */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
      />

      {/* Login Pages */}
      <Route
        path="/:role"
        element={
          <PublicLayout>
            <LoginPage />
          </PublicLayout>
        }
      />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Teacher Routes */}
      <Route element={<ProtectedRoute allowedRole="TEACHER" />}>
        <Route element={<TeacherLayout />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        </Route>
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
        <Route
          path="/student/dashboard"
          element={
            <PublicLayout>
              <PortalPage role="student" />
            </PublicLayout>
          }
        />
      </Route>

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <NotFoundPage />
          </PublicLayout>
        }
      />
    </Routes>
  );
}

export default App;
