import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Components
import ProtectedRoutes from "./components/ProtectedRoutes";

// Pages
import HomePage from "./Pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Dashboard from "./Pages/Dashboard";
import JobPosts from "./pages/jobs/JobPosts";
import JobDetails from "./pages/jobs/JobDetails";
import JobApplications from "./pages/employer/JobApplications";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/job-posts" element={<JobPosts />} />
            <Route path="/job-posts/:id" element={<JobDetails />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={
            <ProtectedRoutes>
              <DashboardLayout />
            </ProtectedRoutes>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employer/jobs/:id/applications" element={<JobApplications />} />
            {/* Future role-specific sub-routes can go here */}
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
