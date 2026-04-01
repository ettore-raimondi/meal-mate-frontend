import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import OrderSummaryCard from "../components/orders/OrderSummaryCard";
import type { OrderSummaryItem } from "../components/orders/OrderSummaryCard";
import { ordersSeed, ORDER_STATUS_META } from "../data/orders";

function OrderDetail() {
  const navigate = useNavigate();
  const { orderId: orderIdParam } = useParams<{ orderId: string }>();
  const parsedOrderId =
    orderIdParam !== undefined ? Number(orderIdParam) : undefined;
  const order =
    parsedOrderId !== undefined && !Number.isNaN(parsedOrderId)
      ? ordersSeed.find((entry) => entry.id === parsedOrderId)
      : undefined;
  const statusMeta = order ? ORDER_STATUS_META[order.status] : null;
  const summaryItems: OrderSummaryItem[] = order
    ? order.lineItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      }))
    : [];

  const handleBack = () => navigate("/orders");

  return (
    <div className="dashboard">
      <Sidebar activeItem="orders" />
      <div className="workspace">
        <section className="panel runs-panel full-panel">
          <div className="panel-head">
            <div className="panel-head-main">
              <button className="back-link" type="button" onClick={handleBack}>
                ← Back to orders
              </button>
              <div className="panel-title-stack">
                <div className="panel-title-row">
                  <h2>{order ? order.restaurant : "Order not found"}</h2>
                  {statusMeta && (
                    <span
                      className={`status-pill panel-status-pill ${statusMeta.tone}`}
                    >
                      {statusMeta.label}
                    </span>
                  )}
                </div>
                <p className="panel-subtitle">
                  {order
                    ? `${order.items} · ${order.placedAt}`
                    : "We couldn't find that order. Return to your history."}
                </p>
              </div>
            </div>
          </div>

          <div className="runs-grid">
            <div className="run-detail scrollable">
              {order ? (
                <section className="menu-section order-detail-section">
                  <div className="order-detail-meta">
                    <div>
                      <p className="muted-label">Order ID</p>
                      <h3>{order.id}</h3>
                    </div>
                    <div className="order-detail-meta-total">
                      <span className="muted-label">{order.placedAt}</span>
                      <strong>{order.total}</strong>
                    </div>
                  </div>
                  <div className="order-detail-fields">
                    <div>
                      <p className="muted-label">Restaurant</p>
                      <strong>{order.restaurant}</strong>
                    </div>
                    <div>
                      <p className="muted-label">Status</p>
                      <strong>{statusMeta?.label}</strong>
                    </div>
                    <div>
                      <p className="muted-label">Items</p>
                      <strong>{order.items}</strong>
                    </div>
                  </div>
                  <OrderSummaryCard
                    title="Order summary"
                    items={summaryItems}
                    emptyMessage="This order has no recorded items."
                    totalLabel="Total"
                  />
                </section>
              ) : (
                <div className="blank-state">
                  <p className="muted-label">
                    The order you are looking for doesn't exist anymore.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OrderDetail;
