import { useState } from "react";
import { registerUser } from "../services/auth";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(email, password);

      setSuccess(
        "Account created successfully. You can now sign in."
      );

      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="auth-page">
    <div className="auth-visual">
      <div className="auth-brand">
        <div className="auth-brand-icon">
          <Sparkles size={18} />
        </div>
        <span>ProbeAI</span>
      </div>

      <h1>
        Your ideas,
        <br />
        <span>made intelligent.</span>
      </h1>

      <p>
        One workspace for AI conversations,
        document intelligence, and video insights.
      </p>
    </div>

    <div className="auth-form-container">
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <h2>Create your account</h2>

        <p className="auth-form-subtitle">
          Start exploring ProbeAI today.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <div className="auth-field">
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="auth-field">
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="••••••••"
            required
          />
        </div>

        <div className="auth-field">
          <label>Confirm Password</label>  

          <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
              setConfirmPassword(event.target.value)
              }
              placeholder="••••••••"
              required
          />
        </div>

        <button
          className="auth-submit"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating account..."
            : "Create account"}
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  </div>
);
}

export default Register;