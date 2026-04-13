import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDecodedToken, logout } from "../services/auth";
import { getUser } from "../services/user/user.service";
import type { User } from "../services/user";

const NAV_ITEMS = [
  { key: "dashboard", label: "Place Order", path: "/place-order" },
  { key: "restaurants", label: "Restaurants", path: "/restaurants" },
  { key: "runs", label: "Runs", path: "/runs" },
  { key: "orders", label: "Orders", path: "/order" },
];

type SidebarProps = {
  activeItem: string;
};

function Sidebar({ activeItem }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;

    const loadUserInfo = async () => {
      try {
        const decoded = getDecodedToken();
        const response = await getUser({
          id: decoded.user_id,
        });

        if (!isMounted) {
          return;
        }

        setUserInfo(response);
      } catch (error) {
        console.error("Failed to load user info for sidebar", error);
        if (isMounted) {
          setUserInfo(null);
        }
      }
    };

    loadUserInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  const fullName = [userInfo?.firstName, userInfo?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

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
        <div className="sidebar-footer">
          <p className="sidebar-footer-name">{fullName || "Unknown user"}</p>
          <p className="sidebar-footer-email">{userInfo?.email || ""}</p>
          <button
            type="button"
            className="sidebar-footer-logout"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
              setIsMenuOpen(false);
            }}
          >
            Log out
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
