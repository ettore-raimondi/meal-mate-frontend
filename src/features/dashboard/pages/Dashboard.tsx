import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatEuroPrice } from "../../../helpers/currency";
import MenuItemDetail from "../components/MenuItemDetail";
import RunDetailView from "../components/RunDetailView";
import RunList from "../components/RunList";
import Sidebar from "../../../components/Sidebar";
import type { RestaurantEnriched } from "../../../services/restaurant";
import { getStatusMeta } from "../utils/runStatusMeta";
import {
  createOrder,
  fetchLatestOrderForRun,
  updateOrder,
} from "../../../services/order/order.service";
import { toast } from "sonner";
import { useAppData } from "../../../hooks/useAppData";

type PanelView = "runs" | "runDetail" | "menuDetail";

const toRouteRunSegment = (id: number) => encodeURIComponent(String(id));
const toRouteMenuSegment = (id: number) => encodeURIComponent(String(id));

const fromRouteRunSegment = (segment?: string) => {
  if (!segment) {
    return undefined;
  }
  const parsed = Number(decodeURIComponent(segment));
  return Number.isNaN(parsed) ? undefined : parsed;
};

const fromRouteMenuSegment = (segment?: string) => {
  if (!segment) {
    return undefined;
  }
  const parsed = Number(decodeURIComponent(segment));
  return Number.isNaN(parsed) ? undefined : parsed;
};

