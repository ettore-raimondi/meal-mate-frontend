import { MenuItem } from "./homeTypes";

type MenuItemDetailProps = {
  menuItem: MenuItem;
};

function MenuItemDetail({ menuItem }: MenuItemDetailProps) {
  return (
    <section className="menu-detail-view">
      <p className="menu-detail-description menu-detail-description--large">
        {menuItem.description}
      </p>

      <div className="menu-detail-meta">
        <span
          className={`availability ${menuItem.available ? "is-available" : "is-soldout"}`}
        >
          {menuItem.available ? "In stock" : "Sold out"}
        </span>
        <span className="menu-detail-price">{menuItem.price}</span>
        <button className="btn" type="button">
          Add to order
        </button>
      </div>
    </section>
  );
}

export default MenuItemDetail;
