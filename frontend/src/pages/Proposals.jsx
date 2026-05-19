import { useEffect, useMemo, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
  CheckCircle2,
  MessageSquare,
  IndianRupee,
  XCircle,
  Sparkles,
  Clock3,
} from "lucide-react";

import { rejectProposal } from "../services/proposalService";

import { createContract } from "../services/contractService";

import { formatCurrency } from "../utils/formatters";

import { getProposalsByJob } from "../services/proposalService";

import FreelancerProfileModal from "./FreelancerProfileModal";

function Proposals() {
  const { jobId } = useParams();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [selectedFreelancerProfile, setSelectedFreelancerProfile] = useState(null);

  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const [profileError, setProfileError] = useState("");

  const handleOpenProfile = (freelancer) => {
    setProfileError("");
    setIsProfileLoading(false);
    setSelectedFreelancerProfile(freelancer || null);
    setIsProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    setSelectedFreelancerProfile(null);
    setProfileError("");
  };



  const [proposals, setProposals] = useState([]);

  const [status, setStatus] = useState("loading");

  const [acceptedId, setAcceptedId] = useState(null);

  const [message, setMessage] = useState("");

  const [sortBy, setSortBy] = useState("highest");

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const data = await getProposalsByJob(jobId);

        setProposals(Array.isArray(data) ? data : []);

        setStatus("success");
      } catch (error) {
        console.log(error);

        setStatus("error");
      }
    };

    fetchProposals();
  }, [jobId]);

  // SORTING
  const visibleProposals = useMemo(() => {
    const next = [...proposals];

    if (sortBy === "lowest") {
      return next.sort(
        (a, b) => Number(a.bidAmount || 0) - Number(b.bidAmount || 0),
      );
    }

    if (sortBy === "message") {
      return next.sort(
        (a, b) =>
          String(b.message || "").length - String(a.message || "").length,
      );
    }

    return next.sort(
      (a, b) => Number(b.bidAmount || 0) - Number(a.bidAmount || 0),
    );
  }, [proposals, sortBy]);

  // AVERAGE BID
  const averageBid =
    proposals.length > 0
      ? proposals.reduce(
          (total, proposal) => total + Number(proposal.bidAmount || 0),
          0,
        ) / proposals.length
      : 0;

  // ACCEPT
  const handleAcceptProposal = async (proposalId) => {
    setAcceptedId(proposalId);

    setMessage("");

    try {
      await createContract(proposalId);

      setProposals((currentProposals) =>
        currentProposals.map((proposal) =>
          proposal.id === proposalId
            ? {
                ...proposal,
                accepted: true,
              }
            : proposal,
        ),
      );

      setMessage("Contract created successfully.");
    } catch (error) {
      console.log(error);

      setMessage(
        "Failed to create contract. Make sure this proposal belongs to your job.",
      );
    } finally {
      setAcceptedId(null);
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      await rejectProposal(proposalId);

      setProposals((current) =>
        current.filter((proposal) => proposal.id !== proposalId),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="app-page">
      <FreelancerProfileModal
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
        profile={selectedFreelancerProfile}
        loading={isProfileLoading}
        error={profileError}
      />
      <section className="page-shell max-w-6xl" onClick={(e) => e.stopPropagation()}>

        {/* BACK */}
        <Link
          to="/jobs"
          className="text-sm font-bold text-blue-700 transition hover:text-blue-900"
        >
          ← Back to jobs
        </Link>

        {/* HERO */}
        <div className="surface-card mt-5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-5">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
                <Sparkles size={13} />
                Hiring Workspace
              </div>

              <h1 className="mt-3 text-2xl font-bold text-slate-950">
                Compare Proposals
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Review freelancer profiles, compare bids, and select the best
                professional for your project.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xl font-bold text-slate-950">
                  {status === "loading" ? "--" : proposals.length}
                </p>

                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Proposals
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xl font-bold text-slate-950">
                  {formatCurrency(averageBid)}
                </p>

                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Avg Bid
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TOP BAR */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Received Proposals
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sort by pricing or proposal depth.
            </p>
          </div>

          {/* SORT */}
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="field max-w-52"
          >
            <option value="highest">Highest bid</option>

            <option value="lowest">Lowest bid</option>

            <option value="message">Longest message</option>
          </select>
        </div>

        {/* ALERT */}
        {message && (
          <div
            className={`mt-5 rounded-xl border p-4 text-sm ${
              message.includes("success")
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        {/* LOADING */}
        {status === "loading" && (
          <div className="mt-6 grid gap-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div className="surface-card mt-6 border-red-200 bg-red-50 p-5 text-red-800">
            Proposals could not be loaded.
          </div>
        )}

        {/* EMPTY */}
        {status === "success" && visibleProposals.length === 0 && (
          <div className="surface-card mt-6 border-dashed p-10 text-center">
            <h2 className="text-xl font-bold text-slate-950">
              No proposals yet
            </h2>

            <p className="mt-2 text-slate-600">
              Proposals for your jobs will appear here.
            </p>
          </div>
        )}

        {/* PROPOSALS */}
        {status === "success" && visibleProposals.length > 0 && (
          <div className="mt-6 grid gap-4">
            {visibleProposals.map((proposal) => (
              <article
                key={proposal.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="grid gap-5 lg:grid-cols-[1.5fr_0.6fr]">
                  {/* LEFT */}
                  <div>
                    <div className="flex gap-4">
                      {/* AVATAR */}
                      <div className="relative shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-lg font-bold text-white">
                          {proposal?.freelancer?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                      </div>

                      {/* INFO */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-bold text-slate-950">
                            {proposal?.freelancer?.name ||
                              proposal?.freelancer?.email ||
                              "Unknown freelancer"}
                          </h2>

                          {proposal.accepted && (
                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                              Accepted
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {proposal?.freelancer?.email || "Email not available"}
                        </p>

                        {/* BIO */}
                        <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <p className="text-sm leading-6 text-slate-600">
                            {proposal?.freelancer?.bio ||
                              "Experienced freelancer available for project collaboration."}
                          </p>
                        </div>

                        {/* SKILLS */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {proposal?.freelancer?.skills
                            ?.split(",")
                            ?.slice(0, 5)
                            ?.map((skill, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                        </div>

                        {/* PROPOSAL */}
                        <div className="mt-4">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                            Proposal
                          </p>

                          <p className="mt-2 text-sm leading-7 text-slate-700">
                            {proposal?.message ||
                              "No proposal message provided."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      {/* BID */}
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                          Bid Amount
                        </p>

                        <div className="mt-2 flex items-center gap-1">
                          <IndianRupee className="h-5 w-5 text-emerald-600" />

                          <span className="text-xl font-bold text-slate-950">
                            {formatCurrency(proposal?.bidAmount)}
                          </span>
                        </div>
                      </div>

                      {/* STATUS */}
                      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Clock3 size={14} />
                        Available Now
                      </div>

                      {/* MESSAGE LENGTH */}
                      <div className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-500">
                        {String(proposal?.message || "").length} chars proposal
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-5 grid gap-2">
                        {proposal?.accepted ? (
                          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                            Contract created
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleAcceptProposal(proposal?.id)}
                              disabled={acceptedId === proposal?.id}
                              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                            >
                              <CheckCircle2 size={16} />

                              {acceptedId === proposal?.id
                                ? "Accepting..."
                                : "Accept"}
                            </button>

                            <button
                              onClick={() => handleRejectProposal(proposal.id)}
                              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                            >
                              <XCircle size={16} />
                              Reject
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenProfile(proposal?.freelancer)}
                              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                            >
                              View Profile
                            </button>

                            <Link to={`/chat/${proposal?.freelancer?.id}`}

                              className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                            >
                              <MessageSquare size={16} />
                              Message
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Proposals;
