import { useState } from "react";
import { login } from "../../../services/auth/auth.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await login({ email, password });
    localStorage.setItem("token", response.access);
    localStorage.setItem("refreshToken", response.refresh);
    toast.success("Logged in successfully, redirecting...");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <header>
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in to Meal Mate</h1>
          <p>Access your runs, menus, and orders.</p>
        </header>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />

          <button className="btn btn-large" type="submit">
            Continue
          </button>
        </form>

        <footer>
          <p>
            Need an account? <a href="/signup">Sign up</a>
          </p>
        </footer>
      </div>
    </section>
  );
}

export default Login;
