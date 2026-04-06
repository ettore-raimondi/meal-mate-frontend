import { formatEuroPrice } from "../../../helpers/currency";
import type { MenuItem } from "../../../services/menu-item";
import OrderSummaryCard from "../../orders/components/OrderSummaryCard";
import type { OrderSummaryItem } from "../../orders/components/OrderSummaryCard";
import { useEffect } from "react";
import { fetchLatestOrderForRun } from "../../../services/order/order.service";

type RunDetailViewProps = {
  menuItems: MenuItem[];
  activeRunId?: number;
  activeItemId: number | null;
  orderedItemIds: Set<number>;
  isLocked?: boolean;
  onSelectMenuItem: (itemId: number) => void;
  onToggleOrder: (itemId: number) => void;
  onPlaceOrder: () => void;
  orderNote: string;
  onOrderNoteChange: (value: string) => void;
  onOrderedItemsChange: (items: Set<number>) => void;
};

function RunDetailView({
  menuItems,
  activeRunId,
  activeItemId,
  orderedItemIds,
  isLocked = false,
  onSelectMenuItem,
  onToggleOrder,
  onPlaceOrder,
  orderNote,
  onOrderNoteChange,
  onOrderedItemsChange,
}: RunDetailViewProps) {
  const orderedItems = menuItems.filter((item) => orderedItemIds.has(item.id));
  const orderSummaryItems: OrderSummaryItem[] = orderedItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
  }));

  useEffect(() => {
    (async () => {
      if (!activeRunId) {
        onOrderedItemsChange(new Set());
        onOrderNoteChange("");
        return;
      }

      const order = await fetchLatestOrderForRun(activeRunId).catch(() => null);

      if (!order) {
        onOrderedItemsChange(new Set());
        onOrderNoteChange("");
        return;
      }

      onOrderedItemsChange(new Set(order.menuItems));
      onOrderNoteChange(order.note ?? "");
    })();
  }, [activeRunId, onOrderNoteChange, onOrderedItemsChange]);

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
                if (isLocked) {
                  return;
                }
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
                disabled={isLocked}
              >
                {orderedItemIds.has(item.id) ? "−" : "+"}
              </button>
            </article>
          ))
        ) : (
          <p className="muted-label">Menu coming soon.</p>
        )}
      </div>

      <div className="order-note-inline">
        <p className="section-label">Special notes</p>
        <input
          id="order-note-input"
          type="text"
          aria-label="Special notes"
          placeholder="Add extra instructions or delivery notes"
          value={orderNote}
          onChange={(event) => onOrderNoteChange(event.target.value)}
          disabled={isLocked}
        />
      </div>

      <OrderSummaryCard
        items={orderSummaryItems}
        emptyMessage="No items added yet."
        action={{
          label: isLocked ? "Run completed" : "Place order →",
          onClick: onPlaceOrder,
          disabled: isLocked,
        }}
      />
    </section>
  );
}

export default RunDetailView;
