import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import OfficerDashboard from '../pages/officer/OfficerDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected Role-Based Routes */}
        <Route
          path="citizen/dashboard"
          element={
            <ProtectedRoute allowedRoles={['citizen', 'officer', 'admin']}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="officer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['officer', 'admin']}>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

