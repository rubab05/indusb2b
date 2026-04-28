import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { authService } from "../../services/auth.service";

function getStrength(password: string): { label: string; color: string; width: string } {
  if (password.length === 0) return { label: "", color: "bg-gray-200", width: "w-0" };
  if (password.length < 6) return { label: "Too short", color: "bg-red-400", width: "w-1/4" };
  if (password.length < 8) return { label: "Weak", color: "bg-orange-400", width: "w-2/4" };
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const score = [hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (score >= 2) return { label: "Strong", color: "bg-green-500", width: "w-full" };
  return { label: "Fair", color: "bg-yellow-400", width: "w-3/4" };
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getStrength(password);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset link. Please request a new one.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset link is invalid or has expired. Please request a new one.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="py-32 bg-gray-50">
        <div className="max-w-md mx-auto px-8">
          <div className="text-center mb-10">
            <p className="text-xs tracking-widest text-gray-500 mb-3">PARTNER PORTAL</p>
            <h1 className="text-4xl tracking-tight">New Password</h1>
            <p className="text-sm text-gray-600 mt-3">Choose a strong password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 p-10">
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-xs tracking-widest text-gray-700 mb-2">
                NEW PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
              />
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirm" className="block text-xs tracking-widest text-gray-700 mb-2">
                CONFIRM PASSWORD
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Repeat your password"
                className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide disabled:opacity-50"
            >
              {loading ? "SAVING..." : "SET NEW PASSWORD"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
