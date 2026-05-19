import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getUserData } from "../utils/auth";

import { getDashboardStats } from "../services/dashboardService";
import { formatCurrency } from "../utils/formatters";
import SkeletonCard from "../components/SkeletonCard";

function Dashboard() {
  const user = getUserData();

  const [stats, setStats] = useState({
    jobs: 0,
    proposals: 0,
    contracts: 0,
    earnings: 0,
  });
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();

        setStats({
          jobs: Number(data?.jobs ?? 0),
          proposals: Number(data?.proposals ?? 0),
          contracts: Number(data?.contracts ?? 0),
          earnings: Number(data?.earnings ?? 0),
        });
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    fetchStats();
  }, []);


  const isClient = user?.role === "CLIENT";

  const roleBasedCards = useMemo(() => {
    if (isClient) {
      return [
        {
          label: "Open jobs",
          value: stats.jobs,
          tone: "from-blue-600 to-cyan-600",
        },
        {
          label: "Active contracts",
          value: stats.contracts,
          tone: "from-emerald-600 to-teal-600",
        },
        {
          label: "Proposals",
          value: stats.proposals,
          tone: "from-violet-600 to-purple-600",
        },
        {
          label: "Payments received",
          value: formatCurrency(stats.earnings),
          tone: "from-amber-600 to-orange-600",
        },
      ];
    }

    return [
      {
        label: "Proposals",
        value: stats.proposals,
        tone: "from-violet-600 to-purple-600",
      },
      {
        label: "Active contracts",
        value: stats.contracts,
        tone: "from-emerald-600 to-teal-600",
      },
      {
        label: "Jobs posted",
        value: stats.jobs,
        tone: "from-blue-600 to-cyan-600",
      },
      {
        label: "Earnings",
        value: formatCurrency(stats.earnings),
        tone: "from-amber-600 to-orange-600",
      },
    ];
  }, [isClient, stats.contracts, stats.earnings, stats.jobs, stats.proposals]);

  return (
    <main className="app-page">
      <section className="page-shell">
        <div className="hero-panel px-6 py-7 sm:px-8 lg:px-10">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="portal-eyebrow">Workspace</p>
              <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Welcome back, {user?.sub?.split("@")[0] || "there"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {isClient
                  ? "Review proposals, monitor contract progress, and stay on top of payments."
                  : "Manage proposals, track contracts, and monitor your earnings."}
              </p>
            </div>

            <Link
              to={isClient ? "/jobs" : "/jobs"}
              className="btn-primary w-fit px-5 py-3 text-sm"
            >
              {isClient ? "View jobs" : "Browse opportunities"}
            </Link>
          </div>
        </div>

        {status === "error" && (
          <div className="soft-card mt-6 border-red-200 bg-red-50 p-5 text-red-800">
            Dashboard stats could not be loaded.
          </div>
        )}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {status === "loading" ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            roleBasedCards.map((card) => (
              <div
                key={card.label}
                className="surface-card relative overflow-hidden p-6"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${card.tone}`}
                />
                <p className="text-sm font-bold text-slate-500">{card.label}</p>
                <p className="mt-3 text-3xl font-black text-slate-950">
                  {card.value}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card p-6">
            <h2 className="text-lg font-black text-slate-950">Quick actions</h2>

            <div className="mt-5 grid gap-3">
              {isClient ? (
                <Link
                  to="/create-job"
                  className="btn-secondary px-4 py-3 text-sm"
                >
                  Post a new project
                </Link>
              ) : (
                <Link to="/jobs" className="btn-secondary px-4 py-3 text-sm">
                  Find matching jobs
                </Link>
              )}

              <Link
                to={isClient ? "/proposals" : "/applications"}
                className="btn-secondary px-4 py-3 text-sm"
              >
                {isClient ? "View proposals" : "View my applications"}
              </Link>

              <Link
                to="/contracts"
                className="btn-secondary px-4 py-3 text-sm"
              >
                Review contracts
              </Link>

              <Link to="/profile" className="btn-secondary px-4 py-3 text-sm">
                Update profile
              </Link>
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="portal-eyebrow">Status</p>
                <h2 className="mt-2 text-lg font-black text-slate-950">
                  {isClient ? "Hiring workflow" : "Delivery workflow"}
                </h2>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                {status === "loading" ? "Loading" : "Ready"}
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  What to do next
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  {isClient
                    ? stats.proposals > 0
                      ? "Review new proposals to move projects forward."
                      : stats.contracts > 0
                        ? "Update contracts and keep payments on track."
                        : "Post a job to start receiving proposals."
                    : stats.proposals > 0
                      ? "Follow up on proposals and confirm contract details."
                      : stats.contracts > 0
                        ? "Review contract milestones and deliver on time."
                        : "Browse jobs and submit proposals to get started."}
                </p>
              </div>

              <p className="text-sm leading-6 text-slate-600">
                All dashboard metrics come from your backend data. Counts update after
                changes to jobs, proposals, contracts, and payments.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;

