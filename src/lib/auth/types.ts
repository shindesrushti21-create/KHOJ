export type AuthUser = { id: string; email: string; name: string; isGuest: boolean };
export type AuthSession = { user: AuthUser };

export interface AuthProvider {
  signUp(name: string, email: string, password: string): Promise<AuthUser>;
  signIn(email: string, password: string): Promise<AuthUser>;
  signInAsGuest(): Promise<AuthUser>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  deleteAccount(): Promise<void>;
  resetPassword(email: string): Promise<void>;
}
