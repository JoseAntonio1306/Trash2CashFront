import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout/Layout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { useAuthStore } from './store/authStore';
import { healthAPI } from './services/api';
import { Me } from './pages/Me';
import { LotsList, LotCreateForm } from './pages/Lots.tsx';
import { OfferCreateForm } from './pages/Offers';
import { AllocationCreateForm, AllocationCancelForm } from './pages/Allocations';
import { PaymentHoldForm, PaymentReleaseForm } from './pages/Payments';
import { ShipmentQuoteForm, ShipmentCreateForm, ShipmentStatusForm } from './pages/Shipments';
import { CompanyCreateForm, CompanyRolesAdmin } from './pages/Companies';
import { LotDetail } from './pages/LotDetail';

// Create a client
const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  const hydrateMe = useAuthStore((s) => s.hydrateMe);
  useEffect(() => {
    // si hay token guardado, intenta cargar /me
    const stored = localStorage.getItem('t2c_token');
    if (stored) {
      hydrateMe();
    }
  }, [hydrateMe]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Landing /></Layout>} />
          <Route path="/auth" element={<Layout showFooter={false}><Auth /></Layout>} />
          <Route path="/health" element={<Layout><HealthPage /></Layout>} />
          
          {/* Protected Routes */}
          <Route path="/me" element={<ProtectedRoute><Layout><Me /></Layout></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><Layout><LotsList /></Layout></ProtectedRoute>} />
          <Route path="/publish" element={<ProtectedRoute><Layout><LotCreateForm /></Layout></ProtectedRoute>} />
          <Route path="/lots/:id" element={<Layout><LotDetail /></Layout>} />
          <Route path="/offers/new" element={<ProtectedRoute><Layout><OfferCreateForm /></Layout></ProtectedRoute>} />
          <Route path="/allocations/new" element={<ProtectedRoute><Layout><AllocationCreateForm /></Layout></ProtectedRoute>} />
          <Route path="/allocations/cancel" element={<ProtectedRoute><Layout><AllocationCancelForm /></Layout></ProtectedRoute>} />
          <Route path="/payments/hold" element={<ProtectedRoute><Layout><PaymentHoldForm /></Layout></ProtectedRoute>} />
          <Route path="/payments/release" element={<ProtectedRoute><Layout><PaymentReleaseForm /></Layout></ProtectedRoute>} />
          <Route path="/shipments/quote" element={<Layout><ShipmentQuoteForm /></Layout>} />
          <Route path="/shipments/new" element={<ProtectedRoute><Layout><ShipmentCreateForm /></Layout></ProtectedRoute>} />
          <Route path="/shipments/status" element={<ProtectedRoute><Layout><ShipmentStatusForm /></Layout></ProtectedRoute>} />
          <Route path="/companies/new" element={<Layout><CompanyCreateForm /></Layout>} />
          <Route path="/admin/company-roles" element={<ProtectedRoute><Layout><CompanyRolesAdmin /></Layout></ProtectedRoute>} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

const HealthPage: React.FC = () => {
  const [status, setStatus] = React.useState<string>('Verificando...');
  useEffect(() => {
    healthAPI
      .healthz()
      .then(() => setStatus('OK'))
      .catch(() => setStatus('OFFLINE'));
  }, []);
  return <div className="p-8 text-center">Backend: {status}</div>;
};