import { useEffect, useState } from "react";

import {
  Users,
  GraduationCap,
  BookOpen,
  Wallet,
  Clock,
  UserCheck,
  ClipboardList,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import api from "../../services/api";

function AdminDashboard() {
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalRevenue: 0,
  });

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const [enrollmentSummary, setEnrollmentSummary] = useState({
    totalEnrollments: 0,
    statusBreakdown: [],
  });

  const [loading, setLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);

  const [error, setError] = useState("");
  const [revenueError, setRevenueError] = useState("");
  const [activityError, setActivityError] = useState("");
  const [enrollmentError, setEnrollmentError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/dashboard");
        setStatistics(response.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load dashboard statistics.",
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchMonthlyRevenue = async () => {
      try {
        const response = await api.get("/dashboard/revenue");
        setMonthlyRevenue(response.data.data);
      } catch (error) {
        setRevenueError(
          error.response?.data?.message || "Failed to load revenue data.",
        );
      } finally {
        setRevenueLoading(false);
      }
    };

    const fetchRecentActivities = async () => {
      try {
        const response = await api.get("/dashboard/activity");
        setRecentActivities(response.data.data);
      } catch (error) {
        setActivityError(
          error.response?.data?.message || "Failed to load recent activities.",
        );
      } finally {
        setActivityLoading(false);
      }
    };

    const fetchEnrollmentSummary = async () => {
      try {
        const response = await api.get("/dashboard/enrollments");
        setEnrollmentSummary(response.data.data);
      } catch (error) {
        setEnrollmentError(
          error.response?.data?.message || "Failed to load enrollment summary.",
        );
      } finally {
        setEnrollmentLoading(false);
      }
    };

    fetchDashboardStats();
    fetchMonthlyRevenue();
    fetchRecentActivities();
    fetchEnrollmentSummary();
  }, []);

  const statisticCards = [
    {
      title: "Total Students",
      value: statistics.totalStudents.toLocaleString(),
      change: "Registered students",
      icon: Users,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Teachers",
      value: statistics.totalTeachers.toLocaleString(),
      change: "Registered teachers",
      icon: GraduationCap,
      iconStyle: "bg-purple-50 text-purple-600",
    },
    {
      title: "Total Courses",
      value: statistics.totalCourses.toLocaleString(),
      change: "Available courses",
      icon: BookOpen,
      iconStyle: "bg-amber-50 text-amber-600",
    },
    {
      title: "Total Revenue",
      value: `৳${Number(statistics.totalRevenue).toLocaleString("en-BD")}`,
      change: "Collected payments",
      icon: Wallet,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
  ];

  const activeEnrollments =
    enrollmentSummary.statusBreakdown.find((item) => item.status === "ACTIVE")
      ?.count || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#17243a]">
          Dashboard Overview
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Here's what's happening at your coaching center.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statisticCards.map((statistic) => {
          const Icon = statistic.icon;

          return (
            <div
              key={statistic.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {statistic.title}
                </p>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${statistic.iconStyle}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              <h2 className="mt-5 text-3xl font-extrabold text-[#17243a]">
                {loading ? "..." : statistic.value}
              </h2>

              <p className="mt-2 text-xs text-slate-400">{statistic.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div>
            <h2 className="font-bold text-[#17243a]">Revenue Overview</h2>

            <p className="mt-1 text-xs text-slate-500">
              Monthly payment collection for the last six months
            </p>
          </div>

          <div className="mt-6 h-72">
            {revenueLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-slate-400">
                  Loading revenue chart...
                </p>
              </div>
            ) : revenueError ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-red-500">{revenueError}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyRevenue}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickFormatter={(value) =>
                      `৳${value.toLocaleString("en-BD")}`
                    }
                  />

                  <Tooltip
                    formatter={(value) => [
                      `৳${Number(value).toLocaleString("en-BD")}`,
                      "Revenue",
                    ]}
                  />

                  <Bar
                    dataKey="revenue"
                    fill="#c6a56b"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-[#17243a]">Recent Activity</h2>

          <p className="mt-1 text-xs text-slate-500">
            Latest coaching center activities
          </p>

          <div className="mt-5 space-y-4">
            {activityLoading ? (
              <p className="py-12 text-center text-sm text-slate-400">
                Loading activities...
              </p>
            ) : activityError ? (
              <p className="py-12 text-center text-sm text-red-500">
                {activityError}
              </p>
            ) : recentActivities.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <Clock size={35} className="text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-400">
                  No recent activity available.
                </p>
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="border-b border-slate-100 pb-4 last:border-0"
                >
                  <p className="text-sm font-semibold text-[#17243a]">
                    {activity.action} {activity.entityType || ""}
                  </p>

                  {activity.details && (
                    <p className="mt-1 text-xs text-slate-500">
                      {activity.details}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-400">
                    {activity.userName}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-[#17243a]">Enrollment Summary</h2>

            <p className="mt-1 text-xs text-slate-500">
              Overview of student enrollments
            </p>
          </div>

          <ClipboardList size={22} className="text-slate-400" />
        </div>

        {enrollmentLoading ? (
          <div className="flex min-h-36 items-center justify-center">
            <p className="text-sm text-slate-400">
              Loading enrollment summary...
            </p>
          </div>
        ) : enrollmentError ? (
          <div className="flex min-h-36 items-center justify-center">
            <p className="text-sm text-red-500">{enrollmentError}</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Total Enrollments
                </p>

                <ClipboardList size={21} className="text-[#c6a56b]" />
              </div>

              <h3 className="mt-4 text-3xl font-extrabold text-[#17243a]">
                {enrollmentSummary.totalEnrollments.toLocaleString()}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                All registered enrollments
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Active Enrollments
                </p>

                <UserCheck size={21} className="text-emerald-600" />
              </div>

              <h3 className="mt-4 text-3xl font-extrabold text-[#17243a]">
                {activeEnrollments.toLocaleString()}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Currently active enrollments
              </p>
            </div>

            {enrollmentSummary.statusBreakdown.length > 0 && (
              <div className="sm:col-span-2">
                <h3 className="mb-4 text-sm font-bold text-[#17243a]">
                  Enrollment Status Breakdown
                </h3>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {enrollmentSummary.statusBreakdown.map((item) => (
                    <div
                      key={item.status}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                    >
                      <span className="text-sm font-medium text-slate-600">
                        {item.status}
                      </span>

                      <span className="text-lg font-bold text-[#17243a]">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {enrollmentSummary.statusBreakdown.length === 0 && (
              <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 sm:col-span-2">
                <p className="text-sm text-slate-400">
                  No enrollment records available.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
