import { Navigate } from "react-router";
import { AccountType } from "../../../types/auth";
import { useAuth } from "../../../contexts/AuthContext";

export default function WholesaleGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.accountType !== AccountType.WHOLESALE) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
