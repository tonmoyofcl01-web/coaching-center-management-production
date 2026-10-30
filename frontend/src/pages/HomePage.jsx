import { useEffect, useState } from "react";

import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import PortalCard from "../components/PortalCard";

import api from "../services/api";

function HomePage() {
  const [serverStatus, setServerStatus] = useState("checking");

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await api.get("/health");

        setServerStatus(
          response.data.status === "success" ? "connected" : "error",
        );
      } catch (error) {
        setServerStatus("disconnected");
      }
    };

    checkServer();
  }, []);

  const portals = [
    {
      number: "01",
      title: "Admin Portal",
      description:
        "Manage students, teachers, courses, batches, payments, attendance, and the entire coaching center.",
      icon: ShieldCheck,
      path: "/admin",
    },
    {
      number: "02",
      title: "Teacher Portal",
      description:
        "Manage assigned batches, view student information, record attendance, and monitor academic activities.",
      icon: GraduationCap,
      path: "/teacher",
    },
    {
      number: "03",
      title: "Student Portal",
      description:
        "Access your enrolled courses, batch schedules, attendance records, and payment information.",
      icon: Users,
      path: "/student",
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-[#17243a] px-6 py-24 text-white md:py-32">
        <div className="absolute -right-20 -top-24 h-96 w-96 rounded-full border border-white/10" />

        <div className="absolute -right-10 -top-14 h-72 w-72 rounded-full border border-[#c6a56b]/20" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wider text-[#d8bc8d]">
            <BookOpen size={15} />
            SMART EDUCATION MANAGEMENT
          </div>

          <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Managing Education,
            <span className="block text-[#c6a56b]">Simplified.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            A centralized platform designed to streamline coaching center
            operations, empower teachers, and create a better learning
            experience for students.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#portals"
              className="inline-flex items-center gap-3 rounded-lg bg-[#c6a56b] px-6 py-3.5 text-sm font-bold text-[#17243a] transition hover:bg-[#d8bc8d]"
            >
              Explore Portals
              <ArrowRight size={17} />
            </a>

            <div className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 size={17} className="text-[#c6a56b]" />
              Centralized Management
            </div>
          </div>
        </div>
      </section>

      <section id="portals" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold tracking-[3px] text-[#b18c50]">
              ACCESS YOUR WORKSPACE
            </p>

            <h2 className="font-display text-3xl font-extrabold text-[#17243a] md:text-4xl">
              Choose Your Portal
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
              Select your designated workspace to access the relevant features
              and services.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {portals.map((portal) => (
              <PortalCard key={portal.number} {...portal} />
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-7 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[#17243a]">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h3 className="font-bold text-[#17243a]">
                  Secure Management Environment
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Backend connectivity status
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold">
              {serverStatus === "checking" && (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin text-amber-500"
                  />
                  <span className="text-slate-500">Checking server...</span>
                </>
              )}

              {serverStatus === "connected" && (
                <>
                  <CheckCircle2 size={17} className="text-green-600" />
                  <span className="text-green-700">Backend connected</span>
                </>
              )}

              {serverStatus === "disconnected" && (
                <>
                  <AlertCircle size={17} className="text-red-500" />
                  <span className="text-red-600">Backend unavailable</span>
                </>
              )}

              {serverStatus === "error" && (
                <>
                  <AlertCircle size={17} className="text-red-500" />
                  <span className="text-red-600">Backend error</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
