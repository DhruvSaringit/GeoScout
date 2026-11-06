import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import AboutCredits from './pages/AboutCredits';
import MainChat from './pages/MainChat';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import SharedChat from './pages/SharedChat';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ModeProvider } from './context/ModeContext';

function App() {
  const router = createBrowserRouter([
    // Landing Page (Option A - Recommended)
    { 
      path: "/", 
      element: <LandingPage /> 
    },
    // Research Paper Heritage & Academic Credits
    { 
      path: "/about", 
      element: <AboutCredits /> 
    },
    { 
      path: "/credits", 
      element: <AboutCredits /> 
    },
    // Workspace Analysis
    { 
      path: "/chat", 
      element: <MainChat /> 
    },
    { 
      path: "/chat/:chatId", 
      element: <MainChat /> 
    },
    { 
      path: "/workspace", 
      element: <MainChat /> 
    },
    { 
      path: "/main-chat", 
      element: <MainChat /> 
    },
    // Authentication
    { 
      path: "/login", 
      element: <Auth /> 
    },
    { 
      path: "/signup", 
      element: <Auth /> 
    },
    // Shared Chat Access
    {
      path: "/shared/:token",
      element: <SharedChat /> 
    },
    // Administration
    { 
      path: "/admin/dashboard", 
      element: (
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      )
    },
  ]);

  return (
    <AuthProvider>
      <ModeProvider>
        <RouterProvider router={router} />
      </ModeProvider>
    </AuthProvider>
  );
}

export default App;
