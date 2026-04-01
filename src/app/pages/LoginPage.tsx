import { useState } from "react";
import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // API-ready: submit credentials to auth endpoint
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="py-32 bg-gray-50">
        <div className="max-w-md mx-auto px-8">
          <div className="text-center mb-10">
            <p className="text-xs tracking-widest text-gray-500 mb-3">PARTNER PORTAL</p>
            <h1 className="text-4xl tracking-tight">Sign In</h1>
            <p className="text-sm text-gray-600 mt-3">Access your HOMATZ trade account</p>
          </div>

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

            <div>
              <label htmlFor="password" className="block text-xs tracking-widest text-gray-700 mb-2">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-gray-300"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide"
            >
              SIGN IN
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Don&apos;t have a trade account?{" "}
            <Link to="/apply" className="text-gray-900 underline hover:text-gray-600">
              Apply here
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
