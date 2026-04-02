import { AccountType, ApprovalStatus, User } from "../types/auth";

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

// Mock user store (in-memory, keyed by email)
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "wholesale@example.com",
    companyName: "Demo Wholesale Ltd",
    accountType: AccountType.WHOLESALE,
    approvalStatus: ApprovalStatus.APPROVED,
    role: "partner",
  },
  {
    id: "2",
    email: "dropship@example.com",
    companyName: "Demo Dropship Co",
    accountType: AccountType.DROPSHIP,
    approvalStatus: ApprovalStatus.APPROVED,
    role: "partner",
  },
  {
    id: "3",
    email: "pending@example.com",
    companyName: "Pending Company Ltd",
    accountType: AccountType.WHOLESALE,
    approvalStatus: ApprovalStatus.PENDING,
    role: "partner",
  },
  {
    id: "4",
    email: "admin@homatz.com",
    companyName: "HOMATZ",
    accountType: AccountType.WHOLESALE,
    approvalStatus: ApprovalStatus.APPROVED,
    role: "admin",
  },
];

export const authService = {
  async login(request: LoginRequest): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 600));

    const user = MOCK_USERS.find((u) => u.email === request.email);
    if (!user || request.password.length < 4) {
      throw new Error("Invalid email or password.");
    }

    return { user, token: `mock-token-${user.id}` };
  },

  async register(request: RegisterRequest): Promise<AuthResponse> {
    await new Promise((r) => setTimeout(r, 800));

    const exists = MOCK_USERS.find((u) => u.email === request.email);
    if (exists) {
      throw new Error("An account with this email already exists.");
    }

    const user: User = {
      id: String(MOCK_USERS.length + 1),
      email: request.email,
      companyName: request.companyName,
      accountType: request.accountType,
      approvalStatus: ApprovalStatus.PENDING,
      role: "partner",
    };

    MOCK_USERS.push(user);
    return { user, token: `mock-token-${user.id}` };
  },

  async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
  },

  async getCurrentUser(token: string): Promise<User | null> {
    await new Promise((r) => setTimeout(r, 300));

    const id = token.replace("mock-token-", "");
    return MOCK_USERS.find((u) => u.id === id) ?? null;
  },
};
