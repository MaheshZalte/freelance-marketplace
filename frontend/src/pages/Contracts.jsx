import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import {
  Briefcase,
  CheckCircle2,
  Clock3,
  CreditCard,
  IndianRupee,
  MessageSquare,
  Sparkles,
  Star,
} from "lucide-react";

import { getAllContracts, completeContract } from "../services/contractService";

import { createReview } from "../services/reviewService";

import { formatCurrency } from "../utils/formatters";

import { getUser } from "../utils/auth";

function Contracts() {
  const [contracts, setContracts] = useState([]);

  const [status, setStatus] = useState("loading");

  const [reviewData, setReviewData] = useState({});

  const user = getUser();

  const [activeTab, setActiveTab] = useState("ACTIVE");


  // FETCH CONTRACTS
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await getAllContracts();

        setContracts(Array.isArray(data) ? data : []);

        setStatus("success");
      } catch (error) {
        console.log(error);

        setStatus("error");
      }
    };

    fetchContracts();
  }, []);

  // GROUP CONTRACTS
  const groupedContracts = useMemo(() => {
    const active = [];

    const paid = [];

    const completed = [];

    contracts.forEach((contract) => {
      const contractStatus = String(contract.status || "ACTIVE").toUpperCase();

      if (contractStatus === "ACTIVE") {
        active.push(contract);
      } else if (contractStatus === "PAID") {
        paid.push(contract);
      } else {
        completed.push(contract);
      }
    });

    // SORT LATEST FIRST
    const sortLatest = (a, b) => b.id - a.id;

    return {
      active: active.sort(sortLatest),
      paid: paid.sort(sortLatest),
      completed: completed.sort(sortLatest),
    };
  }, [contracts]);

  // TOTAL VALUE
  const totalValue = contracts.reduce(
    (total, contract) => total + Number(contract.amount || 0),
    0,
  );

  // COMPLETE CONTRACT
  const handleComplete = async (contractId) => {
    try {
      await completeContract(contractId);

      setContracts((prev) =>
        prev.map((contract) =>
          contract.id === contractId
            ? {
                ...contract,
                status: "COMPLETED",
              }
            : contract,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  // REVIEW
  const handleReview = async (contractId) => {
    try {
      const contractReview = reviewData[contractId];

      await createReview(contractId, {
        rating: contractReview?.rating || 5,
        comment: contractReview?.comment || "",
      });

      alert("Review submitted successfully");

      setReviewData((prev) => ({
        ...prev,
        [contractId]: {
          rating: 5,
          comment: "",
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // CONTRACT SECTION
  const renderContractSection = (title, contractsList, icon, emptyText) => {
    if (contractsList.length === 0) {
      return (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            {icon}
          </div>

          <h2 className="mt-5 text-2xl font-black text-slate-950">
            No {title}
          </h2>

          <p className="mt-3 text-sm text-slate-500">{emptyText}</p>
        </div>
      );
    }

    return (
      <div className="mt-8 grid gap-6">
        {contractsList.map((contract) => (
          <article
            key={contract.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="grid gap-5 p-6 lg:grid-cols-[1.6fr_0.6fr] lg:p-8">
              {/* LEFT */}
              <div>
                {/* HEADER */}
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-700">
                      <Sparkles size={14} />
                      Contract Workspace
                    </div>

                    <h2 className="text-xl font-bold text-slate-950">
                      {contract.job?.title || "Untitled Project"}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Contract #{contract.id}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div>
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ${
                        contract.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-700"
                          : contract.status === "PAID"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {contract.status}
                    </span>
                  </div>
                </div>

                {/* FREELANCER */}
                <div className="mt-5 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-lg font-black text-white shadow-lg">
                      {contract.freelancer?.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500" />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-950">
                      {contract.freelancer?.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {contract.freelancer?.email}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-600">
                      <Clock3 size={14} />
                      Available for collaboration
                    </div>
                  </div>
                </div>

                {/* REVIEW */}
                {contract.status === "COMPLETED" && user?.role === "CLIENT" && (
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-lg font-black text-slate-950">
                      Leave Review
                    </h3>

                    {/* RATING */}
                    <select
                      value={reviewData[contract.id]?.rating || 5}
                      onChange={(event) =>
                        setReviewData((prev) => ({
                          ...prev,
                          [contract.id]: {
                            ...prev[contract.id],
                            rating: event.target.value,
                          },
                        }))
                      }
                      className="field mt-4"
                    >
                      <option value="5">⭐ 5</option>

                      <option value="4">⭐ 4</option>

                      <option value="3">⭐ 3</option>

                      <option value="2">⭐ 2</option>

                      <option value="1">⭐ 1</option>
                    </select>

                    {/* COMMENT */}
                    <textarea
                      rows="4"
                      value={reviewData[contract.id]?.comment || ""}
                      onChange={(event) =>
                        setReviewData((prev) => ({
                          ...prev,
                          [contract.id]: {
                            ...prev[contract.id],
                            comment: event.target.value,
                          },
                        }))
                      }
                      placeholder="Write your feedback..."
                      className="field mt-4"
                    />

                    {/* BUTTON */}
                    <button
                      onClick={() => handleReview(contract.id)}
                      className="mt-4 flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-black text-white transition hover:bg-amber-600"
                    >
                      <Star size={18} />
                      Submit Review
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div>
                <div className=" rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  {/* PRICE */}
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Contract Value
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <IndianRupee className="h-7 w-7 text-emerald-600" />

                      <span className="text-2xl font-black text-slate-950">
                        {formatCurrency(contract.amount)}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-8 grid gap-3">
                    {/* CHAT */}
                    <Link
                      to={`/chat/${contract.id}`}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                    >
                      <MessageSquare size={18} />
                      Open Chat
                    </Link>

                    {/* PAY */}
                    {user?.role === "CLIENT" && contract.status !== "PAID" && (
                      <Link
                        to={`/payment/${contract.id}`}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:bg-slate-100"
                      >
                        <CreditCard size={18} />
                        Release Payment
                      </Link>
                    )}

                    {/* COMPLETE */}
                    {user?.role === "CLIENT" &&
                      contract.status === "ACTIVE" && (
                        <button
                          onClick={() => handleComplete(contract.id)}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-black text-white transition hover:bg-emerald-700"
                        >
                          <CheckCircle2 size={18} />
                          Mark Complete
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  };

  return (
    <main className="app-page">
      <section className="page-shell max-w-7xl">
        {/* HERO */}
        <div className="hero-panel px-6 py-5 sm:px-8">
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-700">
                <Briefcase size={14} />
                Workspace Dashboard
              </div>

              <h1 className="mt-5 text-3xl font-black text-slate-950 sm:text-4xl">
                Contracts Workspace
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Manage freelancer collaboration, project payments, active work,
                and delivery lifecycle from one professional workspace.
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm">
                <p className="text-3xl font-black text-slate-950">
                  {status === "loading" ? "--" : contracts.length}
                </p>

                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Contracts
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm">
                <p className="text-2xl font-black text-slate-950">
                  {formatCurrency(totalValue)}
                </p>

                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Total Value
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {status === "loading" && (
          <div className="mt-8 grid gap-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            Contracts could not be loaded.
          </div>
        )}

        {/* TABS */}
        {status === "success" && (
          <div className="mt-8">
            <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("ACTIVE")}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
                  activeTab === "ACTIVE"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Clock3 size={18} />
                Active
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("COMPLETED")}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
                  activeTab === "COMPLETED"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <CheckCircle2 size={18} />
                Completed
              </button>
            </div>

            {/* CONTENT */}
            <div>
              {activeTab === "ACTIVE"
                ? renderContractSection(
                    "Active Contracts",
                    groupedContracts.active,
                    <Clock3 className="h-8 w-8 text-slate-400" />,
                    "Accepted projects will appear here.",
                  )
                : renderContractSection(
                    "Completed Projects",
                    groupedContracts.completed,
                    <CheckCircle2 className="h-8 w-8 text-slate-400" />,
                    "Completed projects will appear here.",
                  )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Contracts;
