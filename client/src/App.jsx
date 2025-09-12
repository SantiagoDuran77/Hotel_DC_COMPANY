"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import { Toaster } from "./components/ui/Toaster"

// Layouts
import MainLayout from "./layouts/MainLayout"
import DashboardLayout from "./layouts/DashboardLayout"
import AuthLayout from "./layouts/AuthLayout"

// Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import RoomsPage from "./pages/RoomsPage"
import ServicesPage from "./pages/ServicesPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"

// Dashboard Pages
import CustomerDashboard from "./pages/dashboard/CustomerDashboard"
import AdminDashboard from "./pages/dashboard/AdminDashboard"
import ReceptionDashboard from "./pages/dashboard/ReceptionDashboard"
import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard"

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute"
import LoadingSpinner from "./components/ui/LoadingSpinner"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="App">
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Rutas de autenticación */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Rutas protegidas - Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["cliente"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route
          path="/reception"
          element={
            <ProtectedRoute allowedRoles={["reception", "admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ReceptionDashboard />} />
        </Route>

        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["empleado"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeDashboard />} />
        </Route>

        {/* Redirección automática basada en rol */}
        <Route path="/redirect" element={<DashboardRedirect />} />

        {/* Ruta 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster />
    </div>
  )
}

// Componente para redirección automática
function DashboardRedirect() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  const dashboardRoutes = {
    admin: "/admin",
    reception: "/reception",
    empleado: "/employee",
    cliente: "/dashboard",
  }

  return <Navigate to={dashboardRoutes[user.role] || "/"} replace />
}

// Página 404
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
        <a href="/" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}

export default App
