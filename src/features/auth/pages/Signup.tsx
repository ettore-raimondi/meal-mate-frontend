import { useState } from "react";
import { signup } from "../../../services/auth/auth.service";
import { toast } from "sonner";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Validate passwords are the same
    if (name === "confirmPassword" && value !== formData.password) {
      event.target.setCustomValidity("Passwords do not match");
    } else {
      event.target.setCustomValidity("");
    }
    event.target.reportValidity(); // Need to do this because I handle the form submit myself

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    // Sanity checks before sending request to backend
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    if (formData.firstName.length < 2 || formData.lastName.length < 2) {
      toast.error("First and last name must be at least 2 characters");
      return;
    }

    await signup({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });
    toast.success("Account created successfully! Please log in.");
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <header>
          <p className="eyebrow">Get started</p>
          <h1>Create your Meal Mate account</h1>
          <p>Invite teammates and manage food runs together.</p>
        </header>

        <form>
          <div className="two-column">
            <div>
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                minLength={2}
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jane"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                minLength={2}
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <label htmlFor="email">Work email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={4}
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            minLength={4}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <button
            className="btn btn-large"
            type="submit"
            onClick={handleRegister}
          >
            Create account
          </button>
        </form>

        <footer>
          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </footer>
      </div>
    </section>
  );
}

export default Signup;
