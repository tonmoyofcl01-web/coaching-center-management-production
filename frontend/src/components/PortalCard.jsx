import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function PortalCard({ title, description, icon: Icon, path, number }) {
  return (
    <Link
      to={path}
      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#c6a56b] hover:shadow-xl hover:shadow-slate-200/60"
    >
      <div className="mb-7 flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#17243a] text-[#c6a56b] transition-colors group-hover:bg-[#243751]">
          <Icon size={27} />
        </div>

        <span className="text-sm font-semibold text-slate-300">{number}</span>
      </div>

      <h3 className="mb-2 font-display text-xl font-bold text-[#17243a]">
        {title}
      </h3>

      <p className="min-h-12 text-sm leading-6 text-slate-500">{description}</p>

      <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
        <span className="text-sm font-semibold text-[#17243a]">
          Access Portal
        </span>

        <ArrowUpRight
          size={19}
          className="text-[#c6a56b] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </div>
    </Link>
  );
}

export default PortalCard;
