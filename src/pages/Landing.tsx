import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <section className="page">
      <div className="card">
        <header>
          <p className="eyebrow">Meal Mate</p>
          <h1>Coordinate food runs with ease.</h1>
          <p>Manage menus, track orders, and keep every run on schedule.</p>
        </header>
        <div className="flex-center">
          <button className="btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </section>
  );
};

export default Landing;
