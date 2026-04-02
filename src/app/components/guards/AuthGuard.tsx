import { Navigate } from "react-router";
import { ApprovalStatus } from "../../../types/auth";
import { useAuth } from "../../../contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.approvalStatus === ApprovalStatus.PENDING) {
    return <Navigate to="/apply/pending" replace />;
  }

  if (
    user.approvalStatus === ApprovalStatus.REJECTED ||
    user.approvalStatus === ApprovalStatus.SUSPENDED
  ) {
    return <Navigate to="/apply/restricted" replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
