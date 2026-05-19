import { useEffect, useMemo, useState } from "react";

import { getAllPayments } from "../services/paymentService";
import { formatCurrency } from "../utils/formatters";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("loading");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();

        setPayments(Array.isArray(data) ? data : []);
        setStatus("success");
      } catch (error) {
        console.log(error);
        setStatus("error");
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return payments;
    }

    return payments.filter((payment) =>
      [
        payment.razorpayOrderId,
        payment.razorpayPaymentId,
        payment.status,
        payment.contract?.job?.title,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [payments, query]);

  const totalPaid = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  return (
    <main className="app-page">
      <section className="page-shell max-w-6xl">
        <div className="hero-panel px-6 py-8 sm:px-8">
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-center">
            <div>
              <p className="portal-eyebrow">Finance</p>
              <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Payment History
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Review processed payments, gateway references, and linked
                contract records.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-blue-100 bg-white/85 p-4">
                <p className="text-2xl font-black text-slate-950">
                  {status === "loading" ? "--" : payments.length}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Payments
                </p>
              </div>
              <div className="rounded-md border border-blue-100 bg-white/85 p-4">
                <p className="text-2xl font-black text-slate-950">
                  {formatCurrency(totalPaid)}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Paid
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="portal-title text-2xl">Transactions</h2>
            <p className="portal-muted mt-1 text-sm">
              Showing {filteredPayments.length} of {payments.length} records.
            </p>
          </div>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search order, payment, status"
            className="field max-w-sm"
          />
        </div>

        {status === "loading" && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-lg border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="soft-card mt-6 border-red-200 bg-red-50 p-5 text-red-800">
            Payment history could not be loaded.
          </div>
        )}

        {status === "success" && filteredPayments.length === 0 && (
          <div className="surface-card mt-6 border-dashed p-10 text-center">
            <h2 className="text-xl font-black text-slate-950">
              No payments found
            </h2>
            <p className="mt-2 text-slate-600">
              Completed payments will appear here.
            </p>
          </div>
        )}

        {status === "success" && filteredPayments.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredPayments.map((payment) => (
              <article key={payment.id} className="job-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="portal-eyebrow">Amount</p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      {formatCurrency(payment.amount)}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {payment.contract?.job?.title || "Contract payment"}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                    {payment.status || "SUCCESS"}
                  </span>
                </div>

                <dl className="mt-5 grid gap-3 text-sm">
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="font-bold text-slate-500">Order ID</dt>
                    <dd className="mt-1 break-all text-slate-800">
                      {payment.razorpayOrderId || "Not available"}
                    </dd>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="font-bold text-slate-500">Payment ID</dt>
                    <dd className="mt-1 break-all text-slate-800">
                      {payment.razorpayPaymentId || "Not available"}
                    </dd>
                  </div>
                  <div className="rounded-md bg-slate-50 p-3">
                    <dt className="font-bold text-slate-500">Contract ID</dt>
                    <dd className="mt-1 text-slate-800">
                      {payment.contract?.id || "Not linked"}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Payments;
