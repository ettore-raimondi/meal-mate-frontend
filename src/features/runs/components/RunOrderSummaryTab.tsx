import { useMemo } from "react";
import { formatEuroPrice } from "../../../helpers/currency";
import type { MenuItem } from "../../../services/menu-item";
import type { Order } from "../../../services/order/order.types";

type RunOrderSummaryTabProps = {
  runOrders: Order[];
  menuItems: MenuItem[];
};

function RunOrderSummaryTab({ runOrders, menuItems }: RunOrderSummaryTabProps) {
  const summaryItems = useMemo(() => {
    const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));
    const summary = new Map<
      number,
      {
        id: number;
        name: string;
        price: string;
        quantity: number;
        lineTotal: number;
      }
    >();

    runOrders.forEach((order) => {
      order.menuItems.forEach((menuItemId) => {
        const menuItem = menuItemMap.get(menuItemId);
        const entry = summary.get(menuItemId);
        const basePrice = Number(menuItem?.price ?? 0);

        if (entry) {
          entry.quantity += 1;
          entry.lineTotal += basePrice;
          return;
        }

        summary.set(menuItemId, {
          id: menuItemId,
          name: menuItem?.name ?? `Item #${menuItemId}`,
          price: menuItem?.price ?? "0.00",
          quantity: 1,
          lineTotal: basePrice,
        });
      });
    });

    return Array.from(summary.values()).sort((a, b) => {
      if (b.quantity !== a.quantity) return b.quantity - a.quantity;
      return a.name.localeCompare(b.name);
    });
  }, [runOrders, menuItems]);

  const total = useMemo(
    () => runOrders.reduce((sum, order) => sum + Number(order.total), 0),
    [runOrders],
  );

  return (
    <section className="run-orders-panel">
      <div className="run-orders-summary-head">
        <p className="section-label">Order summary</p>
        <div className="run-orders-summary-meta">
          <span>
            {runOrders.length} order{runOrders.length === 1 ? "" : "s"}
          </span>
          <span>{formatEuroPrice(total.toFixed(2))}</span>
        </div>
      </div>

      {summaryItems.length > 0 ? (
        <div className="runs-list scrollable run-orders-summary-list">
          {summaryItems.map((item) => (
            <article
              key={item.id}
              className="list-card run-summary-card list-card--static"
            >
              <div className="order-card-head">
                <div className="order-card-title">
                  <h3>{item.name}</h3>
                  <p>{formatEuroPrice(item.price)} each</p>
                </div>
                <span className="order-info-chip">x{item.quantity}</span>
              </div>
              <div className="order-card-meta">
                <span className="muted-label">Total quantity needed</span>
                <strong>{formatEuroPrice(item.lineTotal.toFixed(2))}</strong>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="blank-state">
          <p className="muted-label">
            No orders have been placed for this run yet.
          </p>
        </div>
      )}
    </section>
  );
}

export default RunOrderSummaryTab;
