import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/admin/AdminLayout";
import TeacherLayout from "./layouts/teacher/TeacherLayout";
import StudentLayout from "./layouts/student/StudentLayout";

import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PortalPage from "./pages/PortalPage";
import NotFoundPage from "./pages/NotFoundPage";

import AdminDashboard from "./layouts/admin/AdminDashboard";
import TeacherDashboard from "./layouts/teacher/TeacherDashboard";
import StudentDashboard from "./layouts/student/StudentDashboard";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
      />

      <Route
        path="/:role"
        element={
          <PublicLayout>
            <LoginPage />
          </PublicLayout>
        }
      />

      <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRole="TEACHER" />}>
        <Route element={<TeacherLayout />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRole="STUDENT" />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>
      </Route>

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
