import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";

import HomePage from "./pages/HomePage";
import PortalPage from "./pages/PortalPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
        path="/"
      />

      <Route
        element={
          <PublicLayout>
            <PortalPage />
          </PublicLayout>
        }
        path="/:role"
      />

      <Route
        element={
          <PublicLayout>
            <NotFoundPage />
          </PublicLayout>
        }
        path="*"
      />
    </Routes>
  );
}

export default App;
