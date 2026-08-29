import { useState } from "react";
import { loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to login. Please try again."
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
        Intelligence,
        <br />
        <span>without limits.</span>
      </h1>

      <p>
        Chat with AI, analyze documents, and
        transform videos into meaningful insights.
      </p>
    </div>

    <div className="auth-form-container">
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <h2>Welcome back</h2>

        <p className="auth-form-subtitle">
          Sign in to continue to ProbeAI.
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

        <button
          className="auth-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">
            Create one
          </Link>
        </p>
      </form>
    </div>
  </div>
);
}

export default Login;