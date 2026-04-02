import { formatEuroPrice } from "../../helpers/currency";

export type OrderSummaryItem = {
  id: number;
  name: string;
  price: string;
};

type OrderSummaryCardProps = {
  title?: string;
  items: OrderSummaryItem[];
  emptyMessage?: string;
  totalLabel?: string;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
};

function OrderSummaryCard({
  title = "Your order",
  items,
  emptyMessage = "No items added yet.",
  totalLabel = "Total",
  action,
}: OrderSummaryCardProps) {
  const orderTotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price),
    0,
  );
  const hasItems = items.length > 0;

  return (
    <div className="order-summary">
      {title && <h4 className="section-label">{title}</h4>}
      <div className="order-summary-body">
        {hasItems ? (
          <>
            <ul className="order-summary-list">
              {items.map((item) => (
                <li key={item.id} className="order-summary-row">
                  <span>{item.name}</span>
                  <span>{formatEuroPrice(item.price)}</span>
                </li>
              ))}
            </ul>
            <div className="order-summary-total">
              <span>{totalLabel}</span>
              <span>{formatEuroPrice(orderTotal.toFixed(2))}</span>
            </div>
            {action && hasItems && (
              <button
                className="order-summary-place-btn"
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </button>
            )}
          </>
        ) : (
          <p className="muted-label">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}

export default OrderSummaryCard;
