import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRestaurants } from "../../../features/restaurants";
import { fetchOrdersForRun } from "../../../services/order/order.service";
import type { Order } from "../../../services/order/order.types";
import type { RunEnriched } from "../../../services/run";
import { getStatusMeta } from "../../dashboard/utils/runStatusMeta";
import type { RunFormData, RunInitialValues } from "../utils/index.ts";
import RunDetailFormTab from "./RunDetailFormTab";
import RunOrderSummaryTab from "./RunOrderSummaryTab";
import RunOrdersTab from "./RunOrdersTab";

type RunViewTab = "details" | "summary" | "orders";

type RunViewPanelProps = {
  run: RunEnriched;
  isLocked?: boolean;
  onSubmit?: (payload: RunFormData) => Promise<void> | void;
  onClose: () => void;
  actionSlot?: ReactNode;
};

const toDateTimeLocalValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function RunViewPanel({
  run,
  isLocked = false,
  onSubmit,
  onClose,
  actionSlot,
}: RunViewPanelProps) {
  const { restaurants } = useRestaurants();
  const [activeTab, setActiveTab] = useState<RunViewTab>("details");
  const [runOrders, setRunOrders] = useState<Order[]>([]);

  const menuItems = useMemo(() => {
    const restaurant = restaurants.find((r) => r.id === run.restaurant.id);
    return restaurant?.menuItems ?? [];
  }, [restaurants, run.restaurant.id]);

  const initialValues: RunInitialValues = useMemo(
    () => ({
      id: run.id,
      name: run.name,
      restaurantId: run.restaurant.id,
      restaurantLabel: run.restaurant.name,
      deadline: toDateTimeLocalValue(run.deadline),
    }),
    [run],
  );

  const statusMeta = getStatusMeta(run.status);

  useEffect(() => {
    setActiveTab("details");
    setRunOrders([]);
    fetchOrdersForRun(run.id)
      .then(setRunOrders)
      .catch(() => setRunOrders([]));
  }, [run.id]);

  const handleSubmit = useCallback(
    async (payload: RunFormData) => {
      if (onSubmit) {
        await onSubmit(payload);
      }
    },
    [onSubmit],
  );

  return (
    <section className="panel create-run-panel">
      <div className="panel-head">
        <div className="panel-head-main">
          <button type="button" className="back-link" onClick={onClose}>
            ← Back to runs
          </button>
          <div className="panel-title-stack">
            <div className="panel-title-row">
              <h2>{run.name}</h2>
              {statusMeta && (
                <span
                  className={`status-pill panel-status-pill ${statusMeta.tone}`}
                >
                  {statusMeta.label}
                </span>
              )}
            </div>
            <p className="panel-subtitle">{run.restaurant.name}</p>
          </div>
        </div>
        {actionSlot ? <div className="panel-actions">{actionSlot}</div> : null}
      </div>

      <div className="run-detail-tabs" role="tablist" aria-label="Run sections">
        <button
          className={`run-detail-tab ${activeTab === "details" ? "is-active" : ""}`}
          type="button"
          onClick={() => setActiveTab("details")}
        >
          Run detail
        </button>
        <button
          className={`run-detail-tab ${activeTab === "summary" ? "is-active" : ""}`}
          type="button"
          onClick={() => setActiveTab("summary")}
        >
          Order summary
        </button>
        <button
          className={`run-detail-tab ${activeTab === "orders" ? "is-active" : ""}`}
          type="button"
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      {activeTab === "details" && (
        <RunDetailFormTab
          mode="edit"
          initialValues={initialValues}
          isLocked={isLocked}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      )}
      {activeTab === "summary" && (
        <RunOrderSummaryTab runOrders={runOrders} menuItems={menuItems} />
      )}
      {activeTab === "orders" && <RunOrdersTab runOrders={runOrders} />}
    </section>
  );
}

export default RunViewPanel;
