


import Modal from "../components/Modal";



function FreelancerProfileModal({
  isOpen,
  onClose,
  profile,
  loading,
  error,
}) {
  const localProfile = profile || null;


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Freelancer Profile"
    >
      {loading && (
        <div className="space-y-3">
          <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && localProfile && (
        <div className="grid gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-black text-white">
              {(localProfile?.name || localProfile?.email || "U").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-xl font-black text-slate-950">
                  {localProfile?.name || localProfile?.email || "Unknown"}
                </h2>
                {localProfile?.role && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                    {localProfile.role}
                  </span>
                )}
              </div>

              <p className="mt-1 truncate text-sm text-slate-500">
                {localProfile?.email || "Email not available"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Bio
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {localProfile?.bio ||
                "No bio provided yet."}
            </p>
          </div>

          {(localProfile?.title || localProfile?.profileImage) && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-4">
                {localProfile?.profileImage ? (
                  <img
                    src={localProfile.profileImage}
                    alt="Profile"
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-lg font-black text-white">
                    {(localProfile?.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  {localProfile?.title && (
                    <h3 className="truncate text-sm font-bold text-slate-950">
                      {localProfile.title}
                    </h3>
                  )}
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Trusted Freelancer
                  </p>
                </div>
              </div>

              {(localProfile?.rating != null || localProfile?.reviewCount != null) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {localProfile?.rating != null && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      Rating: {Number(localProfile.rating).toFixed(1)} ★
                    </span>
                  )}
                  {localProfile?.reviewCount != null && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      {localProfile.reviewCount} Reviews
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Experience
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {localProfile?.experience || "Not provided yet."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Hourly Rate
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {localProfile?.hourlyRate != null
                  ? `$${localProfile.hourlyRate}/hr`
                  : "Not provided yet."}
              </p>
            </div>
          </div>

          {localProfile?.skills && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Skills
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {String(localProfile.skills)
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .slice(0, 12)
                  .map((skill, idx) => (
                    <span
                      key={`${skill}-${idx}`}
                      className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {localProfile?.portfolioLink && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Portfolio
              </p>
              <a
                href={localProfile.portfolioLink}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block break-all text-sm font-semibold text-blue-600 hover:underline"
              >
                {localProfile.portfolioLink}
              </a>
            </div>
          )}
        </div>
      )}

      {!loading && !error && !localProfile && (
        <div className="text-sm text-slate-600">No profile data.</div>
      )}
    </Modal>
  );
}

export default FreelancerProfileModal;

