import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-16 px-6">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary mb-2">
        Sign in
      </h2>
      <p className="text-text-secondary mb-8">
        Welcome back. Sign in to continue your drafts.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <label className="block">
          <span className="text-sm font-medium text-text-primary">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-text-primary focus:outline-none focus:border-accent/50"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-text-primary">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-text-primary focus:outline-none focus:border-accent/50"
          />
        </label>

        <Button
          label={submitting ? "Signing in..." : "Sign in"}
          type="submit"
          disabled={submitting}
          extraClassnames="w-full"
        />
      </form>

      <p className="mt-6 text-sm text-text-secondary text-center">
        Need an account?{" "}
        <Link to="/register" className="text-accent hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
};
