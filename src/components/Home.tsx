import { useMemo, useState } from "react";

type MenuItem = {
  id: string;
  name: string;
  price: string;
  available: boolean;
};

type Restaurant = {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  menu: MenuItem[];
};

type FoodRun = {
  id: string;
  name: string;
  restaurantId: string;
  organizer: string;
  cutoff: string;
  status: "Open" | "Closed" | "Draft";
  orders: number;
  eta: string;
};

const restaurants: Restaurant[] = [
  {
    id: "rest-1",
    name: "Pasta & Co.",
    location: "Downtown",
    cuisine: "Italian",
    menu: [
      { id: "m-1", name: "Truffle Tagliatelle", price: "$18", available: true },
      { id: "m-2", name: "Citrus Burrata", price: "$12", available: true },
      { id: "m-3", name: "Lemon Tiramisu", price: "$9", available: false },
    ],
  },
  {
    id: "rest-2",
    name: "Bao District",
    location: "Uptown",
    cuisine: "Asian Street Food",
    menu: [
      { id: "m-4", name: "Miso Glazed Bao", price: "$11", available: true },
      { id: "m-5", name: "Sesame Crunch Salad", price: "$10", available: true },
    ],
  },
  {
    id: "rest-3",
    name: "Harvest Bowl",
    location: "Midtown",
    cuisine: "Healthy Bowls",
    menu: [
      { id: "m-6", name: "Tahini Power Bowl", price: "$13", available: true },
      {
        id: "m-7",
        name: "Roasted Veggie Stack",
        price: "$14",
        available: true,
      },
    ],
  },
];

const runs: FoodRun[] = [
  {
    id: "run-248",
    name: "Design Sync Lunch",
    restaurantId: "rest-1",
    organizer: "Ava Patel",
    cutoff: "Today · 12:30 PM",
    status: "Open",
    orders: 8,
    eta: "ETA 1:10 PM",
  },
  {
    id: "run-249",
    name: "Sales Push Fuel",
    restaurantId: "rest-2",
    organizer: "Alex Kim",
    cutoff: "Today · 1:00 PM",
    status: "Open",
    orders: 5,
    eta: "ETA 1:45 PM",
  },
  {
    id: "run-250",
    name: "Night Ops",
    restaurantId: "rest-3",
    organizer: "Mia Lopez",
    cutoff: "Tomorrow · 10:00 AM",
    status: "Draft",
    orders: 0,
    eta: "ETA 12:15 PM",
  },
];

function Home() {
  const [activeRunId, setActiveRunId] = useState(runs[0]?.id ?? "");

  const restaurantMap = useMemo(() => {
    const map = new Map<string, Restaurant>();
    restaurants.forEach((rest) => map.set(rest.id, rest));
    return map;
  }, []);

  const activeRun = useMemo(
    () => runs.find((run) => run.id === activeRunId),
    [activeRunId],
  );
  const runRestaurant = activeRun
    ? restaurantMap.get(activeRun.restaurantId)
    : undefined;
  const menuItems = runRestaurant?.menu ?? [];

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">Meal Mate</div>
        <nav>
          <p className="nav-label">Overview</p>
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">Restaurants</button>
          <button className="nav-item">Runs</button>
          <button className="nav-item">Orders</button>
          <button className="nav-item">Team</button>
        </nav>
        <div className="sidebar-footer">
          <p>Next run closes in</p>
          <strong>22 min</strong>
        </div>
      </aside>

      <div className="workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Operations hub</p>
            <h1>Manage runs and keep orders flowing</h1>
            <p>
              Spin up new runs, monitor activity, and place orders in one place.
            </p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline">Create Restaurant</button>
          </div>
        </header>

        <section className="panel runs-panel full-panel">
          <div className="panel-head">
            <div>
              <h2>Open Runs</h2>
              <p>Track active runs and place orders.</p>
            </div>
            <button className="btn btn-ghost">New Run</button>
          </div>

          <div className="runs-grid">
            <div className="runs-list scrollable">
              {runs.map((run) => {
                const runRest = restaurantMap.get(run.restaurantId);
                return (
                  <button
                    key={run.id}
                    className={`list-card run-card ${run.id === activeRunId ? "is-active" : ""}`}
                    onClick={() => setActiveRunId(run.id)}
                  >
                    <div className="run-card-head">
                      <h3>{run.name}</h3>
                      <span
                        className={`status-pill ${run.status === "Open" ? "success" : "muted"}`}
                      >
                        {run.status}
                      </span>
                    </div>
                    <p>{runRest?.name}</p>
                    <div className="run-meta">
                      <span>{run.cutoff}</span>
                      <span>{run.orders} orders</span>
                      <span>{run.eta}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="run-detail scrollable">
              <header className="run-detail-header">
                <div className="run-detail-eyebrow">
                  <p className="eyebrow">Run detail</p>
                  {activeRun && (
                    <span
                      className={`status-pill ${activeRun.status === "Open" ? "success" : "muted"}`}
                    >
                      {activeRun.status}
                    </span>
                  )}
                </div>
                <h2>{activeRun?.name ?? "Select a run"}</h2>
                <p className="muted-label">
                  Organized by {activeRun?.organizer ?? "—"}
                </p>
                <div className="run-detail-actions">
                  <button className="btn btn-outline">Share</button>
                  <button className="btn">Place Order</button>
                </div>
              </header>

              <div className="run-detail-stats">
                <div className="stat-card">
                  <p className="muted-label">Restaurant</p>
                  <strong>{runRestaurant?.name ?? "To be decided"}</strong>
                  <span>
                    {runRestaurant
                      ? `${runRestaurant.location} · ${runRestaurant.cuisine}`
                      : "Add a restaurant"}
                  </span>
                </div>
                <div className="stat-card">
                  <p className="muted-label">Cutoff</p>
                  <strong>{activeRun?.cutoff ?? "—"}</strong>
                  <span>Auto reminders 15 min before</span>
                </div>
                <div className="stat-card">
                  <p className="muted-label">Orders</p>
                  <strong>{activeRun?.orders ?? 0}</strong>
                  <span>{activeRun?.eta ?? "ETA pending"}</span>
                </div>
              </div>

              <section className="menu-section">
                <div className="menu-section-head">
                  <div>
                    <h4>Menu</h4>
                    <p className="muted-label">
                      {runRestaurant
                        ? `Favorites from ${runRestaurant.name}`
                        : "Select a run to preview the menu"}
                    </p>
                  </div>
                  <span className="muted-label">
                    {menuItems.length} item{menuItems.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="menu-grid">
                  {menuItems.length > 0 ? (
                    menuItems.map((item) => (
                      <article
                        key={`${activeRun?.id ?? "run"}-${item.id}`}
                        className="menu-card list-card list-card--inline"
                      >
                        <div className="menu-card-info">
                          <h4>{item.name}</h4>
                          <p>{item.price}</p>
                        </div>
                        <button
                          className="btn btn-ghost btn-icon"
                          aria-label={`Add ${item.name} to order`}
                        >
                          +
                        </button>
                      </article>
                    ))
                  ) : (
                    <p className="muted-label">Menu coming soon.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
