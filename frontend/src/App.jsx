import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import CreateJob from "./pages/CreateJob";
import JobDetails from "./pages/JobDetails";
import Proposals from "./pages/Proposals";
import Payment from "./pages/Payment";
import Navbar from "./components/Navbar";
import Contracts from "./pages/Contracts";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import Payments from "./pages/Payments";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import Chat from "./pages/Chat";
import { updateOnlineStatus } from "./services/authService";

import { useEffect } from "react";

import { isAuthenticated } from "./utils/auth";
import MyApplications from "./pages/MyApplications";

function App() {
  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    updateOnlineStatus(true);

    const handleOffline = () => {
      updateOnlineStatus(false).catch(() => {});
    };

    window.addEventListener("beforeunload", handleOffline);

    window.addEventListener("pagehide", handleOffline);

    return () => {
      window.removeEventListener("beforeunload", handleOffline);

      window.removeEventListener("pagehide", handleOffline);
    };
  }, []);


  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:contractId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contracts"
          element={
            <ProtectedRoute>
              <Contracts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <RoleProtectedRoute allowedRoles={["CLIENT"]}>
              <Payments />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/:contractId"
          element={
            <RoleProtectedRoute allowedRoles={["CLIENT"]}>
              <Payment />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/proposals/:jobId"
          element={
            <ProtectedRoute>
              <Proposals />
            </ProtectedRoute>
          }
        />

        <Route path="/my-applications" element={<MyApplications />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-job"
          element={
            <RoleProtectedRoute allowedRoles={["CLIENT"]}>
              <CreateJob />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
