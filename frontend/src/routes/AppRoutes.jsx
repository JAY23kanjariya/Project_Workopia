import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import RoleRoute from '../auth/RoleRoute';
import { ROLES } from '../utils/constants';

// Public Pages
import HomePage from '../pages/public/HomePage';
import JobList from '../pages/public/JobList';
import JobDetails from '../pages/public/JobDetails';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFoundPage from '../pages/public/NotFoundPage';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import Categories from '../pages/admin/Categories';
import CategoriesForm from '../pages/admin/CategoriesForm';
import Users from '../pages/admin/Users';
import AdminJobs from '../pages/admin/Jobs';

// Employer Pages
import EmployerDashboard from '../pages/employer/Dashboard';
import EmployerJobs from '../pages/employer/Jobs';
import EmployerJobsForm from '../pages/employer/JobsForm';
import EmployerApplications from '../pages/employer/Applications';

// Candidate Pages
import CandidateDashboard from '../pages/candidate/Dashboard';
import AppliedJobs from '../pages/candidate/AppliedJobs';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
                <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <AdminDashboard />
                </RoleRoute>
            } />
            <Route path="/admin/categories" element={
                <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <Categories />
                </RoleRoute>
            } />
            <Route path="/admin/categories/create" element={
                <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <CategoriesForm />
                </RoleRoute>
            } />
            <Route path="/admin/categories/:id" element={
                <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <CategoriesForm />
                </RoleRoute>
            } />
            <Route path="/admin/users" element={
                <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <Users />
                </RoleRoute>
            } />
            <Route path="/admin/users/:id" element={
                <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <Users />
                </RoleRoute>
            } />
            <Route path="/admin/jobs" element={
                <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                    <AdminJobs />
                </RoleRoute>
            } />

            {/* Employer Routes */}
            <Route path="/employer/dashboard" element={
                <RoleRoute allowedRoles={[ROLES.EMPLOYER]}>
                    <EmployerDashboard />
                </RoleRoute>
            } />
            <Route path="/employer/jobs" element={
                <RoleRoute allowedRoles={[ROLES.EMPLOYER]}>
                    <EmployerJobs />
                </RoleRoute>
            } />
            <Route path="/employer/jobs/create" element={
                <RoleRoute allowedRoles={[ROLES.EMPLOYER]}>
                    <EmployerJobsForm />
                </RoleRoute>
            } />
            <Route path="/employer/jobs/:id" element={
                <RoleRoute allowedRoles={[ROLES.EMPLOYER]}>
                    <EmployerJobsForm />
                </RoleRoute>
            } />
            <Route path="/employer/applications" element={
                <RoleRoute allowedRoles={[ROLES.EMPLOYER]}>
                    <EmployerApplications />
                </RoleRoute>
            } />

            {/* Candidate Routes */}
            <Route path="/candidate/dashboard" element={
                <RoleRoute allowedRoles={[ROLES.CANDIDATE]}>
                    <CandidateDashboard />
                </RoleRoute>
            } />
            <Route path="/candidate/my-applications" element={
                <RoleRoute allowedRoles={[ROLES.CANDIDATE]}>
                    <AppliedJobs />
                </RoleRoute>
            } />

            {/* Catch All */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

