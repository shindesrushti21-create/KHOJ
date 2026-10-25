// DEMO AUTH ONLY. NOT PRODUCTION SECURITY. Replace with Supabase/Firebase Auth before real use.
import type { AuthProvider, AuthSession, AuthUser } from './types';
import { clearDiaryData } from '../diaryStorage';

type StoredUser = AuthUser & { salt: string; passwordHash: string };
const USERS_KEY = 'khoj_users';
const SESSION_KEY = 'khoj_session';
const encoder = new TextEncoder();
const bytesToBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const base64ToBytes = (text: string) => Uint8Array.from(atob(text), c => c.charCodeAt(0));
const safeRead = <T,>(key: string, fallback: T): T => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
};
const safeWrite = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { throw new Error('STORAGE_UNAVAILABLE'); }
};
const safeRemove = (key: string) => { try { localStorage.removeItem(key); } catch { /* storage may be disabled */ } };
async function derive(password: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 210_000, hash: 'SHA-256' }, key, 256);
  return new Uint8Array(bits);
}
function publicUser(user: StoredUser): AuthUser { return { id: user.id, email: user.email, name: user.name, isGuest: user.isGuest }; }
function current(): AuthSession | null {
  try { const value = localStorage.getItem(SESSION_KEY); return value ? JSON.parse(value) as AuthSession : null; } catch { return null; }
}
export class LocalDemoAuthProvider implements AuthProvider {
  async signUp(name: string, email: string, password: string): Promise<AuthUser> {
    const normalizedEmail = email.trim().toLowerCase();
    const users = safeRead<StoredUser[]>(USERS_KEY, []);
    if (users.some(user => user.email === normalizedEmail)) throw new Error('EMAIL_EXISTS');
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const user: StoredUser = { id: crypto.randomUUID(), email: normalizedEmail, name: name.trim(), isGuest: false, salt: bytesToBase64(salt), passwordHash: bytesToBase64(await derive(password, salt)) };
    safeWrite(USERS_KEY, [...users, user]);
    safeWrite(SESSION_KEY, { user: publicUser(user) });
    return publicUser(user);
  }
  async signIn(email: string, password: string): Promise<AuthUser> {
    const normalizedEmail = email.trim().toLowerCase();
    const users = safeRead<StoredUser[]>(USERS_KEY, []);
    const user = users.find(entry => entry.email === normalizedEmail);
    if (!user) throw new Error('INVALID_CREDENTIALS');
    const candidate = await derive(password, base64ToBytes(user.salt));
    const stored = base64ToBytes(user.passwordHash);
    const matches = candidate.length === stored.length && candidate.every((value, index) => value === stored[index]);
    if (!matches) throw new Error('INVALID_CREDENTIALS');
    safeWrite(SESSION_KEY, { user: publicUser(user) });
    return publicUser(user);
  }
  async signInAsGuest(): Promise<AuthUser> {
    const user: AuthUser = { id: 'guest-demo', email: '', name: 'Priya', isGuest: true };
    safeWrite(SESSION_KEY, { user });
    return user;
  }
  async signOut() { safeRemove(SESSION_KEY); }
  async getSession() { return current(); }
  async deleteAccount() {
    const session = current();
    if (!session) return;
    const users = safeRead<StoredUser[]>(USERS_KEY, []);
    safeWrite(USERS_KEY, users.filter(user => user.id !== session.user.id));
    safeRemove(`khoj.data.${session.user.id}`);
    safeRemove(`khoj.safety.${session.user.id}`);
    clearDiaryData(session.user.id);
    if (session.user.isGuest) safeRemove('khoj.entries.v1');
    safeRemove(SESSION_KEY);
  }
  async resetPassword(_email: string) { /* Demo mode never sends a password reset email. */ }
}
