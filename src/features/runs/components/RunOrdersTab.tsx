import { useNavigate } from "react-router-dom";
import { formatEuroPrice } from "../../../helpers/currency";
import type { Order } from "../../../services/order/order.types";
import { getOrderStatusMeta } from "../../orders/utils/orderStatusMeta";

type RunOrdersTabProps = {
  runOrders: Order[];
};

function RunOrdersTab({ runOrders }: RunOrdersTabProps) {
  const navigate = useNavigate();

  return (
    <section className="run-orders-panel">
      <div className="run-orders-summary-head">
        <p className="section-label">Orders</p>
        <div className="run-orders-summary-meta">
          <span>
            {runOrders.length} order{runOrders.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {runOrders.length > 0 ? (
        <div className="runs-list scrollable run-orders-list">
          {runOrders.map((order) => {
            const statusMeta = getOrderStatusMeta(order.status);

            return (
              <article
                key={order.id}
                className="list-card order-card"
                onClick={() => navigate(`/order/${order.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/order/${order.id}`);
                  }
                }}
              >
                <div className="order-card-head">
                  <div className="order-card-title">
                    <h3>{order.userName}</h3>
                    <p>
                      {order.menuItems.length} item
                      {order.menuItems.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  {statusMeta && (
                    <span className={`status-pill ${statusMeta.tone}`}>
                      {statusMeta.label}
                    </span>
                  )}
                </div>
                <div className="order-card-meta">
                  <span className="muted-label">
                    {order.createdAt.toLocaleString()}
                  </span>
                  <strong>{formatEuroPrice(order.total)}</strong>
                </div>
              </article>
            );
          })}
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

export default RunOrdersTab;
