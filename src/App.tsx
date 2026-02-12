import React from "react";
import { Routes, Route, Navigate } from "react-router";

import LoginForm from "./components/Auth/LoginForm";
import { authService } from "./services/authService";
import RegisterForm from "./components/Auth/RegisterForm";
import UserManagement from "./components/UserManagement/UserManagement";

import "bootstrap/dist/css/bootstrap.min.css";

/**
 * IMPORTANT: Protected route component
 * NOTE: Redirects to login if user is not authenticated
 */
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
