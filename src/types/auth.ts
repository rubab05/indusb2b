export enum AccountType {
  WHOLESALE = "WHOLESALE",
  DROPSHIP = "DROPSHIP",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export interface User {
  id: string;
  email: string;
  companyName: string;
  accountType: AccountType;
  approvalStatus: ApprovalStatus;
  role: "PARTNER" | "ADMIN";
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}
