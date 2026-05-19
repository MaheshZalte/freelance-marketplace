import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getContractById } from "../services/contractService";
import { createOrder, verifyPayment } from "../services/paymentService";

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

function Payment() {
  const { contractId } = useParams();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [orderPreview, setOrderPreview] = useState(null);

  const [contract, setContract] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const data = await getContractById(contractId);

        setContract(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchContract();
  }, [contractId]);

  const handlePayment = async () => {
    setStatus("processing");
    setMessage("");

    if (!window.Razorpay) {
      setStatus("error");
      setMessage(
        "Razorpay checkout could not be loaded. Refresh the page and try again.",
      );
      return;
    }

    if (!razorpayKey) {
      setStatus("error");
      setMessage("Razorpay public key is not configured.");
      return;
    }

    try {
      const order = await createOrder({
        amount: contract.amount,

        contractId: contract.id,
      });

      setOrderPreview(order);

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "FreelanceMarket",
        description: "Contract Payment",
        order_id: order.id,
        handler: async function (response) {
          const verifyData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            contractId: contract.id,
            amount: contract.amount,
          };

          await verifyPayment(verifyData);
          setStatus("success");
          setMessage("Payment verified successfully.");
        },
        modal: {
          ondismiss: function () {
            setStatus("idle");
            setMessage("Checkout closed before payment was completed.");
          },
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
      setStatus("error");
      setMessage("Payment failed. Please try again.");
    }
  };

  return (
    <main className="app-page">
      <section className="page-shell max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.78fr]">
          <div className="surface-card overflow-hidden">
            <div className="hero-panel rounded-none px-6 py-8 sm:px-8">
              <div className="relative z-10">
                <p className="portal-eyebrow">Checkout</p>
                <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                  Secure contract payment
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Create a Razorpay order, complete checkout, and verify the
                  payment with the backend.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {message && (
                <div
                  className={`rounded-md border p-4 text-sm ${
                    status === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : status === "error"
                        ? "border-red-200 bg-red-50 text-red-800"
                        : "border-blue-200 bg-blue-50 text-blue-800"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="mt-6 grid gap-4">
                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Job</p>

                  <h2 className="font-black">{contract?.job?.title}</h2>
                </div>

                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Freelancer</p>

                  <h2 className="font-black">{contract?.freelancer?.name}</h2>
                </div>

                <div className="rounded-md bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Amount</p>

                  <h2 className="text-2xl font-black text-emerald-600">
                    INR {contract?.amount}
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {["Create order", "Pay in Razorpay", "Verify payment"].map(
                  (step, index) => (
                    <div
                      key={step}
                      className="rounded-md border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Step {index + 1}
                      </p>
                      <p className="mt-1 font-black text-slate-950">{step}</p>
                    </div>
                  ),
                )}
              </div>

              <button
                onClick={handlePayment}
                disabled={status === "processing"}
                className="btn-primary mt-8 px-6 py-3 text-sm"
              >
                {status === "processing" ? "Opening checkout..." : "Pay Now"}
              </button>
            </div>
          </div>

          <aside className="surface-card h-fit p-6">
            <p className="portal-eyebrow">Order preview</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">
              Checkout data
            </h2>
            <dl className="mt-5 grid gap-3 text-sm">
              <div className="rounded-md bg-slate-50 p-3">
                <dt className="font-bold text-slate-500">Order ID</dt>
                <dd className="mt-1 break-all font-semibold text-slate-800">
                  {orderPreview?.id || "Created when payment starts"}
                </dd>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <dt className="font-bold text-slate-500">Currency</dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {orderPreview?.currency || "INR"}
                </dd>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <dt className="font-bold text-slate-500">Status</dt>
                <dd className="mt-1 font-semibold text-slate-800">{status}</dd>
              </div>
            </dl>
            <Link
              to="/payments"
              className="btn-secondary mt-5 block px-4 py-2.5 text-center text-sm"
            >
              View payment history
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Payment;
