import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PortalPage from "./pages/PortalPage";
import NotFoundPage from "./pages/NotFoundPage";

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
        <Route
          path="/admin/dashboard"
          element={
            <PublicLayout>
              <PortalPage role="admin" />
            </PublicLayout>
          }
        />
      </Route>

      <Route element={<ProtectedRoute allowedRole="TEACHER" />}>
        <Route
          path="/teacher/dashboard"
          element={
            <PublicLayout>
              <PortalPage role="teacher" />
            </PublicLayout>
          }
        />
      </Route>

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
