import type { ReactNode } from "react";
import { formatEuroPrice } from "../../../helpers/currency";
import type { MenuItem } from "../../../services/menu-item";

type MenuItemDetailProps = {
  menuItem: MenuItem;
  actionSlot?: ReactNode;
};

function MenuItemDetail({ menuItem, actionSlot }: MenuItemDetailProps) {
  const hasImage = Boolean(menuItem.imageUrl?.trim());

  return (
    <section className="menu-detail-view">
      <div className="menu-detail-hero">
        {hasImage ? (
          <img
            src={menuItem.imageUrl}
            alt={menuItem.name}
            className="menu-detail-image"
            loading="lazy"
          />
        ) : (
          <div
            className="menu-detail-image menu-detail-image-placeholder"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="menu-detail-field">
        <p className="menu-detail-label">Title</p>
        <div className="menu-detail-header">
          <h3>{menuItem.name}</h3>
        </div>
      </div>

      <div className="menu-detail-field">
        <p className="menu-detail-label">Description</p>
        <p className="menu-detail-description menu-detail-description--large">
          {menuItem.description?.trim() || "No description available yet."}
        </p>
      </div>

      <div className="menu-detail-field">
        <p className="menu-detail-label">Price</p>
        <div className="menu-detail-meta">
          <span className="menu-detail-price">
            {formatEuroPrice(menuItem.price)}
          </span>
        </div>
      </div>

      {actionSlot ? (
        <div className="menu-detail-actions">{actionSlot}</div>
      ) : null}
    </section>
  );
}

export default MenuItemDetail;
