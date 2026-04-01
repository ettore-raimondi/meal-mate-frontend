import { formatEuroPrice } from "../../helpers/currency";
import type { MenuItem } from "../../components/homeTypes";
import OrderSummaryCard from "../../components/orders/OrderSummaryCard";
import type { OrderSummaryItem } from "../../components/orders/OrderSummaryCard";

type RunDetailViewProps = {
  menuItems: MenuItem[];
  activeRunId?: number;
  activeItemId: number | null;
  orderedItemIds: Set<number>;
  onSelectMenuItem: (itemId: number) => void;
  onToggleOrder: (itemId: number) => void;
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
  const orderSummaryItems: OrderSummaryItem[] = orderedItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
  }));
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

      <OrderSummaryCard
        items={orderSummaryItems}
        emptyMessage="No items added yet."
        action={{ label: "Place order →", onClick: onPlaceOrder }}
      />
    </section>
  );
}

export default RunDetailView;
