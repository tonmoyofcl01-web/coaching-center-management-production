import { Link, useParams } from "react-router-dom";

import { ArrowLeft, Construction, GraduationCap } from "lucide-react";

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

function PortalPage() {
  const { role } = useParams();

  const portal = portalDetails[role];

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

        <div className="my-8 rounded-xl bg-amber-50 p-5">
          <Construction size={25} className="mx-auto mb-3 text-amber-600" />

          <h2 className="font-bold text-amber-900">Development in Progress</h2>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            This portal will be implemented in the upcoming development phases.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[#17243a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243751]"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default PortalPage;
