import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", path: "/home" },
  { key: "restaurants", label: "Restaurants", path: "/restaurants" },
  { key: "runs", label: "Runs", path: "/runs" },
  { key: "orders", label: "Orders", path: "/orders" },
  { key: "team", label: "Team" },
];

type SidebarProps = {
  activeItem: string;
};

function Sidebar({ activeItem }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="brand">Meal Mate</div>
      <nav>
        <p className="nav-label">Overview</p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${activeItem === item.key ? "active" : ""}`}
            type="button"
            onClick={() => {
              if (item.path) {
                navigate(item.path);
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Next run closes in</p>
        <strong>22 min</strong>
      </div>
    </aside>
  );
}

export default Sidebar;
