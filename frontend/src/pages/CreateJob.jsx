import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createJob } from "../services/jobService";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    requiredSkills: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await createJob(formData);
      navigate("/jobs");
    } catch (submitError) {
      console.log(submitError);
      setError("Failed to create the job. Please review the details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-page">
      <section className="page-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="hero-panel h-fit px-6 py-8 sm:px-8">
          <div className="relative z-10">
            <p className="portal-eyebrow">Hiring</p>
            <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Create a Job
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
              Write a clear project brief with budget and required skills so the
              right freelancers can qualify themselves quickly.
            </p>

            <div className="mt-6 grid gap-3">
              {["Clear title", "Defined budget", "Skill requirements"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-md border border-blue-100 bg-white/85 px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="surface-card p-6 sm:p-8">
          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Job title</span>
              <input
                type="text"
                name="title"
                value={formData.title}
                placeholder="Build a responsive portfolio website"
                className="field"
                onChange={handleChange}
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">
                Description
              </span>
              <textarea
                name="description"
                value={formData.description}
                placeholder="Share scope, deliverables, timeline, and expectations."
                rows="7"
                className="field resize-y"
                onChange={handleChange}
                required
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">Budget</span>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  placeholder="25000"
                  min="1"
                  className="field"
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">
                  Required skills
                </span>
                <input
                  type="text"
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  placeholder="React, Tailwind, API integration"
                  className="field"
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="btn-secondary px-5 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-5 py-2.5 text-sm"
            >
              {isSubmitting ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CreateJob;
