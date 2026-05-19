import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getMyProposals }
from "../services/proposalService";

import {
  formatCurrency
} from "../utils/formatters";

function MyApplications() {

  const [proposals,
    setProposals] =
      useState([]);

  const [loading,
    setLoading] =
      useState(true);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const data =
            await getMyProposals();

          setProposals(data);

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, []);

  if (loading) {

    return (

      <div className="p-10 text-center">

        Loading...

      </div>
    );
  }

  return (

    <main className="app-page">

      <section className="page-shell">

        {/* HEADER */}
        <div className="mb-6">

          <p className="portal-eyebrow">

            Freelancer

          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">

            My Applications

          </h1>

          <p className="mt-2 text-sm text-slate-600">

            Track all proposals and contracts.

          </p>

        </div>

        {/* EMPTY */}
        {proposals.length === 0 && (

          <div className="surface-card p-10 text-center">

            <h2 className="text-xl font-black text-slate-900">

              No applications yet

            </h2>

            <p className="mt-2 text-sm text-slate-500">

              Start applying to jobs.

            </p>

          </div>
        )}

        {/* LIST */}
        <div className="grid gap-5">

          {proposals.map((proposal) => (

            <div
              key={proposal.id}
              className="surface-card p-6"
            >

              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                {/* LEFT */}
                <div>

                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">

                    Proposal

                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-950">

                    {proposal.job?.title}

                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">

                    {proposal.message}

                  </p>

                  {/* META */}
                  <div className="mt-5 flex flex-wrap gap-4 text-sm">

                    <div className="rounded-md bg-slate-100 px-3 py-2 font-bold text-slate-700">

                      Bid:
                      {" "}
                      {formatCurrency(
                        proposal.bidAmount
                      )}

                    </div>

                    <div
                      className={`rounded-md px-3 py-2 font-bold ${
                        proposal.accepted
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >

                      {proposal.accepted
                        ? "Accepted"
                        : "Pending"}

                    </div>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex gap-3">

                  {proposal.accepted && (

                    <Link
                      to="/contracts"
                      className="btn-primary px-5 py-3 text-sm"
                    >

                      View Contract

                    </Link>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>

      </section>

    </main>
  );
}

export default MyApplications;