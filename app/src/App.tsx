import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AgeVerificationModal } from '@/components/modals';
import { WheelPage } from '@/pages/WheelPage';
import { CasinoPage } from '@/pages/CasinoPage';
import './App.css';

// Componente de rota protegida
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAgeVerified } = useAuth();
  
  if (!isAgeVerified) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAuthenticated) {
    // Se não está autenticado mas verificou idade, mostra o cassino (que tem modais de login)
    return <>{children}</>;
  }
  
  return <>{children}</>;
}

// Componente de rota da roleta
function WheelRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAgeVerified } = useAuth();
  const hasSpun = localStorage.getItem('wheel_spun') === 'true';
  
  if (!isAgeVerified) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/casino" replace />;
  }
  
  if (hasSpun) {
    return <Navigate to="/casino" replace />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  const { isAgeVerified, verifyAge } = useAuth();
  const [showAgeModal, setShowAgeModal] = useState(false);

  useEffect(() => {
    if (!isAgeVerified) {
      setShowAgeModal(true);
    }
  }, [isAgeVerified]);

  const handleAgeVerify = () => {
    verifyAge();
    setShowAgeModal(false);
  };

  const handleAgeReject = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <>
      <AgeVerificationModal
        isOpen={showAgeModal}
        onVerify={handleAgeVerify}
        onReject={handleAgeReject}
      />
      
      <Routes>
        <Route 
          path="/" 
          element={
            isAgeVerified ? <Navigate to="/roleta" replace /> : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/roleta" 
          element={
            <WheelRoute>
              <WheelPage />
            </WheelRoute>
          } 
        />
        <Route 
          path="/casino" 
          element={
            <ProtectedRoute>
              <CasinoPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
