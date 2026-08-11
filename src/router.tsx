import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginView from "./views/auth/LoginView";
import DashboardView from "./views/DashboardView";
import EquipmentView from "./views/inventory/EquipmentView";
import UsersView from "./views/iam/UsersView";
import TicketsView from "./views/maintenance/TicketsView";
import MyQueueView from "./views/maintenance/MyQueueView";
import AppLayout from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginView />} />

        {/* Protected App Routes wrapped in AppLayout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/equipment" element={<EquipmentView />} />
          <Route path="/tickets" element={<TicketsView />} />
          <Route path="/my-queue" element={<MyQueueView />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                <UsersView />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
