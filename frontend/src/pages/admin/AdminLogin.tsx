import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";
import { loginAdmin, isAdminAuthenticated } from "../../services/feedbackStore";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const success = loginAdmin(email, password);
      if (success) {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid Admin ID or Password. Please verify your credentials.");
      }
      setLoading(false);
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail("admin@sovilo.com");
    setPassword("Sovilo@2026");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-gray via-white to-pink-50/40 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sovelo Aesthetics
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-card border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-inner">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Admin Portal
            </h1>
            <p className="mt-2 text-xs text-gray-500">
              Manage video reels, customer testimonials &amp; clinic showcase
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-start gap-2">
              <span className="font-bold">Error:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Admin ID / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sovilo.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-soft-gray text-sm text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-soft-gray text-sm text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-charcoal"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-light text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Log In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-100/80">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Default Credentials
              </div>
              <p className="text-[11px] text-gray-600 font-mono">
                ID: <span className="font-semibold text-charcoal">admin@sovilo.com</span>
                <br />
                Pass: <span className="font-semibold text-charcoal">Sovilo@2026</span>
              </p>
              <button
                type="button"
                onClick={handleFillDemo}
                className="mt-3 text-[11px] font-semibold text-primary underline hover:text-primary-light"
              >
                Auto-fill Demo Credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
