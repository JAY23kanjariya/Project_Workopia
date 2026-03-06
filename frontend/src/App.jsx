// routing
import { BrowserRouter, Route, Routes , Navigate } from 'react-router-dom'
// context
import { AuthProvider } from './context/AuthContext'
// components
import Navbar from './components/Navbar'
// public Routes
import HomePage from './pages/HomePage'
import LoginPage from './pages/Auth/LoginPage'
import CreateAccountPage from './pages/Auth/CreateAccountPage'
import NotFoundPage from './pages/NotFoundPage'
// Protected Routes
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRouters'
import EmployerDashboard from './pages/employer/EmployerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import CandidateDashboard from './pages/candidate/CandidateDashboard'
import Categories from './pages/admin/Categories'
import User from './pages/admin/User'
import CategoriesForm from './pages/admin/CategoriesForm'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<CreateAccountPage />} />


          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employer/dashboard" element={<ProtectedRoute><EmployerDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/candidate/dashboard" element={<ProtectedRoute><CandidateDashboard /></ProtectedRoute>} />

          <Route path="/admin/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><User /></ProtectedRoute>} />
          <Route path="/admin/categories/create" element={<ProtectedRoute><CategoriesForm /></ProtectedRoute>} />
          <Route path="/admin/categories/:id" element={<ProtectedRoute><CategoriesForm /></ProtectedRoute>} />

          {/* 404 not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
