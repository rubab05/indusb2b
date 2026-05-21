import { createContext, useContext, useEffect, useState } from 'react';
import { AccountType, AuthState, User } from '../types/auth';
import { authService, LoginRequest, RegisterRequest } from '../services/auth.service';
import { ApiError } from '../lib/api-client';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, companyName: string, accountType: AccountType) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'homatz_auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getCurrentUser()
      .then((u) => setUser(u))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const request: LoginRequest = { email, password };
    const { user: u, token } = await authService.login(request);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
  }

  async function logout() {
    try {
      await authService.logout();
    } catch {
      // server rejection is fine — clear local state regardless
    }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  async function register(
    email: string,
    password: string,
    companyName: string,
    accountType: AccountType,
  ) {
    const request: RegisterRequest = { email, password, companyName, accountType };
    const { user: u, token } = await authService.register(request);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
