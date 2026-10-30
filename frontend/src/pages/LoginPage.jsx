import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GraduationCap, LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const portalDetails = {
  admin: {
    title: "Admin Login",
    description: "Sign in to manage your coaching center.",
    role: "ADMIN",
  },
  teacher: {
    title: "Teacher Login",
    description: "Sign in to access your teaching workspace.",
    role: "TEACHER",
  },
  student: {
    title: "Student Login",
    description: "Sign in to access your learning workspace.",
    role: "STUDENT",
  },
};

function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();

  const { login, logout } = useAuth();

  const portal = portalDetails[role];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!portal) {
    return <div className="p-10 text-center">Login page not found.</div>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const authenticatedUser = await login({
        email: email.trim(),
        password,
      });

      if (authenticatedUser.role !== portal.role) {
        await logout();
        setError("You are not authorized to access this portal.");
        return;
      }

      navigate(`/${role}/dashboard`, { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#17243a] text-[#c6a56b]">
            <GraduationCap size={30} />
          </div>

          <h1 className="font-display text-3xl font-extrabold text-[#17243a]">
            {portal.title}
          </h1>

          <p className="mt-2 text-sm text-slate-500">{portal.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 focus-within:border-[#c6a56b]">
              <Mail size={18} className="text-slate-400" />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 focus-within:border-[#c6a56b]">
              <LockKeyhole size={18} className="text-slate-400" />

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full py-3 text-sm outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#17243a] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#243751] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-7 text-center">
          <Link
            to="/"
            className="text-sm font-semibold text-[#b18c50] hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
