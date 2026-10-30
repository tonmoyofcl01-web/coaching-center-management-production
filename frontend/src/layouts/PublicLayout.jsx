import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17243a] text-[#c6a56b]">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="font-display text-lg font-extrabold text-[#17243a]">
                COACHING
              </h1>

              <p className="text-[10px] font-semibold tracking-[3px] text-[#c6a56b]">
                MANAGEMENT
              </p>
            </div>
          </Link>

          <span className="hidden text-sm font-medium text-slate-500 sm:block">
            Education Management Platform
          </span>

          <div className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
            Secure Portal
          </div>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200 bg-white px-6 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Coaching Center Management. All rights
        reserved.
      </footer>
    </div>
  );
}

export default PublicLayout;
