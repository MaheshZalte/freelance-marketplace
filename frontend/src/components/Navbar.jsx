import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Bell,
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  FileText,
  PlusCircle,
  ClipboardList,
  User,
  LogOut,
  Settings,
} from "lucide-react";

import { toast } from "react-toastify";

import { getUser, getToken, logout as authLogout } from "../utils/auth";

import { connectWebSocket } from "../services/websocketService";

import { getNotifications } from "../services/notificationService";

import { updateOnlineStatus } from "../services/userService";

function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();

  const token = getToken();
  const user = getUser();
  const role = user?.role;
  const avatarUrl = user?.profileImage;

  // FETCH NOTIFICATIONS
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  // WEBSOCKET + ONLINE STATUS
  useEffect(() => {
    if (!user?.id || !token) {
      return;
    }

    let mounted = true;

    const initializeConnection = async () => {
      try {
        await updateOnlineStatus(true);

        connectWebSocket(user.id, (notification) => {
          if (!mounted) return;

          toast.info(notification.message);

          setNotifications((prev) => [notification, ...prev]);
        });
      } catch (error) {
        console.log("WEBSOCKET ERROR", error);
      }
    };

    initializeConnection();

    return () => {
      mounted = false;

      updateOnlineStatus(false).catch(() => {});
    };
  }, []);

  // OUTSIDE CLICK CLOSE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await updateOnlineStatus(false);
    } catch (error) {
      console.log(error);
    }

    authLogout();

    navigate("/login");
  };

  // NAV LINK STYLE
  const navLinkClass = ({ isActive }) =>
    `relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          {/* LOGO */}
          <Link
            to={token ? "/dashboard" : "/login"}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-lg font-black text-white shadow-lg">
              FM
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-black tracking-tight text-slate-950">
                FreelanceMarket
              </h1>

              <p className="text-xs font-medium text-slate-500">
                Hire • Work • Grow
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          {token && (
            <nav className="hidden lg:flex items-center gap-2">
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>

              <NavLink to="/jobs" className={navLinkClass}>
                <Briefcase size={16} />
                Jobs
              </NavLink>

              <NavLink to="/contracts" className={navLinkClass}>
                <FileText size={16} />
                Contracts
              </NavLink>

              {role === "CLIENT" && (
                <NavLink to="/create-job" className={navLinkClass}>
                  <PlusCircle size={16} />
                  Create Job
                </NavLink>
              )}

              {role === "FREELANCER" && (
                <NavLink to="/my-applications" className={navLinkClass}>
                  <ClipboardList size={16} />
                  Applications
                </NavLink>
              )}
            </nav>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* NOTIFICATIONS */}
          {token && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl border border-slate-200 bg-white p-2.5 transition hover:bg-slate-100"
              >
                <Bell className="h-5 w-5 text-slate-700" />

                {notifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* DROPDOWN */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                  {/* HEADER */}
                  <div className="border-b border-slate-100 px-5 py-4">
                    <h2 className="text-base font-black text-slate-900">
                      Notifications
                    </h2>
                  </div>

                  {/* BODY */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-5 text-sm text-slate-500">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notification, index) => (
                        <div
                          key={notification.id || index}
                          className="border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50"
                        >
                          <p className="text-sm font-medium leading-6 text-slate-700">
                            {notification.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {token && (
            <div className="relative hidden sm:block" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50"
              >
                {/* AVATAR */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-black text-white overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl ? `/uploads/${avatarUrl}` : undefined}
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

                {/* INFO */}
                <div className="text-left leading-tight">
                  <p className="max-w-28 truncate text-sm font-bold text-slate-900">
                    {user?.name}
                  </p>

                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {role}
                  </p>
                </div>
              </button>

              {/* PROFILE DROPDOWN */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <User size={16} />
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Settings size={16} />
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* AUTH BUTTONS */}
          {!token && (
            <div className="hidden sm:flex items-center gap-2">
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02]"
              >
                Register
              </NavLink>
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          {token && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-slate-200 bg-white p-2.5 transition hover:bg-slate-100 lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-700" />
              ) : (
                <Menu className="h-5 w-5 text-slate-700" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && token && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="space-y-1 px-4 py-4">
            <NavLink
              to="/dashboard"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to="/jobs"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Briefcase size={18} />
              Jobs
            </NavLink>

            <NavLink
              to="/contracts"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText size={18} />
              Contracts
            </NavLink>

            {role === "CLIENT" && (
              <NavLink
                to="/create-job"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle size={18} />
                Create Job
              </NavLink>
            )}

            {role === "FREELANCER" && (
              <NavLink
                to="/my-applications"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ClipboardList size={18} />
                My Applications
              </NavLink>
            )}

            <NavLink
              to="/profile"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} />
              Profile
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
