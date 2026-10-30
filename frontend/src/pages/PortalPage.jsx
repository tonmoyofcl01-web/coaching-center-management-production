import { Link, useNavigate } from "react-router-dom";

import { ArrowLeft, Construction, GraduationCap, LogOut } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const portalDetails = {
  admin: {
    title: "Admin Portal",
    description: "Coaching center administration workspace",
  },

  teacher: {
    title: "Teacher Portal",
    description: "Teacher academic management workspace",
  },

  student: {
    title: "Student Portal",
    description: "Student learning and information workspace",
  },
};

function PortalPage({ role }) {
  const portal = portalDetails[role];

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(`/${role}`, { replace: true });
    } catch {
      alert("Unable to log out. Please try again.");
    }
  };

  if (!portal) {
    return <div className="p-10 text-center">Portal not found.</div>;
  }

  return (
    <section className="flex min-h-[65vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#17243a] text-[#c6a56b]">
          <GraduationCap size={32} />
        </div>

        <h1 className="font-display text-3xl font-extrabold text-[#17243a]">
          {portal.title}
        </h1>

        <p className="mt-3 text-sm text-slate-500">{portal.description}</p>

        <div className="my-5 rounded-xl bg-slate-50 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Logged in as
          </p>

          <p className="mt-1 font-semibold text-[#17243a]">
            {user?.fullName || user?.name || "User"}
          </p>

          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>

        <div className="my-6 rounded-xl bg-amber-50 p-5">
          <Construction size={25} className="mx-auto mb-3 text-amber-600" />

          <h2 className="font-bold text-amber-900">Development in Progress</h2>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            This portal will be implemented in the upcoming development phases.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Home
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#17243a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243751]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}

export default PortalPage;
