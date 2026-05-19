import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getJobById } from "../services/jobService";
import { createProposal } from "../services/proposalService";
import { getUser } from "../utils/auth";
import { formatCurrency, splitSkills } from "../utils/formatters";

function JobDetails() {
  const { id } = useParams();

  const user = getUser();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [loadStatus, setLoadStatus] = useState("loading");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);

        setJob(data);
        setBidAmount(
          data?.budget ? String(Math.round(Number(data.budget))) : "",
        );
        setLoadStatus("success");
      } catch (jobError) {
        console.log(jobError);
        setLoadStatus("error");
      }
    };

    fetchJob();
  }, [id]);

  const skills = splitSkills(job?.requiredSkills);
  const proposalScore = useMemo(() => {
    let score = 0;

    if (message.trim().length >= 80) {
      score += 35;
    } else if (message.trim().length >= 35) {
      score += 20;
    }

    if (Number(bidAmount) > 0) {
      score += 25;
    }

    if (
      skills.some((skill) =>
        message.toLowerCase().includes(skill.toLowerCase()),
      )
    ) {
      score += 25;
    }

    if (message.toLowerCase().includes("timeline")) {
      score += 15;
    }

    return Math.min(score, 100);
  }, [bidAmount, message, skills]);

  const handleProposal = async (event) => {
    event.preventDefault();
    setSubmitStatus("submitting");
    setError("");

    try {
      await createProposal({
        message,
        bidAmount,
        jobId: id,
      });

      setSubmitStatus("success");
      setMessage("");
    } catch (proposalError) {
      console.log(proposalError);
      setError("Proposal failed. Please check your bid and try again.");
      setSubmitStatus("idle");
    }
  };

  return (
    <main className="app-page">
      <section className="page-shell max-w-6xl">
        <Link
          to="/jobs"
          className="font-bold text-blue-700 transition hover:text-blue-900"
        >
          Back to jobs
        </Link>

        {loadStatus === "loading" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="h-80 animate-pulse rounded-lg border border-slate-200 bg-white" />
            <div className="h-80 animate-pulse rounded-lg border border-slate-200 bg-white" />
          </div>
        )}

        {loadStatus === "error" && (
          <div className="soft-card mt-6 border-red-200 bg-red-50 p-6 text-red-800">
            Job details could not be loaded.
          </div>
        )}

        {loadStatus === "success" && job && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.82fr]">
            <article className="surface-card p-6 sm:p-8">
              <p className="portal-eyebrow">Job details</p>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
                    {job.title || "Untitled project"}
                  </h1>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    Posted by {job.postedBy || "client"}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                  Active
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Budget
                  </p>
                  <p className="mt-1 text-xl font-black text-slate-950">
                    {formatCurrency(job.budget)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Skills
                  </p>
                  <p className="mt-1 text-xl font-black text-slate-950">
                    {skills.length}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Match tip
                  </p>
                  <p className="mt-1 text-xl font-black text-blue-700">
                    Be specific
                  </p>
                </div>
              </div>

              {user?.role === "CLIENT" && (
                <Link
                  to={`/jobs/${job.id}/proposals`}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  View Proposals
                </Link>
              )}

              <div className="mt-7">
                <h2 className="text-lg font-black text-slate-950">
                  Project brief
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {job.description || "No description provided yet."}
                </p>
              </div>

              {skills.length > 0 && (
                <div className="mt-7">
                  <h2 className="text-lg font-black text-slate-950">
                    Required skills
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() =>
                          setMessage((current) =>
                            current.includes(skill)
                              ? current
                              : `${current}${current ? " " : ""}I have experience with ${skill}.`,
                          )
                        }
                        className="accent-pill px-3 py-1.5 text-xs font-bold transition hover:border-blue-400 hover:bg-blue-100"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {user?.role === "FREELANCER" && (
              <aside className="surface-card h-fit p-6 sm:p-8">
                <p className="portal-eyebrow">Apply now</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Submit a proposal
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Mention your approach, relevant skills, timeline, and bid.
                </p>

                <div className="mt-5 rounded-md border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-slate-700">
                      Proposal strength
                    </p>
                    <p className="text-lg font-black text-blue-700">
                      {proposalScore}%
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${proposalScore}%` }}
                    />
                  </div>
                </div>

                {submitStatus === "success" && (
                  <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    Proposal submitted successfully.
                  </div>
                )}

                {error && (
                  <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                  </div>
                )}

                <form onSubmit={handleProposal} className="mt-6 grid gap-5">
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-slate-700">
                      Proposal message
                    </span>
                    <textarea
                      value={message}
                      placeholder="Describe your approach, timeline, and similar work."
                      rows="8"
                      className="field resize-y"
                      onChange={(event) => setMessage(event.target.value)}
                      required
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-slate-700">
                      Bid amount
                    </span>
                    <input
                      type="number"
                      value={bidAmount}
                      placeholder="15000"
                      min="1"
                      className="field"
                      onChange={(event) => setBidAmount(event.target.value)}
                      required
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={submitStatus === "submitting"}
                    className="btn-primary px-5 py-3 text-sm"
                  >
                    {submitStatus === "submitting"
                      ? "Submitting..."
                      : "Submit Proposal"}
                  </button>
                </form>
              </aside>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default JobDetails;
