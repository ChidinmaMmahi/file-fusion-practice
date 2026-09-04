import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-16 px-6">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary mb-2">
        Create an account
      </h2>
      <p className="text-text-secondary mb-8">
        Save drafts and pick up editing whenever you come back.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <label className="block">
          <span className="text-sm font-medium text-text-primary">Name</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-text-primary focus:outline-none focus:border-accent/50"
          />
        </label>

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
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl bg-surface-elevated border border-border px-4 py-3 text-text-primary focus:outline-none focus:border-accent/50"
          />
          <span className="mt-1 block text-xs text-text-muted">At least 8 characters</span>
        </label>

        <Button
          label={submitting ? "Creating account..." : "Create account"}
          type="submit"
          disabled={submitting}
          extraClassnames="w-full"
        />
      </form>

      <p className="mt-6 text-sm text-text-secondary text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};
