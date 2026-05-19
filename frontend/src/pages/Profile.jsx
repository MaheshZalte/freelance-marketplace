import { useEffect, useState } from "react";

import { getProfile, updateProfile } from "../services/userService";

import { uploadProfileImage } from "../services/profileUploadService";



import { splitSkills, formatCurrency } from "../utils/formatters";

import { getMyReviews } from "../services/reviewService";

function Profile() {
  const [reviews, setReviews] = useState([]);

  const [user, setUser] = useState({
    name: "",
    skills: "",
    email: "",
    role: "",
    bio: "",
    experience: "",
    portfolioLink: "",
    hourlyRate: "",
    profileImage: "",
  });

  const [status, setStatus] = useState("loading");

  const [message, setMessage] = useState("");

  const [selectedProfileFile, setSelectedProfileFile] = useState(null);

  const [uploadStatus, setUploadStatus] = useState("idle");


  // ROLE FLAGS
  const isFreelancer = user.role === "FREELANCER";

  const isClient = user.role === "CLIENT";

  // LOAD PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        setUser({
          name: data.name || "",
          email: data.email || "",
          skills: data.skills || "",
          role: data.role || "",
          bio: data.bio || "",
          experience: data.experience || "",
          portfolioLink: data.portfolioLink || "",
          hourlyRate: data.hourlyRate || "",
          profileImage: data.profileImage || "",
        });

        const reviewData = await getMyReviews();

        setReviews(reviewData);

        setStatus("success");
      } catch (error) {
        console.log(error);

        setStatus("error");
      }
    };

    fetchProfile();
  }, []);

  // UPDATE PROFILE
  const handleUpdate = async (event) => {
    event.preventDefault();

    setMessage("");

    setStatus("saving");

    try {
      const updated = await updateProfile(user);

      setUser({
        name: updated.name || "",
        email: updated.email || "",
        skills: updated.skills || "",
        role: updated.role || "",
        bio: updated.bio || "",
        experience: updated.experience || "",
        portfolioLink: updated.portfolioLink || "",
        hourlyRate: updated.hourlyRate || "",
        profileImage: updated.profileImage || "",
      });

      // sync navbar user cache so profile image updates instantly
      const stored = JSON.parse(localStorage.getItem("user") || "null") || {};
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...stored,
          name: updated.name || stored.name,
          role: updated.role || stored.role,
          profileImage: updated.profileImage || stored.profileImage,
          email: updated.email || stored.email,
        })
      );

      setStatus("success");

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.log(error);

      setStatus("success");

      setMessage("Profile update failed.");
    }
  };

  const skills = splitSkills(user.skills);

  const completionItems = [
    Boolean(user.name),
    Boolean(user.email),
    Boolean(user.role),
    Boolean(user.bio),
    isFreelancer ? Boolean(user.experience) : true,
    isFreelancer ? Boolean(user.hourlyRate) : true,
    isFreelancer ? skills.length > 0 : true,
  ];

  const completion = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100,
  );

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 py-6">
      <section className="mx-auto max-w-6xl px-4">
        {/* HERO */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

          <div className="relative px-6 pb-6">
            {/* AVATAR */}
            <div className="-mt-12 flex items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-600 to-indigo-700 text-3xl font-black text-white shadow-xl overflow-hidden">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage ? `/uploads/${user.profileImage}` : undefined}
                    alt={user?.name ? `${user.name} profile` : "Profile"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase()
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">
                  Change picture
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) =>
                      setSelectedProfileFile(
                        event.target.files?.[0] || null
                      )
                    }
                  />
                </label>

                <button
                  type="button"
                  disabled={!selectedProfileFile || uploadStatus === "uploading"}
                  onClick={async () => {
                    if (!selectedProfileFile) return;

                    try {
                      setUploadStatus("uploading");
                      setMessage("");

                      const formData = new FormData();
                      formData.append("file", selectedProfileFile);

                      await uploadProfileImage(formData);

                      // refresh profile so avatar updates instantly
                      const data = await getProfile();

                      setUser({
                        name: data.name || "",
                        email: data.email || "",
                        skills: data.skills || "",
                        role: data.role || "",
                        bio: data.bio || "",
                        experience: data.experience || "",
                        portfolioLink: data.portfolioLink || "",
                        hourlyRate: data.hourlyRate || "",
                        profileImage: data.profileImage || "",
                      });

                      // sync navbar user cache
                      const stored = JSON.parse(
                        localStorage.getItem("user") || "null"
                      ) || {};
                      localStorage.setItem(
                        "user",
                        JSON.stringify({
                          ...stored,
                          profileImage: data.profileImage || stored.profileImage,
                          name: data.name || stored.name,
                          role: data.role || stored.role,
                          email: data.email || stored.email,
                        })
                      );

                      setUploadStatus("success");
                      setMessage("Profile picture updated successfully.");
                    } catch (error) {
                      console.log(error);
                      setUploadStatus("error");
                      setMessage("Profile picture update failed.");
                    }
                  }}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
                >
                  {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>


            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* LEFT */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {user.role}
                </p>

                <h1 className="mt-1 text-3xl font-black text-slate-950">
                  {user.name || "Complete your profile"}
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  {user.bio ||
                    (isFreelancer
                      ? "Showcase your expertise, skills, and experience."
                      : "Describe your company, projects, and hiring goals.")}
                </p>
              </div>

              {/* PROFILE STRENGTH */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:min-w-[240px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Profile Strength
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-blue-700">
                      {completion}%
                    </h2>
                  </div>

                  {isFreelancer && (
                    <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">
                      {formatCurrency(user.hourlyRate || 0)}/hr
                    </div>
                  )}
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${completion}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {status === "error" && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            Profile could not be loaded.
          </div>
        )}

        {/* MAIN */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[340px_1fr]">
          {/* SIDEBAR */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* USER */}
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xl font-black uppercase text-white shadow-lg">
                {(user.name || user.email || "U").slice(0, 1)}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-black text-slate-950">
                  {user.name || "Unnamed User"}
                </h2>

                <p className="mt-1 truncate text-sm text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>

            {/* FREELANCER RATING */}
            {isFreelancer && (
              <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Rating
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <span className="text-3xl">⭐</span>

                  <div>
                    <p className="text-2xl font-black text-slate-950">
                      {averageRating}
                    </p>

                    <p className="text-xs text-slate-500">
                      {reviews.length} reviews
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CLIENT STATS */}
            {isClient && (
              <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Hiring Activity
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Projects Posted
                    </span>

                    <span className="font-black text-slate-950">12</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Active Contracts
                    </span>

                    <span className="font-black text-slate-950">4</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total Spent</span>

                    <span className="font-black text-emerald-600">₹85,000</span>
                  </div>
                </div>
              </div>
            )}

            {/* ROLE */}
            <div className="mt-4 rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Account Type
              </p>

              <p className="mt-2 text-lg font-black text-slate-950">
                {user.role || "Not set"}
              </p>
            </div>

            {/* FREELANCER ONLY */}
            {isFreelancer && (
              <>
                {/* EXPERIENCE */}
                <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Experience
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {user.experience || "No experience added."}
                  </p>
                </div>

                {/* PORTFOLIO */}
                <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Portfolio
                  </p>

                  {user.portfolioLink ? (
                    <a
                      href={user.portfolioLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block break-all text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {user.portfolioLink}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      No portfolio added.
                    </p>
                  )}
                </div>

                {/* SKILLS */}
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Skill Tags
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No skills added.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* FORM */}
          <form
            onSubmit={handleUpdate}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            {/* HEADER */}
            <div className="border-b border-slate-200 pb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Edit Details
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {isFreelancer ? "Freelancer Profile" : "Client Profile"}
              </h2>
            </div>

            {/* MESSAGE */}
            {message && (
              <div
                className={`mt-4 rounded-xl border p-3 text-sm font-semibold ${
                  message.includes("success")
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* FORM */}
            <div className="mt-5 grid gap-4">
              {/* NAME */}
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">
                  Full Name
                </span>

                <input
                  type="text"
                  value={user.name}
                  onChange={(event) =>
                    setUser({
                      ...user,
                      name: event.target.value,
                    })
                  }
                  placeholder="Enter full name"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                />
              </label>

              {/* BIO */}
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">Bio</span>

                <textarea
                  rows="4"
                  value={user.bio}
                  onChange={(event) =>
                    setUser({
                      ...user,
                      bio: event.target.value,
                    })
                  }
                  placeholder={
                    isFreelancer
                      ? "Tell clients about yourself"
                      : "Describe your company or hiring goals"
                  }
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                />
              </label>

              {/* FREELANCER ONLY FIELDS */}
              {isFreelancer && (
                <>
                  {/* SKILLS */}
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-slate-700">
                      Skills
                    </span>

                    <input
                      type="text"
                      value={user.skills}
                      onChange={(event) =>
                        setUser({
                          ...user,
                          skills: event.target.value,
                        })
                      }
                      placeholder="React, Java, Spring Boot"
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                    />
                  </label>

                  {/* EXPERIENCE */}
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-slate-700">
                      Experience
                    </span>

                    <input
                      type="text"
                      value={user.experience}
                      onChange={(event) =>
                        setUser({
                          ...user,
                          experience: event.target.value,
                        })
                      }
                      placeholder="2 years frontend development"
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                    />
                  </label>

                  {/* PORTFOLIO */}
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-slate-700">
                      Portfolio Link
                    </span>

                    <input
                      type="text"
                      value={user.portfolioLink}
                      onChange={(event) =>
                        setUser({
                          ...user,
                          portfolioLink: event.target.value,
                        })
                      }
                      placeholder="https://portfolio.com"
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                    />
                  </label>

                  {/* RATE */}
                  <label className="grid gap-2">
                    <span className="text-sm font-bold text-slate-700">
                      Hourly Rate
                    </span>

                    <input
                      type="number"
                      value={user.hourlyRate}
                      onChange={(event) =>
                        setUser({
                          ...user,
                          hourlyRate: event.target.value,
                        })
                      }
                      placeholder="500"
                      className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                    />
                  </label>
                </>
              )}

              {/* EMAIL + ROLE */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-slate-700">
                    Email
                  </span>

                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-slate-700">
                    Account Type
                  </span>

                  <input
                    type="text"
                    value={user.role}
                    disabled
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                  />
                </label>
              </div>
            </div>

            {/* BUTTON */}
            <div className="mt-6 flex justify-end">
              <button
                disabled={status === "saving"}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01]"
              >
                {status === "saving" ? "Saving..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Profile;