function Dashboard() {
  const { restaurants, enrichedRuns, orders } = useAppData();
  const [activeRunId, setActiveRunId] = useState<number | null>(null);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);
  const [orderedItemIds, setOrderedItemIds] = useState<Set<number>>(new Set());
  const [orderNote, setOrderNote] = useState("");
  const navigate = useNavigate();
  const { runNumber, menuItemNumber } = useParams<{
    runNumber?: string;
    menuItemNumber?: string;
  }>();
  const routeRunId = fromRouteRunSegment(runNumber);
  const routeMenuItemId = fromRouteMenuSegment(menuItemNumber);
  const effectiveRunId = routeRunId ?? activeRunId ?? undefined;

  const restaurantMap = useMemo(() => {
    const map = new Map<number, RestaurantEnriched>();
    restaurants.forEach((restaurant) => {
      map.set(restaurant.id, restaurant);
    });
    return map;
  }, [restaurants]);

  const activeRuns = useMemo(
    () => enrichedRuns.filter((run) => run.status !== "COMPLETED"),
    [enrichedRuns],
  );

  const activeEnrichedRun = useMemo(
    () =>
      effectiveRunId === undefined
        ? undefined
        : enrichedRuns.find((run) => run.id === effectiveRunId),
    [effectiveRunId, enrichedRuns],
  );

  const runRestaurant = activeEnrichedRun
    ? restaurantMap.get(activeEnrichedRun.restaurant.id)
    : undefined;
  const menuItems = runRestaurant?.menuItems ?? [];
  const effectiveMenuItemId = routeMenuItemId ?? activeItemId ?? undefined;
  const activeMenuItem =
    effectiveMenuItemId === undefined
      ? undefined
      : menuItems.find((item) => item.id === effectiveMenuItemId);

  const panelView: PanelView =
    routeRunId !== undefined
      ? routeMenuItemId !== undefined
        ? "menuDetail"
        : "runDetail"
      : "runs";

  const handleRunSelect = (id: number) => {
    setActiveRunId(id);
    navigate(`/place-order/run/${toRouteRunSegment(id)}`);
  };

  const handleBackToRuns = () => {
    navigate("/place-order");
  };

  const handleCreateRun = () => {
    navigate("/runs", { state: { openCreate: true } });
  };

  const openMenuDetail = (itemId: number) => {
    const targetRunId = routeRunId ?? activeRunId ?? enrichedRuns[0]?.id;
    if (targetRunId === undefined || targetRunId === null) {
      return;
    }
    setActiveItemId(itemId);
    navigate(
      `/place-order/run/${toRouteRunSegment(targetRunId)}/menu-item/${toRouteMenuSegment(itemId)}`,
    );
  };

  const handleToggleOrder = (itemId: number) => {
    if (!isRunEditable) {
      return;
    }

    setOrderedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handlePlaceOrder = async () => {
    if (!isRunEditable) {
      return;
    }

    const selectedMenuItems = Array.from(orderedItemIds);
    const latestOrder = await fetchLatestOrderForRun(activeRunId!).catch(
      () => null,
    );

    const order =
      latestOrder && latestOrder.status === "in_progress"
        ? await updateOrder({
            orderId: latestOrder.id,
            menuItems: selectedMenuItems,
            note: orderNote,
          })
        : await createOrder({
            foodRun: activeRunId!,
            menuItems: selectedMenuItems,
            note: orderNote,
          });

    toast.success(`Order #${order.id} has been saved.`);
    navigate(`/my-order-history/${order.id}`);
  };

  const closeMenuDetail = () => {
    const targetRunId = routeRunId ?? activeRunId ?? undefined;
    if (targetRunId !== undefined && targetRunId !== null) {
      navigate(`/place-order/run/${toRouteRunSegment(targetRunId)}`);
    } else {
      navigate("/place-order");
    }
  };

  const panelTitle = (() => {
    if (panelView === "runDetail" && activeEnrichedRun) {
      return activeEnrichedRun.name;
    }
    if (panelView === "menuDetail" && activeMenuItem) {
      return activeMenuItem.name;
    }
    return "Place Order";
  })();

  const panelSubtitle = (() => {
    if (panelView === "runDetail") {
      const parts = [];
      if (runRestaurant) parts.push(runRestaurant.name);
      if (activeEnrichedRun) {
        const organizerLabel =
          activeEnrichedRun.organizerName?.trim() ||
          `Organizer #${activeEnrichedRun.organizerId}`;
        parts.push(organizerLabel);
      }
      return parts.length > 0
        ? `${parts.join(" · ")} · Build your order for this run`
        : "Build your order for the selected run";
    }
    if (panelView === "menuDetail" && activeMenuItem) {
      const restaurantLabel = runRestaurant ? `${runRestaurant.name}` : "";
      const priceLabel = formatEuroPrice(activeMenuItem.price);
      return restaurantLabel
        ? `${restaurantLabel} · ${priceLabel}`
        : priceLabel;
    }
    return "Choose a run to place or review your order.";
  })();

  const activeStatusMeta = getStatusMeta(activeEnrichedRun?.status);

  const isDeadlinePassed = useMemo(() => {
    if (!activeEnrichedRun?.deadline) {
      return false;
    }
    const now = new Date();
    return new Date(activeEnrichedRun.deadline) < now;
  }, [activeEnrichedRun?.deadline]);

  const isRunEditable = useMemo(() => {
    if (!activeEnrichedRun) {
      return false;
    }
    // Can only edit if run is OPEN and deadline hasn't passed
    const isOpen = activeEnrichedRun.status === "OPEN";
    return isOpen && !isDeadlinePassed;
  }, [activeEnrichedRun, isDeadlinePassed]);

  const lockReason = useMemo(() => {
    // Determine why the run is locked for editing (if applicable)
    if (!activeEnrichedRun) {
      return undefined;
    }
    if (activeEnrichedRun.status === "IN_PROGRESS") {
      return "Run in progress";
    }
    if (activeEnrichedRun.status === "COMPLETED") {
      return "Run completed";
    }
    if (isDeadlinePassed) {
      return "Deadline has passed";
    }
    return undefined;
  }, [activeEnrichedRun, isDeadlinePassed]);

  const orderedRunIds = useMemo(
    () => new Set(orders.map((order) => order.foodRun)),
    [orders],
  );

  const hasExistingOrderForActiveRun = useMemo(() => {
    if (!activeEnrichedRun) {
      return false;
    }

    return orders.some(
      (order) =>
        order.foodRun === activeEnrichedRun.id && order.status !== "cancelled",
    );
  }, [activeEnrichedRun, orders]);

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
    if (routeRunId === undefined || enrichedRuns.length === 0) {
      return;
    }
    const runExists = enrichedRuns.some((run) => run.id === routeRunId);
    if (runExists && activeRunId !== routeRunId) {
      setActiveRunId(routeRunId);
    } else if (!runExists) {
      navigate("/place-order", { replace: true });
    }
  }, [routeRunId, activeRunId, navigate, enrichedRuns]);

  useEffect(() => {
    if (
      routeRunId !== undefined ||
      activeRunId !== null ||
      activeRuns.length === 0
    ) {
      return;
    }
    setActiveRunId(activeRuns[0].id);
  }, [routeRunId, activeRunId, activeRuns]);

  useEffect(() => {
    if (menuItems.length === 0) {
      if (activeItemId !== null) {
        setActiveItemId(null);
      }
      if (routeMenuItemId !== undefined && routeRunId !== undefined) {
        navigate(`/place-order/run/${toRouteRunSegment(routeRunId)}`, {
          replace: true,
        });
      }
      return;
    }

    if (routeMenuItemId !== undefined) {
      const exists = menuItems.some((item) => item.id === routeMenuItemId);
      if (exists) {
        if (activeItemId !== routeMenuItemId) {
          setActiveItemId(routeMenuItemId);
        }
      } else if (routeRunId !== undefined) {
        navigate(`/place-order/run/${toRouteRunSegment(routeRunId)}`, {
          replace: true,
        });
      }
      return;
    }

    if (
      activeItemId === null ||
      !menuItems.some((item) => item.id === activeItemId)
    ) {
      setActiveItemId(menuItems[0].id);
    }
  }, [menuItems, routeMenuItemId, routeRunId, navigate, activeItemId]);

  function renderRunsList() {
    if (panelView === "runs") {
      if (activeRuns.length === 0) {
        return (
          <div className="blank-state">
            <p className="muted-label">
              No active runs available. Add one or wait for a new run to start.
            </p>
          </div>
        );
      }

      return (
        <RunList
          runs={activeRuns}
          activeRunId={effectiveRunId ?? null}
          orderedRunIds={orderedRunIds}
          onSelect={handleRunSelect}
        />
      );
    }

    return null;
  }

  return (
    <div className="dashboard">
      <Sidebar activeItem="dashboard" />
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
                  ← {backButton.label}
                </button>
              )}
              <div className="panel-title-stack">
                <div className="panel-title-row">
                  {panelView !== "menuDetail" ? <h2>{panelTitle}</h2> : null}
                  {panelView === "runDetail" && activeStatusMeta && (
                    <span
                      className={`status-pill panel-status-pill ${activeStatusMeta.tone}`}
                    >
                      {activeStatusMeta.label}
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
                <button className="btn" type="button" onClick={handleCreateRun}>
                  New Run
                </button>
              )}
            </div>
          </div>

          <div className="runs-grid">
            {renderRunsList()}

            {panelView !== "runs" && (
              <div className="run-detail scrollable">
                {panelView === "menuDetail" && activeMenuItem ? (
                  <MenuItemDetail
                    menuItem={activeMenuItem}
                    actionSlot={
                      !isRunEditable ? undefined : (
                        <button
                          className={`btn ${
                            orderedItemIds.has(activeMenuItem.id)
                              ? "btn-outline btn-danger"
                              : ""
                          }`}
                          type="button"
                          onClick={() => handleToggleOrder(activeMenuItem.id)}
                        >
                          {orderedItemIds.has(activeMenuItem.id)
                            ? "Remove item"
                            : "Order item"}
                        </button>
                      )
                    }
                  />
                ) : (
                  <RunDetailView
                    menuItems={menuItems}
                    activeRunId={activeEnrichedRun?.id}
                    activeItemId={effectiveMenuItemId ?? null}
                    orderedItemIds={orderedItemIds}
                    actionLabel={
                      hasExistingOrderForActiveRun
                        ? "Update order →"
                        : "Place order →"
                    }
                    onSelectMenuItem={openMenuDetail}
                    onToggleOrder={handleToggleOrder}
                    onPlaceOrder={handlePlaceOrder}
                    orderNote={orderNote}
                    onOrderNoteChange={setOrderNote}
                    onOrderedItemsChange={setOrderedItemIds}
                    isLocked={!isRunEditable}
                    lockReason={lockReason}
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

export default Dashboard;
