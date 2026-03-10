import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuItemDetail from "./MenuItemDetail";
import RunDetailView from "./RunDetailView";
import RunList from "./RunList";
import { FoodRun, MenuItem, PanelView, Restaurant } from "./homeTypes";

const restaurants: Restaurant[] = [
  {
    id: "rest-1",
    name: "Pasta & Co.",
    location: "Downtown",
    cuisine: "Italian",
    menu: [
      {
        id: "m-1",
        name: "Truffle Tagliatelle",
        price: "$18",
        available: true,
        description: "Hand-cut pasta, black truffle butter, parmesan snow.",
      },
      {
        id: "m-2",
        name: "Citrus Burrata",
        price: "$12",
        available: true,
        description: "Blood orange, basil oil, toasted pistachio crumble.",
      },
      {
        id: "m-3",
        name: "Lemon Tiramisu",
        price: "$9",
        available: false,
        description:
          "Meyer lemon curd, mascarpone cloud, white chocolate dust.",
      },
    ],
  },
  {
    id: "rest-2",
    name: "Bao District",
    location: "Uptown",
    cuisine: "Asian Street Food",
    menu: [
      {
        id: "m-4",
        name: "Miso Glazed Bao",
        price: "$11",
        available: true,
        description: "Steamed bao, caramelized miso glaze, pickled daikon.",
      },
      {
        id: "m-5",
        name: "Sesame Crunch Salad",
        price: "$10",
        available: true,
        description:
          "Shaved cabbage, toasted sesame brittle, chili-lime vinaigrette.",
      },
    ],
  },
  {
    id: "rest-3",
    name: "Harvest Bowl",
    location: "Midtown",
    cuisine: "Healthy Bowls",
    menu: [
      {
        id: "m-6",
        name: "Tahini Power Bowl",
        price: "$13",
        available: true,
        description: "Roasted sweet potato, chickpeas, lemon tahini drizzle.",
      },
      {
        id: "m-7",
        name: "Roasted Veggie Stack",
        price: "$14",
        available: true,
        description: "Layered squash, herb pesto, smoked sea salt finish.",
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

const RUN_PREFIX = "run-";
const MENU_PREFIX = "m-";

const toRouteRunSegment = (id: string) => id.replace(/^run-/i, "");
const toRouteMenuSegment = (id: string) => id.replace(/^m-/i, "");

const fromRouteRunSegment = (segment?: string) => {
  if (!segment) {
    return undefined;
  }
  return segment.startsWith(RUN_PREFIX) ? segment : `${RUN_PREFIX}${segment}`;
};

const fromRouteMenuSegment = (segment?: string) => {
  if (!segment) {
    return undefined;
  }
  return segment.startsWith(MENU_PREFIX) ? segment : `${MENU_PREFIX}${segment}`;
};

function Home() {
  const [activeRunId, setActiveRunId] = useState(runs[0]?.id ?? "");
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { runNumber, menuItemNumber } = useParams<{
    runNumber?: string;
    menuItemNumber?: string;
  }>();
  const routeRunId = fromRouteRunSegment(runNumber);
  const routeMenuItemId = fromRouteMenuSegment(menuItemNumber);
  const effectiveRunId = routeRunId ?? activeRunId;

  const restaurantMap = useMemo(() => {
    const map = new Map<string, Restaurant>();
    restaurants.forEach((rest) => map.set(rest.id, rest));
    return map;
  }, []);

  const activeRun = useMemo(
    () => runs.find((run) => run.id === effectiveRunId),
    [effectiveRunId],
  );
  const runRestaurant = activeRun
    ? restaurantMap.get(activeRun.restaurantId)
    : undefined;
  const menuItems = runRestaurant?.menu ?? [];
  const effectiveMenuItemId = routeMenuItemId ?? activeItemId;
  const activeMenuItem = menuItems.find(
    (item) => item.id === effectiveMenuItemId,
  );

  const panelView: PanelView = routeRunId
    ? routeMenuItemId
      ? "menuDetail"
      : "runDetail"
    : "runs";

  const handleRunSelect = (id: string) => {
    setActiveRunId(id);
    navigate(`/home/run/${toRouteRunSegment(id)}`);
  };

  const handleBackToRuns = () => {
    navigate("/home");
  };

  const openMenuDetail = (itemId: string) => {
    const targetRunId = routeRunId ?? activeRunId ?? runs[0]?.id;
    if (!targetRunId) {
      return;
    }
    setActiveItemId(itemId);
    navigate(
      `/home/run/${toRouteRunSegment(targetRunId)}/menu-item/${toRouteMenuSegment(itemId)}`,
    );
  };

  const closeMenuDetail = () => {
    const targetRunId = routeRunId ?? activeRunId;
    if (targetRunId) {
      navigate(`/home/run/${toRouteRunSegment(targetRunId)}`);
    } else {
      navigate("/home");
    }
  };

  const panelTitle = (() => {
    if (panelView === "runDetail" && activeRun) {
      return activeRun.name;
    }
    if (panelView === "menuDetail" && activeMenuItem) {
      return activeMenuItem.name;
    }
    return "Open Runs";
  })();

  const panelSubtitle = (() => {
    if (panelView === "runDetail") {
      return runRestaurant
        ? `${runRestaurant.name} · ${runRestaurant.cuisine}`
        : "Review the selected run";
    }
    if (panelView === "menuDetail" && activeMenuItem) {
      const restaurantLabel = runRestaurant ? `${runRestaurant.name}` : "";
      const priceLabel = activeMenuItem.price;
      return restaurantLabel
        ? `${restaurantLabel} · ${priceLabel}`
        : priceLabel;
    }
    return "Track active runs and place orders.";
  })();

  const backButton = (() => {
    if (panelView === "runDetail") {
      return { label: "Back to runs", onClick: handleBackToRuns };
    }
    if (panelView === "menuDetail") {
      return { label: "Back to menu", onClick: closeMenuDetail };
    }
    return null;
  })();

  useEffect(() => {
    if (routeRunId) {
      const runExists = runs.some((run) => run.id === routeRunId);
      if (runExists && activeRunId !== routeRunId) {
        setActiveRunId(routeRunId);
      } else if (!runExists) {
        navigate("/home", { replace: true });
      }
    }
  }, [routeRunId, activeRunId, navigate, runs]);

  useEffect(() => {
    if (!routeRunId && !activeRunId && runs.length > 0) {
      setActiveRunId(runs[0].id);
    }
  }, [routeRunId, activeRunId, runs]);

  useEffect(() => {
    if (menuItems.length === 0) {
      if (activeItemId !== null) {
        setActiveItemId(null);
      }
      if (routeMenuItemId && routeRunId) {
        navigate(`/home/run/${toRouteRunSegment(routeRunId)}`, {
          replace: true,
        });
      }
      return;
    }

    if (routeMenuItemId) {
      const exists = menuItems.some((item) => item.id === routeMenuItemId);
      if (exists) {
        if (activeItemId !== routeMenuItemId) {
          setActiveItemId(routeMenuItemId);
        }
      } else if (routeRunId) {
        navigate(`/home/run/${toRouteRunSegment(routeRunId)}`, {
          replace: true,
        });
      }
      return;
    }

    if (!activeItemId || !menuItems.some((item) => item.id === activeItemId)) {
      setActiveItemId(menuItems[0].id);
    }
  }, [menuItems, routeMenuItemId, routeRunId, navigate, activeItemId]);

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
        <section className="panel runs-panel full-panel">
          <div className="panel-head">
            <div className="panel-head-main">
              {backButton && (
                <button
                  className="back-link"
                  onClick={backButton.onClick}
                  type="button"
                >
                  <span className="back-link-icon" aria-hidden="true">
                    ←
                  </span>
                  <span>{backButton.label}</span>
                </button>
              )}
              <div className="panel-title-stack">
                <div className="panel-title-row">
                  <h2>{panelTitle}</h2>
                  {panelView === "runDetail" && activeRun && (
                    <span
                      className={`status-pill panel-status-pill ${activeRun.status === "Open" ? "success" : "muted"}`}
                    >
                      {activeRun.status}
                    </span>
                  )}
                </div>
                {panelSubtitle && (
                  <p className="panel-subtitle">{panelSubtitle}</p>
                )}
              </div>
            </div>

            <div className="panel-actions">
              {panelView === "runs" && (
                <button className="btn btn-ghost">New Run</button>
              )}
            </div>
          </div>

          <div className="runs-grid">
            {panelView === "runs" && (
              <RunList
                runs={runs}
                activeRunId={effectiveRunId ?? ""}
                restaurantMap={restaurantMap}
                onSelect={handleRunSelect}
              />
            )}

            {panelView !== "runs" && (
              <div className="run-detail scrollable">
                {panelView === "menuDetail" && activeMenuItem ? (
                  <MenuItemDetail menuItem={activeMenuItem} />
                ) : (
                  <RunDetailView
                    runRestaurant={runRestaurant}
                    menuItems={menuItems}
                    activeRunId={activeRun?.id}
                    activeItemId={effectiveMenuItemId ?? null}
                    onSelectMenuItem={openMenuDetail}
                  />
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
