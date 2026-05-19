import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { loginUser, updateOnlineStatus } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // VALIDATE FORM
  const validateForm = () => {
    const newErrors = {};

    // EMAIL
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email";
    }

    // PASSWORD
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // HANDLE LOGIN
  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    setIsSubmitting(true);

    // VALIDATE
    if (!validateForm()) {
      setIsSubmitting(false);

      return;
    }

    try {
      const response = await loginUser({
        email,

        password,
      });

      // ACTUAL DATA
      const userData = response.data;

      // SAVE TOKEN
      localStorage.setItem(
        "token",

        userData.token,
      );

      // SAVE USER INFO
      localStorage.setItem(
        "user",

        JSON.stringify({
          id: userData.id,

          name: userData.name,

          role: userData.role,

          email: userData.email,
        }),
      );

      updateOnlineStatus(true).catch((statusError) => console.log(statusError));

      toast.success("Login successful 🚀");

      await updateOnlineStatus(true);

      // NAVIGATE
      navigate("/dashboard");
    } catch (loginError) {
      console.log(loginError);

      toast.error("Login failed. Please check your email and password.");
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
            <p className="portal-eyebrow">Welcome back</p>

            <h1 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">
              Manage freelance work with confidence.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Sign in to review jobs, proposals, contracts, and payment activity
              from one clean workspace.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="surface-card w-full p-6 sm:p-8">
          <h2 className="text-2xl font-black text-slate-950">Login</h2>

          <p className="mt-2 text-sm text-slate-500">
            Use your marketplace account credentials.
          </p>

          {/* GLOBAL ERROR */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="mt-6 grid gap-4">
            {/* EMAIL */}
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Email</span>

              <input
                type="text"
                placeholder="you@example.com"
                className={`field ${
                  errors.email ? "border-red-500 focus:ring-red-500" : ""
                }`}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);

                  setErrors({
                    ...errors,

                    email: "",
                  });
                }}
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
                placeholder="Enter your password"
                className={`field ${
                  errors.password ? "border-red-500 focus:ring-red-500" : ""
                }`}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);

                  setErrors({
                    ...errors,

                    password: "",
                  });
                }}
              />

              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </label>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary mt-6 w-full px-4 py-3 text-sm"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          {/* REGISTER LINK */}
          <p className="mt-5 text-center text-sm text-slate-500">
            New here?{" "}
            <Link to="/register" className="font-bold text-blue-700">
              Create an account
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
