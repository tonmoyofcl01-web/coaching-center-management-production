import { useEffect, useState } from "react";

import {
  BookOpen,
  Users,
  Layers,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";

import api from "../../services/api";

function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalBatches: 0,
    totalStudents: 0,
    activeBatches: 0,
  });

  const [batches, setBatches] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsResponse, batchesResponse, scheduleResponse] =
          await Promise.all([
            api.get("/teacher-dashboard/stats"),
            api.get("/teacher-dashboard/batches"),
            api.get("/teacher-dashboard/schedule"),
          ]);

        setStats(statsResponse.data.data);
        setBatches(batchesResponse.data.data);
        setSchedule(scheduleResponse.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load dashboard information.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statisticCards = [
    {
      title: "Total Batches",
      value: stats.totalBatches,
      icon: Layers,
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
    },
    {
      title: "Active Batches",
      value: stats.activeBatches,
      icon: BookOpen,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm font-medium text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-2xl font-bold text-[#17243a]">
          Welcome to Your Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your batches, students, and class schedules.
        </p>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statisticCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-[#17243a]">
                    {card.value}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5f0e7] text-[#b28c4e]">
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Assigned Batches */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 p-6">
          <BookOpen className="text-[#b28c4e]" size={21} />

          <div>
            <h2 className="font-bold text-[#17243a]">My Assigned Batches</h2>

            <p className="mt-1 text-xs text-slate-500">
              Batches assigned to you
            </p>
          </div>
        </div>

        {batches.length === 0 ? (
          <div className="p-10 text-center">
            <Layers className="mx-auto mb-3 text-slate-300" size={32} />

            <p className="font-semibold text-slate-600">
              No batches assigned yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Your assigned batches will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold text-[#17243a]">{batch.name}</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {batch.code} · {batch.courseName}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Users size={16} />
                    {batch.totalStudents} Students
                  </span>

                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {batch.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Class Schedule */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 p-6">
          <CalendarDays className="text-[#b28c4e]" size={21} />

          <div>
            <h2 className="font-bold text-[#17243a]">Class Schedule</h2>

            <p className="mt-1 text-xs text-slate-500">
              Your weekly teaching schedule
            </p>
          </div>
        </div>

        {schedule.length === 0 ? (
          <div className="p-10 text-center">
            <CalendarDays className="mx-auto mb-3 text-slate-300" size={32} />

            <p className="font-semibold text-slate-600">
              No classes scheduled yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Your weekly class schedule will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {schedule.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-[#17243a]">
                    {item.batchName}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.courseName} · {item.batchCode}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {item.day}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    {item.startTime} – {item.endTime}
                  </span>

                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    {item.room || "Room not assigned"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TeacherDashboard;
