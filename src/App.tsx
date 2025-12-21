import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { MealProvider } from './context/MealContext';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CameraPage } from './pages/CameraPage';
import { EditorPage } from './pages/EditorPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <UserProvider>
      <MealProvider>
        <BrowserRouter>
          <div className="antialiased text-slate-900 bg-white max-w-md mx-auto min-h-screen border-x border-slate-100 shadow-2xl relative">
            <Routes>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/camera" element={
                <ProtectedRoute>
                  <CameraPage />
                </ProtectedRoute>
              } />
              <Route path="/editor" element={
                <ProtectedRoute>
                  <EditorPage />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </MealProvider>
    </UserProvider>
  );
}
