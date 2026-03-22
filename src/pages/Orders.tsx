import Sidebar from "../components/Sidebar";
import { ordersSeed, OrderStatus } from "../data/orders";

const STATUS_CONFIG: Record<OrderStatus, { label: string; tone: string }> = {
  paid: { label: "Paid", tone: "success" },
  outstanding: { label: "Outstanding", tone: "muted" },
  "in-progress": { label: "In progress", tone: "progress" },
};

const STATUS_RANK: Record<OrderStatus, number> = {
  "in-progress": 0,
  outstanding: 1,
  paid: 2,
};

function Orders() {
  const sortedOrders = [...ordersSeed].sort((a, b) => {
    const scoreA = STATUS_RANK[a.status];
    const scoreB = STATUS_RANK[b.status];
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
                  const statusMeta = STATUS_CONFIG[order.status];
                  return (
                    <article key={order.id} className="list-card order-card">
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
