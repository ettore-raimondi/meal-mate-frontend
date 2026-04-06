import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { getOrderStatusMeta } from "../utils/orderStatusMeta";
import { useAppData } from "../../../hooks/useAppData";

function Orders() {
  const navigate = useNavigate();
  const { enrichedOrders } = useAppData();
  // const sortedOrders = [...orders].sort((a, b) => {
  //   const scoreA = ORDER_STATUS_RANK[a.status];
  //   const scoreB = ORDER_STATUS_RANK[b.status];
  //   if (scoreA !== scoreB) {
  //     return scoreA - scoreB;
  //   }
  //   return b.placedAt.localeCompare(a.placedAt);
  // });

  return (
    <div className="dashboard">
      <Sidebar activeItem="orders" />
      <div className="workspace">
        <section className="panel runs-panel full-panel">
          <div className="panel-head">
            <div className="panel-head-main">
              <div className="panel-title-stack">
                <div className="panel-title-row">
                  <h2>My Order History</h2>
                </div>
                <p className="panel-subtitle">
                  Review what you ordered and settle outstanding balances.
                </p>
              </div>
            </div>
          </div>

          <div className="runs-grid">
            <div className="runs-list scrollable">
              {enrichedOrders.length > 0 ? (
                enrichedOrders.map((order) => {
                  const statusMeta = getOrderStatusMeta(order.status);
                  return (
                    <article
                      key={order.id}
                      className="list-card order-card"
                      onClick={() => navigate(`/my-order-history/${order.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          navigate(`/my-order-history/${order.id}`);
                        }
                      }}
                    >
                      <div className="order-card-head">
                        <div className="order-card-title">
                          <h3>{order.restaurant.name}</h3>
                          <p>{order.menuItems.length} items</p>
                        </div>
                        {statusMeta && (
                          <span className={`status-pill ${statusMeta.tone}`}>
                            {statusMeta.label}
                          </span>
                        )}
                      </div>
                      <div className="order-card-meta">
                        <span className="muted-label">
                          {order.createdAtFormatted}
                        </span>
                        <strong>€{order.total}</strong>
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
