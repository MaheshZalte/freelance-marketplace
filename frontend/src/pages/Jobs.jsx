import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import Modal from "../components/Modal";

import { createProposal } from "../services/proposalService";

import { getJobs } from "../services/jobService";

import { getUser } from "../utils/auth";

import { formatCurrency, splitSkills } from "../utils/formatters";

import { toast } from "react-toastify";

import { toggleJobStatus } from "../services/jobService";

function Jobs() {
  const user = getUser();

  const [selectedJob, setSelectedJob] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [proposalMessage, setProposalMessage] = useState("");

  const [bidAmount, setBidAmount] = useState("");

  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [budgetFilter, setBudgetFilter] = useState("all");

  const [status, setStatus] = useState("loading");

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [sort, setSort] = useState("");

  // SEARCH DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // FETCH JOBS
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setStatus("loading");

        const data = await getJobs(
          page,

          6,

          debouncedSearch,

          budgetFilter,

          sort,
        );

        setJobs(data.content || []);

        setTotalPages(data.totalPages || 0);

        setStatus("success");
      } catch (error) {
        console.log(error);

        setStatus("error");
      }
    };

    fetchJobs();
  }, [page, debouncedSearch, budgetFilter, sort]);

  // FEATURED SKILLS
  const featuredSkills = useMemo(() => {
    const allSkills = jobs.flatMap((job) => splitSkills(job.requiredSkills));

    return [...new Set(allSkills)].slice(0, 7);
  }, [jobs]);

  // AVG BUDGET
  const averageBudget =
    jobs.length > 0
      ? jobs.reduce(
          (total, job) => total + Number(job.budget || 0),

          0,
        ) / jobs.length
      : 0;

  // BUDGET OPTIONS
  const budgetOptions = [
    {
      label: "All",
      value: "all",
    },

    {
      label: "Below 10k",
      value: "starter",
    },

    {
      label: "10k - 50k",
      value: "growth",
    },

    {
      label: "50k+",
      value: "premium",
    },
  ];

  // SUBMIT PROPOSAL
  const handleProposalSubmit = async (event) => {
    event.preventDefault();

    try {
      await createProposal({
        jobId: selectedJob.id,

        message: proposalMessage,

        bidAmount,
      });

      toast.success("Proposal submitted 🚀");

      setIsModalOpen(false);

      setProposalMessage("");

      setBidAmount("");
    } catch (error) {
      console.log(error);

      toast.error("Proposal failed");
    }
  };

  const handleToggle = async (jobId) => {
    try {
      const updatedJob = await toggleJobStatus(jobId);

      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? updatedJob : job)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="app-page">
      <section className="page-shell">
        {/* HERO */}
        <div className="hero-panel px-6 py-7 sm:px-8 lg:px-10">
          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_25rem] lg:items-center">
            <div>
              <p className="portal-eyebrow">Marketplace</p>

              <h1 className="mt-3 max-w-3xl text-3xl font-black text-slate-950 sm:text-5xl">
                Find freelance jobs that match your skills
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Search active projects, compare budgets, scan required skills,
                and apply with a focused proposal.
              </p>

              {/* STATS */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-blue-100 bg-white/85 p-4">
                  <p className="text-2xl font-black text-slate-950">
                    {status === "loading" ? "--" : jobs.length}
                  </p>

                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Open jobs
                  </p>
                </div>

                <div className="rounded-md border border-blue-100 bg-white/85 p-4">
                  <p className="text-2xl font-black text-slate-950">
                    {status === "loading"
                      ? "--"
                      : formatCurrency(averageBudget)}
                  </p>

                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Avg budget
                  </p>
                </div>

                <div className="rounded-md border border-blue-100 bg-white/85 p-4">
                  <p className="text-2xl font-black text-slate-950">
                    {featuredSkills.length}
                  </p>

                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Skill areas
                  </p>
                </div>
              </div>
            </div>

            {/* FILTER PANEL */}
            <div className="portal-panel p-4">
              <label
                htmlFor="job-search"
                className="text-sm font-black text-slate-800"
              >
                Search jobs
              </label>

              <input
                id="job-search"
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);

                  setPage(0);
                }}
                placeholder="Search title, skill, or description"
                className="field mt-2"
              />

              {/* BUDGET */}
              <p className="mt-5 text-sm font-black text-slate-800">
                Budget range
              </p>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {budgetOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setBudgetFilter(option.value);

                      setPage(0);
                    }}
                    className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                      budgetFilter === option.value
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* SORT */}
              <p className="mt-5 text-sm font-black text-slate-800">Sort by</p>

              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);

                  setPage(0);
                }}
                className="field mt-2"
              >
                <option value="">Default</option>

                <option value="budget">Highest Budget</option>
              </select>
            </div>
          </div>
        </div>

        {/* JOBS */}
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {status === "loading" && jobs.length === 0 &&
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="job-card min-h-80 animate-pulse p-5"
              >
                <div className="h-5 w-24 rounded bg-slate-200" />
                <div className="mt-3 h-8 w-3/4 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-full rounded bg-slate-200" />
                <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
                <div className="mt-6 h-10 w-full rounded bg-slate-200" />
              </div>
            ))}

          {jobs.map((job) => {
            const skills = splitSkills(job.requiredSkills);


            return (
              <article
                key={job.id}
                className={`job-card flex min-h-80 flex-col p-5 transition ${
                  !job.active ? "opacity-70 grayscale-[0.15]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                      Project
                    </p>

                    <h3 className="mt-2 line-clamp-2 text-xl font-black leading-7 text-slate-950">
                      {job.title || "Untitled project"}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                      job.active
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : "bg-red-50 text-red-700 ring-red-200"
                    }`}
                  >
                    {job.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {job.description || "No description provided yet."}
                </p>

                {/* BUDGET */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Budget
                    </p>

                    <p className="mt-1 text-lg font-black text-slate-950">
                      {formatCurrency(job.budget)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Skills
                    </p>

                    <p className="mt-1 text-lg font-black text-slate-950">
                      {skills.length || 0}
                    </p>
                  </div>
                </div>

                {/* SKILLS */}
                {skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="accent-pill px-3 py-1 text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* ACTIONS */}
                <div className="mt-auto grid gap-3 pt-6">
                  {/* FREELANCER */}
                  {/* FREELANCER */}
                  {user?.role === "FREELANCER" &&
                    (job.active ? (
                      <button
                        onClick={() => {
                          setSelectedJob(job);

                          setIsModalOpen(true);
                        }}
                        className="btn-primary px-4 py-2.5 text-center text-sm"
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        disabled
                        className="cursor-not-allowed rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500 opacity-70"
                      >
                        Job Closed
                      </button>
                    ))}

                  {/* CLIENT */}
                  {user?.role === "CLIENT" && (
                    job.postedBy?.email === user?.email && (
                    <Link
                      to={`/proposals/${job.id}`}
                      className="btn-secondary px-4 py-2.5 text-center text-sm"
                    >
                      View Proposals
                    </Link>
                  ))}

                  {/* CLIENT CONTROL */}
                  {user?.role === "CLIENT" &&
                    job.postedBy?.email === user?.email && (
                      <button
                        onClick={() => handleToggle(job.id)}
                        className={`rounded-xl px-4 py-2 text-sm font-bold text-white transition ${
                          job.active
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {job.active ? "Deactivate" : "Activate"}
                      </button>
                    )}

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      job.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {job.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {status === "success" && jobs.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="text-2xl font-black text-slate-900">
              No jobs found
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              Try adjusting filters or search keywords.
            </p>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="btn-secondary px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm font-bold text-slate-700">
              Page {page + 1}
              of {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
              onClick={() => setPage(page + 1)}
              className="btn-primary px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* MODAL */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Submit Proposal"
        >
          <form onSubmit={handleProposalSubmit} className="grid gap-4">
            <textarea
              placeholder="Proposal message"
              value={proposalMessage}
              onChange={(event) => setProposalMessage(event.target.value)}
              className="field min-h-32"
            />

            <input
              type="number"
              placeholder="Bid amount"
              value={bidAmount}
              onChange={(event) => setBidAmount(event.target.value)}
              className="field"
            />

            <button type="submit" className="btn-primary px-4 py-3">
              Submit Proposal
            </button>
          </form>
        </Modal>
      </section>
    </main>
  );
}

export default Jobs;
