import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  ordersSeed,
  ORDER_STATUS_META,
  ORDER_STATUS_RANK,
} from "../data/orders";

function Orders() {
  const navigate = useNavigate();
  const sortedOrders = [...ordersSeed].sort((a, b) => {
    const scoreA = ORDER_STATUS_RANK[a.status];
    const scoreB = ORDER_STATUS_RANK[b.status];
    if (scoreA !== scoreB) {
      return scoreA - scoreB;
    }
    return b.placedAt.localeCompare(a.placedAt);
  });

  return (
    <div className="dashboard">
      <Sidebar activeItem="orders" />
      <div className="workspace">
        <section className="panel runs-panel full-panel">
          <div className="panel-head">
            <div className="panel-head-main">
              <div className="panel-title-stack">
                <div className="panel-title-row">
                  <h2>Order History</h2>
                </div>
                <p className="panel-subtitle">
                  Review what you ordered and settle outstanding balances.
                </p>
              </div>
            </div>
          </div>

          <div className="runs-grid">
            <div className="runs-list scrollable">
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order) => {
                  const statusMeta = ORDER_STATUS_META[order.status];
                  return (
                    <article
                      key={order.id}
                      className="list-card order-card"
                      onClick={() => navigate(`/orders/${order.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          navigate(`/orders/${order.id}`);
                        }
                      }}
                    >
                      <div className="order-card-head">
                        <div className="order-card-title">
                          <h3>{order.restaurant}</h3>
                          <p>{order.items}</p>
                        </div>
                        <span className={`status-pill ${statusMeta.tone}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <div className="order-card-meta">
                        <span className="muted-label">{order.placedAt}</span>
                        <strong>{order.total}</strong>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="blank-state">
                  <p className="muted-label">
                    You haven't placed any orders yet.
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

export default Orders;
