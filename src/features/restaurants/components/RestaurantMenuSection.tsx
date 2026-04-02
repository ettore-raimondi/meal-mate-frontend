import { formatEuroPrice } from "../../../helpers/currency";
import type { MenuItem } from "../../../services/menu-item";

type RestaurantMenuSectionProps = {
  menu: MenuItem[];
  title?: string;
  description?: string;
  onAddItem?: () => void;
  onSelectItem?: (item: MenuItem) => void;
  onDeleteItem?: (item: MenuItem) => void;
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    tooltip?: string;
  };
};

function RestaurantMenuSection({
  menu,
  title = "Menu Items",
  description = "Keep this restaurant lineup current.",
  onAddItem,
  onSelectItem,
  onDeleteItem,
  secondaryAction,
}: RestaurantMenuSectionProps) {
  const hasMenuItems = menu.length > 0;
  const menuStatusLabel = hasMenuItems
    ? `${menu.length} item${menu.length === 1 ? "" : "s"}`
    : "No menu items yet.";

  return (
    <div className="restaurant-menu-layout">
      <div className="menu-section-head">
        <div>
          <h4>{title}</h4>
          <p className="muted-label">{description}</p>
        </div>
        <div className="menu-section-actions">
          {secondaryAction && (
            <button
              className="btn btn-outline"
              type="button"
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
              title={secondaryAction.tooltip}
            >
              {secondaryAction.label}
            </button>
          )}
          <button
            className="btn btn-ghost"
            type="button"
            onClick={onAddItem}
            disabled={!onAddItem}
          >
            Add item
          </button>
        </div>
      </div>
      <div className="restaurant-menu-list-panel">
        <p className="muted-label restaurant-menu-count">{menuStatusLabel}</p>
        {hasMenuItems ? (
          <div className="restaurant-menu-grid menu-grid">
            {menu.map((item) => (
              <article
                key={item.id}
                className={`menu-card list-card list-card--inline ${onDeleteItem ? "menu-card--with-delete" : ""}`}
                onClick={() => onSelectItem?.(item)}
                role={onSelectItem ? "button" : undefined}
                tabIndex={onSelectItem ? 0 : -1}
                onKeyDown={(event) => {
                  if (!onSelectItem) {
                    return;
                  }
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectItem(item);
                  }
                }}
              >
                <div className="menu-card-info">
                  <h4>{item.name}</h4>
                  <p>{formatEuroPrice(item.price)}</p>
                </div>
                {onDeleteItem && (
                  <button
                    type="button"
                    className="menu-card-delete"
                    aria-label={`Delete ${item.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteItem(item);
                    }}
                  >
                    <span aria-hidden="true" className="menu-card-delete-icon">
                      ×
                    </span>
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="restaurant-menu-empty">
            <p className="muted-label">
              Use Add item to create the first dish.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantMenuSection;
