import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-7xl font-extrabold text-[#17243a]">
        404
      </h1>

      <h2 className="mt-4 text-xl font-bold">Page Not Found</h2>

      <p className="mt-3 text-sm text-slate-500">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-7 rounded-lg bg-[#17243a] px-6 py-3 text-sm font-semibold text-white"
      >
        Return Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
