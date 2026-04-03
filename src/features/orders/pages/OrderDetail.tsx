import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import OrderSummaryCard from "../components/OrderSummaryCard";
import type { OrderSummaryItem } from "../components/OrderSummaryCard";
import { useOrders } from "../hooks/useOrders";
import { getOrderStatusMeta } from "../utils/orderStatusMeta";

function OrderDetail() {
  const navigate = useNavigate();
  const { enrichedOrders } = useOrders();
  const { orderId: orderIdParam } = useParams<{ orderId: string }>();
  const parsedOrderId =
    orderIdParam !== undefined ? Number(orderIdParam) : undefined;
  const order =
    parsedOrderId !== undefined && !Number.isNaN(parsedOrderId)
      ? enrichedOrders.find((entry) => entry.id === parsedOrderId)
      : undefined;
  const statusMeta = getOrderStatusMeta(order?.status);
  const summaryItems: OrderSummaryItem[] = order
    ? order.menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      }))
    : [];
  const formattedRunStatus = order?.run
    ? order.run.status
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : undefined;

  const handleBack = () => navigate("/my-order-history");

  return (
    <div className="dashboard">
      <Sidebar activeItem="orders" />
      <div className="workspace">
        <section className="panel runs-panel full-panel">
          <div className="panel-head">
            <div className="panel-head-main">
              <button className="back-link" type="button" onClick={handleBack}>
                ← Back to My Order History
              </button>
              <div className="panel-title-stack">
                <div className="panel-title-row">
                  <h2>{order ? order.restaurant.name : "Order not found"}</h2>
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
                    ? `${order.menuItems.length} items in this order`
                    : "We couldn't find that order. Return to your history."}
                </p>
              </div>
            </div>
          </div>

          <div className="runs-grid">
            <div className="run-detail scrollable">
              {order ? (
                <section className="menu-section order-detail-section">
                  <p className="section-label">Order info</p>
                  <div className="order-info-bar">
                    <span className="order-info-chip">Order #{order.id}</span>
                    <span className="order-info-text">
                      Placed on {order.createdAtFormatted}
                    </span>
                    <span className="order-info-text">
                      {order.menuItems.length} items
                    </span>
                  </div>
                  <p className="section-label">Run info</p>
                  <div className="run-info-bar">
                    <span className="run-info-chip">
                      {order.run ? order.run.name : `Run #${order.foodRun}`}
                    </span>
                    <span className="run-info-text">
                      {order.run
                        ? `Deadline ${order.run.deadlineFormatted}`
                        : `Run #${order.foodRun}`}
                    </span>
                    {order.run && (
                      <span className="run-info-text">
                        Status {formattedRunStatus}
                      </span>
                    )}
                  </div>
                  <p className="section-label">Restaurant info</p>
                  <div className="restaurant-info-bar">
                    <span className="restaurant-info-chip">
                      {order.restaurant.name}
                    </span>
                    <span className="restaurant-info-text">
                      {order.restaurant.address}
                    </span>
                    <span className="restaurant-info-text">
                      {order.restaurant.phoneNumber}
                    </span>
                  </div>
                  <OrderSummaryCard
                    title="Order summary"
                    items={summaryItems}
                    emptyMessage="This order has no recorded items."
                    totalLabel="Total"
                  />
                  {order.note && (
                    <div className="order-notes-section">
                      <p className="muted-label">Special notes</p>
                      <p className="order-notes-text">{order.note}</p>
                    </div>
                  )}
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
