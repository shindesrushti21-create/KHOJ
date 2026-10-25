import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LocalDemoAuthProvider } from './localAuth';
import type { AuthProvider, AuthSession, AuthUser } from './types';

type AuthContextValue = {
  session: AuthSession | null;
  loading: boolean;
  signUp: AuthProvider['signUp'];
  signIn: AuthProvider['signIn'];
  signInAsGuest: AuthProvider['signInAsGuest'];
  signOut: AuthProvider['signOut'];
  deleteAccount: AuthProvider['deleteAccount'];
  resetPassword: AuthProvider['resetPassword'];
  refreshSession: () => Promise<void>;
};
export const AuthContext = createContext<AuthContextValue | null>(null);
const defaultProvider = new LocalDemoAuthProvider();
export function AuthProviderContext({ children, provider = defaultProvider }: { children: ReactNode; provider?: AuthProvider }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshSession = async () => { setSession(await provider.getSession()); setLoading(false); };
  useEffect(() => { let alive = true; const sync = () => { provider.getSession().then(value => { if (alive) { setSession(value); setLoading(false); } }).catch(() => { if (alive) setLoading(false); }); }; const onStorage = (event: StorageEvent) => { if (event.key === 'khoj_session') sync(); }; sync(); window.addEventListener('storage', onStorage); return () => { alive = false; window.removeEventListener('storage', onStorage); }; }, [provider]);
  const value = useMemo<AuthContextValue>(() => ({
    session, loading, refreshSession,
    signUp: async (...args) => { const user = await provider.signUp(...args); await refreshSession(); return user; },
    signIn: async (...args) => { const user = await provider.signIn(...args); await refreshSession(); return user; },
    signInAsGuest: async () => { const user = await provider.signInAsGuest(); await refreshSession(); return user; },
    signOut: async () => { await provider.signOut(); await refreshSession(); },
    deleteAccount: async () => { await provider.deleteAccount(); await refreshSession(); },
    resetPassword: (...args) => provider.resetPassword(...args)
  }), [provider, session, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used within AuthProviderContext'); return value; }
export type { AuthUser };
