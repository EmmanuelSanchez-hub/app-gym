import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import RecepcionistaDashboard from "./pages/dashboard/RecepcionistaDashboard";
import ClienteDashboard from "./pages/dashboard/ClienteDashboard";
import Clientes from "./pages/clientes/Clientes";
import Suscripciones from "./pages/suscripciones/Suscripciones";
import RegistrarPago from "./pages/suscripciones/RegistrarPago";
import ProtectedRoute from "./routes/ProtectedRoute";
import './App.css'

export default function App() {
  return (
    <BrowserRouter basename="/app">
      <Routes>
        {/* Rutas públicas */}
        <Route path="*" element={<Navigate to="/login" replace />} />

        {/* Solo el admin puede registrar */}
        <Route
          path="/register"
          element={
            <ProtectedRoute role="admin">
              <Register />
            </ProtectedRoute>
          }
        />

        {/* Dashboards */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Gestión de clientes */}
        <Route
          path="/gestion/clientes"
          element={
            <ProtectedRoute role={["admin", "recepcionista"]} >
              <Clientes />
            </ProtectedRoute>
          }
        />
        {/* Gestión de suscripciones */}
        <Route
          path="/suscripciones"
          element={
            <ProtectedRoute role={["admin", "recepcionista"]}>
              <Suscripciones />
            </ProtectedRoute>
          }
        />
        {/* Registrar pago: accesible por admin o recepcionista */}
        <Route
          path="/admin/suscripciones/:id/RegistrarPago"
          element={
            <ProtectedRoute role="admin">
              <RegistrarPago />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recepcionista"
          element={
            <ProtectedRoute role="recepcionista">
              <RecepcionistaDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cliente"
          element={
            <ProtectedRoute role="cliente">
              <ClienteDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}