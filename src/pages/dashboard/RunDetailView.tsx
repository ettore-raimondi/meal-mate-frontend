import { formatEuroPrice } from "../../helpers/currency";
import type { MenuItem } from "../../components/homeTypes";

type RunDetailViewProps = {
  menuItems: MenuItem[];
  activeRunId?: string;
  activeItemId: string | null;
  orderedItemIds: Set<string>;
  onSelectMenuItem: (itemId: string) => void;
  onToggleOrder: (itemId: string) => void;
  onPlaceOrder: () => void;
};

function RunDetailView({
  menuItems,
  activeRunId,
  activeItemId,
  orderedItemIds,
  onSelectMenuItem,
  onToggleOrder,
  onPlaceOrder,
}: RunDetailViewProps) {
  const orderedItems = menuItems.filter((item) => orderedItemIds.has(item.id));
  const orderTotal = orderedItems.reduce(
    (sum, item) => sum + parseFloat(item.price),
    0,
  );
  return (
    <section className="menu-section">
      <div className="menu-section-head">
        <div>
          <h4>Menu</h4>
        </div>
        <span className="muted-label">
          {menuItems.length} item{menuItems.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="menu-grid">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <article
              key={`${activeRunId ?? "run"}-${item.id}`}
              className={`menu-card list-card list-card--inline ${item.id === activeItemId ? "is-active" : ""}`}
              onClick={() => onSelectMenuItem(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectMenuItem(item.id);
                }
              }}
            >
              <div className="menu-card-info">
                <h4>{item.name}</h4>
                <p>{formatEuroPrice(item.price)}</p>
              </div>
              <button
                className={`btn btn-icon ${
                  orderedItemIds.has(item.id)
                    ? "btn-ghost btn-danger"
                    : "btn-ghost"
                }`}
                aria-label={
                  orderedItemIds.has(item.id)
                    ? `Remove ${item.name} from order`
                    : `Add ${item.name} to order`
                }
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleOrder(item.id);
                }}
              >
                {orderedItemIds.has(item.id) ? "−" : "+"}
              </button>
            </article>
          ))
        ) : (
          <p className="muted-label">Menu coming soon.</p>
        )}
      </div>

      <div className="order-summary">
        <h4>Your order</h4>
        {orderedItems.length > 0 ? (
          <>
            <ul className="order-summary-list">
              {orderedItems.map((item) => (
                <li key={item.id} className="order-summary-row">
                  <span>{item.name}</span>
                  <span>{formatEuroPrice(item.price)}</span>
                </li>
              ))}
            </ul>
            <div className="order-summary-total">
              <span>Total</span>
              <span>{formatEuroPrice(orderTotal.toFixed(2))}</span>
            </div>
            <button
              className="order-summary-place-btn"
              type="button"
              onClick={onPlaceOrder}
            >
              Place order →
            </button>
          </>
        ) : (
          <p className="muted-label">No items added yet.</p>
        )}
      </div>
    </section>
  );
}

export default RunDetailView;
