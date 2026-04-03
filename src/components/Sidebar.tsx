import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", path: "/dashboard" },
  { key: "restaurants", label: "Restaurants", path: "/restaurants" },
  { key: "runs", label: "Runs", path: "/runs" },
  { key: "orders", label: "My Orders", path: "/my-order-history" },
];

type SidebarProps = {
  activeItem: string;
};

function Sidebar({ activeItem }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <aside className="sidebar">
      <div className="sidebar-top-row">
        <div className="brand">Meal Mate</div>
        <button
          type="button"
          className="sidebar-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav className={`sidebar-nav ${isMenuOpen ? "is-open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${activeItem === item.key ? "active" : ""}`}
            type="button"
            onClick={() => {
              navigate(item.path);
              setIsMenuOpen(false);
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
