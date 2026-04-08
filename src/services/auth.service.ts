import { AccountType, User } from '../types/auth';
import { api } from '../lib/api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  companyName: string;
  accountType: AccountType;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(request: LoginRequest): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', request);
  },

  async register(request: RegisterRequest): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/register', request);
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('homatz_auth_token');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    return api.get<User>('/auth/me');
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password, confirmPassword: password });
  },

  async changePassword(current: string, newPass: string): Promise<void> {
    await api.post('/auth/change-password', {
      currentPassword: current,
      newPassword: newPass,
      confirmPassword: newPass,
    });
  },
};
