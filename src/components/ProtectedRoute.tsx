import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import { LoadingState } from './PageStates';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();
  if (location.pathname === '/' || location.pathname === '/about' || location.pathname === '/auth') return <>{children}</>;
  if (loading) return <LoadingState/>;
  return session ? <>{children}</> : <Navigate to="/auth" replace state={{ from: location.pathname + location.search }} />;
}
