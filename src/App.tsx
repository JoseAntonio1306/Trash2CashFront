import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout/Layout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { useAuthStore } from './store/authStore';

// Create a client
const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Landing /></Layout>} />
          <Route path="/auth" element={<Layout showFooter={false}><Auth /></Layout>} />
          
          {/* Protected Routes - We'll add these in the next steps */}
          <Route path="/feed" element={
            <ProtectedRoute>
              <Layout><div className="p-8 text-center">Feed - Coming Soon</div></Layout>
            </ProtectedRoute>
          } />
          <Route path="/publish" element={
            <ProtectedRoute>
              <Layout><div className="p-8 text-center">Publish - Coming Soon</div></Layout>
            </ProtectedRoute>
          } />
          <Route path="/matches" element={
            <ProtectedRoute>
              <Layout><div className="p-8 text-center">Matches - Coming Soon</div></Layout>
            </ProtectedRoute>
          } />
          <Route path="/esg" element={
            <ProtectedRoute>
              <Layout><div className="p-8 text-center">ESG Dashboard - Coming Soon</div></Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout><div className="p-8 text-center">Profile - Coming Soon</div></Layout>
            </ProtectedRoute>
          } />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;