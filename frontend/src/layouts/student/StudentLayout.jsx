import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, GraduationCap, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/student", { replace: true });
    } catch {
      alert("Unable to log out. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f6f8]">
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#17243a] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div>
            <h1 className="text-xl font-extrabold tracking-wide">COACHING</h1>
            <p className="mt-1 text-[10px] font-semibold tracking-[3px] text-[#c6a56b]">
              STUDENT PANEL
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-300 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <NavLink
            to="/student/dashboard"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[#c6a56b] text-[#17243a]"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold">
              {user?.fullName || user?.name || "Student"}
            </p>
            <p className="mt-1 truncate text-xs text-slate-400">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-600 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-[#17243a]">
                Student Dashboard
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Coaching Center Management System
              </p>
            </div>
          </div>

          <div className="hidden text-sm font-medium text-slate-600 sm:block">
            Welcome, {user?.fullName || user?.name || "Student"}
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
