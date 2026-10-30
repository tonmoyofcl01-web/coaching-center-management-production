import { NavLink, Outlet } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  ClipboardCheck,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const navigationItems = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    path: "/admin/students",
    icon: Users,
  },
  {
    title: "Teachers",
    path: "/admin/teachers",
    icon: GraduationCap,
  },
  {
    title: "Courses",
    path: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Batches",
    path: "/admin/batches",
    icon: Layers,
  },
  {
    title: "Attendance",
    path: "/admin/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/admin";
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
              ADMIN PANEL
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
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#c6a56b] text-[#17243a]"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold">
              {user?.fullName || user?.name || "Admin"}
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
                Admin Dashboard
              </h2>

              <p className="hidden text-xs text-slate-500 sm:block">
                Coaching Center Management System
              </p>
            </div>
          </div>

          <div className="hidden text-sm font-medium text-slate-600 sm:block">
            Welcome, {user?.fullName || user?.name || "Admin"}
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
