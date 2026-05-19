import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "FREELANCER",
    skills: "",
  });

  const [error, setError] = useState("");

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (event) => {
    setFormData({
      ...formData,

      [event.target.name]: event.target.value,
    });

    // CLEAR FIELD ERROR
    setErrors({
      ...errors,

      [event.target.name]: "",
    });
  };

  // VALIDATE FORM
  const validateForm = () => {
    const newErrors = {};

    // NAME
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // EMAIL
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    // PASSWORD
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else {
      const password = formData.password;

      const hasUppercase = /[A-Z]/.test(password);

      const hasLowercase = /[a-z]/.test(password);

      const hasNumber = /[0-9]/.test(password);

      const hasSpecial = /[@$!%*?&]/.test(password);

      const hasMinLength = password.length >= 8;

      if (
        !hasUppercase ||
        !hasLowercase ||
        !hasNumber ||
        !hasSpecial ||
        !hasMinLength
      ) {
        newErrors.password =
          "Password must contain uppercase, lowercase, number, special character and be at least 8 characters";
      }
    }

    // SKILLS
    if (!formData.skills.trim()) {
      newErrors.skills = "Skills are required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT FORM
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    setIsSubmitting(true);

    // VALIDATE
    if (!validateForm()) {
      setIsSubmitting(false);

      return;
    }

    try {
      await registerUser(formData);

      toast.success("Account created successfully 🚀");

      navigate("/login");
    } catch (submitError) {
      console.log(submitError.response?.data);

      setError(JSON.stringify(submitError.response?.data, null, 2));

      toast.error("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-page">
      <section className="page-shell grid min-h-[calc(100vh-73px)] items-center gap-10 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hero-panel px-6 py-8 sm:px-8 lg:px-10">
          <div className="relative z-10">
            <p className="portal-eyebrow">Join the marketplace</p>

            <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">
              Build a cleaner hiring and freelancing workflow.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Create a profile as a client or freelancer and start managing work
              through proposals, contracts, and payments.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="surface-card w-full p-6 sm:p-8"
        >
          <h2 className="text-2xl font-black text-slate-950">Register</h2>

          {/* GLOBAL ERROR */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="mt-6 grid gap-4">
            {/* NAME */}
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Name</span>

              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Your full name"
                className={`field ${
                  errors.name ? "border-red-500 focus:ring-red-500" : ""
                }`}
                onChange={handleChange}
              />

              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </label>

            {/* EMAIL */}
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Email</span>

              <input
                type="text"
                name="email"
                value={formData.email}
                placeholder="you@example.com"
                className={`field ${
                  errors.email ? "border-red-500 focus:ring-red-500" : ""
                }`}
                onChange={handleChange}
              />

              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </label>

            {/* PASSWORD */}
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Password</span>

              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Example: Mahesh@123"
                className={`field ${
                  errors.password ? "border-red-500 focus:ring-red-500" : ""
                }`}
                onChange={handleChange}
              />

              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </label>

            {/* ROLE + SKILLS */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* ROLE */}
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">Role</span>

                <select
                  name="role"
                  value={formData.role}
                  className="field"
                  onChange={handleChange}
                >
                  <option value="FREELANCER">Freelancer</option>

                  <option value="CLIENT">Client</option>
                </select>
              </label>

              {/* SKILLS */}
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">Skills</span>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  placeholder="React, Java, Design"
                  className={`field ${
                    errors.skills ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  onChange={handleChange}
                />

                {errors.skills && (
                  <p className="text-sm text-red-500">{errors.skills}</p>
                )}
              </label>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary mt-6 w-full px-4 py-3 text-sm"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>

          {/* LOGIN LINK */}
          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-700">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
