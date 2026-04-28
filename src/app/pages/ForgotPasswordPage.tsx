import { useState } from "react";
import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { authService } from "../../services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch {
      // Always show success to prevent email enumeration
      setSubmitted(true);
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
            <h1 className="text-4xl tracking-tight">Reset Password</h1>
            <p className="text-sm text-gray-600 mt-3">
              Enter your account email and we&apos;ll send you a reset link.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white border border-gray-200 p-10 text-center space-y-6">
              <div className="w-16 h-16 bg-green-50 border-2 border-green-500 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-xl tracking-tight">Check your inbox</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                If an account exists for <strong>{email}</strong>, you will receive a password
                reset link shortly.
              </p>
              <Link
                to="/login"
                className="inline-block px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide"
              >
                BACK TO SIGN IN
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 p-10">
              <div>
                <label htmlFor="email" className="block text-xs tracking-widest text-gray-700 mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@company.co.uk"
                  className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide disabled:opacity-50"
              >
                {loading ? "SENDING..." : "SEND RESET LINK"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-600 mt-8">
            <Link to="/login" className="text-gray-900 underline hover:text-gray-600">
              Back to sign in
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
